namespace WebApplication1.Models
{
    public class ProjetUpdateDto
    {

        public int? Identifiant { get; set; }
        public int? ExIdentifiant { get; set; }
        public string? RaisonSociale { get; set; }
        public string? RaisonSocialeAr { get; set; }
        public string? LibelleCourt { get; set; }
        public string? SiegeSocial { get; set; }
        public string? SiegeSocialAr { get; set; }
        public string? MF { get; set; }
        public DateTime? DateCreation { get; set; }
        public DateTime? DateDossier { get; set; }
        public string? Objet { get; set; }
        public string? ObjetAr { get; set; }
        public string? Telephone { get; set; }
        public string? Email { get; set; }
        public string? Status { get; set; }
        public string? DossierJuridique { get; set; }
        public int? IdPays { get; set; }
        public int? IdGouvernorat { get; set; }
        public int? IdFormeJuridique { get; set; }
        public int? IdSecteurEconomique { get; set; }
        public int? IdNatureProjet { get; set; }
        public int? IdTypeManagement { get; set; }
        public int? IdDevise { get; set; }
        public int? IdTypeIdentifiant { get; set; }
        public int? IdTypeEntreprise { get; set; }
        public int? IdTypeProjet { get; set; }
        public int? IdParametreRSM620 { get; set; }
        public int? IdParametreRNLPA870 { get; set; }
        public string? CodeRisque { get; set; }
        public DateTime? DateMaj { get; set; }
        public string? Utilisateur { get; set; }
    }
}