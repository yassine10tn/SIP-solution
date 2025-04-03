namespace WebApplication1.Models
{
    internal class ProjectDetails
    {
        public int proinvestId { get; internal set; }
        public string raisonSociale { get; internal set; }
        public string raisonAr { get; internal set; }
        public string abreviation { get; internal set; }
        public string adresseFr { get; internal set; }
        public string adresseAr { get; internal set; }
        public string matriculeFiscal { get; internal set; }
        public DateTime? dateCreation { get; internal set; }
        public DateTime? dateExploitation { get; internal set; }
        public string statutsPdf { get; internal set; }
        public string dossierJuridique { get; internal set; }
        public string objetSocial { get; internal set; }
        public string activiteAr { get; internal set; }
        public string telephone { get; internal set; }
        public string email { get; internal set; }
        public int identifiantSTB { get; internal set; }

        // Noms des entités associées
        public string PaysNom { get; internal set; } // Nom du pays
        public string GouvernoratNom { get; internal set; } // Nom du gouvernorat
        public string FormeJuridiqueNom { get; internal set; } // Nom de la forme juridique
        public string SecteurEconomiqueNom { get; internal set; } // Nom du secteur économique
        public string NatureSocieteNom { get; internal set; } // Nom de la nature de la société
        public string TypeManagementNom { get; internal set; } // Nom du type de management
        public string DeviseNom { get; internal set; } // Nom de la devise
        public string TypeIdentifiantNom { get; internal set; } // Nom du type d'identifiant
        public string TypeEntrepriseNom { get; internal set; } // Nom du type d'entreprise
        public string ParametreRSM620Nom { get; internal set; } // Nom du paramètre RSM620
        public string ParametreRNL870Nom { get; internal set; } // Nom du paramètre RNL870
    }
}