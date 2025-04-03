namespace WebApplication1.Models
{
    public class Vente
    {
        public int IdVente { get; set; }
        public int IdProjet { get; set; }
        public DateTime DateVente { get; set; }
        public int Quantite { get; set; }
        public decimal PrixUnitaire { get; set; }
        public decimal MontantTotal { get; set; }
        public string Signataire { get; set; }
        public string Fonction { get; set; }
        public string RaisonSociale { get; set; } // Ajouté pour afficher la raison sociale du projet
    }
}