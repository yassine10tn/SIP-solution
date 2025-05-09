import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment.development';

export interface User {
  idUtilisateur: number;
  matricule: string;
  status: string;
  nomPrenomUtilisateur: string | null;
}
@Injectable({
  providedIn: 'root'
})
export class ParametrageService {
  private apiUrl =  environment.apiURL;

  constructor(private http: HttpClient) { }

 // Validation du matricule
 private validateMatricule(matricule: string): boolean {
  return matricule?.startsWith('MAT') && matricule.length >= 6;
}

// Validation du mot de passe
private validatePassword(password: string): boolean {
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return password?.length >= 8 && hasLetter && hasNumber;
}

// Récupérer les statuts depuis le backend
getStatusOptions(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/Utilisateur/get-all-status`).pipe(
    catchError(this.handleError('Impossible de récupérer les statuts disponibles'))
  );
}

// Créer un utilisateur
createUser(matricule: string, password: string, status: string) {
  if (!this.validateMatricule(matricule)) {
    return this.showValidationError('Le matricule doit commencer par "MAT" et avoir au moins 6 caractères');
  }

  if (!this.validatePassword(password)) {
    return this.showValidationError('Le mot de passe doit contenir au moins 8 caractères avec des lettres et des chiffres');
  }

  if (!status) {
    return this.showValidationError('Veuillez sélectionner un statut');
  }

  // Modifiez ici pour correspondre au DTO backend
  return this.http.post(`${this.apiUrl}/Utilisateur/create-user`, { 
    Matricule: matricule,  // Majuscule
    Mdp: password,         // "Mdp" au lieu de "password"
    Status: status         // Majuscule
  }).pipe(
    catchError(this.handleError('Erreur lors de la création de l\'utilisateur'))
  );
}
getRepresentantStatusOptions(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/Utilisateur/get-representant-status`).pipe(
    catchError(this.handleError('Impossible de récupérer les statuts de représentant'))
  );
}
getRepresentantMatricules(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/Utilisateur/get-representants-matricules-simple`).pipe(
    catchError(this.handleError('Impossible de récupérer les matricules des représentants'))
  );
}

createRepresentant(nomPrenom: string, matricule: string) {
  if (!nomPrenom || nomPrenom.trim().length < 3) {
    return this.showValidationError('Le nom complet doit contenir au moins 3 caractères');
  }

  if (!matricule) {
    return this.showValidationError('Veuillez sélectionner un matricule');
  }

  return this.http.post(`${this.apiUrl}/Utilisateur/create-representant`, { 
    NomPrenomUtilisateur: nomPrenom,
    Matricule: matricule
  }).pipe(
    catchError(this.handleError('Erreur lors de la création du représentant'))
  );
}

// Gestion des erreurs générique
private handleError(message: string) {
  return (error: HttpErrorResponse) => {
    let errorMessage = message;
    if (error.status === 409) errorMessage = 'Un utilisateur avec ce matricule existe déjà';
    if (error.status === 400) errorMessage = 'Données invalides envoyées au serveur';

    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: errorMessage,
      confirmButtonColor: '#3b82f6'
    });

    return throwError(() => error);
  };
}

// Récupérer tous les utilisateurs
getAllUsers(): Observable<User[]> {
  return this.http.get<User[]>(`${this.apiUrl}/Utilisateur/get-all-users`).pipe(
    catchError(this.handleError('Impossible de récupérer la liste des utilisateurs'))
  );
}

// Supprimer un utilisateur
deleteUser(matricule: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/Utilisateur/delete-user/${matricule}`).pipe(
    catchError(this.handleError('Erreur lors de la suppression de l\'utilisateur'))
  );
}

// Afficher une erreur de validation
private showValidationError(message: string) {
  Swal.fire({
    icon: 'error',
    title: 'Erreur de validation',
    text: message,
    confirmButtonColor: '#3b82f6'
  });
  return throwError(() => new Error(message));
}
}
