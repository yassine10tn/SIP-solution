namespace WebApplication1.Models
{
    public class CapitalModel
    {
        public int IdCapital { get; set; }
        public int IdProjet { get; set; }
        public int NombreActions { get; set; }
        public decimal MontantNominalAction { get; set; }
        public decimal CapitalSociete { get; set; }
        public string RaisonSociale { get; set; } // Ajouté pour l'affichage
    }
}
