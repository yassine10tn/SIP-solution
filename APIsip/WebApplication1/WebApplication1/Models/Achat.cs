namespace WebApplication1.Models
{
    public class Achat
    {
        public int IdAchat { get; set; }
        public int IdProjet { get; set; }
        public DateTime DateAchat { get; set; }
        public int Quantite { get; set; }
        public decimal PrixUnitaire { get; set; }
        public decimal MontantTotal { get; set; }
        public string Signataire { get; set; }
        public string Fonction { get; set; }
        public string CopieOrdreAchat { get; set; } // Base64-encoded string pour le fichier
        public string RaisonSociale { get; set; }
    }
}