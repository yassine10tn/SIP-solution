namespace WebApplication1.Models
{
    public class ActionnaireModel
    {
        public int IdActionnaire { get; set; }
        public int IdProjet { get; set; }
        public DateTime DateOperation { get; set; }
        public int? Nature_ID { get; set; }
        public string TypeActionnaire { get; set; }
        public int? IdNationalite { get; set; }
        public string LibelleNationalite { get; set; }
        public int? IdNatureActionnaire { get; set; }
        public string LibelleNatureActionnaire { get; set; }
        public int NombredactionActionnaire { get; set; }
        public string RaisonSociale { get; set; }  // Correspond à raison_sociale en base
        public string ProjetRaisonSociale { get; set; }  // Info supplémentaire
    }
}
