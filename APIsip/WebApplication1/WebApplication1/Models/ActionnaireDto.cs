namespace WebApplication1.Models
{
    public class ActionnaireDto
    {
        public int idProjet { get; set; }
        public int? Nature_ID { get; set; }
        public int? idNationalite { get; set; }
        public int? idNatureActionnaire { get; set; }
        public int NombredactionActionnaire { get; set; }
        public string RaisonSociale { get; set; } // Ajout du champ RaisonSociale
    }
}
