import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
export interface Pays {
  id: number;
  nom: string;
}

export interface Gouvernorats {
  id: number;
  nom: string;
} 
export interface FormeJuridique {
  id: number;
  nom: string;
} 
export interface TypeProjet {
  id: number;
  nom: string;
}
export interface SecteurEconomique {
  id: number;
  nom: string;
} 
export interface NatureProjet {
  id: number;
  nom: string;
} 
export interface TypeManagement {
  id: number;
  nom: string;
} 
export interface Devise {
  id: number;
  nom: string;
} 
export interface TypeIdentifiant {
  id: number;
  nom: string;
} 
export interface TypeEntreprise {
  id: number;
  nom: string;
} 
export interface ParametreRSM620 {
  id: number;
  nom: string;
} 
export interface ParametreRNL870 {
  id: number;
  nom: string;
} 
// Interface Projet
export interface Projet {
  idProjet: number;
  identifiant: number;
  exIdentifiant: number | null;
  raisonSociale: string;
  raisonSocialeAr: string | null;
  libelleCourt: string | null;
  siegeSocial: string;
  siegeSocialAr: string | null;
  mf: string | null;
  dateCreation: Date;
  dateDossier: Date;
  objet: string | null;
  objetAr: string | null;
  telephone: string | null;
  email: string | null;
  status: string | null; // Base64-encoded string
  dossierJuridique: string | null; // Base64-encoded string
  idPays: number;
  libellePays: string | null;
  idGouvernorat: number;
  libelleGouvernorat: string | null;
  idFormeJuridique: number;
  libelleFormeJuridique: string | null;
  idSecteurEconomique: number;
  libelleSecteurEconomique: string | null;
  idNatureProjet: number;
  libelleNatureProjet: string | null;
  idTypeManagement: number;
  libelleTypeManagement: string | null;
  idDevise: number;
  libelleDevise: string | null;
  idTypeIdentifiant: number;
  libelleTypeIdentifiant: string | null;
  idTypeEntreprise: number;
  libelleTypeEntreprise: string | null;
  idTypeProjet: number;
  libelleTypeProjet: string | null;
  idParametreRSM620: number;
  libelleParametreRSM620: string | null;
  idParametreRNLPA870: number;
  libelleParametreRNLPA870: string | null;
  codeRisque: string | null;
  dateMaj: Date | null;
  utilisateur: string | null;
}

// Modèle pour les mises à jour partielles
export interface ProjetUpdateDto {
  identifiant?: number;
  exIdentifiant?: number | null;
  raisonSociale?: string | null;
  raisonSocialeAr?: string | null;
  libelleCourt?: string | null;
  siegeSocial?: string | null;
  siegeSocialAr?: string | null;
  mf?: string | null;
  dateCreation?: Date | null;
  dateDossier?: Date | null;
  objet?: string | null;
  objetAr?: string | null;
  telephone?: string | null;
  email?: string | null;
  status?: string | null;
  dossierJuridique?: string | null;
  idPays?: number | null;
  idGouvernorat?: number | null;
  idFormeJuridique?: number | null;
  idSecteurEconomique?: number | null;
  idNatureProjet?: number | null;
  idTypeManagement?: number | null;
  idDevise?: number | null;
  idTypeIdentifiant?: number | null;
  idTypeEntreprise?: number | null;
  idTypeProjet?: number | null;
  idParametreRSM620?: number | null;
  idParametreRNLPA870?: number | null;
  codeRisque?: string | null;
  dateMaj?: Date | null;
  utilisateur?: string | null;
}
// l'interface pour typesouscription
export interface TypeSouscription {
  idtypesouscription: number;
  libelletype: string;
}
//cac nature
export interface CACNature {
  nature_ID: number;
  libelle: string;
}

export interface CAC {
  cabinet_Nom: string;
  nature_ID: number;
  commissaire_NomPrenom: string;
  cabinet_Email?: string | null;
  cabinet_Telephone?: number | null;  
  email1?: string | null;
  telephone1?: number | null;         
  email2?: string | null;
  telephone2?: number | null;         
}
// interface pour les commissaires
export interface Commissaire {
  caC_ID: number;
  commissaire_NomPrenom: string;
  cabinet_Nom: string;
}
// Interface pour les données d'affectation
export interface AffectationCAC {
  idProjet: number;
  cac_ID: number;
  mandat: string;
  dateAffectation: string;
  observation?: string;
  numeroMandat: number;
}
export interface Fonction {
  fonction_ID: number;
  libelle: string;
}

export interface Situation {
  situation_ID: number;
  libelle: string;
}

export interface Contact {
  contact_ID: number;
  nomPrenom: string;
  fonction_ID: number;
  fonction_Libelle: string;
  email1: string;
  telephone1: number;
  email2: string | null;
  telephone2: number | null;
  idProjet: number;
  raisonSociale: string;
  situation_ID: number;
  situation_Libelle: string;
  observation: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = environment.apiURL; // URL de base

  constructor(private http: HttpClient) { }

  // Ajouter une société
  public addCompany(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add_Societe`, data);
  }

  // Récupérer toutes les sociétés
  public getCompanies(): Observable<Projet[]> {
    return this.http.get<Projet[]>(`${this.apiUrl}/get_Societe`);
  }

  //  Récupérer tous les pays
  public getPays(): Observable<Pays[]> {
    return this.http.get<Pays[]>(`${this.apiUrl}/get_Pays`);
  }

  //  Récupérer tous les Gouvernorats
  public getGouvernorats(): Observable<Gouvernorats[]> {
    return this.http.get<Gouvernorats[]>(`${this.apiUrl}/get_Gouvernorats`);
  }

  // Récupérer tous les FormeJuridique
  public getFormeJuridique(): Observable<FormeJuridique[]> {
    return this.http.get<FormeJuridique[]>(`${this.apiUrl}/get_FormeJuridique`);
  }
  //  Récupérer tous les TypeProjet
  public getTypeProjet(): Observable<TypeProjet[]> {
    return this.http.get<TypeProjet[]>(`${this.apiUrl}/get_TypeProjet`);
  }

  //  Récupérer tous les Secteur economique
  public getSecteurEconomique(): Observable<SecteurEconomique[]> {
    return this.http.get<SecteurEconomique[]>(`${this.apiUrl}/get_SecteurEconomique`);
  }

  //  Récupérer tous les NatureProjet 
  public getNatureProjet(): Observable<NatureProjet[]> {
    return this.http.get<NatureProjet[]>(`${this.apiUrl}/get_NatureProjet`);
  }

  //  Récupérer tous les TypeManagment 
  public getTypeManagement(): Observable<TypeManagement[]> {
    return this.http.get<TypeManagement[]>(`${this.apiUrl}/get_TypeManagement`);
  }
  //  Récupérer tous les Devise 
  public getDevise(): Observable<Devise[]> {
    return this.http.get<Devise[]>(`${this.apiUrl}/get_Devise`);
  }
  //  Récupérer tous les TypeIdentifiant 
  public getTypeIdentifiant(): Observable<TypeIdentifiant[]> {
    return this.http.get<TypeIdentifiant[]>(`${this.apiUrl}/get_TypeIdentifiant`);
  }
  //  Récupérer tous les TypeEntreprise 
  public getTypeEntreprise(): Observable<TypeEntreprise[]> {
    return this.http.get<TypeEntreprise[]>(`${this.apiUrl}/get_TypeEntreprise`);
  }
  // Récupérer tous les ParametreRSM620 
  public getParametreRSM620(): Observable<ParametreRSM620[]> {
    return this.http.get<ParametreRSM620[]>(`${this.apiUrl}/get_ParametreRSM620`);
  }
    //  Récupérer tous les ParametreRNL870 
    public getParametreRNL870(): Observable<ParametreRNL870[]> {
      return this.http.get<ParametreRNL870[]>(`${this.apiUrl}/get_ParametreRNL870`);
    }

    // Method to download PDF
    public downloadPdf(id: number, type: string): Observable<Blob> {
      return this.http.get(`${this.apiUrl}/downloadPdf/${id}/${type}`, { responseType: 'blob' });
    }

    // Mettre à jour une société avec un modèle partiel
  public updateCompany(id: number, updateData: ProjetUpdateDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/update_Societe/${id}`, updateData);
  }

  // Supprimer une société par son ID
  public deleteCompany(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete_Projet/${id}`);
  }

  // Récupérer tous les types de souscription
  public getTypesSouscription(): Observable<TypeSouscription[]> {
    return this.http.get<TypeSouscription[]>(`${this.apiUrl}/get_TypesSouscription`);
  }

  // Ajouter une souscription
  public postSouscription(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/post_Souscription`, data);
  }

  // Ajouter un achat
  postAchat(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/post_Achat`, data);
}

// ajouter vente 
postVente(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/post_Vente`, data);
}
// Récupérer tous les types de nature CAC
public getCACNature(): Observable<CACNature[]> {
  return this.http.get<CACNature[]>(`${this.apiUrl}/get_CAC_Nature`);
}
public addCAC(data: CAC): Observable<any> {
  return this.http.post(`${this.apiUrl}/add_CAC`, data);
}
// Méthode pour récupérer les commissaires
public getCommissaires(): Observable<Commissaire[]> {
  return this.http.get<Commissaire[]>(`${this.apiUrl}/get_CAC`);
}
public addAffectationCAC(data: AffectationCAC): Observable<any> {
  return this.http.post(`${this.apiUrl}/add_AffectationCAC`, data);
}
// Récupérer toutes les fonctions
public getFonctions(): Observable<Fonction[]> {
  return this.http.get<Fonction[]>(`${this.apiUrl}/get_Fonctions`);
}

// Récupérer toutes les situations
public getSituations(): Observable<Situation[]> {
  return this.http.get<Situation[]>(`${this.apiUrl}/get_Situations`);
}
// Ajouter un contact
public addContact(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/add_Contact`, data);
}

// Récupérer tous les contacts
public getContacts(): Observable<Contact[]> {
  return this.http.get<Contact[]>(`${this.apiUrl}/get_Contacts`);
}

}

