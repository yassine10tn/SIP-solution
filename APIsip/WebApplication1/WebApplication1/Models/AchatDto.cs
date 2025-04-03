namespace WebApplication1.Models
{
    public class AchatDto
    {
        public int IdProjet { get; set; } // Clé étrangère vers la table Projet
        public DateTime DateAchat { get; set; }
        public int Quantite { get; set; }
        public decimal PrixUnitaire { get; set; }
        public string Signataire { get; set; }
        public string Fonction { get; set; }
        public string CopieOrdreAchat { get; set; } // Base64-encoded string
    }
}