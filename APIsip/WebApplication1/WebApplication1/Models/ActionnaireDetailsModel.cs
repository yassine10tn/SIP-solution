namespace WebApplication1.Models
{
    public class ActionnaireDetailsModel
    {
        public int Id { get; set; }
        public string RaisonSociale { get; set; }
        public string TypeActionnaire { get; set; }
        public string Nationalite { get; set; }
        public string NatureActionnaire { get; set; }
        public int NombresActions { get; set; }
        public decimal MontantNominal { get; set; }
        public double PourcentageParticipation { get; set; } // Valeur entre 0 et 1
    }
}
