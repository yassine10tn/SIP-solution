using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReunionController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ReunionController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("create-repperma")]
        public IActionResult CreateRepPerma([FromBody] RepPermaCreateDto repPermaDto)
        {
            if (repPermaDto == null)
            {
                return BadRequest(new { message = "Les données du représentant permanent sont requises." });
            }

            try
            {
                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();

                    // 1. Récupérer les infos de l'utilisateur depuis UtilisateurRep
                    var userInfo = GetUserInfoFromUtilisateurRep(myCon, repPermaDto.IdUtilisateurRep);
                    if (userInfo == null)
                    {
                        return BadRequest(new { message = "L'utilisateur spécifié n'existe pas dans la table UtilisateurRep." });
                    }

                    // 2. Insérer le RepPerma avec les infos récupérées
                    string query = @"
                INSERT INTO RepPerma (idProjet, idUtilisateurRep, matricule, NomPrenomPerma, datePouvoir)
                VALUES (@IdProjet, @IdUtilisateurRep, @Matricule, @NomPrenomPerma, @DatePouvoir);
                SELECT SCOPE_IDENTITY();";

                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@IdProjet", repPermaDto.IdProjet);
                        myCommand.Parameters.AddWithValue("@IdUtilisateurRep", repPermaDto.IdUtilisateurRep);
                        myCommand.Parameters.AddWithValue("@Matricule", userInfo.Matricule);
                        myCommand.Parameters.AddWithValue("@NomPrenomPerma", userInfo.NomPrenomUtilisateur);
                        myCommand.Parameters.AddWithValue("@DatePouvoir", repPermaDto.DatePouvoir);

                        int newId = Convert.ToInt32(myCommand.ExecuteScalar());

                        return Ok(new
                        {
                            message = "Représentant permanent créé avec succès.",
                            idRepPerm = newId
                        });
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                if (sqlEx.Number == 547) // Violation de contrainte FK
                {
                    return BadRequest(new { message = "Violation de contrainte: Le projet spécifié n'existe pas." });
                }
                return StatusCode(500, new { message = "Erreur SQL", error = sqlEx.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne du serveur", error = ex.Message });
            }
        }

        // Nouveau DTO pour la création (sans les champs Matricule et NomPrenomPerma)
        public class RepPermaCreateDto
        {
            public int IdProjet { get; set; }
            public int IdUtilisateurRep { get; set; }
            public DateTime DatePouvoir { get; set; }
        }

        // Méthode pour récupérer les infos utilisateur
        private UserInfoDto GetUserInfoFromUtilisateurRep(SqlConnection connection, int idUtilisateurRep)
        {
            string query = @"
        SELECT Matricule, NomPrenomUtilisateur 
        FROM UtilisateurRep 
        WHERE IdUtilisateurRep = @IdUtilisateurRep";

            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@IdUtilisateurRep", idUtilisateurRep);

                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return new UserInfoDto
                        {
                            Matricule = reader["Matricule"].ToString(),
                            NomPrenomUtilisateur = reader["NomPrenomUtilisateur"].ToString()
                        };
                    }
                    return null;
                }
            }
        }

        [HttpPost("create-repponct")]
        public IActionResult CreateRepPonct([FromBody] RepPonctCreateDto repPonctDto)
        {
            if (repPonctDto == null)
            {
                return BadRequest(new { message = "Les données du représentant ponctuel sont requises." });
            }

            try
            {
                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();

                    // 1. Récupérer les infos de l'utilisateur depuis UtilisateurRep
                    var userInfo = GetUserInfoFromUtilisateurRep(myCon, repPonctDto.IdUtilisateurRep);
                    if (userInfo == null)
                    {
                        return BadRequest(new { message = "L'utilisateur spécifié n'existe pas dans la table UtilisateurRep." });
                    }

                    // 2. Récupérer la date de réunion si idReunion est fourni
                    DateTime? dateReunion = null;
                    if (repPonctDto.IdReunion.HasValue)
                    {
                        string dateQuery = "SELECT DateReunion FROM Reunion WHERE idReunion = @IdReunion";
                        using (SqlCommand dateCommand = new SqlCommand(dateQuery, myCon))
                        {
                            dateCommand.Parameters.AddWithValue("@IdReunion", repPonctDto.IdReunion.Value);
                            var result = dateCommand.ExecuteScalar();
                            if (result != null)
                            {
                                dateReunion = Convert.ToDateTime(result);
                            }
                        }
                    }

                    // 3. Insérer le RepPonct avec les infos récupérées
                    string query = @"
                INSERT INTO RepPonct (
                    idProjet, 
                    idUtilisateurRep, 
                    matricule, 
                    NomPrenomPonct, 
                    datePouvoir,
                    idReunion,
                    DateReunion,
                    Motif
                )
                VALUES (
                    @IdProjet, 
                    @IdUtilisateurRep, 
                    @Matricule, 
                    @NomPrenomPonct, 
                    @DatePouvoir,
                    @IdReunion,
                    @DateReunion,
                    @Motif
                );
                SELECT SCOPE_IDENTITY();";

                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@IdProjet", repPonctDto.IdProjet);
                        myCommand.Parameters.AddWithValue("@IdUtilisateurRep", repPonctDto.IdUtilisateurRep);
                        myCommand.Parameters.AddWithValue("@Matricule", userInfo.Matricule);
                        myCommand.Parameters.AddWithValue("@NomPrenomPonct", userInfo.NomPrenomUtilisateur);
                        myCommand.Parameters.AddWithValue("@DatePouvoir", repPonctDto.DatePouvoir);
                        myCommand.Parameters.AddWithValue("@IdReunion", repPonctDto.IdReunion ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@DateReunion", dateReunion ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@Motif", repPonctDto.Motif ?? (object)DBNull.Value);

                        int newId = Convert.ToInt32(myCommand.ExecuteScalar());

                        return Ok(new
                        {
                            message = "Représentant ponctuel créé avec succès.",
                            idRepPonct = newId
                        });
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                if (sqlEx.Number == 547) // Violation de contrainte FK
                {
                    return BadRequest(new
                    {
                        message = "Violation de contrainte: Le projet ou la réunion spécifié n'existe pas."
                    });
                }
                return StatusCode(500, new { message = "Erreur SQL", error = sqlEx.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne du serveur", error = ex.Message });
            }
        }

        // DTO pour la création d'un représentant ponctuel
        public class RepPonctCreateDto
        {
            public int IdProjet { get; set; }
            public int IdUtilisateurRep { get; set; }
            public DateTime DatePouvoir { get; set; }
            public int? IdReunion { get; set; }
            public string Motif { get; set; }
        }

        // DTO pour les infos utilisateur
        public class UserInfoDto
        {
            public string Matricule { get; set; }
            public string NomPrenomUtilisateur { get; set; }
        }

        // Récupérer tous les représentants permanents
        [HttpGet("get-all-repperma")]
        public IActionResult GetAllRepPerma()
        {
            try
            {
                string query = @"
            SELECT 
                rp.idRepPerm, 
                rp.idProjet, 
                p.RaisonSociale, 
                rp.idUtilisateurRep, 
                rp.matricule, 
                rp.NomPrenomPerma, 
                rp.datePouvoir,
                ur.NomPrenomUtilisateur
            FROM RepPerma rp
            INNER JOIN Projet p ON rp.idProjet = p.idProjet
            INNER JOIN UtilisateurRep ur ON rp.idUtilisateurRep = ur.IdUtilisateurRep";

                var repPermas = new List<RepPermaDetailsDto>();

                using (var myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (var myCommand = new SqlCommand(query, myCon))
                    using (var reader = myCommand.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            repPermas.Add(new RepPermaDetailsDto
                            {
                                IdRepPerm = reader.GetInt32(0),
                                IdProjet = reader.GetInt32(1),
                                RaisonSociale = reader.GetString(2),
                                IdUtilisateurRep = reader.GetInt32(3),
                                Matricule = reader.GetString(4),
                                NomPrenomPerma = reader.IsDBNull(5) ? null : reader.GetString(5),
                                DatePouvoir = reader.GetDateTime(6),
                                NomComplet = reader.GetString(7)
                            });
                        }
                    }
                }

                return Ok(repPermas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne du serveur", error = ex.Message });
            }
        }

        // Récupérer tous les représentants ponctuels
        [HttpGet("get-all-repponct")]
        public IActionResult GetAllRepPonct()
        {
            try
            {
                string query = @"
            SELECT 
                rp.idRepPonct, 
                rp.idProjet, 
                p.RaisonSociale, 
                rp.idUtilisateurRep, 
                rp.matricule, 
                rp.NomPrenomPonct, 
                rp.datePouvoir,
                rp.idReunion,
                rp.DateReunion,
                rp.Motif,
                ur.NomPrenomUtilisateur,
                CASE 
                    WHEN r.idReunion IS NULL THEN NULL 
                    ELSE r.typeR 
                END as TypeReunion
            FROM RepPonct rp
            INNER JOIN Projet p ON rp.idProjet = p.idProjet
            INNER JOIN UtilisateurRep ur ON rp.idUtilisateurRep = ur.IdUtilisateurRep
            LEFT JOIN Reunion r ON rp.idReunion = r.idReunion";

                var repPoncts = new List<RepPonctDetailsDto>();

                using (var myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (var myCommand = new SqlCommand(query, myCon))
                    using (var reader = myCommand.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            repPoncts.Add(new RepPonctDetailsDto
                            {
                                IdRepPonct = reader.GetInt32(0),
                                IdProjet = reader.GetInt32(1),
                                RaisonSociale = reader.GetString(2),
                                IdUtilisateurRep = reader.GetInt32(3),
                                Matricule = reader.GetString(4),
                                NomPrenomPonct = reader.IsDBNull(5) ? null : reader.GetString(5),
                                DatePouvoir = reader.GetDateTime(6),
                                IdReunion = reader.IsDBNull(7) ? (int?)null : reader.GetInt32(7),
                                DateReunion = reader.IsDBNull(8) ? (DateTime?)null : reader.GetDateTime(8),
                                Motif = reader.IsDBNull(9) ? null : reader.GetString(9),
                                NomComplet = reader.GetString(10),
                                TypeReunion = reader.IsDBNull(11) ? null : reader.GetString(11)
                            });
                        }
                    }
                }

                return Ok(repPoncts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne du serveur", error = ex.Message });
            }
        }

        // DTOs mis à jour
        public class RepPermaDetailsDto
        {
            public int IdRepPerm { get; set; }
            public int IdProjet { get; set; }
            public string RaisonSociale { get; set; }
            public int IdUtilisateurRep { get; set; }
            public string Matricule { get; set; }
            public string NomPrenomPerma { get; set; }
            public DateTime DatePouvoir { get; set; }
            public string NomComplet { get; set; }
        }

        public class RepPonctDetailsDto
        {
            public int IdRepPonct { get; set; }
            public int IdProjet { get; set; }
            public string RaisonSociale { get; set; }
            public int IdUtilisateurRep { get; set; }
            public string Matricule { get; set; }
            public string NomPrenomPonct { get; set; }
            public DateTime DatePouvoir { get; set; }
            public int? IdReunion { get; set; }
            public DateTime? DateReunion { get; set; }
            public string Motif { get; set; }
            public string NomComplet { get; set; }
            public string TypeReunion { get; set; }
        }

        // Vérifier l'existence d'un représentant pour un projet et une réunion
        [HttpGet("check-representative/{idProjet}/{idReunion}")]
        public IActionResult CheckRepresentative(int idProjet, int idReunion)
        {
            try
            {
                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();

                    // Vérifier si la réunion est de type CA
                    string typeQuery = "SELECT typeR FROM Reunion WHERE idReunion = @IdReunion";
                    string typeR = null;

                    using (SqlCommand typeCommand = new SqlCommand(typeQuery, myCon))
                    {
                        typeCommand.Parameters.AddWithValue("@IdReunion", idReunion);
                        var result = typeCommand.ExecuteScalar();
                        if (result != null)
                        {
                            typeR = result.ToString();
                        }
                    }

                    if (typeR == "CA")
                    {
                        // Vérifier dans RepPerma
                        string repPermaQuery = "SELECT COUNT(*) FROM RepPerma WHERE idProjet = @IdProjet";
                        using (SqlCommand repPermaCommand = new SqlCommand(repPermaQuery, myCon))
                        {
                            repPermaCommand.Parameters.AddWithValue("@IdProjet", idProjet);
                            int repPermaCount = (int)repPermaCommand.ExecuteScalar();
                            return Ok(repPermaCount > 0);
                        }
                    }
                    else
                    {
                        // Vérifier dans RepPonct
                        string repPonctQuery = "SELECT COUNT(*) FROM RepPonct WHERE idProjet = @IdProjet AND idReunion = @IdReunion";
                        using (SqlCommand repPonctCommand = new SqlCommand(repPonctQuery, myCon))
                        {
                            repPonctCommand.Parameters.AddWithValue("@IdProjet", idProjet);
                            repPonctCommand.Parameters.AddWithValue("@IdReunion", idReunion);
                            int repPonctCount = (int)repPonctCommand.ExecuteScalar();
                            return Ok(repPonctCount > 0);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne du serveur", error = ex.Message });
            }
        }

        // Méthode pour créer une réunion
        [HttpPost("create-reunion")]
        public IActionResult CreateReunion([FromBody] ReunionCreateDto reunionDto)
        {
            if (reunionDto == null)
            {
                return BadRequest(new { message = "Les données de la réunion sont requises." });
            }

            try
            {
                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();

                    // 1. Récupérer le libellé du type de réunion
                    string typeReunionQuery = "SELECT libelleTypereunion FROM TypeReunion WHERE idTypeReunion = @IdTypeReunion";
                    string libelleType = "";

                    using (SqlCommand typeCommand = new SqlCommand(typeReunionQuery, myCon))
                    {
                        typeCommand.Parameters.AddWithValue("@IdTypeReunion", reunionDto.IdTypeReunion);
                        var result = typeCommand.ExecuteScalar();
                        if (result == null)
                        {
                            return BadRequest(new { message = "Type de réunion non trouvé." });
                        }
                        libelleType = result.ToString();
                    }

                    // 2. Insérer la réunion
                    string query = @"
                INSERT INTO Reunion (
                    idProjet, 
                    idTypeReunion, 
                    typeR, 
                    DateReunion, 
                    heureReunion, 
                    ordre, 
                    convocation, 
                    lieuReunion
                )
                VALUES (
                    @IdProjet, 
                    @IdTypeReunion, 
                    @TypeR, 
                    @DateReunion, 
                    @HeureReunion, 
                    @Ordre, 
                    @Convocation, 
                    @LieuReunion
                );
                SELECT SCOPE_IDENTITY();";

                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@IdProjet", reunionDto.IdProjet);
                        myCommand.Parameters.AddWithValue("@IdTypeReunion", reunionDto.IdTypeReunion);
                        myCommand.Parameters.AddWithValue("@TypeR", libelleType);
                        myCommand.Parameters.AddWithValue("@DateReunion", reunionDto.DateReunion);
                        myCommand.Parameters.AddWithValue("@HeureReunion", reunionDto.HeureReunion);
                        myCommand.Parameters.AddWithValue("@Ordre", reunionDto.Ordre ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@Convocation", reunionDto.Convocation ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@LieuReunion", reunionDto.LieuReunion ?? (object)DBNull.Value);

                        int newId = Convert.ToInt32(myCommand.ExecuteScalar());

                        return Ok(new
                        {
                            message = "Réunion créée avec succès.",
                            idReunion = newId
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne du serveur", error = ex.Message });
            }
        }

        // Méthode pour récupérer tous les types de réunion
        [HttpGet("get-all-typereunion")]
        public IActionResult GetAllTypeReunion()
        {
            try
            {
                string query = "SELECT idTypeReunion, libelleTypereunion FROM TypeReunion";

                List<TypeReunionDto> types = new List<TypeReunionDto>();

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    using (SqlDataReader reader = myCommand.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            types.Add(new TypeReunionDto
                            {
                                IdTypeReunion = Convert.ToInt32(reader["idTypeReunion"]),
                                LibelleTypereunion = reader["libelleTypereunion"].ToString()
                            });
                        }
                    }
                }

                return Ok(types);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne du serveur", error = ex.Message });
            }
        }

        // Méthode pour récupérer toutes les réunions avec détails
        [HttpGet("get-all-reunion")]
        public IActionResult GetAllReunion()
        {
            try
            {
                string query = @"
            SELECT 
                r.idReunion,
                r.idProjet,
                p.RaisonSociale,
                r.idTypeReunion,
                tr.libelleTypereunion,
                r.typeR,
                r.DateReunion,
                r.heureReunion,
                r.ordre,
                r.lieuReunion
            FROM Reunion r
            INNER JOIN Projet p ON r.idProjet = p.idProjet
            INNER JOIN TypeReunion tr ON r.idTypeReunion = tr.idTypeReunion";

                List<ReunionDetailsDto> reunions = new List<ReunionDetailsDto>();

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    using (SqlDataReader reader = myCommand.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            reunions.Add(new ReunionDetailsDto
                            {
                                IdReunion = Convert.ToInt32(reader["idReunion"]),
                                IdProjet = Convert.ToInt32(reader["idProjet"]),
                                RaisonSociale = reader["RaisonSociale"].ToString(),
                                IdTypeReunion = Convert.ToInt32(reader["idTypeReunion"]),
                                LibelleTypeReunion = reader["libelleTypereunion"].ToString(),
                                TypeR = reader["typeR"].ToString(),
                                DateReunion = Convert.ToDateTime(reader["DateReunion"]),
                                HeureReunion = TimeSpan.Parse(reader["heureReunion"].ToString()),
                                Ordre = reader.IsDBNull(reader.GetOrdinal("ordre")) ? null : reader["ordre"].ToString(),
                                LieuReunion = reader.IsDBNull(reader.GetOrdinal("lieuReunion")) ? null : reader["lieuReunion"].ToString()
                            });
                        }
                    }
                }

                return Ok(reunions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne du serveur", error = ex.Message });
            }
        }

        // DTOs nécessaires
        public class ReunionCreateDto
        {
            public int IdProjet { get; set; }
            public int IdTypeReunion { get; set; }
            public DateTime DateReunion { get; set; }
            public TimeSpan HeureReunion { get; set; }
            public string? Ordre { get; set; }
            public string? Convocation { get; set; }
            public string? LieuReunion { get; set; }
        }

        public class TypeReunionDto
        {
            public int IdTypeReunion { get; set; }
            public string LibelleTypereunion { get; set; }
        }

        public class ReunionDetailsDto
        {
            public int IdReunion { get; set; }
            public int IdProjet { get; set; }
            public string RaisonSociale { get; set; }
            public int IdTypeReunion { get; set; }
            public string LibelleTypeReunion { get; set; }
            public string TypeR { get; set; }
            public DateTime DateReunion { get; set; }
            public TimeSpan HeureReunion { get; set; }
            public string Ordre { get; set; }
            public string LieuReunion { get; set; }
        }

        [HttpPost("create-suivireunion")]
        public async Task<IActionResult> CreateSuiviReunion([FromBody] SuiviReunionCreateDto suiviReunionDto)
        {
            if (suiviReunionDto == null)
            {
                return BadRequest(new { message = "Les données du suivi de réunion sont requises." });
            }

            // Validate TenueReunion
            if (suiviReunionDto.TenueReunion != "Oui" && suiviReunionDto.TenueReunion != "Non")
            {
                return BadRequest(new { message = "TenueReunion doit être 'Oui' ou 'Non'." });
            }

            try
            {

                // Initialize document variables as SqlBytes to handle null properly
                SqlBytes docCRBytes = SqlBytes.Null;
                SqlBytes docPVBytes = SqlBytes.Null;
                SqlBytes autreDocBytes = SqlBytes.Null;


                // Convert Base64 strings to byte arrays if provided
                if (!string.IsNullOrWhiteSpace(suiviReunionDto.DocCR))
                {
                    docCRBytes = new SqlBytes(Convert.FromBase64String(suiviReunionDto.DocCR));
                }
                if (!string.IsNullOrWhiteSpace(suiviReunionDto.DocPV))
                {
                    docPVBytes = new SqlBytes(Convert.FromBase64String(suiviReunionDto.DocPV));
                }
                if (!string.IsNullOrWhiteSpace(suiviReunionDto.AutreDoc))
                {
                    autreDocBytes = new SqlBytes(Convert.FromBase64String(suiviReunionDto.AutreDoc));
                }
                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();

                    // Validate Reunion existence and fetch details
                    string reunionQuery = @"
                        SELECT typeR, DateReunion, heureReunion, ordre 
                        FROM Reunion 
                        WHERE idReunion = @IdReunion";
                    string typeR;
                    DateTime? dateReunion;
                    TimeSpan? heureReunion;
                    string ordre;

                    using (SqlCommand reunionCommand = new SqlCommand(reunionQuery, myCon))
                    {
                        reunionCommand.Parameters.AddWithValue("@IdReunion", suiviReunionDto.IdReunion);
                        using (SqlDataReader reader = reunionCommand.ExecuteReader())
                        {
                            if (!reader.Read())
                            {
                                return BadRequest(new { message = "La réunion spécifiée n'existe pas." });
                            }
                            typeR = reader.IsDBNull(0) ? null : reader.GetString(0);
                            dateReunion = reader.IsDBNull(1) ? (DateTime?)null : reader.GetDateTime(1);
                            heureReunion = reader.IsDBNull(2) ? (TimeSpan?)null : reader.GetTimeSpan(2);
                            ordre = reader.IsDBNull(3) ? null : reader.GetString(3);
                            reader.Close();
                        }
                    }

                    // Validate Projet existence
                    string projetQuery = "SELECT COUNT(*) FROM Projet WHERE idProjet = @IdProjet";
                    using (SqlCommand projetCommand = new SqlCommand(projetQuery, myCon))
                    {
                        projetCommand.Parameters.AddWithValue("@IdProjet", suiviReunionDto.IdProjet);
                        int projetCount = (int)projetCommand.ExecuteScalar();
                        if (projetCount == 0)
                        {
                            return BadRequest(new { message = "Le projet spécifié n'existe pas." });
                        }
                    }

                    // Initialize variables for representatives
                    string pouvoirPerma = null;
                    string reprSTB = null;
                    int? idRepPermToInsert = null;
                    int? idRepPonctToInsert = null;

                    // Fetch representative based on typeR
                    if (typeR == "CA")
                    {
                        // Fetch RepPerma for the project
                        string repPermaQuery = @"
                            SELECT idRepPerm, NomPrenomPerma 
                            FROM RepPerma 
                            WHERE idProjet = @IdProjet";
                        using (SqlCommand repPermaCommand = new SqlCommand(repPermaQuery, myCon))
                        {
                            repPermaCommand.Parameters.AddWithValue("@IdProjet", suiviReunionDto.IdProjet);
                            using (SqlDataReader reader = repPermaCommand.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    idRepPermToInsert = reader.GetInt32(0);
                                    pouvoirPerma = reader.IsDBNull(1) ? null : reader.GetString(1);
                                }
                                else
                                {
                                    return BadRequest(new { message = "Aucun représentant permanent trouvé pour ce projet avec typeR 'CA'." });
                                }
                                reader.Close();
                            }
                        }
                    }
                    else
                    {
                        // Fetch RepPonct for the project
                        string repPonctQuery = @"
                            SELECT idRepPonct, NomPrenomPonct 
                            FROM RepPonct 
                            WHERE idProjet = @IdProjet";
                        using (SqlCommand repPonctCommand = new SqlCommand(repPonctQuery, myCon))
                        {
                            repPonctCommand.Parameters.AddWithValue("@IdProjet", suiviReunionDto.IdProjet);
                            using (SqlDataReader reader = repPonctCommand.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    idRepPonctToInsert = reader.GetInt32(0);
                                    reprSTB = reader.IsDBNull(1) ? null : reader.GetString(1);
                                }
                                else
                                {
                                    return BadRequest(new { message = "Aucun représentant ponctuel trouvé pour ce projet avec typeR différent de 'CA'." });
                                }
                                reader.Close();
                            }
                        }
                    }


                    // Insert SuiviReunion
                    string query = @"
                        INSERT INTO SuiviReunion (
                            idProjet,
                            idReunion,
                            typeR,
                            dateReunion,
                            heureReunion,
                            ordre,
                            idRepPonct,
                            idRepPerm,
                            PouvoirPerma,
                            ReprSTB,
                            TenueReunion,
                            MotifReplacement,
                            TenueMotifAnnulation,
                            Observation,
                            DateRapellePremCR,
                            DateRapelleDeuxCR,
                            DocCR,
                            DateRapellePremPV,
                            DateRapelleDeuxPV,
                            DocPV,
                            AutreDoc
                        )
                        VALUES (
                            @IdProjet,
                            @IdReunion,
                            @TypeR,
                            @DateReunion,
                            @HeureReunion,
                            @Ordre,
                            @IdRepPonct,
                            @IdRepPerm,
                            @PouvoirPerma,
                            @ReprSTB,
                            @TenueReunion,
                            @MotifReplacement,
                            @TenueMotifAnnulation,
                            @Observation,
                            @DateRapellePremCR,
                            @DateRapelleDeuxCR,
                            @DocCR,
                            @DateRapellePremPV,
                            @DateRapelleDeuxPV,
                            @DocPV,
                            @AutreDoc
                        );
                        SELECT SCOPE_IDENTITY();";

                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@IdProjet", suiviReunionDto.IdProjet);
                        myCommand.Parameters.AddWithValue("@IdReunion", suiviReunionDto.IdReunion);
                        myCommand.Parameters.AddWithValue("@TypeR", (object)typeR ?? DBNull.Value);
                        myCommand.Parameters.AddWithValue("@DateReunion", (object)dateReunion ?? DBNull.Value);
                        myCommand.Parameters.AddWithValue("@HeureReunion", (object)heureReunion ?? DBNull.Value);
                        myCommand.Parameters.AddWithValue("@Ordre", (object)ordre ?? DBNull.Value);
                        myCommand.Parameters.AddWithValue("@IdRepPonct", (object)idRepPonctToInsert ?? DBNull.Value);
                        myCommand.Parameters.AddWithValue("@IdRepPerm", (object)idRepPermToInsert ?? DBNull.Value);
                        myCommand.Parameters.AddWithValue("@PouvoirPerma", (object)pouvoirPerma ?? DBNull.Value);
                        myCommand.Parameters.AddWithValue("@ReprSTB", (object)reprSTB ?? DBNull.Value);
                        myCommand.Parameters.AddWithValue("@TenueReunion", suiviReunionDto.TenueReunion);
                        myCommand.Parameters.AddWithValue("@MotifReplacement", suiviReunionDto.MotifReplacement ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@TenueMotifAnnulation", suiviReunionDto.TenueMotifAnnulation ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@Observation", suiviReunionDto.Observation ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@DateRapellePremCR", suiviReunionDto.DateRapellePremCR ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@DateRapelleDeuxCR", suiviReunionDto.DateRapelleDeuxCR ?? (object)DBNull.Value);
                        myCommand.Parameters.Add("@DocCR", SqlDbType.VarBinary, -1).Value = docCRBytes;
                        myCommand.Parameters.AddWithValue("@DateRapellePremPV", suiviReunionDto.DateRapellePremPV ?? (object)DBNull.Value);
                        myCommand.Parameters.AddWithValue("@DateRapelleDeuxPV", suiviReunionDto.DateRapelleDeuxPV ?? (object)DBNull.Value);
                        myCommand.Parameters.Add("@DocPV", SqlDbType.VarBinary, -1).Value = docPVBytes;
                        myCommand.Parameters.Add("@AutreDoc", SqlDbType.VarBinary, -1).Value = autreDocBytes;

                        int newId = Convert.ToInt32(await myCommand.ExecuteScalarAsync());

                        return Ok(new
                        {
                            message = "Suivi de réunion créé avec succès.",
                            idSuivi = newId
                        });
                    }
                }
            }
            catch (FormatException ex)
            {
                return BadRequest(new { message = "Invalid Base64 string for one or more documents.", error = ex.Message });
            }
            catch (SqlException sqlEx)
            {
                if (sqlEx.Number == 547) // Foreign key violation
                {
                    return BadRequest(new { message = "Violation de contrainte: Vérifiez les identifiants fournis (projet, réunion)." });
                }
                return StatusCode(500, new { message = "Erreur SQL", error = sqlEx.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne du serveur", error = ex.Message });
            }
        }

        // DTO for SuiviReunion creation
        public class SuiviReunionCreateDto
        {
            public int IdProjet { get; set; }
            public int IdReunion { get; set; }
            public string TenueReunion { get; set; } // "Oui" or "Non"
            public string? MotifReplacement { get; set; }
            public string? TenueMotifAnnulation { get; set; }
            public string? Observation { get; set; }
            public DateTime? DateRapellePremCR { get; set; }
            public DateTime? DateRapelleDeuxCR { get; set; }
            public string? DocCR { get; set; } // Base64-encoded string
            public DateTime? DateRapellePremPV { get; set; }
            public DateTime? DateRapelleDeuxPV { get; set; }
            public string? DocPV { get; set; } // Base64-encoded string
            public string? AutreDoc { get; set; } // Base64-encoded string
        }

        // DTO for SuiviReunion details
        public class SuiviReunionDetailsDto
        {
            public int IdSuivi { get; set; }
            public int IdProjet { get; set; }
            public string RaisonSociale { get; set; }
            public int IdReunion { get; set; }
            public string TypeR { get; set; }
            public DateTime? DateReunion { get; set; }
            public TimeSpan? HeureReunion { get; set; }
            public string Ordre { get; set; }
            public int? IdRepPonct { get; set; }
            public string NomPrenomPonct { get; set; }
            public int? IdRepPerm { get; set; }
            public string NomPrenomPerma { get; set; }
            public string PouvoirPerma { get; set; }
            public string ReprSTB { get; set; }
            public string TenueReunion { get; set; }
            public string MotifReplacement { get; set; }
            public string TenueMotifAnnulation { get; set; }
            public string Observation { get; set; }
            public DateTime? DateRapellePremCR { get; set; }
            public DateTime? DateRapelleDeuxCR { get; set; }
            public string? DocCR { get; set; } // Base64-encoded string
            public DateTime? DateRapellePremPV { get; set; }
            public DateTime? DateRapelleDeuxPV { get; set; }
            public string? DocPV { get; set; } // Base64-encoded string
            public string? AutreDoc { get; set; } // Base64-encoded string
        }

        [HttpGet("get-all-suivireunion")]
        public IActionResult GetAllSuiviReunion()
        {
            try
            {
                string query = @"
                    SELECT 
                        sr.idSuivi,
                        sr.idProjet,
                        p.RaisonSociale,
                        sr.idReunion,
                        sr.typeR,
                        sr.dateReunion,
                        sr.heureReunion,
                        sr.ordre,
                        sr.idRepPonct,
                        rpo.NomPrenomPonct,
                        sr.idRepPerm,
                        rpe.NomPrenomPerma,
                        sr.PouvoirPerma,
                        sr.ReprSTB,
                        sr.TenueReunion,
                        sr.MotifReplacement,
                        sr.TenueMotifAnnulation,
                        sr.Observation,
                        sr.DateRapellePremCR,
                        sr.DateRapelleDeuxCR,
                        sr.DocCR,
                        sr.DateRapellePremPV,
                        sr.DateRapelleDeuxPV,
                        sr.DocPV,
                        sr.AutreDoc
                    FROM SuiviReunion sr
                    INNER JOIN Projet p ON sr.idProjet = p.idProjet
                    INNER JOIN Reunion r ON sr.idReunion = r.idReunion
                    LEFT JOIN RepPonct rpo ON sr.idRepPonct = rpo.idRepPonct
                    LEFT JOIN RepPerma rpe ON sr.idRepPerm = rpe.idRepPerm";

                var suiviReunions = new List<SuiviReunionDetailsDto>();

                using (var myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (var myCommand = new SqlCommand(query, myCon))
                    using (var reader = myCommand.ExecuteReader())
                    {
                        while (reader.Read())
                        {

                            //
                            // Convert binary data to Base64 strings
                            byte[] docPVBytes = reader.IsDBNull(reader.GetOrdinal("DocPV")) ? null : (byte[])reader["DocPV"];
                            string docPVBase64 = docPVBytes != null ? Convert.ToBase64String(docPVBytes) : null;

                            byte[] docCRBytes = reader.IsDBNull(reader.GetOrdinal("DocCR")) ? null : (byte[])reader["DocCR"];
                            string docCRBase64 = docCRBytes != null ? Convert.ToBase64String(docCRBytes) : null;

                            byte[] autreDocBytes = reader.IsDBNull(reader.GetOrdinal("AutreDoc")) ? null : (byte[])reader["AutreDoc"];
                            string autreDocBase64 = autreDocBytes != null ? Convert.ToBase64String(autreDocBytes) : null;

                            suiviReunions.Add(new SuiviReunionDetailsDto
                            {
                                IdSuivi = reader.GetInt32(reader.GetOrdinal("idSuivi")),
                                IdProjet = reader.GetInt32(reader.GetOrdinal("idProjet")),
                                RaisonSociale = reader.GetString(reader.GetOrdinal("RaisonSociale")),
                                IdReunion = reader.GetInt32(reader.GetOrdinal("idReunion")),
                                TypeR = reader.IsDBNull(reader.GetOrdinal("typeR")) ? null : reader.GetString(reader.GetOrdinal("typeR")),
                                DateReunion = reader.IsDBNull(reader.GetOrdinal("dateReunion")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("dateReunion")),
                                HeureReunion = reader.IsDBNull(reader.GetOrdinal("heureReunion")) ? (TimeSpan?)null : reader.GetTimeSpan(reader.GetOrdinal("heureReunion")),
                                Ordre = reader.IsDBNull(reader.GetOrdinal("ordre")) ? null : reader.GetString(reader.GetOrdinal("ordre")),
                                IdRepPonct = reader.IsDBNull(reader.GetOrdinal("idRepPonct")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("idRepPonct")),
                                NomPrenomPonct = reader.IsDBNull(reader.GetOrdinal("NomPrenomPonct")) ? null : reader.GetString(reader.GetOrdinal("NomPrenomPonct")),
                                IdRepPerm = reader.IsDBNull(reader.GetOrdinal("idRepPerm")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("idRepPerm")),
                                NomPrenomPerma = reader.IsDBNull(reader.GetOrdinal("NomPrenomPerma")) ? null : reader.GetString(reader.GetOrdinal("NomPrenomPerma")),
                                PouvoirPerma = reader.IsDBNull(reader.GetOrdinal("PouvoirPerma")) ? null : reader.GetString(reader.GetOrdinal("PouvoirPerma")),
                                ReprSTB = reader.IsDBNull(reader.GetOrdinal("ReprSTB")) ? null : reader.GetString(reader.GetOrdinal("ReprSTB")),
                                TenueReunion = reader.GetString(reader.GetOrdinal("TenueReunion")),
                                MotifReplacement = reader.IsDBNull(reader.GetOrdinal("MotifReplacement")) ? null : reader.GetString(reader.GetOrdinal("MotifReplacement")),
                                TenueMotifAnnulation = reader.IsDBNull(reader.GetOrdinal("TenueMotifAnnulation")) ? null : reader.GetString(reader.GetOrdinal("TenueMotifAnnulation")),
                                Observation = reader.IsDBNull(reader.GetOrdinal("Observation")) ? null : reader.GetString(reader.GetOrdinal("Observation")),
                                DateRapellePremCR = reader.IsDBNull(reader.GetOrdinal("DateRapellePremCR")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("DateRapellePremCR")),
                                DateRapelleDeuxCR = reader.IsDBNull(reader.GetOrdinal("DateRapelleDeuxCR")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("DateRapelleDeuxCR")),
                                DocCR = docCRBase64,
                                DateRapellePremPV = reader.IsDBNull(reader.GetOrdinal("DateRapellePremPV")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("DateRapellePremPV")),
                                DateRapelleDeuxPV = reader.IsDBNull(reader.GetOrdinal("DateRapelleDeuxPV")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("DateRapelleDeuxPV")),
                                DocPV = docPVBase64,
                                AutreDoc = autreDocBase64
                            });
                        }
                    }
                }

                return Ok(suiviReunions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne du serveur", error = ex.Message });
            }
        }

        [HttpGet("download-document/{idSuivi}/{type}")]
        public IActionResult DownloadDocument(int idSuivi, string type)
        {
            try
            {
                string columnName = type switch
                {
                    "DocPV" => "DocPV",
                    "DocCR" => "DocCR",
                    "AutreDoc" => "AutreDoc",
                    _ => throw new ArgumentException("Invalid document type")
                };

                string query = $"SELECT {columnName} FROM SuiviReunion WHERE idSuivi = @IdSuivi";
                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@IdSuivi", idSuivi);
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            if (reader.Read() && !reader.IsDBNull(0))
                            {
                                byte[] fileData = (byte[])reader[columnName];
                                string contentType = "application/octet-stream"; // Adjust based on file type if needed
                                return File(fileData, contentType, $"{type}_{idSuivi}.pdf"); // Assuming PDF for simplicity
                            }
                            else
                            {
                                return NotFound(new { message = "Document not found." });
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





        [HttpGet("get-all-utilisateurrep")]
        public IActionResult GetAllUtilisateurRep()
        {
            try
            {
                string query = "SELECT IdUtilisateurRep, Matricule, NomPrenomUtilisateur FROM UtilisateurRep";
                var users = new List<UtilisateurRepDto>();

                using (var connection = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    connection.Open();
                    using (var command = new SqlCommand(query, connection))
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            users.Add(new UtilisateurRepDto
                            {
                                IdUtilisateurRep = reader.GetInt32(0),
                                Matricule = reader.GetString(1),
                                NomPrenomUtilisateur = reader.IsDBNull(2) ? null : reader.GetString(2)
                            });
                        }
                    }
                }

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne du serveur", error = ex.Message });
            }
        }

        public class UtilisateurRepDto
        {
            public int IdUtilisateurRep { get; set; }
            public string Matricule { get; set; }
            public string NomPrenomUtilisateur { get; set; }
        }

        // New endpoint to get reunions by idProjet and typeR
        [HttpGet("get-reunion-by-projet-and-type/{idProjet}/{typeR}")]
        public IActionResult GetReunionByProjetAndType(int idProjet, string typeR)
        {
            try
            {
                string query = @"
                    SELECT 
                        r.idReunion,
                        r.idProjet,
                        p.RaisonSociale,
                        r.idTypeReunion,
                        tr.libelleTypereunion,
                        r.typeR,
                        r.DateReunion,
                        r.heureReunion,
                        r.ordre,
                        r.lieuReunion
                    FROM Reunion r
                    INNER JOIN Projet p ON r.idProjet = p.idProjet
                    INNER JOIN TypeReunion tr ON r.idTypeReunion = tr.idTypeReunion
                    WHERE r.idProjet = @IdProjet AND r.typeR = @TypeR";

                List<ReunionDetailsDto> reunions = new List<ReunionDetailsDto>();

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@IdProjet", idProjet);
                        myCommand.Parameters.AddWithValue("@TypeR", typeR);
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                reunions.Add(new ReunionDetailsDto
                                {
                                    IdReunion = Convert.ToInt32(reader["idReunion"]),
                                    IdProjet = Convert.ToInt32(reader["idProjet"]),
                                    RaisonSociale = reader["RaisonSociale"].ToString(),
                                    IdTypeReunion = Convert.ToInt32(reader["idTypeReunion"]),
                                    LibelleTypeReunion = reader["libelleTypereunion"].ToString(),
                                    TypeR = reader["typeR"].ToString(),
                                    DateReunion = Convert.ToDateTime(reader["DateReunion"]),
                                    HeureReunion = TimeSpan.Parse(reader["heureReunion"].ToString()),
                                    Ordre = reader.IsDBNull(reader.GetOrdinal("ordre")) ? null : reader["ordre"].ToString(),
                                    LieuReunion = reader.IsDBNull(reader.GetOrdinal("lieuReunion")) ? null : reader["lieuReunion"].ToString()
                                });
                            }
                        }
                    }
                }

                return Ok(reunions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne du serveur", error = ex.Message });
            }
        }

        [HttpPut("update-suivireunion/{idSuivi}")]
        public async Task<IActionResult> UpdateSuiviReunion(int idSuivi, [FromBody] SuiviReunionUpdateDto suiviDto)
        {
            if (suiviDto == null)
            {
                return BadRequest(new { message = "Les données de mise à jour sont requises." });
            }

            try
            {
                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    await myCon.OpenAsync();

                    // Vérifier si l'enregistrement existe
                    if (!await SuiviReunionExists(myCon, idSuivi))
                    {
                        return NotFound(new { message = "Suivi de réunion non trouvé." });
                    }

                    // Construire la requête de mise à jour dynamique
                    var (updateQuery, parameters) = BuildUpdateQuery(idSuivi, suiviDto);

                    using (SqlCommand updateCommand = new SqlCommand(updateQuery, myCon))
                    {
                        updateCommand.Parameters.AddRange(parameters.ToArray());

                        int rowsAffected = await updateCommand.ExecuteNonQueryAsync();

                        if (rowsAffected == 0)
                        {
                            return Ok(new { message = "Aucune modification nécessaire." });
                        }

                        return Ok(new
                        {
                            message = "Suivi de réunion mis à jour avec succès.",
                            idSuivi = idSuivi
                        });
                    }
                }
            }
            catch (FormatException ex)
            {
                return BadRequest(new { message = "Format de document invalide.", error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur interne du serveur", error = ex.Message });
            }
        }

        // Méthode pour vérifier l'existence d'un suivi
        private async Task<bool> SuiviReunionExists(SqlConnection connection, int idSuivi)
        {
            string query = "SELECT COUNT(1) FROM SuiviReunion WHERE idSuivi = @IdSuivi";
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@IdSuivi", idSuivi);
                return (int)await command.ExecuteScalarAsync() > 0;
            }
        }

        // Méthode pour construire la requête dynamique
        private (string, List<SqlParameter>) BuildUpdateQuery(int idSuivi, SuiviReunionUpdateDto suiviDto)
        {
            var updateFields = new List<string>();
            var parameters = new List<SqlParameter>
    {
        new SqlParameter("@IdSuivi", idSuivi)
    };

            // Ajouter chaque champ à mettre à jour si fourni
            if (suiviDto.TenueReunion != null)
            {
                updateFields.Add("TenueReunion = @TenueReunion");
                parameters.Add(new SqlParameter("@TenueReunion", suiviDto.TenueReunion));
            }

            if (suiviDto.MotifReplacement != null)
            {
                updateFields.Add("MotifReplacement = @MotifReplacement");
                parameters.Add(new SqlParameter("@MotifReplacement", suiviDto.MotifReplacement));
            }

            if (suiviDto.TenueMotifAnnulation != null)
            {
                updateFields.Add("TenueMotifAnnulation = @TenueMotifAnnulation");
                parameters.Add(new SqlParameter("@TenueMotifAnnulation", suiviDto.TenueMotifAnnulation));
            }

            if (suiviDto.Observation != null)
            {
                updateFields.Add("Observation = @Observation");
                parameters.Add(new SqlParameter("@Observation", suiviDto.Observation));
            }

            // Dates CR
            AddDateField(updateFields, parameters, "DateRapellePremCR", suiviDto.DateRapellePremCR);
            AddDateField(updateFields, parameters, "DateRapelleDeuxCR", suiviDto.DateRapelleDeuxCR);

            // Dates PV
            AddDateField(updateFields, parameters, "DateRapellePremPV", suiviDto.DateRapellePremPV);
            AddDateField(updateFields, parameters, "DateRapelleDeuxPV", suiviDto.DateRapelleDeuxPV);

            // Documents
            AddDocumentField(updateFields, parameters, "DocCR", suiviDto.DocCR);
            AddDocumentField(updateFields, parameters, "DocPV", suiviDto.DocPV);
            AddDocumentField(updateFields, parameters, "AutreDoc", suiviDto.AutreDoc);

            if (updateFields.Count == 0)
            {
                throw new ArgumentException("Aucun champ à mettre à jour n'a été fourni.");
            }

            string updateQuery = $"UPDATE SuiviReunion SET {string.Join(", ", updateFields)} WHERE idSuivi = @IdSuivi";
            return (updateQuery, parameters);
        }

        // Méthodes helpers pour ajouter des champs conditionnels
        private void AddDateField(List<string> updateFields, List<SqlParameter> parameters, string fieldName, DateTime? value)
        {
            if (value.HasValue)
            {
                updateFields.Add($"{fieldName} = @{fieldName}");
                parameters.Add(new SqlParameter($"@{fieldName}", value.Value));
            }
        }

        private void AddDocumentField(List<string> updateFields, List<SqlParameter> parameters, string fieldName, string base64Value)
        {
            if (base64Value != null)
            {
                updateFields.Add($"{fieldName} = @{fieldName}");
                parameters.Add(new SqlParameter($"@{fieldName}", SqlDbType.VarBinary, -1)
                {
                    Value = string.IsNullOrEmpty(base64Value)
                        ? (object)DBNull.Value
                        : Convert.FromBase64String(base64Value)
                });
            }
        }


        public class SuiviReunionUpdateDto
        {
            public int IdSuivi { get; set; }
            public string? TenueReunion { get; set; }
            public string? MotifReplacement { get; set; }
            public string? TenueMotifAnnulation { get; set; }
            public string? Observation { get; set; }
            public DateTime? DateRapellePremCR { get; set; }
            public DateTime? DateRapelleDeuxCR { get; set; }
            public string? DocCR { get; set; } // Base64-encoded string
            public DateTime? DateRapellePremPV { get; set; }
            public DateTime? DateRapelleDeuxPV { get; set; }
            public string? DocPV { get; set; } // Base64-encoded string
            public string? AutreDoc { get; set; } // Base64-encoded string
        }


        [HttpGet("get-reunion-count")]
        public IActionResult GetReunionCount()
        {
            try
            {
                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();

                    string query = "SELECT COUNT(*) FROM Reunion";

                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        int count = (int)myCommand.ExecuteScalar();
                        return Ok(new { count = count });
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