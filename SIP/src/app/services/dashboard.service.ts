import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, map, of } from 'rxjs';
import { environment } from '../../environments/environment.development';


export interface SecteurEconomique {
  id: number;
  nom: string;
}
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiURL; // URL de base

  constructor(private http: HttpClient) { }
  getSocieteCount(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/Societe/Count_societe`).pipe(
      map(response => {
        // Gestion des différentes casse possibles
        const count = response.SocieteCount ?? response.societeCount ?? response.count;
        
        if (typeof count !== 'number') {
          console.warn('Format de réponse inattendu:', response);
          return 0;
        }
        return count;
      }),
      catchError(error => {
        console.error('Erreur API:', error);
        return of(0); // Retourne 0 en cas d'erreur
      })
    );
  }

  getCACCount(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/Societe/Count_CAC`).pipe(
      map(response => {
        // Gestion des différentes casse possibles
        const count = response.CACCount ?? response.cacCount ?? response.count;
        
        if (typeof count !== 'number') {
          console.warn('Format de réponse inattendu pour CAC:', response);
          return 0;
        }
        return count;
      }),
      catchError(error => {
        console.error('Erreur API CAC:', error);
        return of(0); // Retourne 0 en cas d'erreur
      })
    );
  }

  getContactsCount(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/Societe/get-contacts-count`).pipe(
      map(response => {
        // Votre API retourne { totalContacts: number }
        const count = response.totalContacts;
        
        if (typeof count !== 'number') {
          console.warn('Format de réponse inattendu pour Contacts:', response);
          return 0;
        }
        return count;
      }),
      catchError(error => {
        console.error('Erreur API Contacts:', error);
        return of(0);
      })
    );
  }

  getReunionCount(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/Reunion/get-reunion-count`).pipe(
      map(response => {
        // Votre API retourne { count: number }
        const count = response.count;
        
        if (typeof count !== 'number') {
          console.warn('Format de réponse inattendu pour Réunions:', response);
          return 0;
        }
        return count;
      }),
      catchError(error => {
        console.error('Erreur API Réunions:', error);
        return of(0);
      })
    );
  }

  getAchatsCount(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/Societe/get-achats-count`).pipe(
      map(response => {
        // Votre API retourne { totalAchats: number }
        const count = response.totalAchats;
        
        if (typeof count !== 'number') {
          console.warn('Format de réponse inattendu pour Achats:', response);
          return 0;
        }
        return count;
      }),
      catchError(error => {
        console.error('Erreur API Achats:', error);
        return of(0);
      })
    );
  }

  getVentesCount(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/Societe/get-ventes-count`).pipe(
      map(response => {
        // Votre API retourne { totalVentes: number }
        const count = response.totalVentes;
        
        if (typeof count !== 'number') {
          console.warn('Format de réponse inattendu pour Ventes:', response);
          return 0;
        }
        return count;
      }),
      catchError(error => {
        console.error('Erreur API Ventes:', error);
        return of(0);
      })
    );
  }
  getSouscriptionsCount(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/Societe/get-souscriptions-count`).pipe(
      map(response => {
        const count = response.totalSouscriptions;
        if (typeof count !== 'number') {
          console.warn('Format de réponse inattendu pour Souscriptions:', response);
          return 0;
        }
        return count;
      }),
      catchError(error => {
        console.error('Erreur API Souscriptions:', error);
        return of(0);
      })
    );
  }
  
  getLiberationsCount(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/Societe/get-liberations-count`).pipe(
      map(response => {
        const count = response.totalLiberations;
        if (typeof count !== 'number') {
          console.warn('Format de réponse inattendu pour Libérations:', response);
          return 0;
        }
        return count;
      }),
      catchError(error => {
        console.error('Erreur API Libérations:', error);
        return of(0);
      })
    );
  }
  getUsersCount(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/Utilisateur/get-users-count`).pipe(
      map(response => {
        // Votre API retourne { totalUsers: number }
        const count = response.totalUsers;
        
        if (typeof count !== 'number') {
          console.warn('Format de réponse inattendu pour Utilisateurs:', response);
          return 0;
        }
        return count;
      }),
      catchError(error => {
        console.error('Erreur API Utilisateurs:', error);
        return of(0);
      })
    );
  }
  getTotalActionnaires(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/Actionnaire/get-total-actionnaires`).pipe(
      map(response => response.totalActionnaires || 0),  // totalActionnaires au lieu de TotalActionnaires
      catchError(error => {
        console.error('Erreur API Total Actionnaires:', error);
        return of(0);
      })
    );
  }
  
  getActionnairesByNationalite(): Observable<{tunisiens: number, etrangers: number}> {
    return this.http.get<any>(`${this.apiUrl}/Actionnaire/get-count-actionnaires-nationalite`).pipe(
      map(response => ({
        tunisiens: response.actionnairesTunisiens || 0,  // Notez le changement ici
        etrangers: response.actionnairesEtrangers || 0   // Et ici
      })),
      catchError(error => {
        console.error('Erreur API Actionnaires par nationalité:', error);
        return of({tunisiens: 0, etrangers: 0});
      })
    );
  }
  getMontantParGouvernorat(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Societe/get-montant-par-gouvernorat`).pipe(
      catchError(error => {
        console.error('Erreur API Montant par gouvernorat:', error);
        return of([]);
      })
    );
  }
  getMontantAchatsParSecteur(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Societe/get-montant-achats-par-secteur`).pipe(
      catchError(error => {
        console.error('Erreur API Montant achats par secteur:', error);
        return of([]);
      })
    );
  }
  getTauxSouscriptionParMois(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Societe/get-taux-souscription-par-mois-2025`).pipe(
      catchError(error => {
        console.error('Erreur API Taux souscription par mois:', error);
        return of([]);
      })
    );
  }









  // pour les secteurs
  getSecteursEconomiques(): Observable<SecteurEconomique[]> {
    return this.http.get<SecteurEconomique[]>(`${this.apiUrl}/Societe/get_SecteurEconomique`).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des secteurs:', error);
        return of([]);
      })
    );
  }

  
}
