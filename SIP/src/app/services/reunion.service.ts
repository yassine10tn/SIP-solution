import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';

export interface TypeReunion {
  idTypeReunion: number;
  libelleTypereunion: string;
}
export interface SuiviReunion {
  idSuivi: number;
  idProjet: number;
  raisonSociale: string;
  idReunion: number;
  typeR: string;
  dateReunion: Date;
  heureReunion: string;
  ordre: string;
  idRepPonct: number | null;
  nomPrenomPonct: string | null;
  idRepPerm: number | null;
  nomPrenomPerma: string | null;
  pouvoirPerma: string;
  reprSTB: string;
  tenueReunion: string;
  motifReplacement: string | null;
  tenueMotifAnnulation: string | null;
  observation: string | null;
  datePremierRappelCR: Date | null;
  dateDeuxiemeRappelCR: Date | null;
  docCR: string | null;
  docCRBase64: string | null;
  datePremierRappelPV: Date | null;
  dateDeuxiemeRappelPV: Date | null;
  docPV: string | null;
  docPVBase64: string | null;
  autreDoc: string | null;
  autreDocBase64: string | null;
  documentAJoindreCR: string | null;
  documentAJoindrePV: string | null;
  autreDocument: string | null;
  isEditing: {
    [key: string]: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ReunionService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
    }
    Swal.fire('Erreur', errorMessage, 'error');
    return throwError(errorMessage);
  }

  // Méthodes pour les représentants permanents
  createRepPermanent(repData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Reunion/create-repperma`, repData)
      .pipe(catchError(this.handleError));
  }

  getAllRepPermanents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Reunion/get-all-repperma`)
      .pipe(catchError(this.handleError));
  }

  // Méthodes pour les représentants ponctuels
  createRepPonctuel(repData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Reunion/create-repponct`, repData)
      .pipe(catchError(this.handleError));
  }

  getAllRepPonctuels(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Reunion/get-all-repponct`)
      .pipe(catchError(this.handleError));
  }

  // Méthode pour vérifier l'existence d'un représentant
  checkRepresentativeExists(idProjet: number, idReunion: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/Reunion/check-representative/${idProjet}/${idReunion}`)
      .pipe(catchError(this.handleError));
  }

  // Méthodes pour les réunions
  createReunion(reunionData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Reunion/create-reunion`, reunionData)
      .pipe(catchError(this.handleError));
  }

  getAllReunions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Reunion/get-all-reunion`)
      .pipe(catchError(this.handleError));
  }

  // Méthodes pour les types de réunion
  getAllTypeReunion(): Observable<TypeReunion[]> {
    return this.http.get<TypeReunion[]>(`${this.apiUrl}/Reunion/get-all-typereunion`).pipe(
      catchError(this.handleError)
    );
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1]; // Remove data URI prefix
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Méthodes pour le suivi des réunions
  async createSuiviReunion(suiviData: any, docPV?: File, docCR?: File, autreDoc?: File): Promise<Observable<any>> {
    const dataToSend = { ...suiviData };

    if (docPV) {
      dataToSend.DocPV = await this.fileToBase64(docPV);
    }
    if (docCR) {
      dataToSend.DocCR = await this.fileToBase64(docCR);
    }
    if (autreDoc) {
      dataToSend.AutreDoc = await this.fileToBase64(autreDoc);
    }

    return this.http.post(`${this.apiUrl}/Reunion/create-suivireunion`, dataToSend)
      .pipe(catchError(this.handleError));
  }

  getAllSuiviReunions(): Observable<SuiviReunion[]> {
    return this.http.get<SuiviReunion[]>(`${this.apiUrl}/Reunion/get-all-suivireunion`)
      .pipe(catchError(this.handleError),
      tap(data => console.log('Données reçues:', data)));
  }

  downloadDocument(idSuivi: number, type: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/Reunion/download-document/${idSuivi}/${type}`, { responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }

  // Méthodes pour les utilisateurs représentants
  getAllUtilisateurRep(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Reunion/get-all-utilisateurrep`)
      .pipe(catchError(this.handleError));
  }

  getAllProjets(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Societe/get_Societe`)
      .pipe(catchError(this.handleError));
  }

  updateSuiviReunion(idSuivi: number, suiviData: Partial<SuiviReunion>): Observable<any> {
    return this.http.put(`${this.apiUrl}/Reunion/update-suivireunion/${idSuivi}`, suiviData)
      .pipe(catchError(this.handleError));
}

  // Nouvelle méthode pour récupérer les réunions par idProjet et typeR
  getReunionByProjetAndType(idProjet: number, typeR: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Reunion/get-reunion-by-projet-and-type/${idProjet}/${typeR}`)
      .pipe(catchError(this.handleError));
  }
}
