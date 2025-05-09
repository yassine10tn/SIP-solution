namespace WebApplication1.Models
{
    public class Liberation
    {
        public int Id { get; set; }
        public DateTime DateLiberation { get; set; }
        public float PourcentageLiberation { get; set; }
        public decimal Montant { get; set; }
        public string RIB { get; set; }
        public int IdProjet { get; set; }
        public string RaisonSociale { get; set; }
    }
}
