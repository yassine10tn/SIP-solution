using System;
using System.Data;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActionnaireController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ActionnaireController(IConfiguration configuration)
        {
            _configuration = configuration;
        }



        // Ajouter un capital
        [HttpPost("add_Capital")]
        public IActionResult AddCapital([FromBody] CapitalDto capitalDto)
        {
            if (capitalDto == null)
            {
                return BadRequest("Données invalides.");
            }

            try
            {
                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();

                    // 1. Vérification de la souscription
                    string querySouscription = "SELECT SUM(quantite) FROM Souscription WHERE IdProjet = @IdProjet";
                    int quantiteSouscriptionTotale = 0;

                    using (SqlCommand cmd = new SqlCommand(querySouscription, myCon))
                    {
                        cmd.Parameters.AddWithValue("@IdProjet", capitalDto.IdProjet);
                        var result = cmd.ExecuteScalar();
                        if (result == null || result == DBNull.Value)
                        {
                            return BadRequest("Aucune souscription trouvée pour ce projet");
                        }
                        quantiteSouscriptionTotale = Convert.ToInt32(result);
                    }

                    // 2. Validation du nombre d'actions
                    if (capitalDto.NombreActions < quantiteSouscriptionTotale)
                    {
                        return BadRequest($"Le nombre d'actions ({capitalDto.NombreActions}) doit être supérieur ou égal à la quantité souscrite ({quantiteSouscriptionTotale})");
                    }

                    // 3. Vérifier si le capital existe déjà
                    if (HasExistingCapital(capitalDto.IdProjet))
                    {
                        return BadRequest("Un capital existe déjà pour ce projet.");
                    }

                    // 4. Validation des valeurs
                    if (capitalDto.NombreActions <= 0)
                    {
                        return BadRequest("Le nombre d'actions doit être supérieur à zéro.");
                    }

                    if (capitalDto.MontantNominalAction <= 0)
                    {
                        return BadRequest("Le montant nominal de l'action doit être supérieur à zéro.");
                    }

                    // 5. Insertion (sans CapitalSociete qui est calculé)
                    string query = @"
                INSERT INTO Capital 
                (IdProjet, NombreActions, MontantNominalAction) 
                VALUES 
                (@IdProjet, @NombreActions, @MontantNominalAction)";

                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@IdProjet", capitalDto.IdProjet);
                        myCommand.Parameters.AddWithValue("@NombreActions", capitalDto.NombreActions);
                        myCommand.Parameters.AddWithValue("@MontantNominalAction", capitalDto.MontantNominalAction);

                        int rowsAffected = myCommand.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            // Calculer le capital société pour la réponse
                            decimal capitalSociete = capitalDto.NombreActions * capitalDto.MontantNominalAction;

                            return Ok(new
                            {
                                message = "Capital enregistré avec succès",
                                details = new
                                {
                                    capitalTotal = capitalDto.NombreActions,
                                    montantNominal = capitalDto.MontantNominalAction,
                                    capitalSociete = capitalSociete
                                }
                            });
                        }
                        else
                        {
                            return BadRequest(new { message = "L'insertion a échoué." });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Erreur interne",
                    error = ex.Message
                });
            }
        }

        // Récupérer tous les capitaux
        [HttpGet("get_Capital")]
        public IActionResult GetCapital()
        {
            try
            {
                List<CapitalModel> capitals = new List<CapitalModel>();
                string query = @"
                SELECT 
                    c.IdCapital, c.IdProjet, c.NombreActions, 
                    c.MontantNominalAction, c.CapitalSociete,
                    p.RaisonSociale
                FROM Capital c
                LEFT JOIN Projet p ON c.IdProjet = p.IdProjet";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                capitals.Add(new CapitalModel
                                {
                                    IdCapital = reader.GetInt32(reader.GetOrdinal("IdCapital")),
                                    IdProjet = reader.GetInt32(reader.GetOrdinal("IdProjet")),
                                    NombreActions = reader.GetInt32(reader.GetOrdinal("NombreActions")),
                                    MontantNominalAction = reader.GetDecimal(reader.GetOrdinal("MontantNominalAction")),
                                    CapitalSociete = reader.GetDecimal(reader.GetOrdinal("CapitalSociete")),
                                    RaisonSociale = reader.IsDBNull(reader.GetOrdinal("RaisonSociale")) ? null : reader.GetString(reader.GetOrdinal("RaisonSociale"))
                                });
                            }
                        }
                    }
                }

                return Ok(capitals);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }


        // Méthode pour vérifier si un projet est dans la table Souscription
        private bool IsProjectInSouscription(int idProjet)
        {
            string query = "SELECT COUNT(*) FROM Souscription WHERE IdProjet = @IdProjet";
            using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@IdProjet", idProjet);
                    int count = (int)myCommand.ExecuteScalar();
                    return count > 0;
                }
            }
        }

        // Méthode pour vérifier si un capital existe déjà pour un projet
        private bool HasExistingCapital(int idProjet)
        {
            string query = "SELECT COUNT(*) FROM Capital WHERE IdProjet = @IdProjet";
            using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@IdProjet", idProjet);
                    int count = (int)myCommand.ExecuteScalar();
                    return count > 0;
                }
            }
        }



        // Valider les clés étrangères (méthode existante du SocieteController)
        private bool IsValidForeignKey(int id, string tableName)
        {
            string idColumnName = tableName switch
            {
                "Capital" => "IdCapital",
                _ => throw new ArgumentException($"Table {tableName} non reconnue.")
            };

            string query = $"SELECT COUNT(*) FROM {tableName} WHERE {idColumnName} = @id";
            using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@id", id);
                    int count = (int)myCommand.ExecuteScalar();
                    return count > 0;
                }
            }
        }

        [HttpPost("add_ActionnaireSTB")]
        public IActionResult AddActionnaireSTB([FromBody] ActionnaireSTBDto actionnaireDto)
        {
            if (actionnaireDto == null)
            {
                return BadRequest("Données invalides.");
            }

            try
            {
                // Vérifier si le projet existe dans Souscription et Capital
                if (!IsProjectInSouscription(actionnaireDto.idProjet))
                {
                    return BadRequest("Le projet doit être dans la souscription.");
                }

                if (!HasExistingCapital(actionnaireDto.idProjet))
                {
                    return BadRequest("Un capital doit être défini pour ce projet.");
                }

                string query = @"
        INSERT INTO ActionnaireSTB (
            idProjet, 
            Nombredaction, 
            typeactionnaire, 
            libellenationalite, 
            libelleNatureActionnaire, 
            IdCapital, 
            montantennominal,
            IdSouscription -- Colonne optionnelle (si elle existe)
        )
        SELECT 
            @idProjet,
            s.quantite,                      -- Depuis Souscription
            'Personne Physique',              -- Valeur par défaut
            'Tunisienne',                     -- Valeur par défaut
            'Etablissement Public',           -- Valeur par défaut
            c.IdCapital,                     -- Depuis Capital
            c.MontantNominalAction,           -- Depuis Capital
            s.IdSouscription                  -- Récupéré automatiquement depuis Souscription
        FROM 
            Souscription s
        JOIN 
            Capital c ON s.IdProjet = c.IdProjet
        WHERE 
            s.IdProjet = @idProjet";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@idProjet", actionnaireDto.idProjet);
                        int rowsAffected = myCommand.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            return Ok(new { message = "Actionnaire STB ajouté avec succès." });
                        }
                        else
                        {
                            return BadRequest("Échec de l'insertion.");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne", error = ex.Message });
            }
        }

        [HttpGet("get_ActionnaireSTB")]
        public IActionResult GetActionnaireSTB()
        {
            try
            {
                List<ActionnaireSTBModel> actionnaires = new List<ActionnaireSTBModel>();
                string query = @"
        SELECT 
            a.*, 
            p.RaisonSociale AS NomProjet,
            c.MontantNominalAction
        FROM 
            ActionnaireSTB a
        JOIN 
            Projet p ON a.idProjet = p.IdProjet
        JOIN 
            Capital c ON a.IdCapital = c.IdCapital";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                actionnaires.Add(new ActionnaireSTBModel
                                {
                                    idactSTB = reader.GetInt32(reader.GetOrdinal("idactSTB")),
                                    idProjet = reader.GetInt32(reader.GetOrdinal("idProjet")),
                                    Nombredaction = reader.GetInt32(reader.GetOrdinal("Nombredaction")),
                                    typeactionnaire = reader.GetString(reader.GetOrdinal("typeactionnaire")),
                                    libellenationalite = reader.GetString(reader.GetOrdinal("libellenationalite")),
                                    libelleNatureActionnaire = reader.GetString(reader.GetOrdinal("libelleNatureActionnaire")),
                                    IdCapital = reader.GetInt32(reader.GetOrdinal("IdCapital")),
                                    montantennominal = reader.IsDBNull(reader.GetOrdinal("montantennominal")) ? null : reader.GetDecimal(reader.GetOrdinal("montantennominal")),
                                    IdSouscription = reader.GetInt32(reader.GetOrdinal("IdSouscription")) // Si la colonne existe
                                });
                            }
                        }
                    }
                }

                return Ok(actionnaires);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne", error = ex.Message });
            }
        }

        [HttpPost("add_Actionnaire")]
        public IActionResult AddActionnaire([FromBody] ActionnaireDto actionnaireDto)
        {
            if (actionnaireDto == null || string.IsNullOrWhiteSpace(actionnaireDto.RaisonSociale))
            {
                return BadRequest("Données invalides. La raison sociale est obligatoire.");
            }

            try
            {
                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (var transaction = myCon.BeginTransaction())
                    {
                        try
                        {
                            // 1. Vérifier l'existence du capital
                            string capitalQuery = "SELECT NombreActions FROM Capital WHERE IdProjet = @idProjet";
                            int capitalActions = 0;

                            using (SqlCommand cmd = new SqlCommand(capitalQuery, myCon, transaction))
                            {
                                cmd.Parameters.AddWithValue("@idProjet", actionnaireDto.idProjet);
                                var result = cmd.ExecuteScalar();
                                if (result == null || result == DBNull.Value)
                                {
                                    transaction.Rollback();
                                    return BadRequest("Aucun capital n'a été défini pour ce projet.");
                                }
                                capitalActions = Convert.ToInt32(result);
                            }

                            // 2. Calculer le total des actions déjà attribuées
                            string actionsQuery = @"
                        SELECT ISNULL(SUM(NombredactionActionnaire), 0) FROM Actionnaire WHERE idProjet = @idProjet;
                        SELECT ISNULL(SUM(Nombredaction), 0) FROM ActionnaireSTB WHERE idProjet = @idProjet;";

                            int totalActions = 0;
                            using (SqlCommand cmd = new SqlCommand(actionsQuery, myCon, transaction))
                            {
                                cmd.Parameters.AddWithValue("@idProjet", actionnaireDto.idProjet);
                                using (var reader = cmd.ExecuteReader())
                                {
                                    if (reader.Read()) totalActions += reader.GetInt32(0);
                                    if (reader.NextResult() && reader.Read()) totalActions += reader.GetInt32(0);
                                }
                            }

                            // 3. Calculer les actions disponibles
                            int actionsDisponibles = capitalActions - totalActions;

                            // 4. Validation stricte
                            if (actionnaireDto.NombredactionActionnaire <= 0)
                            {
                                transaction.Rollback();
                                return BadRequest("Le nombre d'actions doit être supérieur à zéro.");
                            }

                            if (actionnaireDto.NombredactionActionnaire > actionsDisponibles)
                            {
                                transaction.Rollback();
                                return BadRequest(
                                    $"Impossible d'ajouter {actionnaireDto.NombredactionActionnaire} actions. " +
                                    $"Capital total: {capitalActions}, " +
                                    $"Déjà attribuées: {totalActions}, " +
                                    $"Actions disponibles: {actionsDisponibles}");
                            }

                            // 5. Récupération des libellés
                            string libelleNationalite = GetLibelleFromTable(myCon, transaction, "Nationalite", actionnaireDto.idNationalite);
                            string libelleNatureActionnaire = GetLibelleFromTable(myCon, transaction, "NatureActionnaire", actionnaireDto.idNatureActionnaire);

                            // 6. Récupération du type d'actionnaire
                            var (typeActionnaire, _) = GetTypeActionnaire(myCon, transaction, actionnaireDto.Nature_ID);

                            // 7. Insertion
                            string insertQuery = @"
                        INSERT INTO Actionnaire (
                            idProjet, dateoperation, Nature_ID, typeactionnaire,
                            idNationalite, libellenationalite, idNatureActionnaire, 
                            libelleNatureActionnaire, NombredactionActionnaire, raison_sociale
                        )
                        VALUES (
                            @idProjet, GETDATE(), @Nature_ID, @typeactionnaire,
                            @idNationalite, @libellenationalite, @idNatureActionnaire,
                            @libelleNatureActionnaire, @NombredactionActionnaire, @raison_sociale
                        )";

                            using (SqlCommand cmd = new SqlCommand(insertQuery, myCon, transaction))
                            {
                                cmd.Parameters.AddWithValue("@idProjet", actionnaireDto.idProjet);
                                cmd.Parameters.AddWithValue("@Nature_ID", actionnaireDto.Nature_ID ?? (object)DBNull.Value);
                                cmd.Parameters.AddWithValue("@typeactionnaire", typeActionnaire ?? (object)DBNull.Value);
                                cmd.Parameters.AddWithValue("@idNationalite", actionnaireDto.idNationalite ?? (object)DBNull.Value);
                                cmd.Parameters.AddWithValue("@libellenationalite", libelleNationalite ?? (object)DBNull.Value);
                                cmd.Parameters.AddWithValue("@idNatureActionnaire", actionnaireDto.idNatureActionnaire ?? (object)DBNull.Value);
                                cmd.Parameters.AddWithValue("@libelleNatureActionnaire", libelleNatureActionnaire ?? (object)DBNull.Value);
                                cmd.Parameters.AddWithValue("@NombredactionActionnaire", actionnaireDto.NombredactionActionnaire);
                                cmd.Parameters.AddWithValue("@raison_sociale", actionnaireDto.RaisonSociale);

                                int rowsAffected = cmd.ExecuteNonQuery();
                                if (rowsAffected > 0)
                                {
                                    transaction.Commit();
                                    return Ok(new
                                    {
                                        success = true,
                                        message = "Actionnaire ajouté avec succès",
                                        details = new
                                        {
                                            actionsAjoutees = actionnaireDto.NombredactionActionnaire,
                                            nouveauTotalActions = totalActions + actionnaireDto.NombredactionActionnaire,
                                            actionsDisponibles = actionsDisponibles - actionnaireDto.NombredactionActionnaire,
                                            capitalTotal = capitalActions
                                        }
                                    });
                                }
                                else
                                {
                                    transaction.Rollback();
                                    return BadRequest("Échec de l'insertion.");
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            return StatusCode(500, new { message = "Erreur interne", error = ex.Message });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne", error = ex.Message });
            }
        }


        // Nouvelle méthode pour obtenir toutes les infos du capital
        private (int totalActions, int totalAttribuees, int disponibles, decimal montantNominal)
            GetCapitalInfo(SqlConnection connection, SqlTransaction transaction, int idProjet)
        {
            string query = @"
        SELECT 
            c.NombreActions,
            ISNULL(SUM(a.NombredactionActionnaire), 0),
            c.NombreActions - ISNULL(SUM(a.NombredactionActionnaire), 0),
            c.MontantNominalAction
        FROM Capital c
        LEFT JOIN Actionnaire a ON c.IdProjet = a.idProjet
        WHERE c.IdProjet = @idProjet
        GROUP BY c.NombreActions, c.MontantNominalAction";

            using (SqlCommand cmd = new SqlCommand(query, connection, transaction))
            {
                cmd.Parameters.AddWithValue("@idProjet", idProjet);
                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return (
                            reader.GetInt32(0),
                            reader.GetInt32(1),
                            reader.GetInt32(2),
                            reader.GetDecimal(3)
                        );
                    }
                    return (-1, -1, -1, 0);
                }
            }
        }
        // Méthodes helpers avec transaction
        private string GetLibelleFromTable(SqlConnection connection, SqlTransaction transaction, string table, int? id)
        {
            if (!id.HasValue) return null;

            string libelleColumn = table switch
            {
                "Nationalite" => "libellenationalite",
                "NatureActionnaire" => "libelleNatureActionnaire",
                _ => "Libelle"
            };

            string query = $"SELECT {libelleColumn} FROM {table} WHERE id{table} = @id";
            using (SqlCommand cmd = new SqlCommand(query, connection, transaction))
            {
                cmd.Parameters.AddWithValue("@id", id.Value);
                return cmd.ExecuteScalar()?.ToString();
            }
        }

        private (string? libelle, int? natureId) GetTypeActionnaire(SqlConnection connection, SqlTransaction transaction, int? idtypeactionnaire)
        {
            if (!idtypeactionnaire.HasValue) return (null, null);

            string query = "SELECT Libelle, Nature_ID FROM CAC_Nature WHERE Nature_ID = @id";
            using (SqlCommand cmd = new SqlCommand(query, connection, transaction))
            {
                cmd.Parameters.AddWithValue("@id", idtypeactionnaire.Value);
                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return (reader.GetString(0), reader.GetInt32(1));
                    }
                }
            }
            return (null, null);
        }

        // Méthode HasExistingCapital modifiée pour supporter les transactions
        private bool HasExistingCapital(SqlConnection connection, SqlTransaction transaction, int idProjet)
        {
            string query = "SELECT COUNT(*) FROM Capital WHERE IdProjet = @idProjet";
            using (SqlCommand cmd = new SqlCommand(query, connection, transaction))
            {
                cmd.Parameters.AddWithValue("@idProjet", idProjet);
                return (int)cmd.ExecuteScalar() > 0;
            }
        }

        // Méthode helper pour récupérer les libellés
        private (int actionsDisponibles, decimal montantNominal) VerifyCapital(SqlConnection connection, int idProjet, int actionsDemandees)
        {
            string query = @"
    SELECT 
        c.NombreActions AS TotalActionsCapital,
        ISNULL(SUM(a.NombredactionActionnaire), 0) AS TotalActionsAttribuees,
        c.NombreActions - ISNULL(SUM(a.NombredactionActionnaire), 0) AS ActionsDisponibles,
        c.MontantNominalAction
    FROM Capital c
    LEFT JOIN Actionnaire a ON c.IdProjet = a.idProjet
    WHERE c.IdProjet = @idProjet
    GROUP BY c.NombreActions, c.MontantNominalAction";

            using (SqlCommand cmd = new SqlCommand(query, connection))
            {
                cmd.Parameters.AddWithValue("@idProjet", idProjet);
                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        int totalActionsCapital = reader.GetInt32(0);
                        int totalActionsAttribuees = reader.GetInt32(1);
                        int actionsDisponibles = reader.GetInt32(2);
                        decimal montantNominal = reader.GetDecimal(3);

                        // Vérification que les actions demandées ne dépassent pas le disponible
                        if (actionsDemandees > actionsDisponibles)
                        {
                            return (-1, montantNominal); // -1 indique une erreur
                        }

                        return (actionsDisponibles, montantNominal);
                    }
                    else
                    {
                        // Aucun capital trouvé pour ce projet
                        return (-1, 0);
                    }
                }
            }
        }
        private (string? libelle, int? natureId) GetTypeActionnaire(SqlConnection connection, int? idtypeactionnaire)
        {
            if (!idtypeactionnaire.HasValue) return (null, null);

            // Correction: Utiliser Nature_ID comme colonne d'identification
            string query = "SELECT Libelle, Nature_ID FROM CAC_Nature WHERE Nature_ID = @id";
            using (SqlCommand cmd = new SqlCommand(query, connection))
            {
                cmd.Parameters.AddWithValue("@id", idtypeactionnaire.Value);
                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return (reader.GetString(0), reader.GetInt32(1));
                    }
                }
            }
            return (null, null);
        }

        private string GetLibelleFromTable(SqlConnection connection, string table, int? id)
        {
            if (!id.HasValue) return null;

            // Détermine le nom de la colonne libellé en fonction de la table
            string libelleColumn = table switch
            {
                "Nationalite" => "libellenationalite",
                "NatureActionnaire" => "libelleNatureActionnaire",
                _ => "Libelle" // Par défaut pour les autres tables
            };

            string query = $"SELECT {libelleColumn} FROM {table} WHERE id{table} = @id";
            using (SqlCommand cmd = new SqlCommand(query, connection))
            {
                cmd.Parameters.AddWithValue("@id", id.Value);
                return cmd.ExecuteScalar()?.ToString();
            }
        }

        [HttpGet("get_Actionnaire")]
        public IActionResult GetActionnaire()
        {
            try
            {
                List<ActionnaireModel> actionnaires = new List<ActionnaireModel>();

                string query = @"
            SELECT 
                a.idact AS IdActionnaire,  -- Correction ici
                a.idProjet,
                a.dateoperation,
                a.Nature_ID,
                a.typeactionnaire,
                a.idNationalite,
                a.libellenationalite,
                a.idNatureActionnaire,
                a.libelleNatureActionnaire,
                a.NombredactionActionnaire,
                a.raison_sociale,
                p.RaisonSociale AS ProjetRaisonSociale
            FROM Actionnaire a
            LEFT JOIN Projet p ON a.idProjet = p.IdProjet";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                actionnaires.Add(new ActionnaireModel
                                {
                                    IdActionnaire = reader.GetInt32(reader.GetOrdinal("IdActionnaire")),
                                    IdProjet = reader.GetInt32(reader.GetOrdinal("idProjet")),
                                    DateOperation = reader.GetDateTime(reader.GetOrdinal("dateoperation")),
                                    Nature_ID = reader.IsDBNull(reader.GetOrdinal("Nature_ID")) ? null : (int?)reader.GetInt32(reader.GetOrdinal("Nature_ID")),
                                    TypeActionnaire = reader.IsDBNull(reader.GetOrdinal("typeactionnaire")) ? null : reader.GetString(reader.GetOrdinal("typeactionnaire")),
                                    IdNationalite = reader.IsDBNull(reader.GetOrdinal("idNationalite")) ? null : (int?)reader.GetInt32(reader.GetOrdinal("idNationalite")),
                                    LibelleNationalite = reader.IsDBNull(reader.GetOrdinal("libellenationalite")) ? null : reader.GetString(reader.GetOrdinal("libellenationalite")),
                                    IdNatureActionnaire = reader.IsDBNull(reader.GetOrdinal("idNatureActionnaire")) ? null : (int?)reader.GetInt32(reader.GetOrdinal("idNatureActionnaire")),
                                    LibelleNatureActionnaire = reader.IsDBNull(reader.GetOrdinal("libelleNatureActionnaire")) ? null : reader.GetString(reader.GetOrdinal("libelleNatureActionnaire")),
                                    NombredactionActionnaire = reader.GetInt32(reader.GetOrdinal("NombredactionActionnaire")),
                                    RaisonSociale = reader.IsDBNull(reader.GetOrdinal("raison_sociale")) ? null : reader.GetString(reader.GetOrdinal("raison_sociale")),
                                    ProjetRaisonSociale = reader.IsDBNull(reader.GetOrdinal("ProjetRaisonSociale")) ? null : reader.GetString(reader.GetOrdinal("ProjetRaisonSociale"))
                                });
                            }
                        }
                    }
                }

                return Ok(actionnaires);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne", error = ex.Message });
            }
        }

        [HttpGet("get_AllActionnairesByProjet/{idProjet}")]
        public IActionResult GetAllActionnairesByProjet(int idProjet)
        {
            try
            {
                List<ActionnaireDetailsModel> actionnairesSTB = new List<ActionnaireDetailsModel>();
                List<ActionnaireDetailsModel> autresActionnaires = new List<ActionnaireDetailsModel>();
                int totalActionsCapital = 0;
                decimal montantNominal = 0;
                int totalActionsAttribuees = 0;

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();

                    // 1. Récupérer le capital total et le montant nominal
                    string queryCapital = @"
                SELECT NombreActions, MontantNominalAction 
                FROM Capital 
                WHERE IdProjet = @idProjet";

                    using (SqlCommand cmd = new SqlCommand(queryCapital, myCon))
                    {
                        cmd.Parameters.AddWithValue("@idProjet", idProjet);
                        using (var reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                totalActionsCapital = reader.GetInt32(0);
                                montantNominal = reader.GetDecimal(1);
                            }
                            else
                            {
                                return NotFound("Capital non trouvé pour ce projet");
                            }
                        }
                    }

                    // 2. Récupérer les actionnaires standards
                    string queryActionnaires = @"
                SELECT 
                    a.idact,
                    a.raison_sociale AS RaisonSociale,
                    cn.Libelle AS TypeActionnaire,
                    n.libellenationalite AS Nationalite,
                    na.libelleNatureActionnaire AS NatureActionnaire,
                    a.NombredactionActionnaire AS NombresActions
                FROM 
                    Actionnaire a
                LEFT JOIN Projet p ON a.idProjet = p.IdProjet
                LEFT JOIN CAC_Nature cn ON a.Nature_ID = cn.Nature_ID
                LEFT JOIN Nationalite n ON a.idNationalite = n.idNationalite
                LEFT JOIN NatureActionnaire na ON a.idNatureActionnaire = na.idNatureActionnaire
                WHERE a.idProjet = @idProjet";

                    using (SqlCommand cmd = new SqlCommand(queryActionnaires, myCon))
                    {
                        cmd.Parameters.AddWithValue("@idProjet", idProjet);
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                int nombresActions = reader.GetInt32(reader.GetOrdinal("NombresActions"));
                                double pourcentage = Math.Round((double)nombresActions / totalActionsCapital * 100, 2);

                                autresActionnaires.Add(new ActionnaireDetailsModel
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("idact")),
                                    RaisonSociale = reader.IsDBNull(reader.GetOrdinal("RaisonSociale")) ? "Non spécifié" : reader.GetString(reader.GetOrdinal("RaisonSociale")),
                                    TypeActionnaire = reader.IsDBNull(reader.GetOrdinal("TypeActionnaire")) ? null : reader.GetString(reader.GetOrdinal("TypeActionnaire")),
                                    Nationalite = reader.IsDBNull(reader.GetOrdinal("Nationalite")) ? null : reader.GetString(reader.GetOrdinal("Nationalite")),
                                    NatureActionnaire = reader.IsDBNull(reader.GetOrdinal("NatureActionnaire")) ? null : reader.GetString(reader.GetOrdinal("NatureActionnaire")),
                                    NombresActions = nombresActions,
                                    MontantNominal = montantNominal,
                                    PourcentageParticipation = pourcentage
                                });

                                totalActionsAttribuees += nombresActions;
                            }
                        }
                    }

                    // 3. Récupérer les actionnaires STB
                    string queryActionnairesSTB = @"
                SELECT 
                    a.idactSTB,
                    a.typeactionnaire AS TypeActionnaire,
                    a.libellenationalite AS Nationalite,
                    a.libelleNatureActionnaire AS NatureActionnaire,
                    a.Nombredaction AS NombresActions
                FROM ActionnaireSTB a
                WHERE a.idProjet = @idProjet";

                    using (SqlCommand cmd = new SqlCommand(queryActionnairesSTB, myCon))
                    {
                        cmd.Parameters.AddWithValue("@idProjet", idProjet);
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                int nombresActions = reader.GetInt32(reader.GetOrdinal("NombresActions"));
                                double pourcentage = Math.Round((double)nombresActions / totalActionsCapital * 100, 2);

                                actionnairesSTB.Add(new ActionnaireDetailsModel
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("idactSTB")),
                                    RaisonSociale = "STB",
                                    TypeActionnaire = reader.IsDBNull(reader.GetOrdinal("TypeActionnaire")) ? null : reader.GetString(reader.GetOrdinal("TypeActionnaire")),
                                    Nationalite = reader.IsDBNull(reader.GetOrdinal("Nationalite")) ? null : reader.GetString(reader.GetOrdinal("Nationalite")),
                                    NatureActionnaire = reader.IsDBNull(reader.GetOrdinal("NatureActionnaire")) ? null : reader.GetString(reader.GetOrdinal("NatureActionnaire")),
                                    NombresActions = nombresActions,
                                    MontantNominal = montantNominal,
                                    PourcentageParticipation = pourcentage
                                });

                                totalActionsAttribuees += nombresActions;
                            }
                        }
                    }

                    // 4. Trier les autres actionnaires par nombre d'actions décroissant
                    autresActionnaires = autresActionnaires
                        .OrderByDescending(a => a.NombresActions)
                        .ToList();

                    // 5. Créer la liste finale avec STB en premier
                    var result = new List<ActionnaireDetailsModel>();
                    result.AddRange(actionnairesSTB);
                    result.AddRange(autresActionnaires);

                    // 6. Ajouter la catégorie "Autres" si nécessaire (toujours en dernier)
                    if (totalActionsAttribuees < totalActionsCapital)
                    {
                        int actionsRestantes = totalActionsCapital - totalActionsAttribuees;
                        double pourcentageRestant = Math.Round((double)actionsRestantes / totalActionsCapital * 100, 2);

                        result.Add(new ActionnaireDetailsModel
                        {
                            Id = -1,
                            RaisonSociale = "Autres",
                            TypeActionnaire = "Non attribué",
                            Nationalite = null,
                            NatureActionnaire = null,
                            NombresActions = actionsRestantes,
                            MontantNominal = montantNominal,
                            PourcentageParticipation = pourcentageRestant
                        });
                    }

                    return Ok(new
                    {
                        Actionnaires = result,
                        TotalActionsCapital = totalActionsCapital,
                        TotalActionsAttribuees = totalActionsAttribuees,
                        MontantNominalAction = montantNominal
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne", error = ex.Message });
            }
        }


        [HttpGet("get_ActionnaireSTBByProjet/{idProjet}")]
        public IActionResult GetActionnaireSTBByProjet(int idProjet)
        {
            try
            {
                List<ActionnaireSTBModel> actionnaires = new List<ActionnaireSTBModel>();
                string query = @"
            SELECT 
                a.*, 
                p.RaisonSociale AS NomProjet,
                c.MontantNominalAction
            FROM 
                ActionnaireSTB a
            JOIN 
                Projet p ON a.idProjet = p.IdProjet
            JOIN 
                Capital c ON a.IdCapital = c.IdCapital
            WHERE 
                a.idProjet = @idProjet";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@idProjet", idProjet);
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                actionnaires.Add(new ActionnaireSTBModel
                                {
                                    idactSTB = reader.GetInt32(reader.GetOrdinal("idactSTB")),
                                    idProjet = reader.GetInt32(reader.GetOrdinal("idProjet")),
                                    Nombredaction = reader.GetInt32(reader.GetOrdinal("Nombredaction")),
                                    typeactionnaire = reader.GetString(reader.GetOrdinal("typeactionnaire")),
                                    libellenationalite = reader.GetString(reader.GetOrdinal("libellenationalite")),
                                    libelleNatureActionnaire = reader.GetString(reader.GetOrdinal("libelleNatureActionnaire")),
                                    IdCapital = reader.GetInt32(reader.GetOrdinal("IdCapital")),
                                    montantennominal = reader.IsDBNull(reader.GetOrdinal("montantennominal")) ? null : reader.GetDecimal(reader.GetOrdinal("montantennominal")),
                                    IdSouscription = reader.GetInt32(reader.GetOrdinal("IdSouscription"))
                                });
                            }
                        }
                    }
                }

                return Ok(actionnaires);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne", error = ex.Message });
            }



        }
        // Récupérer la liste des nationalités
        [HttpGet("get_Nationalites")]
        public IActionResult GetNationalites()
        {
            try
            {
                List<object> nationalites = new List<object>();
                string query = "SELECT idNationalite AS id, libellenationalite AS libelle FROM Nationalite";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                nationalites.Add(new
                                {
                                    id = reader.GetInt32(reader.GetOrdinal("id")),
                                    libelle = reader.GetString(reader.GetOrdinal("libelle"))
                                });
                            }
                        }
                    }
                }

                return Ok(nationalites);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne", error = ex.Message });
            }
        }

        // Récupérer la liste des natures d'actionnaires
        [HttpGet("get_NaturesActionnaire")]
        public IActionResult GetNaturesActionnaire()
        {
            try
            {
                List<object> natures = new List<object>();
                string query = "SELECT idNatureActionnaire AS id, libelleNatureActionnaire AS libelle FROM NatureActionnaire";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                natures.Add(new
                                {
                                    id = reader.GetInt32(reader.GetOrdinal("id")),
                                    libelle = reader.GetString(reader.GetOrdinal("libelle"))
                                });
                            }
                        }
                    }
                }

                return Ok(natures);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne", error = ex.Message });
            }
        }

        // Récupérer la liste des types d'actionnaires
        [HttpGet("get_TypesActionnaire")]
        public IActionResult GetTypesActionnaire()
        {
            try
            {
                List<object> types = new List<object>();
                string query = "SELECT Nature_ID AS id, Libelle AS libelle FROM CAC_Nature";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                types.Add(new
                                {
                                    id = reader.GetInt32(reader.GetOrdinal("id")),
                                    libelle = reader.GetString(reader.GetOrdinal("libelle"))
                                });
                            }
                        }
                    }
                }

                return Ok(types);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne", error = ex.Message });
            }
        }

        [HttpGet("get-count-actionnaires-nationalite")]
        public IActionResult GetCountActionnairesByNationalite()
        {
            try
            {
                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();

                    string query = @"
                SELECT 
                    SUM(CASE WHEN libellenationalite = 'Tunisienne' THEN 1 ELSE 0 END) as ActionnairesTunisiens,
                    SUM(CASE WHEN libellenationalite != 'Tunisienne' OR libellenationalite IS NULL THEN 1 ELSE 0 END) as ActionnairesEtrangers
                FROM Actionnaire";

                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    using (SqlDataReader reader = myCommand.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return Ok(new
                            {
                                ActionnairesTunisiens = reader.GetInt32(reader.GetOrdinal("ActionnairesTunisiens")),
                                ActionnairesEtrangers = reader.GetInt32(reader.GetOrdinal("ActionnairesEtrangers"))
                            });
                        }
                        return NotFound();
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne du serveur", error = ex.Message });
            }
        }

        [HttpGet("get-total-actionnaires")]
        public IActionResult GetTotalActionnaires()
        {
            try
            {
                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();

                    string query = "SELECT COUNT(*) FROM Actionnaire";

                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        int total = (int)myCommand.ExecuteScalar();
                        return Ok(new { TotalActionnaires = total });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne du serveur", error = ex.Message });
            }
        }
    }
}