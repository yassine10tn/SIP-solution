using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using WebApplication3.Models;

namespace WebApplication3.Controllers
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
                        myCommand.Parameters.AddWithValue("@Status", projet.Status ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@DossierJuridique", projet.DossierJuridique ?? (object)DBNull.Value);
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

        // Récupérer toutes les sociétés
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
    p.Objet, p.ObjetAr, p.Telephone, p.Email, p.Status, p.DossierJuridique, 
    p.idPays, pay.Libelle AS LibellePays,
    p.IdGouvernorat, gouv.Libelle AS LibelleGouvernorat,
    p.IdFormeJuridique, fj.Libelle AS LibelleFormeJuridique,
    p.IdSecteurEconomique, se.Libelle AS LibelleSecteurEconomique,
    p.IdNatureProjet, np.Libelle AS LibelleNatureProjet,
    p.idTypeManagement, tm.Libelle AS LibelleTypeManagement,
    p.IdDevise, dev.Libelle AS LibelleDevise,
    p.IdTypeIdentifiant, ti.Libelle AS LibelleTypeIdentifiant,
    p.idTypeEntreprise, te.Libelle AS LibelleTypeEntreprise,
    p.IdTypeProjet, tp.Libelle AS LibelleTypeProjet,
    p.idParametreRSM620, prsm.Libelle AS LibelleParametreRSM620,
    p.idParametreRNLPA870, prnl.Libelle AS LibelleParametreRNLPA870,
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
                                projets.Add(new Projet
                                {
                                    IdProjet = reader.GetInt32(reader.GetOrdinal("IdProjet")),
                                    Identifiant = reader.GetInt32(reader.GetOrdinal("Identifiant")),
                                    ExIdentifiant = reader.IsDBNull(reader.GetOrdinal("ExIdentifiant")) ? 0 : reader.GetInt32(reader.GetOrdinal("ExIdentifiant")),
                                    RaisonSociale = reader.IsDBNull(reader.GetOrdinal("RaisonSociale")) ? " " : reader.GetString(reader.GetOrdinal("RaisonSociale")),
                                    RaisonSocialeAr = reader.IsDBNull(reader.GetOrdinal("RaisonSocialeAr")) ? " " : reader.GetString(reader.GetOrdinal("RaisonSocialeAr")),
                                    LibelleCourt = reader.IsDBNull(reader.GetOrdinal("LibelleCourt")) ? " " : reader.GetString(reader.GetOrdinal("LibelleCourt")),
                                    SiegeSocial = reader.IsDBNull(reader.GetOrdinal("SiegeSocial")) ? " " : reader.GetString(reader.GetOrdinal("SiegeSocial")),
                                    SiegeSocialAr = reader.IsDBNull(reader.GetOrdinal("SiegeSocialAr")) ? " " : reader.GetString(reader.GetOrdinal("SiegeSocialAr")),
                                    MF = reader.IsDBNull(reader.GetOrdinal("MF")) ? " " : reader.GetString(reader.GetOrdinal("MF")),
                                    DateCreation = reader.GetDateTime(reader.GetOrdinal("DateCreation")),
                                    DateDossier = reader.GetDateTime(reader.GetOrdinal("DateDossier")),
                                    Objet = reader.IsDBNull(reader.GetOrdinal("Objet")) ? " " : reader.GetString(reader.GetOrdinal("Objet")),
                                    ObjetAr = reader.IsDBNull(reader.GetOrdinal("ObjetAr")) ? " " : reader.GetString(reader.GetOrdinal("ObjetAr")),
                                    Telephone = reader.IsDBNull(reader.GetOrdinal("Telephone")) ? " " : reader.GetString(reader.GetOrdinal("Telephone")),
                                    Email = reader.IsDBNull(reader.GetOrdinal("Email")) ? " " : reader.GetString(reader.GetOrdinal("Email")),
                                    Status = reader.IsDBNull(reader.GetOrdinal("Status")) ? " " : reader.GetString(reader.GetOrdinal("Status")),
                                    DossierJuridique = reader.IsDBNull(reader.GetOrdinal("DossierJuridique")) ? " " : reader.GetString(reader.GetOrdinal("DossierJuridique")),
                                    idPays = reader.GetInt32(reader.GetOrdinal("idPays")),
                                    LibellePays = reader.IsDBNull(reader.GetOrdinal("LibellePays")) ? " " : reader.GetString(reader.GetOrdinal("LibellePays")),
                                    IdGouvernorat = reader.GetInt32(reader.GetOrdinal("IdGouvernorat")),
                                    LibelleGouvernorat = reader.IsDBNull(reader.GetOrdinal("LibelleGouvernorat")) ? " " : reader.GetString(reader.GetOrdinal("LibelleGouvernorat")),
                                    IdFormeJuridique = reader.GetInt32(reader.GetOrdinal("IdFormeJuridique")),
                                    LibelleFormeJuridique = reader.IsDBNull(reader.GetOrdinal("LibelleFormeJuridique")) ? " " : reader.GetString(reader.GetOrdinal("LibelleFormeJuridique")),
                                    IdSecteurEconomique = reader.GetInt32(reader.GetOrdinal("IdSecteurEconomique")),
                                    LibelleSecteurEconomique = reader.IsDBNull(reader.GetOrdinal("LibelleSecteurEconomique")) ? " " : reader.GetString(reader.GetOrdinal("LibelleSecteurEconomique")),
                                    IdNatureProjet = reader.GetInt32(reader.GetOrdinal("IdNatureProjet")),
                                    LibelleNatureProjet = reader.IsDBNull(reader.GetOrdinal("LibelleNatureProjet")) ? " " : reader.GetString(reader.GetOrdinal("LibelleNatureProjet")),
                                    idTypeManagement = reader.GetInt32(reader.GetOrdinal("idTypeManagement")),
                                    LibelleTypeManagement = reader.IsDBNull(reader.GetOrdinal("LibelleTypeManagement")) ? " " : reader.GetString(reader.GetOrdinal("LibelleTypeManagement")),
                                    IdDevise = reader.GetInt32(reader.GetOrdinal("IdDevise")),
                                    LibelleDevise = reader.IsDBNull(reader.GetOrdinal("LibelleDevise")) ? " " : reader.GetString(reader.GetOrdinal("LibelleDevise")),
                                    IdTypeIdentifiant = reader.GetInt32(reader.GetOrdinal("IdTypeIdentifiant")),
                                    LibelleTypeIdentifiant = reader.IsDBNull(reader.GetOrdinal("LibelleTypeIdentifiant")) ? " " : reader.GetString(reader.GetOrdinal("LibelleTypeIdentifiant")),
                                    idTypeEntreprise = reader.GetInt32(reader.GetOrdinal("idTypeEntreprise")),
                                    LibelleTypeEntreprise = reader.IsDBNull(reader.GetOrdinal("LibelleTypeEntreprise")) ? " " : reader.GetString(reader.GetOrdinal("LibelleTypeEntreprise")),
                                    IdTypeProjet = reader.GetInt32(reader.GetOrdinal("IdTypeProjet")),
                                    LibelleTypeProjet = reader.IsDBNull(reader.GetOrdinal("LibelleTypeProjet")) ? " " : reader.GetString(reader.GetOrdinal("LibelleTypeProjet")),
                                    IdParametreRSM620 = reader.GetInt32(reader.GetOrdinal("idParametreRSM620")),
                                    LibelleParametreRSM620 = reader.IsDBNull(reader.GetOrdinal("LibelleParametreRSM620")) ? " " : reader.GetString(reader.GetOrdinal("LibelleParametreRSM620")),
                                    IdParametreRNLPA870 = reader.GetInt32(reader.GetOrdinal("idParametreRNLPA870")),
                                    LibelleParametreRNLPA870 = reader.IsDBNull(reader.GetOrdinal("LibelleParametreRNLPA870")) ? " " : reader.GetString(reader.GetOrdinal("LibelleParametreRNLPA870")),
                                    CodeRisque = reader.IsDBNull(reader.GetOrdinal("CodeRisque")) ? " " : reader.GetString(reader.GetOrdinal("CodeRisque")),
                                    DateMaj = reader.IsDBNull(reader.GetOrdinal("DateMaj")) ? DateTime.Now : reader.GetDateTime(reader.GetOrdinal("DateMaj")),
                                    Utilisateur = reader.IsDBNull(reader.GetOrdinal("Utilisateur")) ? " " : reader.GetString(reader.GetOrdinal("Utilisateur"))
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
                                    Nom = reader.GetString(reader.GetOrdinal("Libelle"))
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
                                    Nom = reader.GetString(reader.GetOrdinal("Libelle"))
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
                                    Nom = reader.GetString(reader.GetOrdinal("Libelle"))
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
                                    Nom = reader.GetString(reader.GetOrdinal("Libelle"))
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
                                    Nom = reader.GetString(reader.GetOrdinal("LIbelle"))
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






    }




}
