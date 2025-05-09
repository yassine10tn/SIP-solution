import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ActionnaireService {
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

  // Capital
  addCapital(capitalData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Actionnaire/add_Capital`, capitalData)
      .pipe(catchError(this.handleError));
  }

  getCapitals(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Actionnaire/get_Capital`)
      .pipe(catchError(this.handleError));
  }

  // Actionnaire STB
  addActionnaireSTB(actionnaireData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Actionnaire/add_ActionnaireSTB`, actionnaireData)
      .pipe(catchError(this.handleError));
  }

  getActionnairesSTB(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Actionnaire/get_ActionnaireSTB`)
      .pipe(
        catchError(this.handleError),
        tap(data => console.log('Actionnaires STB:', data)) // Affiche les données dans la console
      );
  }

  getActionnaireSTBByProjet(idProjet: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/Actionnaire/get_ActionnaireSTBByProjet/${idProjet}`)
      .pipe(
        catchError(this.handleError),
        tap(data => console.log('Actionnaires STB par projet:', data)) // Affiche les données dans la console
      );
  }

  // Actionnaires standards
  addActionnaire(actionnaireData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Actionnaire/add_Actionnaire`, actionnaireData)
      .pipe(catchError(this.handleError));
  }

  getActionnaires(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Actionnaire/get_Actionnaire`)
      .pipe(catchError(this.handleError));
  }

  getAllActionnairesByProjet(idProjet: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/Actionnaire/get_AllActionnairesByProjet/${idProjet}`)
      .pipe(catchError(this.handleError));
  }

  // Récupérer les nationalités
  getNationalites(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Actionnaire/get_Nationalites`)
      .pipe(
        catchError(this.handleError),
        tap(data => console.log('Nationalités:', data))
      );
  }

  // Récupérer les natures d'actionnaires
  getNaturesActionnaire(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Actionnaire/get_NaturesActionnaire`)
      .pipe(
        catchError(this.handleError),
        tap(data => console.log('Natures Actionnaire:', data))
      );
  }

  // Récupérer les types d'actionnaires
  getTypesActionnaire(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Actionnaire/get_TypesActionnaire`)
      .pipe(
        catchError(this.handleError),
        tap(data => console.log('Types Actionnaire:', data))
      );
  }
}
