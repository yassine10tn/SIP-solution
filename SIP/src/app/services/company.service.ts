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

    
}