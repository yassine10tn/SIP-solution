public class Projet
{
    public int IdProjet { get; set; }
    public int Identifiant { get; set; }
    public int? ExIdentifiant { get; set; }
    public string RaisonSociale { get; set; }
    public string? RaisonSocialeAr { get; set; }
    public string? LibelleCourt { get; set; }
    public string SiegeSocial { get; set; }
    public string? SiegeSocialAr { get; set; }
    public string? MF { get; set; }
    public DateTime DateCreation { get; set; }
    public DateTime DateDossier { get; set; }
    public string? Objet { get; set; }
    public string? ObjetAr { get; set; }
    public string? Telephone { get; set; }
    public string? Email { get; set; }
    public string? Status { get; set; }
    public string? DossierJuridique { get; set; }
    public int idPays { get; set; }
    public string? LibellePays { get; set; } // Libellé du pays
    public int IdGouvernorat { get; set; }
    public string? LibelleGouvernorat { get; set; } // Libellé du gouvernorat
    public int IdFormeJuridique { get; set; }
    public string? LibelleFormeJuridique { get; set; } // Libellé de la forme juridique
    public int IdSecteurEconomique { get; set; }
    public string? LibelleSecteurEconomique { get; set; } // Libellé du secteur économique
    public int IdNatureProjet { get; set; }
    public string? LibelleNatureProjet { get; set; } // Libellé de la nature du projet
    public int idTypeManagement { get; set; }
    public string? LibelleTypeManagement { get; set; } // Libellé du type de management
    public int IdDevise { get; set; }
    public string? LibelleDevise { get; set; } // Libellé de la devise
    public int IdTypeIdentifiant { get; set; }
    public string? LibelleTypeIdentifiant { get; set; } // Libellé du type d'identifiant
    public int idTypeEntreprise { get; set; }
    public string? LibelleTypeEntreprise { get; set; } // Libellé du type d'entreprise
    public int IdTypeProjet { get; set; }
    public string? LibelleTypeProjet { get; set; } // Libellé du type de projet
    public int IdParametreRSM620 { get; set; }
    public string? LibelleParametreRSM620 { get; set; } // Libellé du paramètre RSM620
    public int IdParametreRNLPA870 { get; set; }
    public string? LibelleParametreRNLPA870 { get; set; } // Libellé du paramètre RNLPA870
    public string? CodeRisque { get; set; }
    public DateTime? DateMaj { get; set; }
    public string? Utilisateur { get; set; }
}