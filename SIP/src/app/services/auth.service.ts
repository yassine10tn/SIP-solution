import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';

export interface LoginDto {
    Matricule: string;
    Mdp: string;
}

export interface UserResponseDto {
    idUtilisateur: number;
    matricule: string;
    status: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiURL;
    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.initializeAuthState();
    }

    private initializeAuthState(): void {
        const user = localStorage.getItem('currentUser');
        if (user && user !== 'undefined') {
            try {
                const parsedUser = JSON.parse(user);
                this.currentUserSubject.next(parsedUser);
            } catch (e) {
                console.error('Erreur lors du parsing de currentUser:', e);
                localStorage.removeItem('currentUser'); // Nettoyer les données corrompues
            }
        }
    }

    login(loginData: { Matricule: string; Mdp: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/Utilisateur/login`, loginData).pipe(
            tap({
                next: (user) => {
                    if (user) {
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        this.currentUserSubject.next(user);
                        this.router.navigate(['/accueil']);
                    } else {
                        console.error('Aucun utilisateur reçu de l\'API');
                    }
                },
                error: (error) => {
                    console.error('Login error:', error);
                    throw error;
                }
            })
        );
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    getCurrentUser(): any {
        return this.currentUserSubject.value;
    }

    isLoggedIn(): boolean {
        return !!this.currentUserSubject.value;
    }
}