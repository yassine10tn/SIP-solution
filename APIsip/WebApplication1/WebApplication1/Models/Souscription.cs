namespace WebApplication1.Models
{
    public class Souscription
    {
        public int IdSouscription { get; set; }
        public int IdProjet { get; set; }
        public DateTime DateSouscription { get; set; }
        public int IdTypeSouscription { get; set; }
        public int Quantite { get; set; }
        public decimal PrixUnitaire { get; set; }
        public decimal? MontantTotal { get; set; }
        public decimal PrimeEmissionTotal { get; set; }
        public string Signataire { get; set; }
        public string Fonction { get; set; }
        public string? CopieBulletin { get; set; } // Base64-encoded string
        public string LibelleTypeSouscription { get; set; }
        public string RaisonSociale { get; set; }

    }
}