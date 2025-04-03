namespace WebApplication1.Models
{
    public class SouscriptionDto
    {
        public int IdProjet { get; set; } // Clé étrangère vers la table Projet
        public DateTime DateSouscription { get; set; }
        public int IdTypeSouscription { get; set; } // Clé étrangère vers la table typesouscription
        public int Quantite { get; set; }
        public decimal PrixUnitaire { get; set; }
        public decimal PrimeEmissionTotal { get; set; }
        public string Signataire { get; set; }
        public string Fonction { get; set; }
        public string? CopieBulletin { get; set; } // Pour l'upload de fichier
    }
}