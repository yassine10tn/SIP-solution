namespace WebApplication1.Models
{
    public class ListeContactModel
    {
        public int Contact_ID { get; set; }
        public string NomPrenom { get; set; }
        public int Fonction_ID { get; set; }
        public string? Fonction_Libelle { get; set; }
        public string Email1 { get; set; }
        public int Telephone1 { get; set; }
        public string? Email2 { get; set; }
        public int? Telephone2 { get; set; }
        public int IdProjet { get; set; }
        public string? RaisonSociale { get; set; }
        public int Situation_ID { get; set; }
        public string? Situation_Libelle { get; set; }
        public string? Observation { get; set; }
    }
}
