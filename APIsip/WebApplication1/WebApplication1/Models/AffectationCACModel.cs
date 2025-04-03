namespace WebApplication1.Models
{
    public class AffectationCACModel
    {
        public int Affectation_ID { get; set; }
        public int IdProjet { get; set; }
        public int CAC_ID { get; set; }
        public string Mandat { get; set; }
        public DateTime DateAffectation { get; set; }
        public string Observation { get; set; }
        public int NumeroMandat { get; set; }
        public string? RaisonSociale { get; set; } // Pour l'affichage
        public string? Cabinet_Nom { get; set; } // Pour l'affichage
        public string? Commissaire_NomPrenom { get; set; } // Nouvelle propriété ajoutée
    }
}
