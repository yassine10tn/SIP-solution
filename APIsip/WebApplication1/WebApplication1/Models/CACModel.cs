namespace WebApplication1.Models
{
    public class CACModel
    {
        internal string Nature_Libelle;

        public int CAC_ID { get; set; }
        public string Cabinet_Nom { get; set; }
        public int Nature_ID { get; set; }
        public string Commissaire_NomPrenom { get; set; }
        public string? Cabinet_Email { get; set; }
        public int? Cabinet_Telephone { get; set; }
        public string? Email1 { get; set; }
        public int? Telephone1 { get; set; }
        public string? Email2 { get; set; }
        public int? Telephone2 { get; set; }
    }

}
