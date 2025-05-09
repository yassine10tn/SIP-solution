namespace WebApplication1.Models
{
    public class ActionnaireSTBModel
    {
        public int idactSTB { get; set; }
        public int idProjet { get; set; }
        public int Nombredaction { get; set; }
        public string typeactionnaire { get; set; }
        public string libellenationalite { get; set; }
        public string libelleNatureActionnaire { get; set; }
        public int IdCapital { get; set; }
        public decimal? montantennominal { get; set; }
        public int IdSouscription { get; set; } // Si la colonne existe
    }
}
