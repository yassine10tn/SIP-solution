using System;
using System.Data;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using BCrypt.Net;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UtilisateurController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public UtilisateurController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // Login endpoint
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto loginDto)
        {
            if (loginDto == null || string.IsNullOrEmpty(loginDto.Matricule) || string.IsNullOrEmpty(loginDto.Mdp))
            {
                return BadRequest(new { message = "Invalid login data." });
            }

            try
            {
                string query = @"
                    SELECT IdUtilisateur, Matricule, Mdp, Status 
                    FROM Utilisateur 
                    WHERE Matricule = @Matricule";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@Matricule", loginDto.Matricule);

                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                string storedHash = reader["Mdp"].ToString();
                                if (BCrypt.Net.BCrypt.Verify(loginDto.Mdp, storedHash))
                                {
                                    var userResponse = new UserResponseDto
                                    {
                                        IdUtilisateur = Convert.ToInt32(reader["IdUtilisateur"]),
                                        Matricule = reader["Matricule"].ToString(),
                                        Status = reader["Status"].ToString()
                                    };
                                    return Ok(userResponse);
                                }
                            }
                            return Unauthorized(new { message = "Matricule ou mot de passe incorrect" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }

        // Create initial users endpoint
        [HttpPost("create-initial-users")]
        public IActionResult CreateInitialUsers()
        {
            try
            {
                string query = @"
                    INSERT INTO Utilisateur (Matricule, Mdp, Status)
                    VALUES (@Matricule, @Mdp, @Status)";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();

                    var users = new[]
                    {
                        new { Matricule = "MATADMIN001", Mdp = BCrypt.Net.BCrypt.HashPassword("Admin08523"), Status = "Administrateur" },
                        new { Matricule = "MATMETIER002", Mdp = BCrypt.Net.BCrypt.HashPassword("Metier185123"), Status = "Metier" },
                        new { Matricule = "MATREPORT003", Mdp = BCrypt.Net.BCrypt.HashPassword("Report796123"), Status = "reporting" },
                        new { Matricule = "MATREP004", Mdp = BCrypt.Net.BCrypt.HashPassword("Rep441238"), Status = "representantPerma" }
                    };

                    int rowsAffected = 0;
                    foreach (var user in users)
                    {
                        // Check if user already exists
                        string checkQuery = "SELECT COUNT(*) FROM Utilisateur WHERE Matricule = @Matricule";
                        using (SqlCommand checkCommand = new SqlCommand(checkQuery, myCon))
                        {
                            checkCommand.Parameters.AddWithValue("@Matricule", user.Matricule);
                            int count = (int)checkCommand.ExecuteScalar();
                            if (count > 0) continue; // Skip if user exists
                        }

                        using (SqlCommand myCommand = new SqlCommand(query, myCon))
                        {
                            myCommand.Parameters.AddWithValue("@Matricule", user.Matricule);
                            myCommand.Parameters.AddWithValue("@Mdp", user.Mdp);
                            myCommand.Parameters.AddWithValue("@Status", user.Status);

                            rowsAffected += myCommand.ExecuteNonQuery();
                        }
                    }

                    if (rowsAffected > 0)
                    {
                        return Ok(new { message = "Initial users created successfully", count = rowsAffected });
                    }
                    return Ok(new { message = "No new users were created (possibly already exist)" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
            }
        }


        [HttpPost("create-representant")]
        public IActionResult CreateRepresentant([FromBody] CreateRepresentantDto createDto)
        {
            // Validation des données d'entrée
            if (createDto == null)
            {
                return BadRequest(new { message = "Les données sont requises." });
            }

            if (string.IsNullOrWhiteSpace(createDto.Matricule))
            {
                return BadRequest(new { message = "Le matricule est requis." });
            }

            if (string.IsNullOrWhiteSpace(createDto.NomPrenomUtilisateur))
            {
                return BadRequest(new { message = "Le nom complet est requis." });
            }

            try
            {
                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();

                    // 1. Vérifier si le représentant existe déjà
                    string checkRepQuery = "SELECT COUNT(*) FROM UtilisateurRep WHERE Matricule = @Matricule";
                    using (SqlCommand checkRepCommand = new SqlCommand(checkRepQuery, myCon))
                    {
                        checkRepCommand.Parameters.AddWithValue("@Matricule", createDto.Matricule);
                        int repCount = (int)checkRepCommand.ExecuteScalar();
                        if (repCount > 0)
                        {
                            return Conflict(new { message = "Ce matricule est déjà enregistré comme représentant." });
                        }
                    }

                    // 2. Vérifier que l'utilisateur existe avec le bon statut
                    string userCheckQuery = @"
                SELECT Status 
                FROM Utilisateur 
                WHERE Matricule = @Matricule 
                AND Status IN ('representantPerma', 'representantPonct')";

                    bool isValidUser = false;
                    using (SqlCommand userCheckCommand = new SqlCommand(userCheckQuery, myCon))
                    {
                        userCheckCommand.Parameters.AddWithValue("@Matricule", createDto.Matricule);

                        using (SqlDataReader reader = userCheckCommand.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                isValidUser = true;
                            }
                        }
                    }

                    if (!isValidUser)
                    {
                        return BadRequest(new
                        {
                            message = "Matricule invalide ou statut incorrect. Le statut doit être 'representantPerma' ou 'representantPonct'."
                        });
                    }

                    // 3. Insérer dans UtilisateurRep
                    string insertQuery = @"
                INSERT INTO UtilisateurRep (Matricule, NomPrenomUtilisateur)
                VALUES (@Matricule, @NomPrenomUtilisateur)";

                    using (SqlCommand insertCommand = new SqlCommand(insertQuery, myCon))
                    {
                        insertCommand.Parameters.AddWithValue("@Matricule", createDto.Matricule);
                        insertCommand.Parameters.AddWithValue("@NomPrenomUtilisateur", createDto.NomPrenomUtilisateur.Trim());

                        int rowsAffected = insertCommand.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            return Ok(new
                            {
                                success = true,
                                message = "Représentant enregistré avec succès.",
                                data = new
                                {
                                    Matricule = createDto.Matricule,
                                    NomPrenom = createDto.NomPrenomUtilisateur
                                }
                            });
                        }
                        return StatusCode(500, new { message = "Échec lors de la création du représentant." });
                    }
                }
            }
            catch (SqlException sqlEx) when (sqlEx.Number == 547) // Violation de contrainte FK
            {
                return BadRequest(new { message = "Le matricule n'existe pas dans la table Utilisateur." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Erreur interne du serveur",
                    error = ex.Message
                });
            }
        }

        [HttpGet("get-users-count")]
        public IActionResult GetUsersCount()
        {
            try
            {
                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();

                    string query = "SELECT COUNT(*) FROM Utilisateur";

                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        int count = (int)myCommand.ExecuteScalar();
                        return Ok(new { totalUsers = count });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne du serveur", error = ex.Message });
            }
        }

        // Classe DTO pour la création de représentant
        public class CreateRepresentantDto
        {
            public string Matricule { get; set; }
            public string NomPrenomUtilisateur { get; set; }
        }

        [HttpPost("create-user")]
        public IActionResult CreateUser([FromBody] CreateUserDto createDto)
        {
            // Validation des données d'entrée
            if (createDto == null || string.IsNullOrEmpty(createDto.Matricule) || string.IsNullOrEmpty(createDto.Mdp))
            {
                return BadRequest(new { message = "Matricule et mot de passe sont requis." });
            }

            // Validation du statut
            var validStatuses = new[] { "Administrateur", "Metier", "representantPonct", "representantPerma" };
            if (!validStatuses.Contains(createDto.Status))
            {
                return BadRequest(new { message = "Statut invalide. Les statuts valides sont: " + string.Join(", ", validStatuses) });
            }

            try
            {
                string query = @"
            INSERT INTO Utilisateur (Matricule, Mdp, Status)
            VALUES (@Matricule, @Mdp, @Status)";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();

                    // Vérifier si l'utilisateur existe déjà
                    string checkQuery = "SELECT COUNT(*) FROM Utilisateur WHERE Matricule = @Matricule";
                    using (SqlCommand checkCommand = new SqlCommand(checkQuery, myCon))
                    {
                        checkCommand.Parameters.AddWithValue("@Matricule", createDto.Matricule);
                        int count = (int)checkCommand.ExecuteScalar();
                        if (count > 0)
                        {
                            return Conflict(new { message = "Un utilisateur avec ce matricule existe déjà." });
                        }
                    }

                    // Hasher le mot de passe
                    string hashedPassword = BCrypt.Net.BCrypt.HashPassword(createDto.Mdp);

                    // Créer l'utilisateur
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@Matricule", createDto.Matricule);
                        myCommand.Parameters.AddWithValue("@Mdp", hashedPassword);
                        myCommand.Parameters.AddWithValue("@Status", createDto.Status);

                        int rowsAffected = myCommand.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            return Ok(new { message = "Utilisateur créé avec succès." });
                        }
                        return StatusCode(500, new { message = "Échec de la création de l'utilisateur." });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne du serveur", error = ex.Message });
            }
        }

        // Classe DTO pour la création d'utilisateur
        public class CreateUserDto
        {
            public string Matricule { get; set; }
            public string Mdp { get; set; }
            public string Status { get; set; }
        }

        [HttpGet("get-all-status")]
        public IActionResult GetAllUserStatus()
        {
            try
            {
                string query = "SELECT DISTINCT Status FROM Utilisateur";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            List<string> statusList = new List<string>();

                            while (reader.Read())
                            {
                                statusList.Add(reader["Status"].ToString());
                            }

                            return Ok(statusList);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne du serveur", error = ex.Message });
            }
        }

        [HttpGet("get-representants-matricules-simple")]
        public IActionResult GetRepresentantsMatriculesSimple()
        {
            try
            {
                string query = @"
            SELECT Matricule
            FROM Utilisateur
            WHERE Status IN ('representantPerma', 'representantPonct')
            ORDER BY Matricule";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();

                    using (SqlCommand command = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            List<string> matricules = new List<string>();

                            while (reader.Read())
                            {
                                matricules.Add(reader["Matricule"].ToString());
                            }

                            if (matricules.Count == 0)
                            {
                                return NotFound(new { message = "Aucun représentant trouvé." });
                            }

                            return Ok(matricules);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Erreur lors de la récupération des matricules",
                    error = ex.Message
                });
            }
        }
        [HttpGet("get-all-users")]
        public IActionResult GetAllUsers()
        {
            try
            {
                string query = @"
                    SELECT U.IdUtilisateur, U.Matricule, U.Status, UR.NomPrenomUtilisateur
                    FROM Utilisateur U
                    LEFT JOIN UtilisateurRep UR ON U.Matricule = UR.Matricule
                    ORDER BY U.Matricule";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();

                    using (SqlCommand command = new SqlCommand(query, myCon))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            List<UserDto> users = new List<UserDto>();

                            while (reader.Read())
                            {
                                users.Add(new UserDto
                                {
                                    IdUtilisateur = Convert.ToInt32(reader["IdUtilisateur"]),
                                    Matricule = reader["Matricule"].ToString(),
                                    Status = reader["Status"].ToString(),
                                    NomPrenomUtilisateur = reader["NomPrenomUtilisateur"] != DBNull.Value
                                        ? reader["NomPrenomUtilisateur"].ToString()
                                        : null
                                });
                            }

                            return Ok(users);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Erreur lors de la récupération des utilisateurs",
                    error = ex.Message
                });
            }
        }

        // New endpoint to delete a user by matricule
        [HttpDelete("delete-user/{matricule}")]
        public IActionResult DeleteUser(string matricule)
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
                            // Vérifier si l'utilisateur existe
                            string checkQuery = "SELECT COUNT(*) FROM Utilisateur WHERE Matricule = @Matricule";
                            using (SqlCommand checkCommand = new SqlCommand(checkQuery, myCon, transaction))
                            {
                                checkCommand.Parameters.AddWithValue("@Matricule", matricule);
                                int count = (int)checkCommand.ExecuteScalar();
                                if (count == 0)
                                {
                                    transaction.Rollback();
                                    return NotFound(new { message = "Utilisateur non trouvé." });
                                }
                            }

                            // Vérifier si l'utilisateur est un représentant
                            string getRepIdQuery = "SELECT idUtilisateurRep FROM UtilisateurRep WHERE Matricule = @Matricule";
                            int? idUtilisateurRep = null;
                            using (SqlCommand getRepIdCommand = new SqlCommand(getRepIdQuery, myCon, transaction))
                            {
                                getRepIdCommand.Parameters.AddWithValue("@Matricule", matricule);
                                var result = getRepIdCommand.ExecuteScalar();
                                if (result != null && result != DBNull.Value)
                                {
                                    idUtilisateurRep = Convert.ToInt32(result);
                                }
                            }

                            if (idUtilisateurRep.HasValue)
                            {
                                // 1. Supprimer les dépendances dans SuiviReunion
                                string deleteSuiviQuery = @"
                     DELETE FROM SuiviReunion 
                     WHERE idRepPerm IN (SELECT idRepPerm FROM RepPerma WHERE idUtilisateurRep = @idUtilisateurRep)
                     OR idRepPonct IN (SELECT idRepPonct FROM RepPonct WHERE idUtilisateurRep = @idUtilisateurRep)";

                                using (SqlCommand deleteSuiviCommand = new SqlCommand(deleteSuiviQuery, myCon, transaction))
                                {
                                    deleteSuiviCommand.Parameters.AddWithValue("@idUtilisateurRep", idUtilisateurRep.Value);
                                    deleteSuiviCommand.ExecuteNonQuery();
                                }

                                // 2. Supprimer de RepPerma
                                string deleteRepPermaQuery = "DELETE FROM RepPerma WHERE idUtilisateurRep = @idUtilisateurRep";
                                using (SqlCommand deleteRepPermaCommand = new SqlCommand(deleteRepPermaQuery, myCon, transaction))
                                {
                                    deleteRepPermaCommand.Parameters.AddWithValue("@idUtilisateurRep", idUtilisateurRep.Value);
                                    deleteRepPermaCommand.ExecuteNonQuery();
                                }

                                // 3. Supprimer de RepPonct
                                string deleteRepPonctQuery = "DELETE FROM RepPonct WHERE idUtilisateurRep = @idUtilisateurRep";
                                using (SqlCommand deleteRepPonctCommand = new SqlCommand(deleteRepPonctQuery, myCon, transaction))
                                {
                                    deleteRepPonctCommand.Parameters.AddWithValue("@idUtilisateurRep", idUtilisateurRep.Value);
                                    deleteRepPonctCommand.ExecuteNonQuery();
                                }

                                // 4. Supprimer de UtilisateurRep
                                string deleteRepQuery = "DELETE FROM UtilisateurRep WHERE Matricule = @Matricule";
                                using (SqlCommand deleteRepCommand = new SqlCommand(deleteRepQuery, myCon, transaction))
                                {
                                    deleteRepCommand.Parameters.AddWithValue("@Matricule", matricule);
                                    deleteRepCommand.ExecuteNonQuery();
                                }
                            }

                            // Finalement supprimer de Utilisateur
                            string deleteQuery = "DELETE FROM Utilisateur WHERE Matricule = @Matricule";
                            using (SqlCommand deleteCommand = new SqlCommand(deleteQuery, myCon, transaction))
                            {
                                deleteCommand.Parameters.AddWithValue("@Matricule", matricule);
                                int rowsAffected = deleteCommand.ExecuteNonQuery();

                                if (rowsAffected > 0)
                                {
                                    transaction.Commit();
                                    return Ok(new { message = "Utilisateur supprimé avec succès." });
                                }

                                transaction.Rollback();
                                return StatusCode(500, new { message = "Échec de la suppression de l'utilisateur." });
                            }
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            return StatusCode(500, new
                            {
                                message = "Erreur lors de la suppression de l'utilisateur",
                                error = ex.Message
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Erreur de connexion à la base de données",
                    error = ex.Message
                });
            }
        }


        // DTO for user data
        public class UserDto
        {
            public int IdUtilisateur { get; set; }
            public string Matricule { get; set; }
            public string Status { get; set; }
            public string NomPrenomUtilisateur { get; set; }
        }


    }


}