namespace WebApplication1.Models
{
    public class VenteDto
    {
        public int IdProjet { get; set; } // Clé étrangère vers la table Projet
        public DateTime DateVente { get; set; }
        public int Quantite { get; set; }
        public decimal PrixUnitaire { get; set; }
        public string Signataire { get; set; }
        public string Fonction { get; set; }
    }
}