using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatbotController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ChatbotController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("ask")]
        public IActionResult AskQuestion([FromBody] ChatQuestion question)
        {
            if (string.IsNullOrWhiteSpace(question?.Question))
            {
                return Ok(new { response = "Désolé, votre message est vide. Posez-moi une question sur une société !" });
            }

            try
            {
                // Gérer les salutations ou messages courants
                string lowerQuestion = question.Question.ToLower().Trim();
                if (lowerQuestion == "bonjour" || lowerQuestion == "salut" || lowerQuestion == "hello")
                {
                    return Ok(new { response = "Bonjour ! Comment puis-je vous aider aujourd'hui ?" });
                }
                if (lowerQuestion == "merci" || lowerQuestion == "thanks" || lowerQuestion == "thank you")
                {
                    return Ok(new { response = "De rien !" });
                }

                // Extraire le nom de la société de la question
                string societeNom = ExtractSocieteName(question.Question);

                if (string.IsNullOrEmpty(societeNom))
                {
                    return Ok(new { response = "Je n'ai pas compris le nom de la société. Essayez de reformuler, par exemple : 'Combien de souscriptions pour la société Acme ?'" });
                }

                // Vérifier que la société existe
                if (!SocieteExists(societeNom))
                {
                    return Ok(new { response = $"La société {societeNom} n'a pas été trouvée dans notre base de données." });
                }

                // Analyser la question et fournir la réponse appropriée
                if (question.Question.Contains("nombre de souscription") || question.Question.Contains("souscriptions"))
                {
                    return GetSouscriptionCountResponse(societeNom);
                }
                else if (question.Question.Contains("nombre d'achat") || question.Question.Contains("achats"))
                {
                    return GetAchatCountResponse(societeNom);
                }
                else if (question.Question.Contains("nombre de vente") || question.Question.Contains("ventes"))
                {
                    return GetVenteCountResponse(societeNom);
                }
                else if (question.Question.Contains("commissaire aux comptes") || question.Question.Contains("commissaire au comptes"))
                {
                    return GetCommissaireResponse(societeNom);
                }
                else if (question.Question.Contains("contacts"))
                {
                    return GetContactsResponse(societeNom);
                }
                else
                {
                    return Ok(new { response = "Je n'ai pas compris votre question. Pouvez-vous la reformuler ?" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { response = "Erreur interne du serveur. Veuillez réessayer plus tard.", error = ex.Message });
            }
        }

        private bool SocieteExists(string societeNom)
        {
            string query = "SELECT COUNT(*) FROM Projet WHERE RaisonSociale = @SocieteNom";

            using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@SocieteNom", societeNom);
                    int count = (int)myCommand.ExecuteScalar();
                    return count > 0;
                }
            }
        }

        private string ExtractSocieteName(string question)
        {
            string[] keywords = { "société", "de la société", "societe", "Société", "Societe" };
            foreach (var keyword in keywords)
            {
                int index = question.IndexOf(keyword, StringComparison.OrdinalIgnoreCase);
                if (index != -1)
                {
                    // Extraire tout ce qui suit le mot-clé jusqu'à la fin ou jusqu'à un point d'interrogation
                    string remaining = question.Substring(index + keyword.Length).Trim();
                    int endIndex = remaining.IndexOf('?');
                    if (endIndex != -1)
                    {
                        return remaining.Substring(0, endIndex).Trim();
                    }
                    return remaining.Trim();
                }
            }
            return null;
        }

        private IActionResult GetSouscriptionCountResponse(string societeNom)
        {
            try
            {
                string query = @"
                    SELECT COUNT(*) 
                    FROM souscription s
                    INNER JOIN Projet p ON s.IdProjet = p.IdProjet
                    WHERE p.RaisonSociale = @SocieteNom";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@SocieteNom", societeNom);
                        int count = (int)myCommand.ExecuteScalar();

                        return Ok(new { response = $"La société {societeNom} a {count} souscription(s)." });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { response = "Erreur lors de la récupération des souscriptions.", error = ex.Message });
            }
        }

        private IActionResult GetAchatCountResponse(string societeNom)
        {
            try
            {
                string query = @"
                    SELECT COUNT(*) 
                    FROM Achat a
                    INNER JOIN Projet p ON a.IdProjet = p.IdProjet
                    WHERE p.RaisonSociale = @SocieteNom";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@SocieteNom", societeNom);
                        int count = (int)myCommand.ExecuteScalar();

                        return Ok(new { response = $"La société {societeNom} a {count} achat(s)." });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { response = "Erreur lors de la récupération des achats.", error = ex.Message });
            }
        }

        private IActionResult GetVenteCountResponse(string societeNom)
        {
            try
            {
                string query = @"
                    SELECT COUNT(*) 
                    FROM Vente v
                    INNER JOIN Projet p ON v.IdProjet = p.IdProjet
                    WHERE p.RaisonSociale = @SocieteNom";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@SocieteNom", societeNom);
                        int count = (int)myCommand.ExecuteScalar();

                        return Ok(new { response = $"La société {societeNom} a {count} vente(s)." });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { response = "Erreur lors de la récupération des ventes.", error = ex.Message });
            }
        }

        private IActionResult GetCommissaireResponse(string societeNom)
        {
            try
            {
                string query = @"
                    SELECT 
                        c.Commissaire_NomPrenom, c.Cabinet_Nom
                    FROM AffectationCAC a
                    INNER JOIN CAC c ON a.CAC_ID = c.CAC_ID
                    INNER JOIN Projet p ON a.IdProjet = p.IdProjet
                    WHERE p.RaisonSociale = @SocieteNom";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@SocieteNom", societeNom);

                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                string nomPrenom = reader.GetString(reader.GetOrdinal("Commissaire_NomPrenom"));
                                string cabinet = reader.GetString(reader.GetOrdinal("Cabinet_Nom"));
                                return Ok(new { response = $"Le commissaire aux comptes de la société {societeNom} est {nomPrenom} du cabinet {cabinet}." });
                            }
                            else
                            {
                                return Ok(new { response = $"Aucun commissaire aux comptes trouvé pour la société {societeNom}." });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { response = "Erreur lors de la récupération du commissaire.", error = ex.Message });
            }
        }

        private IActionResult GetContactsResponse(string societeNom)
        {
            try
            {
                string query = @"
                    SELECT 
                        lc.NomPrenom, f.Libelle AS Fonction
                    FROM ListeContact lc
                    INNER JOIN Fonction f ON lc.Fonction_ID = f.Fonction_ID
                    INNER JOIN Projet p ON lc.IdProjet = p.IdProjet
                    WHERE p.RaisonSociale = @SocieteNom";

                using (SqlConnection myCon = new SqlConnection(_configuration.GetConnectionString("mybd")))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@SocieteNom", societeNom);

                        List<string> contacts = new List<string>();
                        using (SqlDataReader reader = myCommand.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                string nomPrenom = reader.GetString(reader.GetOrdinal("NomPrenom"));
                                string fonction = reader.GetString(reader.GetOrdinal("Fonction"));
                                contacts.Add($"{nomPrenom} ({fonction})");
                            }
                        }

                        if (contacts.Count > 0)
                        {
                            string response = $"Les contacts de la société {societeNom} sont : {string.Join(", ", contacts)}.";
                            return Ok(new { response = response });
                        }
                        else
                        {
                            return Ok(new { response = $"Aucun contact trouvé pour la société {societeNom}." });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { response = "Erreur lors de la récupération des contacts.", error = ex.Message });
            }
        }


    }

    public class ChatQuestion
    {
        public string Question { get; set; }
    }
}