using System;
using System.Data;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;


namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SocieteController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public SocieteController(IConfiguration configuration)
        {
            _configuration = configuration;

        }


        // Ajouter une société
        [HttpPost("add_Societe")]
        public IActionResult AddSociete([FromBody] Projet projet)
        {
            if (projet == null)
            {
                return BadRequest("Invalid project data.");
            }

            try
            {
                // Valider les clés étrangères
                if (!IsValidForeignKey(projet.idPays, "Pays") ||
                    !IsValidForeignKey(projet.IdGouvernorat, "Gouvernorat") ||
                    !IsValidForeignKey(projet.IdFormeJuridique, "FormeJuridique") ||
                    !IsValidForeignKey(projet.IdSecteurEconomique, "SecteurEconomique") ||
                    !IsValidForeignKey(projet.IdNatureProjet, "NatureProjet") ||
                    !IsValidForeignKey(projet.idTypeManagement, "TypeManagement") ||
                    !IsValidForeignKey(projet.IdDevise, "Devise") ||
                    !IsValidForeignKey(projet.IdTypeIdentifiant, "TypeIdentifiant") ||
                    !IsValidForeignKey(projet.idTypeEntreprise, "TypeEntreprise") ||
                    !IsValidForeignKey(projet.IdTypeProjet, "TypeProjet") ||
                    !IsValidForeignKey(projet.IdParametreRSM620, "ParametreRSM620") ||
                    !IsValidForeignKey(projet.IdParametreRNLPA870, "ParametreRNLPA870"))
                {
                    return BadRequest("Invalid foreign key ID(s).");
                }

                // Requête SQL pour insérer une nouvelle société
                string query = @"
                INSERT INTO Projet 
                (Identifiant, ExIdentifiant, RaisonSociale, RaisonSocialeAr, LibelleCourt, SiegeSocial, SiegeSocialAr, 
                 MF, DateCreation, DateDossier, Objet, ObjetAr, Telephone, Email, Status, DossierJuridique, 
                 idPays, IdGouvernorat, IdFormeJuridique, IdSecteurEconomique, IdNatureProjet, idTypeManagement, 
                 IdDevise, IdTypeIdentifiant, idTypeEntreprise, IdTypeProjet, idParametreRSM620, idParametreRNLPA870, 
                 CodeRisque, DateMaj, Utilisateur) 
                VALUES 
                (@Identifiant, @ExIdentifiant, @RaisonSociale, @RaisonSocialeAr, @LibelleCourt, @SiegeSocial, @SiegeSocialAr, 
                 @MF, @DateCreation, @DateDossier, @Objet, @ObjetAr, @Telephone, @Email, @Status, @DossierJuridique, 
                 @idPays, @IdGouvernorat, @IdFormeJuridique, @IdSecteurEconomique, @IdNatureProjet, @idTypeManagement, 
                 @IdDevise, @IdTypeIdentifiant, @idTypeEntreprise, @IdTypeProjet, @idParametreRSM620, @idParametreRNLPA870, 
                 @CodeRisque, @DateMaj, @Utilisateur)";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        // Ajouter les paramètres
                        myCommand.Parameters.AddWithValue("@Identifiant", projet.Identifiant);
                        myCommand.Parameters.AddWithValue("@ExIdentifiant", projet.ExIdentifiant ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@RaisonSociale", projet.RaisonSociale);
                        myCommand.Parameters.AddWithValue("@RaisonSocialeAr", projet.RaisonSocialeAr ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@LibelleCourt", projet.LibelleCourt ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@SiegeSocial", projet.SiegeSocial);
                        myCommand.Parameters.AddWithValue("@SiegeSocialAr", projet.SiegeSocialAr ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@MF", projet.MF ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@DateCreation", projet.DateCreation);
                        myCommand.Parameters.AddWithValue("@DateDossier", projet.DateDossier);
                        myCommand.Parameters.AddWithValue("@Objet", projet.Objet ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@ObjetAr", projet.ObjetAr ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@Telephone", projet.Telephone ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@Email", projet.Email ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@Status", Convert.FromBase64String(projet.Status ?? string.Empty));
                        myCommand.Parameters.AddWithValue("@DossierJuridique", Convert.FromBase64String(projet.DossierJuridique ?? string.Empty));
                        myCommand.Parameters.AddWithValue("@idPays", projet.idPays);
                        myCommand.Parameters.AddWithValue("@IdGouvernorat", projet.IdGouvernorat);
                        myCommand.Parameters.AddWithValue("@IdFormeJuridique", projet.IdFormeJuridique);
                        myCommand.Parameters.AddWithValue("@IdSecteurEconomique", projet.IdSecteurEconomique);
                        myCommand.Parameters.AddWithValue("@IdNatureProjet", projet.IdNatureProjet);
                        myCommand.Parameters.AddWithValue("@idTypeManagement", projet.idTypeManagement);
                        myCommand.Parameters.AddWithValue("@IdDevise", projet.IdDevise);
                        myCommand.Parameters.AddWithValue("@IdTypeIdentifiant", projet.IdTypeIdentifiant);
                        myCommand.Parameters.AddWithValue("@idTypeEntreprise", projet.idTypeEntreprise);
                        myCommand.Parameters.AddWithValue("@IdTypeProjet", projet.IdTypeProjet);
                        myCommand.Parameters.AddWithValue("@idParametreRSM620", projet.IdParametreRSM620);
                        myCommand.Parameters.AddWithValue("@idParametreRNLPA870", projet.IdParametreRNLPA870);
                        myCommand.Parameters.AddWithValue("@CodeRisque", projet.CodeRisque ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@DateMaj", projet.DateMaj ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@Utilisateur", projet.Utilisateur ?? (object)DBNull.Value);

                        // Exécuter la requête
                        int rowsAffected = myCommand.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            return Ok(new { message = "Data saved successfully" });
                        }
                        else
                        {
                            return BadRequest(new { message = "Insertion failed." });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }
        // download files 
        [HttpGet("downloadPdf/{id}/{type}")]
        public IActionResult DownloadPdf(int id, string type)
        {
            try
            {
                string query = "SELECT " + (type == "status" ? "Status" : "DossierJuridique") + " FROM Projet WHERE IdProjet = @id";
                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@id", id);
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                byte[] fileData = (byte[])reader[type == "status" ? "Status" : "DossierJuridique"];
                                return File(fileData, "application/pdf");
                            }
                            else
                            {
                                return NotFound();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        [HttpGet("get_Societe")]
        public IActionResult GetSociete()
        {
            try
            {
                List<Projet> projets = new List<Projet>();
                string query = @"
SELECT 
    p.IdProjet, p.Identifiant, p.ExIdentifiant, p.RaisonSociale, p.RaisonSocialeAr, p.LibelleCourt, 
    p.SiegeSocial, p.SiegeSocialAr, p.MF, p.DateCreation, p.DateDossier, 
    p.Objet, p.ObjetAr, p.Telephone, p.Email, 
    p.Status, p.DossierJuridique, -- These are varbinary(max) fields
    p.idPays, pay.Libelle AS LibellePays,
    p.IdGouvernorat, gouv.Libelle AS LibelleGouvernorat,
    p.IdFormeJuridique, fj.Libelle AS LibelleFormeJuridique,
    p.IdSecteurEconomique, se.Libelle AS LibelleSecteurEconomique,
    p.IdNatureProjet, np.LibelleNatureProjet AS LibelleNatureProjet,
    p.idTypeManagement, tm.Libelle AS LibelleTypeManagement,
    p.IdDevise, dev.Libelle AS LibelleDevise,
    p.IdTypeIdentifiant, ti.Libelle AS LibelleTypeIdentifiant,
    p.idTypeEntreprise, te.LibelleTypeEntreprise AS LibelleTypeEntreprise,
    p.IdTypeProjet, tp.LibelleTypeProjet AS LibelleTypeProjet,
    p.idParametreRSM620, prsm.LibelleParametreRSM620 AS LibelleParametreRSM620,
    p.idParametreRNLPA870, prnl.LibelleParametreRNLPA870 AS LibelleParametreRNLPA870,
    p.CodeRisque, p.DateMaj, p.Utilisateur
FROM Projet p
LEFT JOIN Pays pay ON p.idPays = pay.idPays
LEFT JOIN Gouvernorat gouv ON p.IdGouvernorat = gouv.IdGouvernorat
LEFT JOIN FormeJuridique fj ON p.IdFormeJuridique = fj.IdFormeJuridique
LEFT JOIN SecteurEconomique se ON p.IdSecteurEconomique = se.IdSecteurEconomique
LEFT JOIN NatureProjet np ON p.IdNatureProjet = np.IdNatureProjet
LEFT JOIN TypeManagement tm ON p.idTypeManagement = tm.idTypeManagement
LEFT JOIN Devise dev ON p.IdDevise = dev.IdDevise
LEFT JOIN TypeIdentifiant ti ON p.IdTypeIdentifiant = ti.IdTypeIdentifiant
LEFT JOIN TypeEntreprise te ON p.idTypeEntreprise = te.idTypeEntreprise
LEFT JOIN TypeProjet tp ON p.IdTypeProjet = tp.IdTypeProjet
LEFT JOIN ParametreRSM620 prsm ON p.idParametreRSM620 = prsm.idParametreRSM620
LEFT JOIN ParametreRNLPA870 prnl ON p.idParametreRNLPA870 = prnl.idParametreRNLPA870";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                // Convert binary data to base64 strings
                                byte[] statusBytes = reader["Status"] as byte[];
                                string statusBase64 = statusBytes != null ? Convert.ToBase64String(statusBytes) : null;

                                byte[] dossierJuridiqueBytes = reader["DossierJuridique"] as byte[];
                                string dossierJuridiqueBase64 = dossierJuridiqueBytes != null ? Convert.ToBase64String(dossierJuridiqueBytes) : null;

                                projets.Add(new Projet
                                {
                                    IdProjet = reader.GetInt32(reader.GetOrdinal("IdProjet")),
                                    Identifiant = reader.GetInt32(reader.GetOrdinal("Identifiant")),
                                    ExIdentifiant = reader.IsDBNull(reader.GetOrdinal("ExIdentifiant")) ? null : reader.GetInt32(reader.GetOrdinal("ExIdentifiant")),
                                    RaisonSociale = reader.IsDBNull(reader.GetOrdinal("RaisonSociale")) ? null : reader.GetString(reader.GetOrdinal("RaisonSociale")),
                                    RaisonSocialeAr = reader.IsDBNull(reader.GetOrdinal("RaisonSocialeAr")) ? null : reader.GetString(reader.GetOrdinal("RaisonSocialeAr")),
                                    LibelleCourt = reader.IsDBNull(reader.GetOrdinal("LibelleCourt")) ? null : reader.GetString(reader.GetOrdinal("LibelleCourt")),
                                    SiegeSocial = reader.IsDBNull(reader.GetOrdinal("SiegeSocial")) ? null : reader.GetString(reader.GetOrdinal("SiegeSocial")),
                                    SiegeSocialAr = reader.IsDBNull(reader.GetOrdinal("SiegeSocialAr")) ? null : reader.GetString(reader.GetOrdinal("SiegeSocialAr")),
                                    MF = reader.IsDBNull(reader.GetOrdinal("MF")) ? null : reader.GetString(reader.GetOrdinal("MF")),
                                    DateCreation = reader.GetDateTime(reader.GetOrdinal("DateCreation")),
                                    DateDossier = reader.GetDateTime(reader.GetOrdinal("DateDossier")),
                                    Objet = reader.IsDBNull(reader.GetOrdinal("Objet")) ? null : reader.GetString(reader.GetOrdinal("Objet")),
                                    ObjetAr = reader.IsDBNull(reader.GetOrdinal("ObjetAr")) ? null : reader.GetString(reader.GetOrdinal("ObjetAr")),
                                    Telephone = reader.IsDBNull(reader.GetOrdinal("Telephone")) ? null : reader.GetString(reader.GetOrdinal("Telephone")),
                                    Email = reader.IsDBNull(reader.GetOrdinal("Email")) ? null : reader.GetString(reader.GetOrdinal("Email")),
                                    Status = statusBase64, // Base64-encoded string
                                    DossierJuridique = dossierJuridiqueBase64, // Base64-encoded string
                                    idPays = reader.GetInt32(reader.GetOrdinal("idPays")),
                                    LibellePays = reader.IsDBNull(reader.GetOrdinal("LibellePays")) ? null : reader.GetString(reader.GetOrdinal("LibellePays")),
                                    IdGouvernorat = reader.GetInt32(reader.GetOrdinal("IdGouvernorat")),
                                    LibelleGouvernorat = reader.IsDBNull(reader.GetOrdinal("LibelleGouvernorat")) ? null : reader.GetString(reader.GetOrdinal("LibelleGouvernorat")),
                                    IdFormeJuridique = reader.GetInt32(reader.GetOrdinal("IdFormeJuridique")),
                                    LibelleFormeJuridique = reader.IsDBNull(reader.GetOrdinal("LibelleFormeJuridique")) ? null : reader.GetString(reader.GetOrdinal("LibelleFormeJuridique")),
                                    IdSecteurEconomique = reader.GetInt32(reader.GetOrdinal("IdSecteurEconomique")),
                                    LibelleSecteurEconomique = reader.IsDBNull(reader.GetOrdinal("LibelleSecteurEconomique")) ? null : reader.GetString(reader.GetOrdinal("LibelleSecteurEconomique")),
                                    IdNatureProjet = reader.GetInt32(reader.GetOrdinal("IdNatureProjet")),
                                    LibelleNatureProjet = reader.IsDBNull(reader.GetOrdinal("LibelleNatureProjet")) ? null : reader.GetString(reader.GetOrdinal("LibelleNatureProjet")),
                                    idTypeManagement = reader.GetInt32(reader.GetOrdinal("idTypeManagement")),
                                    LibelleTypeManagement = reader.IsDBNull(reader.GetOrdinal("LibelleTypeManagement")) ? null : reader.GetString(reader.GetOrdinal("LibelleTypeManagement")),
                                    IdDevise = reader.GetInt32(reader.GetOrdinal("IdDevise")),
                                    LibelleDevise = reader.IsDBNull(reader.GetOrdinal("LibelleDevise")) ? null : reader.GetString(reader.GetOrdinal("LibelleDevise")),
                                    IdTypeIdentifiant = reader.GetInt32(reader.GetOrdinal("IdTypeIdentifiant")),
                                    LibelleTypeIdentifiant = reader.IsDBNull(reader.GetOrdinal("LibelleTypeIdentifiant")) ? null : reader.GetString(reader.GetOrdinal("LibelleTypeIdentifiant")),
                                    idTypeEntreprise = reader.GetInt32(reader.GetOrdinal("idTypeEntreprise")),
                                    LibelleTypeEntreprise = reader.IsDBNull(reader.GetOrdinal("LibelleTypeEntreprise")) ? null : reader.GetString(reader.GetOrdinal("LibelleTypeEntreprise")),
                                    IdTypeProjet = reader.GetInt32(reader.GetOrdinal("IdTypeProjet")),
                                    LibelleTypeProjet = reader.IsDBNull(reader.GetOrdinal("LibelleTypeProjet")) ? null : reader.GetString(reader.GetOrdinal("LibelleTypeProjet")),
                                    IdParametreRSM620 = reader.GetInt32(reader.GetOrdinal("idParametreRSM620")),
                                    LibelleParametreRSM620 = reader.IsDBNull(reader.GetOrdinal("LibelleParametreRSM620")) ? null : reader.GetString(reader.GetOrdinal("LibelleParametreRSM620")),
                                    IdParametreRNLPA870 = reader.GetInt32(reader.GetOrdinal("idParametreRNLPA870")),
                                    LibelleParametreRNLPA870 = reader.IsDBNull(reader.GetOrdinal("LibelleParametreRNLPA870")) ? null : reader.GetString(reader.GetOrdinal("LibelleParametreRNLPA870")),
                                    CodeRisque = reader.IsDBNull(reader.GetOrdinal("CodeRisque")) ? null : reader.GetString(reader.GetOrdinal("CodeRisque")),
                                    DateMaj = reader.IsDBNull(reader.GetOrdinal("DateMaj")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("DateMaj")),
                                    Utilisateur = reader.IsDBNull(reader.GetOrdinal("Utilisateur")) ? null : reader.GetString(reader.GetOrdinal("Utilisateur"))
                                });
                            }
                        }
                    }
                }

                return Ok(projets);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        // Valider les clés étrangères
        private bool IsValidForeignKey(int id, string tableName)
        {
            // Détermine le nom de la colonne d'identifiant en fonction de la table
            string idColumnName = tableName switch
            {
                "Pays" => "idPays",
                "Gouvernorat" => "idGouvernorat",
                "FormeJuridique" => "idFormeJuridique",
                "SecteurEconomique" => "idSecteurEconomique",
                "NatureProjet" => "idNatureProjet",
                "TypeManagement" => "idTypeManagement",
                "Devise" => "idDevise",
                "TypeIdentifiant" => "idTypeIdentifiant",
                "TypeEntreprise" => "idTypeEntreprise",
                "TypeProjet" => "idTypeProjet",
                "ParametreRSM620" => "idParametreRSM620",
                "ParametreRNLPA870" => "idParametreRNLPA870",
                "Projet" => "IdProjet", // Colonne de clé primaire dans la table Projet
                "typesouscription" => "idtypesouscription",
                "CAC_Nature" => "Nature_ID",
                "CAC" => "CAC_ID",
                "Situation" => "Situation_ID",
                "Fonction" => "Fonction_ID",

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



        // GET:  Pays 
        [HttpGet("get_Pays")]
        public IActionResult GetPays()
        {
            try
            {
                List<Pays> paysList = new List<Pays>();
                string query = "SELECT * FROM Pays";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                paysList.Add(new Pays
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("idPays")),
                                    Nom = reader.GetString(reader.GetOrdinal("Libelle"))
                                });
                            }
                        }
                    }
                }

                return Ok(paysList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        // GET:  Gouvernorats 
        [HttpGet("get_Gouvernorats")]
        public IActionResult GetGouvernorats()
        {
            try
            {
                List<Gouvernorats> GouvernoratsList = new List<Gouvernorats>();
                string query = "SELECT * FROM Gouvernorat";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                GouvernoratsList.Add(new Gouvernorats
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("idGouvernorat")),
                                    Nom = reader.GetString(reader.GetOrdinal("Libelle"))
                                });
                            }
                        }
                    }
                }

                return Ok(GouvernoratsList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        // GET:  FormeJuridique 
        [HttpGet("get_FormeJuridique")]
        public IActionResult GetFormeJuridique()
        {
            try
            {
                List<FormeJuridique> FormeJuridiqueList = new List<FormeJuridique>();
                string query = "SELECT * FROM FormeJuridique";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                FormeJuridiqueList.Add(new FormeJuridique
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("idFormeJuridique")),
                                    Nom = reader.GetString(reader.GetOrdinal("Libelle"))
                                });
                            }
                        }
                    }
                }

                return Ok(FormeJuridiqueList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        // GET:  SecteurEconomique 
        [HttpGet("get_SecteurEconomique")]
        public IActionResult GetSecteurEconomique()
        {
            try
            {
                List<SecteurEconomique> SecteurEconomiqueList = new List<SecteurEconomique>();
                string query = "SELECT * FROM SecteurEconomique";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                SecteurEconomiqueList.Add(new SecteurEconomique
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("idSecteurEconomique")),
                                    Nom = reader.GetString(reader.GetOrdinal("Libelle"))
                                });
                            }
                        }
                    }
                }

                return Ok(SecteurEconomiqueList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }



        // GET:  ModeleEtatFinancier 
        [HttpGet("get_ModeleEtatFinancier")]
        public IActionResult GetModeleEtatFinancier()
        {
            try
            {
                List<ModeleEtatFinancier> ModeleEtatFinancierList = new List<ModeleEtatFinancier>();
                string query = "SELECT * FROM ModeleEtatFinancier";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                ModeleEtatFinancierList.Add(new ModeleEtatFinancier
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("idModeleEtatFinancier")),
                                    Nom = reader.GetString(reader.GetOrdinal("Libelle"))
                                });
                            }
                        }
                    }
                }

                return Ok(ModeleEtatFinancierList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        // GET: NatureProjet
        [HttpGet("get_NatureProjet")]
        public IActionResult GetNatureProjet()
        {
            try
            {
                List<NatureProjet> NatureProjetList = new List<NatureProjet>();
                string query = "SELECT * FROM NatureProjet";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                NatureProjetList.Add(new NatureProjet
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("idNatureProjet")),
                                    Nom = reader.GetString(reader.GetOrdinal("LibelleNatureProjet"))
                                });
                            }
                        }
                    }
                }

                return Ok(NatureProjetList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        // GET: TypeManagement 
        [HttpGet("get_TypeManagement")]
        public IActionResult GetTypeManagement()
        {
            try
            {
                List<TypeManagement> TypeManagementList = new List<TypeManagement>();
                string query = "SELECT * FROM TypeManagement";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                TypeManagementList.Add(new TypeManagement
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("idTypeManagement")),
                                    Nom = reader.GetString(reader.GetOrdinal("Libelle"))
                                });
                            }
                        }
                    }
                }

                return Ok(TypeManagementList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }
        // GET: Devise 
        [HttpGet("get_Devise")]
        public IActionResult GetDevise()
        {
            try
            {
                List<Devise> DeviseList = new List<Devise>();
                string query = "SELECT * FROM Devise";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                DeviseList.Add(new Devise
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("idDevise")),
                                    Nom = reader.GetString(reader.GetOrdinal("Libelle"))
                                });
                            }
                        }
                    }
                }

                return Ok(DeviseList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        // GET:  TypeIdentifiant 
        [HttpGet("get_TypeIdentifiant")]
        public IActionResult GetTypeIdentifiant()
        {
            try
            {
                List<TypeIdentifiant> TypeIdentifiantList = new List<TypeIdentifiant>();
                string query = "SELECT * FROM TypeIdentifiant";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                TypeIdentifiantList.Add(new TypeIdentifiant
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("idTypeIdentifiant")),
                                    Nom = reader.GetString(reader.GetOrdinal("Libelle"))
                                });
                            }
                        }
                    }
                }

                return Ok(TypeIdentifiantList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        // GET:  TypeProjet 
        [HttpGet("get_TypeProjet")]
        public IActionResult GetTypeProjet()
        {
            try
            {
                List<TypeProjet> TypeProjetList = new List<TypeProjet>();
                string query = "SELECT * FROM TypeProjet";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                TypeProjetList.Add(new TypeProjet
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("idTypeProjet")),
                                    Nom = reader.GetString(reader.GetOrdinal("LibelleTypeProjet"))
                                });
                            }
                        }
                    }
                }

                return Ok(TypeProjetList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }
        // GET:  TypeProjet 
        [HttpGet("get_TypeEntreprise")]
        public IActionResult GetTypeEntreprise()
        {
            try
            {
                List<TypeEntreprise> TypeEntrepriseList = new List<TypeEntreprise>();
                string query = "SELECT * FROM TypeEntreprise";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                TypeEntrepriseList.Add(new TypeEntreprise
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("idTypeEntreprise")),
                                    Nom = reader.GetString(reader.GetOrdinal("LibelleTypeEntreprise"))
                                });
                            }
                        }
                    }
                }

                return Ok(TypeEntrepriseList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        // GET:  ParametreRSM620 
        [HttpGet("get_ParametreRSM620")]
        public IActionResult GetParametreRSM620()
        {
            try
            {
                List<ParametreRSM620> ParametreRSM620List = new List<ParametreRSM620>();
                string query = "SELECT * FROM ParametreRSM620";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                ParametreRSM620List.Add(new ParametreRSM620
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("idParametreRSM620")),
                                    Nom = reader.GetString(reader.GetOrdinal("LibelleParametreRSM620"))
                                });
                            }
                        }
                    }
                }

                return Ok(ParametreRSM620List);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }
        // GET:  ParametreRNL870 
        [HttpGet("get_ParametreRNL870")]
        public IActionResult GetParametreRNL870()
        {
            try
            {
                List<ParametreRNL870> ParametreRNL870List = new List<ParametreRNL870>();
                string query = "SELECT * FROM ParametreRNLPA870";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                ParametreRNL870List.Add(new ParametreRNL870
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("idParametreRNLPA870")),
                                    Nom = reader.GetString(reader.GetOrdinal("LibelleParametreRNLPA870"))
                                });
                            }
                        }
                    }
                }

                return Ok(ParametreRNL870List);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }



        [HttpPut("update_Societe/{id}")]
        public IActionResult UpdateSociete(int id, [FromBody] ProjetUpdateDto projetUpdate)
        {
            if (projetUpdate == null)
            {
                return BadRequest("Invalid project data.");
            }

            try
            {
                // Construire la requête SQL dynamiquement
                var queryParts = new List<string>();
                var parameters = new List<SqlParameter>();

                if (projetUpdate.Identifiant.HasValue)
                {
                    queryParts.Add("Identifiant = @Identifiant");
                    parameters.Add(new SqlParameter("@Identifiant", projetUpdate.Identifiant.Value));
                }
                if (projetUpdate.ExIdentifiant.HasValue)
                {
                    queryParts.Add("ExIdentifiant = @ExIdentifiant");
                    parameters.Add(new SqlParameter("@ExIdentifiant", projetUpdate.ExIdentifiant.Value));
                }
                if (!string.IsNullOrEmpty(projetUpdate.RaisonSociale))
                {
                    queryParts.Add("RaisonSociale = @RaisonSociale");
                    parameters.Add(new SqlParameter("@RaisonSociale", projetUpdate.RaisonSociale));
                }
                if (!string.IsNullOrEmpty(projetUpdate.RaisonSocialeAr))
                {
                    queryParts.Add("RaisonSocialeAr = @RaisonSocialeAr");
                    parameters.Add(new SqlParameter("@RaisonSocialeAr", projetUpdate.RaisonSocialeAr));
                }
                if (!string.IsNullOrEmpty(projetUpdate.LibelleCourt))
                {
                    queryParts.Add("LibelleCourt = @LibelleCourt");
                    parameters.Add(new SqlParameter("@LibelleCourt", projetUpdate.LibelleCourt));
                }
                if (!string.IsNullOrEmpty(projetUpdate.SiegeSocial))
                {
                    queryParts.Add("SiegeSocial = @SiegeSocial");
                    parameters.Add(new SqlParameter("@SiegeSocial", projetUpdate.SiegeSocial));
                }
                if (!string.IsNullOrEmpty(projetUpdate.SiegeSocialAr))
                {
                    queryParts.Add("SiegeSocialAr = @SiegeSocialAr");
                    parameters.Add(new SqlParameter("@SiegeSocialAr", projetUpdate.SiegeSocialAr));
                }
                if (!string.IsNullOrEmpty(projetUpdate.MF))
                {
                    queryParts.Add("MF = @MF");
                    parameters.Add(new SqlParameter("@MF", projetUpdate.MF));
                }
                if (projetUpdate.DateCreation.HasValue)
                {
                    queryParts.Add("DateCreation = @DateCreation");
                    parameters.Add(new SqlParameter("@DateCreation", projetUpdate.DateCreation.Value));
                }
                if (projetUpdate.DateDossier.HasValue)
                {
                    queryParts.Add("DateDossier = @DateDossier");
                    parameters.Add(new SqlParameter("@DateDossier", projetUpdate.DateDossier.Value));
                }
                if (!string.IsNullOrEmpty(projetUpdate.Objet))
                {
                    queryParts.Add("Objet = @Objet");
                    parameters.Add(new SqlParameter("@Objet", projetUpdate.Objet));
                }
                if (!string.IsNullOrEmpty(projetUpdate.ObjetAr))
                {
                    queryParts.Add("ObjetAr = @ObjetAr");
                    parameters.Add(new SqlParameter("@ObjetAr", projetUpdate.ObjetAr));
                }
                if (!string.IsNullOrEmpty(projetUpdate.Telephone))
                {
                    queryParts.Add("Telephone = @Telephone");
                    parameters.Add(new SqlParameter("@Telephone", projetUpdate.Telephone));
                }
                if (!string.IsNullOrEmpty(projetUpdate.Email))
                {
                    queryParts.Add("Email = @Email");
                    parameters.Add(new SqlParameter("@Email", projetUpdate.Email));
                }
                if (!string.IsNullOrEmpty(projetUpdate.Status))
                {
                    queryParts.Add("Status = @Status");
                    parameters.Add(new SqlParameter("@Status", Convert.FromBase64String(projetUpdate.Status)));
                }
                if (!string.IsNullOrEmpty(projetUpdate.DossierJuridique))
                {
                    queryParts.Add("DossierJuridique = @DossierJuridique");
                    parameters.Add(new SqlParameter("@DossierJuridique", Convert.FromBase64String(projetUpdate.DossierJuridique)));
                }
                if (projetUpdate.IdPays.HasValue)
                {
                    queryParts.Add("idPays = @idPays");
                    parameters.Add(new SqlParameter("@idPays", projetUpdate.IdPays.Value));
                }
                if (projetUpdate.IdGouvernorat.HasValue)
                {
                    queryParts.Add("IdGouvernorat = @IdGouvernorat");
                    parameters.Add(new SqlParameter("@IdGouvernorat", projetUpdate.IdGouvernorat.Value));
                }
                if (projetUpdate.IdFormeJuridique.HasValue)
                {
                    queryParts.Add("IdFormeJuridique = @IdFormeJuridique");
                    parameters.Add(new SqlParameter("@IdFormeJuridique", projetUpdate.IdFormeJuridique.Value));
                }
                if (projetUpdate.IdSecteurEconomique.HasValue)
                {
                    queryParts.Add("IdSecteurEconomique = @IdSecteurEconomique");
                    parameters.Add(new SqlParameter("@IdSecteurEconomique", projetUpdate.IdSecteurEconomique.Value));
                }
                if (projetUpdate.IdNatureProjet.HasValue)
                {
                    queryParts.Add("IdNatureProjet = @IdNatureProjet");
                    parameters.Add(new SqlParameter("@IdNatureProjet", projetUpdate.IdNatureProjet.Value));
                }
                if (projetUpdate.IdTypeManagement.HasValue)
                {
                    queryParts.Add("idTypeManagement = @idTypeManagement");
                    parameters.Add(new SqlParameter("@idTypeManagement", projetUpdate.IdTypeManagement.Value));
                }
                if (projetUpdate.IdDevise.HasValue)
                {
                    queryParts.Add("IdDevise = @IdDevise");
                    parameters.Add(new SqlParameter("@IdDevise", projetUpdate.IdDevise.Value));
                }
                if (projetUpdate.IdTypeIdentifiant.HasValue)
                {
                    queryParts.Add("IdTypeIdentifiant = @IdTypeIdentifiant");
                    parameters.Add(new SqlParameter("@IdTypeIdentifiant", projetUpdate.IdTypeIdentifiant.Value));
                }
                if (projetUpdate.IdTypeEntreprise.HasValue)
                {
                    queryParts.Add("idTypeEntreprise = @idTypeEntreprise");
                    parameters.Add(new SqlParameter("@idTypeEntreprise", projetUpdate.IdTypeEntreprise.Value));
                }
                if (projetUpdate.IdTypeProjet.HasValue)
                {
                    queryParts.Add("IdTypeProjet = @IdTypeProjet");
                    parameters.Add(new SqlParameter("@IdTypeProjet", projetUpdate.IdTypeProjet.Value));
                }
                if (projetUpdate.IdParametreRSM620.HasValue)
                {
                    queryParts.Add("idParametreRSM620 = @idParametreRSM620");
                    parameters.Add(new SqlParameter("@idParametreRSM620", projetUpdate.IdParametreRSM620.Value));
                }
                if (projetUpdate.IdParametreRNLPA870.HasValue)
                {
                    queryParts.Add("idParametreRNLPA870 = @idParametreRNLPA870");
                    parameters.Add(new SqlParameter("@idParametreRNLPA870", projetUpdate.IdParametreRNLPA870.Value));
                }
                if (!string.IsNullOrEmpty(projetUpdate.CodeRisque))
                {
                    queryParts.Add("CodeRisque = @CodeRisque");
                    parameters.Add(new SqlParameter("@CodeRisque", projetUpdate.CodeRisque));
                }
                if (projetUpdate.DateMaj.HasValue)
                {
                    queryParts.Add("DateMaj = @DateMaj");
                    parameters.Add(new SqlParameter("@DateMaj", projetUpdate.DateMaj.Value));
                }
                if (!string.IsNullOrEmpty(projetUpdate.Utilisateur))
                {
                    queryParts.Add("Utilisateur = @Utilisateur");
                    parameters.Add(new SqlParameter("@Utilisateur", projetUpdate.Utilisateur));
                }

                if (queryParts.Count == 0)
                {
                    return BadRequest("No fields to update.");
                }

                string query = $"UPDATE Projet SET {string.Join(", ", queryParts)} WHERE IdProjet = @IdProjet";
                parameters.Add(new SqlParameter("@IdProjet", id));

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddRange(parameters.ToArray());

                        int rowsAffected = myCommand.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            return Ok(new { message = "Data updated successfully" });
                        }
                        else
                        {
                            return BadRequest(new { message = "Update failed." });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }



        // Supprimer un projet par son ID
        [HttpDelete("delete_Projet/{id}")]
        public IActionResult DeleteProjet(int id)
        {
            try
            {
                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();

                    using (SqlTransaction transaction = myCon.BeginTransaction())
                    {
                        try
                        {
                            // Get all tables that reference Projet
                            var referencingTables = GetReferencingTables(myCon, transaction, "Projet");

                            // Delete from all referencing tables in proper order
                            foreach (var table in referencingTables.OrderByDescending(t => t.Depth))
                            {
                                string deleteQuery = $"DELETE FROM {table.TableName} WHERE {table.ColumnName} = @IdProjet";
                                using (SqlCommand cmd = new SqlCommand(deleteQuery, myCon, transaction))
                                {
                                    cmd.Parameters.AddWithValue("@IdProjet", id);
                                    cmd.ExecuteNonQuery();
                                }
                            }

                            // Finally delete the project
                            string deleteProjectQuery = "DELETE FROM Projet WHERE IdProjet = @IdProjet";
                            using (SqlCommand cmd = new SqlCommand(deleteProjectQuery, myCon, transaction))
                            {
                                cmd.Parameters.AddWithValue("@IdProjet", id);
                                int rowsAffected = cmd.ExecuteNonQuery();

                                if (rowsAffected > 0)
                                {
                                    transaction.Commit();
                                    return Ok(new { message = "Project and all dependencies deleted successfully" });
                                }
                                else
                                {
                                    transaction.Rollback();
                                    return NotFound(new { message = "Project not found" });
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            return StatusCode(500, new
                            {
                                message = "Deletion failed",
                                error = ex.Message,
                                details = ex.InnerException?.Message,
                                stackTrace = ex.StackTrace
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Database connection failed",
                    error = ex.Message
                });
            }
        }

        private List<TableReference> GetReferencingTables(SqlConnection connection, SqlTransaction transaction, string targetTable)
        {
            var tables = new List<TableReference>();

            string query = @"
        WITH ReferencingTables AS (
            SELECT 
                OBJECT_NAME(fk.parent_object_id) AS TableName,
                COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS ColumnName,
                1 AS Depth
            FROM sys.foreign_keys fk
            INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
            WHERE OBJECT_NAME(fk.referenced_object_id) = @TargetTable
            
            UNION ALL
            
            SELECT 
                OBJECT_NAME(fk.parent_object_id) AS TableName,
                COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS ColumnName,
                rt.Depth + 1
            FROM sys.foreign_keys fk
            INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
            INNER JOIN ReferencingTables rt ON OBJECT_NAME(fk.referenced_object_id) = rt.TableName
        )
        SELECT DISTINCT TableName, ColumnName, Depth FROM ReferencingTables
        ORDER BY Depth DESC";

            using (SqlCommand cmd = new SqlCommand(query, connection, transaction))
            {
                cmd.Parameters.AddWithValue("@TargetTable", targetTable);

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        tables.Add(new TableReference
                        {
                            TableName = reader["TableName"].ToString(),
                            ColumnName = reader["ColumnName"].ToString(),
                            Depth = Convert.ToInt32(reader["Depth"])
                        });
                    }
                }
            }

            return tables;
        }

        [HttpPost("post_Souscription")]
        public IActionResult PostSouscription([FromBody] SouscriptionDto souscriptionDto)
        {
            if (souscriptionDto == null)
            {
                return BadRequest("Invalid subscription data.");
            }

            try
            {
                // Valider les clés étrangères
                if (!IsValidForeignKey(souscriptionDto.IdProjet, "Projet") ||
                    !IsValidForeignKey(souscriptionDto.IdTypeSouscription, "typesouscription"))
                {
                    return BadRequest("Invalid foreign key ID(s).");
                }

                // Convertir le fichier en tableau de bytes (si un fichier est fourni)
                byte[] fileBytes = null;
                if (!string.IsNullOrEmpty(souscriptionDto.CopieBulletin))
                {
                    fileBytes = Convert.FromBase64String(souscriptionDto.CopieBulletin);
                }

                // Requête SQL pour insérer une nouvelle souscription
                string query = @"
            INSERT INTO souscription 
            (IdProjet, datesouscription, idtypesouscription, quantite, prixunitaire, prime_emission_total, signataire, fonction, copiebulletin) 
            VALUES 
            (@IdProjet, @DateSouscription, @IdTypeSouscription, @Quantite, @PrixUnitaire, @PrimeEmissionTotal, @Signataire, @Fonction, @CopieBulletin)";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        // Ajouter les paramètres
                        myCommand.Parameters.AddWithValue("@IdProjet", souscriptionDto.IdProjet);
                        myCommand.Parameters.AddWithValue("@DateSouscription", souscriptionDto.DateSouscription);
                        myCommand.Parameters.AddWithValue("@IdTypeSouscription", souscriptionDto.IdTypeSouscription);
                        myCommand.Parameters.AddWithValue("@Quantite", souscriptionDto.Quantite);
                        myCommand.Parameters.AddWithValue("@PrixUnitaire", souscriptionDto.PrixUnitaire);
                        myCommand.Parameters.AddWithValue("@PrimeEmissionTotal", souscriptionDto.PrimeEmissionTotal);
                        myCommand.Parameters.AddWithValue("@Signataire", souscriptionDto.Signataire);
                        myCommand.Parameters.AddWithValue("@Fonction", souscriptionDto.Fonction);
                        myCommand.Parameters.AddWithValue("@CopieBulletin", fileBytes ?? (object)DBNull.Value); // Gérer le cas où le fichier est null

                        // Exécuter la requête
                        int rowsAffected = myCommand.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            return Ok(new { message = "Subscription data saved successfully" });
                        }
                        else
                        {
                            return BadRequest(new { message = "Insertion failed." });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        [HttpGet("downloadBulletin/{id}")]
        public IActionResult DownloadBulletin(int id)
        {
            try
            {
                string query = "SELECT copiebulletin FROM souscription WHERE IdSouscription = @id";
                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@id", id);
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                byte[] fileData = (byte[])reader["copiebulletin"];
                                return File(fileData, "application/pdf", "bulletin.pdf");
                            }
                            else
                            {
                                return NotFound();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        [HttpGet("get_Souscription")]
        public IActionResult GetSouscription()
        {
            try
            {
                List<Souscription> souscriptions = new List<Souscription>();

                // Requête SQL pour récupérer les souscriptions avec les détails du type de souscription
                string query = @"
        SELECT 
            s.IdSouscription, s.IdProjet, s.datesouscription, s.idtypesouscription, 
            s.quantite, s.prixunitaire, s.montanttotal, s.prime_emission_total, 
            s.signataire, s.fonction, s.copiebulletin,
            ts.libelletype AS LibelleTypeSouscription,
            p.RaisonSociale -- Ajouter la colonne RaisonSociale
        FROM souscription s
        LEFT JOIN typesouscription ts ON s.idtypesouscription = ts.idtypesouscription
        LEFT JOIN Projet p ON s.IdProjet = p.IdProjet"; // Jointure avec la table Projet

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                // Convertir le fichier binaire en base64 si nécessaire
                                byte[] copieBulletinBytes = reader["copiebulletin"] as byte[];
                                string copieBulletinBase64 = copieBulletinBytes != null ? Convert.ToBase64String(copieBulletinBytes) : null;

                                souscriptions.Add(new Souscription
                                {
                                    IdSouscription = reader.GetInt32(reader.GetOrdinal("IdSouscription")),
                                    IdProjet = reader.GetInt32(reader.GetOrdinal("IdProjet")),
                                    DateSouscription = reader.GetDateTime(reader.GetOrdinal("datesouscription")),
                                    IdTypeSouscription = reader.GetInt32(reader.GetOrdinal("idtypesouscription")),
                                    Quantite = reader.GetInt32(reader.GetOrdinal("quantite")),
                                    PrixUnitaire = reader.GetDecimal(reader.GetOrdinal("prixunitaire")),
                                    MontantTotal = reader.GetDecimal(reader.GetOrdinal("montanttotal")),
                                    PrimeEmissionTotal = reader.GetDecimal(reader.GetOrdinal("prime_emission_total")),
                                    Signataire = reader.GetString(reader.GetOrdinal("signataire")),
                                    Fonction = reader.GetString(reader.GetOrdinal("fonction")),
                                    CopieBulletin = copieBulletinBase64, // Base64-encoded string
                                    LibelleTypeSouscription = reader.GetString(reader.GetOrdinal("LibelleTypeSouscription")),
                                    RaisonSociale = reader.IsDBNull(reader.GetOrdinal("RaisonSociale")) ? null : reader.GetString(reader.GetOrdinal("RaisonSociale")) // Ajouter RaisonSociale
                                });
                            }
                        }
                    }
                }

                return Ok(souscriptions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }



        [HttpPost("post_Achat")]
        public IActionResult PostAchat([FromBody] AchatDto achatDto)
        {
            if (achatDto == null)
            {
                return BadRequest("Invalid purchase data.");
            }

            try
            {
                // Valider la clé étrangère IdProjet
                if (!IsValidForeignKey(achatDto.IdProjet, "Projet"))
                {
                    return BadRequest("Invalid project ID.");
                }

                // Convertir le fichier en tableau de bytes (si un fichier est fourni)
                byte[] fileBytes = null;
                if (!string.IsNullOrEmpty(achatDto.CopieOrdreAchat))
                {
                    fileBytes = Convert.FromBase64String(achatDto.CopieOrdreAchat);
                }

                // Requête SQL pour insérer un nouvel achat
                string query = @"
        INSERT INTO Achat 
        (IdProjet, DateAchat, Quantite, PrixUnitaire, Signataire, Fonction, CopieOrdreAchat) 
        VALUES 
        (@IdProjet, @DateAchat, @Quantite, @PrixUnitaire, @Signataire, @Fonction, @CopieOrdreAchat)";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        // Ajouter les paramètres
                        myCommand.Parameters.AddWithValue("@IdProjet", achatDto.IdProjet);
                        myCommand.Parameters.AddWithValue("@DateAchat", achatDto.DateAchat);
                        myCommand.Parameters.AddWithValue("@Quantite", achatDto.Quantite);
                        myCommand.Parameters.AddWithValue("@PrixUnitaire", achatDto.PrixUnitaire);
                        myCommand.Parameters.AddWithValue("@Signataire", achatDto.Signataire);
                        myCommand.Parameters.AddWithValue("@Fonction", achatDto.Fonction);
                        myCommand.Parameters.AddWithValue("@CopieOrdreAchat", fileBytes ?? (object)DBNull.Value); // Gérer le cas où le fichier est null

                        // Exécuter la requête
                        int rowsAffected = myCommand.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            return Ok(new { message = "Purchase data saved successfully" });
                        }
                        else
                        {
                            return BadRequest(new { message = "Insertion failed." });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }




        [HttpGet("get_Achat")]
        public IActionResult GetAchat()
        {
            try
            {
                List<Achat> achats = new List<Achat>();

                // Requête SQL pour récupérer les achats avec les détails du projet
                string query = @"
        SELECT 
            a.IdAchat, a.IdProjet, a.DateAchat, a.Quantite, a.PrixUnitaire, 
            a.MontantTotal, a.Signataire, a.Fonction, a.CopieOrdreAchat,
            p.RaisonSociale -- Ajouter la colonne RaisonSociale
        FROM Achat a
        LEFT JOIN Projet p ON a.IdProjet = p.IdProjet"; // Jointure avec la table Projet

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                // Convertir le fichier binaire en base64 si nécessaire
                                byte[] copieOrdreAchatBytes = reader["CopieOrdreAchat"] as byte[];
                                string copieOrdreAchatBase64 = copieOrdreAchatBytes != null ? Convert.ToBase64String(copieOrdreAchatBytes) : null;

                                achats.Add(new Achat
                                {
                                    IdAchat = reader.GetInt32(reader.GetOrdinal("IdAchat")),
                                    IdProjet = reader.GetInt32(reader.GetOrdinal("IdProjet")),
                                    DateAchat = reader.GetDateTime(reader.GetOrdinal("DateAchat")),
                                    Quantite = reader.GetInt32(reader.GetOrdinal("Quantite")),
                                    PrixUnitaire = reader.GetDecimal(reader.GetOrdinal("PrixUnitaire")),
                                    MontantTotal = reader.GetDecimal(reader.GetOrdinal("MontantTotal")),
                                    Signataire = reader.GetString(reader.GetOrdinal("Signataire")),
                                    Fonction = reader.GetString(reader.GetOrdinal("Fonction")),
                                    CopieOrdreAchat = copieOrdreAchatBase64, // Base64-encoded string
                                    RaisonSociale = reader.IsDBNull(reader.GetOrdinal("RaisonSociale")) ? null : reader.GetString(reader.GetOrdinal("RaisonSociale")) // Ajouter RaisonSociale
                                });
                            }
                        }
                    }
                }

                return Ok(achats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }





        [HttpGet("download_CopieOrdreAchat/{id}")]
        public IActionResult DownloadCopieOrdreAchat(int id)
        {
            try
            {
                string query = "SELECT CopieOrdreAchat FROM Achat WHERE IdAchat = @id";
                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@id", id);
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                byte[] fileData = (byte[])reader["CopieOrdreAchat"];
                                return File(fileData, "application/pdf", "CopieOrdreAchat.pdf"); // Retourner le fichier en tant que PDF
                            }
                            else
                            {
                                return NotFound();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }


        [HttpPost("post_Vente")]
        public IActionResult PostVente([FromBody] VenteDto venteDto)
        {
            if (venteDto == null)
            {
                return BadRequest("Invalid sale data.");
            }

            try
            {
                // Valider la clé étrangère IdProjet
                if (!IsValidForeignKey(venteDto.IdProjet, "Projet"))
                {
                    return BadRequest("Invalid project ID.");
                }

                // Requête SQL pour insérer une nouvelle vente
                string query = @"
        INSERT INTO Vente 
        (IdProjet, DateVente, Quantite, PrixUnitaire, Signataire, Fonction) 
        VALUES 
        (@IdProjet, @DateVente, @Quantite, @PrixUnitaire, @Signataire, @Fonction)";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        // Ajouter les paramètres
                        myCommand.Parameters.AddWithValue("@IdProjet", venteDto.IdProjet);
                        myCommand.Parameters.AddWithValue("@DateVente", venteDto.DateVente);
                        myCommand.Parameters.AddWithValue("@Quantite", venteDto.Quantite);
                        myCommand.Parameters.AddWithValue("@PrixUnitaire", venteDto.PrixUnitaire);
                        myCommand.Parameters.AddWithValue("@Signataire", venteDto.Signataire);
                        myCommand.Parameters.AddWithValue("@Fonction", venteDto.Fonction);

                        // Exécuter la requête
                        int rowsAffected = myCommand.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            return Ok(new { message = "Sale data saved successfully" });
                        }
                        else
                        {
                            return BadRequest(new { message = "Insertion failed." });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }


        [HttpGet("get_Vente")]
        public IActionResult GetVente()
        {
            try
            {
                List<Vente> ventes = new List<Vente>();

                // Requête SQL pour récupérer les ventes avec les détails du projet
                string query = @"
        SELECT 
            v.IdVente, v.IdProjet, v.DateVente, v.Quantite, v.PrixUnitaire, 
            v.MontantTotal, v.Signataire, v.Fonction,
            p.RaisonSociale -- Ajouter la colonne RaisonSociale
        FROM Vente v
        LEFT JOIN Projet p ON v.IdProjet = p.IdProjet"; // Jointure avec la table Projet

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                ventes.Add(new Vente
                                {
                                    IdVente = reader.GetInt32(reader.GetOrdinal("IdVente")),
                                    IdProjet = reader.GetInt32(reader.GetOrdinal("IdProjet")),
                                    DateVente = reader.GetDateTime(reader.GetOrdinal("DateVente")),
                                    Quantite = reader.GetInt32(reader.GetOrdinal("Quantite")),
                                    PrixUnitaire = reader.GetDecimal(reader.GetOrdinal("PrixUnitaire")),
                                    MontantTotal = reader.GetDecimal(reader.GetOrdinal("MontantTotal")),
                                    Signataire = reader.GetString(reader.GetOrdinal("Signataire")),
                                    Fonction = reader.GetString(reader.GetOrdinal("Fonction")),
                                    RaisonSociale = reader.IsDBNull(reader.GetOrdinal("RaisonSociale")) ? null : reader.GetString(reader.GetOrdinal("RaisonSociale")) // Ajouter RaisonSociale
                                });
                            }
                        }
                    }
                }

                return Ok(ventes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }


        // recuperer les types sous
        [HttpGet("get_TypesSouscription")]
        public IActionResult GetTypesSouscription()
        {
            try
            {
                List<TypeSouscription> typesSouscriptionList = new List<TypeSouscription>();
                string query = "SELECT * FROM typesouscription";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                typesSouscriptionList.Add(new TypeSouscription
                                {
                                    idtypesouscription = reader.GetInt32(reader.GetOrdinal("idtypesouscription")),
                                    libelletype = reader.GetString(reader.GetOrdinal("libelletype"))
                                });
                            }
                        }
                    }
                }

                return Ok(typesSouscriptionList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }


        }
        // Ajouter un Commissaire aux Comptes
        [HttpPost("add_CAC")]
        public IActionResult AddCAC([FromBody] CACModel cac)
        {

            if (cac == null)
            {
                return BadRequest("Invalid CAC data.");
            }

            try
            {
                // Valider la clé étrangère Nature_ID
                if (!IsValidForeignKey(cac.Nature_ID, "CAC_Nature"))
                {
                    return BadRequest("Invalid Nature_ID.");
                }

                // Requête SQL pour insérer un nouveau CAC
                string query = @"
        INSERT INTO CAC 
        (Cabinet_Nom, Nature_ID, Commissaire_NomPrenom, Cabinet_Email, Cabinet_Telephone, 
         Email1, Telephone1, Email2, Telephone2) 
        VALUES 
        (@Cabinet_Nom, @Nature_ID, @Commissaire_NomPrenom, @Cabinet_Email, @Cabinet_Telephone, 
         @Email1, @Telephone1, @Email2, @Telephone2)";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        // Ajouter les paramètres
                        myCommand.Parameters.AddWithValue("@Cabinet_Nom", cac.Cabinet_Nom);
                        myCommand.Parameters.AddWithValue("@Nature_ID", cac.Nature_ID);
                        myCommand.Parameters.AddWithValue("@Commissaire_NomPrenom", cac.Commissaire_NomPrenom);
                        myCommand.Parameters.AddWithValue("@Cabinet_Email", cac.Cabinet_Email ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@Cabinet_Telephone", cac.Cabinet_Telephone ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@Email1", cac.Email1 ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@Telephone1", cac.Telephone1 ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@Email2", cac.Email2 ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@Telephone2", cac.Telephone2 ?? (object)DBNull.Value);

                        // Exécuter la requête
                        int rowsAffected = myCommand.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            return Ok(new { message = "CAC saved successfully" });
                        }
                        else
                        {
                            return BadRequest(new { message = "Insertion failed." });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        // Récupérer tous les CAC
        [HttpGet("get_CAC")]
        public IActionResult GetCAC()
        {
            try
            {
                List<CACModel> cacList = new List<CACModel>();
                string query = @"
        SELECT 
            c.CAC_ID, c.Cabinet_Nom, c.Nature_ID, c.Commissaire_NomPrenom, 
            c.Cabinet_Email, c.Cabinet_Telephone, c.Email1, c.Telephone1, 
            c.Email2, c.Telephone2, n.Libelle AS Nature_Libelle
        FROM CAC c
        LEFT JOIN CAC_Nature n ON c.Nature_ID = n.Nature_ID";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                cacList.Add(new CACModel
                                {
                                    CAC_ID = reader.GetInt32(reader.GetOrdinal("CAC_ID")),
                                    Cabinet_Nom = reader.GetString(reader.GetOrdinal("Cabinet_Nom")),
                                    Nature_ID = reader.GetInt32(reader.GetOrdinal("Nature_ID")),
                                    Commissaire_NomPrenom = reader.GetString(reader.GetOrdinal("Commissaire_NomPrenom")),
                                    Cabinet_Email = reader.IsDBNull(reader.GetOrdinal("Cabinet_Email")) ? null : reader.GetString(reader.GetOrdinal("Cabinet_Email")),
                                    Cabinet_Telephone = reader.IsDBNull(reader.GetOrdinal("Cabinet_Telephone")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("Cabinet_Telephone")),
                                    Email1 = reader.IsDBNull(reader.GetOrdinal("Email1")) ? null : reader.GetString(reader.GetOrdinal("Email1")),
                                    Telephone1 = reader.IsDBNull(reader.GetOrdinal("Telephone1")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("Telephone1")),
                                    Email2 = reader.IsDBNull(reader.GetOrdinal("Email2")) ? null : reader.GetString(reader.GetOrdinal("Email2")),
                                    Telephone2 = reader.IsDBNull(reader.GetOrdinal("Telephone2")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("Telephone2")),
                                    Nature_Libelle = reader.GetString(reader.GetOrdinal("Nature_Libelle"))
                                });
                            }
                        }
                    }
                }

                return Ok(cacList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        // Récupérer les types de nature CAC
        [HttpGet("get_CAC_Nature")]
        public IActionResult GetCACNature()
        {
            try
            {
                List<CACNatureModel> natureList = new List<CACNatureModel>();
                string query = "SELECT * FROM CAC_Nature";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                natureList.Add(new CACNatureModel
                                {
                                    Nature_ID = reader.GetInt32(reader.GetOrdinal("Nature_ID")),
                                    Libelle = reader.GetString(reader.GetOrdinal("Libelle"))
                                });
                            }
                        }
                    }
                }

                return Ok(natureList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }



        }
        // Ajouter une affectation CAC
        [HttpPost("add_AffectationCAC")]
        public IActionResult AddAffectationCAC([FromBody] AffectationCACModel affectation)
        {
            if (affectation == null)
            {
                return BadRequest("Invalid affectation data.");
            }

            try
            {
                // Valider les clés étrangères
                if (!IsValidForeignKey(affectation.IdProjet, "Projet") ||
                    !IsValidForeignKey(affectation.CAC_ID, "CAC"))
                {
                    return BadRequest("Invalid project ID or CAC ID.");
                }

                // Valider le format du mandat (doit commencer par 20 suivi de 2 chiffres)
                if (!System.Text.RegularExpressions.Regex.IsMatch(affectation.Mandat, @"^20\d{2}"))
                {
                    return BadRequest("Le mandat doit commencer par '20' suivi de 2 chiffres (ex: '2023').");
                }

                // Valider la date d'affectation (doit être >= 25/02/2026)
                if (affectation.DateAffectation < new DateTime(2026, 2, 25))
                {
                    return BadRequest("La date d'affectation doit être postérieure au 25/02/2026.");
                }

                // Requête SQL pour insérer une nouvelle affectation
                string query = @"
        INSERT INTO AffectationCAC 
        (IdProjet, CAC_ID, Mandat, DateAffectation, Observation, NumeroMandat) 
        VALUES 
        (@IdProjet, @CAC_ID, @Mandat, @DateAffectation, @Observation, @NumeroMandat)";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        // Ajouter les paramètres
                        myCommand.Parameters.AddWithValue("@IdProjet", affectation.IdProjet);
                        myCommand.Parameters.AddWithValue("@CAC_ID", affectation.CAC_ID);
                        myCommand.Parameters.AddWithValue("@Mandat", affectation.Mandat);
                        myCommand.Parameters.AddWithValue("@DateAffectation", affectation.DateAffectation);
                        myCommand.Parameters.AddWithValue("@Observation", affectation.Observation ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@NumeroMandat", affectation.NumeroMandat);

                        // Exécuter la requête
                        int rowsAffected = myCommand.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            return Ok(new { message = "Affectation saved successfully" });
                        }
                        else
                        {
                            return BadRequest(new { message = "Insertion failed." });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        [HttpGet("get_AffectationCAC")]
        public IActionResult GetAffectationCAC()
        {
            try
            {
                List<AffectationCACModel> affectationList = new List<AffectationCACModel>();
                string query = @"
        SELECT 
            a.Affectation_ID, a.IdProjet, a.CAC_ID, a.Mandat, 
            a.DateAffectation, a.Observation, a.NumeroMandat,
            p.RaisonSociale, c.Cabinet_Nom, c.Commissaire_NomPrenom
        FROM AffectationCAC a
        LEFT JOIN Projet p ON a.IdProjet = p.IdProjet
        LEFT JOIN CAC c ON a.CAC_ID = c.CAC_ID";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                affectationList.Add(new AffectationCACModel
                                {
                                    Affectation_ID = reader.GetInt32(reader.GetOrdinal("Affectation_ID")),
                                    IdProjet = reader.GetInt32(reader.GetOrdinal("IdProjet")),
                                    CAC_ID = reader.GetInt32(reader.GetOrdinal("CAC_ID")),
                                    Mandat = reader.GetString(reader.GetOrdinal("Mandat")),
                                    DateAffectation = reader.GetDateTime(reader.GetOrdinal("DateAffectation")),
                                    Observation = reader.IsDBNull(reader.GetOrdinal("Observation")) ? null : reader.GetString(reader.GetOrdinal("Observation")),
                                    NumeroMandat = reader.GetInt32(reader.GetOrdinal("NumeroMandat")),
                                    RaisonSociale = reader.IsDBNull(reader.GetOrdinal("RaisonSociale")) ? null : reader.GetString(reader.GetOrdinal("RaisonSociale")),
                                    Cabinet_Nom = reader.IsDBNull(reader.GetOrdinal("Cabinet_Nom")) ? null : reader.GetString(reader.GetOrdinal("Cabinet_Nom")),
                                    Commissaire_NomPrenom = reader.IsDBNull(reader.GetOrdinal("Commissaire_NomPrenom")) ? null : reader.GetString(reader.GetOrdinal("Commissaire_NomPrenom"))
                                });
                            }
                        }
                    }
                }

                return Ok(affectationList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }
        // Récupérer les fonctions
        [HttpGet("get_Fonctions")]
        public IActionResult GetFonctions()
        {
            try
            {
                List<FonctionModel> fonctions = new List<FonctionModel>();
                string query = "SELECT * FROM Fonction";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                fonctions.Add(new FonctionModel
                                {
                                    Fonction_ID = reader.GetInt32(reader.GetOrdinal("Fonction_ID")),
                                    Libelle = reader.GetString(reader.GetOrdinal("Libelle"))
                                });
                            }
                        }
                    }
                }

                return Ok(fonctions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        // Récupérer les situations
        [HttpGet("get_Situations")]
        public IActionResult GetSituations()
        {
            try
            {
                List<SituationModel> situations = new List<SituationModel>();
                string query = "SELECT * FROM Situation";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                situations.Add(new SituationModel
                                {
                                    Situation_ID = reader.GetInt32(reader.GetOrdinal("Situation_ID")),
                                    Libelle = reader.GetString(reader.GetOrdinal("Libelle"))
                                });
                            }
                        }
                    }
                }

                return Ok(situations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        // Ajouter un contact
        [HttpPost("add_Contact")]
        public IActionResult AddContact([FromBody] ListeContactModel contact)
        {
            if (contact == null)
            {
                return BadRequest("Invalid contact data.");
            }

            try
            {
                // Valider les clés étrangères
                if (!IsValidForeignKey(contact.IdProjet, "Projet") ||
                    !IsValidForeignKey(contact.Fonction_ID, "Fonction") ||
                    !IsValidForeignKey(contact.Situation_ID, "Situation"))
                {
                    return BadRequest("Invalid foreign key ID(s).");
                }



                string query = @"
        INSERT INTO ListeContact 
        (NomPrenom, Fonction_ID, Email1, Telephone1, Email2, Telephone2, IdProjet, Situation_ID, Observation) 
        VALUES 
        (@NomPrenom, @Fonction_ID, @Email1, @Telephone1, @Email2, @Telephone2, @IdProjet, @Situation_ID, @Observation)";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@NomPrenom", contact.NomPrenom);
                        myCommand.Parameters.AddWithValue("@Fonction_ID", contact.Fonction_ID);
                        myCommand.Parameters.AddWithValue("@Email1", contact.Email1);
                        myCommand.Parameters.AddWithValue("@Telephone1", contact.Telephone1);
                        myCommand.Parameters.AddWithValue("@Email2", contact.Email2 ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@Telephone2", contact.Telephone2 ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@IdProjet", contact.IdProjet);
                        myCommand.Parameters.AddWithValue("@Situation_ID", contact.Situation_ID);
                        myCommand.Parameters.AddWithValue("@Observation", contact.Observation ?? (object)DBNull.Value);



                        int rowsAffected = myCommand.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            return Ok(new { message = "Contact saved successfully" });
                        }
                        else
                        {
                            return BadRequest(new { message = "Insertion failed." });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }
        // Récupérer tous les contacts
        [HttpGet("get_Contacts")]
        public IActionResult GetContacts()
        {
            try
            {
                List<ListeContactModel> contacts = new List<ListeContactModel>();
                string query = @"
        SELECT 
            lc.Contact_ID, lc.NomPrenom, lc.Fonction_ID, lc.Email1, 
            lc.Telephone1, lc.Email2, lc.Telephone2, lc.IdProjet, 
            lc.Situation_ID, lc.Observation,
            f.Libelle AS Fonction_Libelle,
            s.Libelle AS Situation_Libelle,
            p.RaisonSociale
        FROM ListeContact lc
        LEFT JOIN Fonction f ON lc.Fonction_ID = f.Fonction_ID
        LEFT JOIN Situation s ON lc.Situation_ID = s.Situation_ID
        LEFT JOIN Projet p ON lc.IdProjet = p.IdProjet";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                contacts.Add(new ListeContactModel
                                {
                                    Contact_ID = reader.GetInt32(reader.GetOrdinal("Contact_ID")),
                                    NomPrenom = reader.GetString(reader.GetOrdinal("NomPrenom")),
                                    Fonction_ID = reader.GetInt32(reader.GetOrdinal("Fonction_ID")),
                                    Fonction_Libelle = reader.GetString(reader.GetOrdinal("Fonction_Libelle")),
                                    Email1 = reader.GetString(reader.GetOrdinal("Email1")),
                                    Telephone1 = reader.GetInt32(reader.GetOrdinal("Telephone1")),
                                    Email2 = reader.IsDBNull(reader.GetOrdinal("Email2")) ? null : reader.GetString(reader.GetOrdinal("Email2")),
                                    Telephone2 = reader.IsDBNull(reader.GetOrdinal("Telephone2")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("Telephone2")),
                                    IdProjet = reader.GetInt32(reader.GetOrdinal("IdProjet")),
                                    RaisonSociale = reader.GetString(reader.GetOrdinal("RaisonSociale")),
                                    Situation_ID = reader.GetInt32(reader.GetOrdinal("Situation_ID")),
                                    Situation_Libelle = reader.GetString(reader.GetOrdinal("Situation_Libelle")),
                                    Observation = reader.IsDBNull(reader.GetOrdinal("Observation")) ? null : reader.GetString(reader.GetOrdinal("Observation"))
                                });
                            }
                        }
                    }
                }

                return Ok(contacts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

    }

}








