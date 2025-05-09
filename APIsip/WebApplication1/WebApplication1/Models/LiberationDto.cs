namespace WebApplication1.Models
{
    public class LiberationDto
    {
        public DateTime DateLiberation { get; set; }
        public float PourcentageLiberation { get; set; } // REAL dans SQL, donc float en C#
        public string RIB { get; set; }
        public int IdProjet { get; set; }
    }
}
