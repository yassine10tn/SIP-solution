import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('AppComponent: Initializing navigation guard');
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      console.log('AppComponent: NavigationEnd event for URL:', event.url);
      this.checkRoutePermissions(event.url);
    });
  }

  private async checkRoutePermissions(url: string): Promise<void> {
    if (!this.authService.isLoggedIn()) {
      console.log('AppComponent: User not logged in, skipping permission check');
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user || !user.status) {
      console.log('AppComponent: No user or status, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    const status = user.status;
    // Extract the path from the URL (e.g., "/gestion-societe" -> "gestion-societe")
    const path = url.startsWith('/') ? url.substring(1) : url;

    console.log(`AppComponent: Checking permissions for status: ${status}, path: ${path}`);

    const allowedPages: { [key: string]: string[] } = {
      Metier: [
        'accueil',
        'gestion-societe',
        'participation',
        'societe-list',
        'affectation-commissaire',
        'saisie-commissaire',
        'saisie-contacts',
        'commissaire-list',
        'contact-list',
        'assistant-virtual'
      ],
      representantPonct: [
        'accueil',
        'Saisie-Representant',
        'Suivi-Reunion',
        'Creation-Reunion'
      ],
      representantPerma: [
        'accueil',
        'Saisie-Representant',
        'Suivi-Reunion',
        'Creation-Reunion'
      ],
      reporting: ['accueil', 'dashboard'],
      Administrateur: [
        'accueil',
        'gestion-societe',
        'participation',
        'societe-list',
        'affectation-commissaire',
        'saisie-commissaire',
        'saisie-contacts',
        'commissaire-list',
        'contact-list',
        'assistant-virtual',
        'Saisie-Representant',
        'Suivi-Reunion',
        'Creation-Reunion',
        'dashboard',
        'parametrage',
        'liste-utilisateur'
      ]
    };

    // Skip check for login page or empty path
    if (!path || path === 'login') {
      console.log('AppComponent: Skipping permission check for path:', path);
      return;
    }

    if (!allowedPages[status]?.includes(path)) {
      console.log(`AppComponent: Access denied for ${status} to ${path}, redirecting to accueil`);
      // Navigate to accueil first to prevent unauthorized page from rendering
      await this.router.navigate(['/accueil']);
      await Swal.fire({
        icon: 'error',
        title: 'Accès non autorisé',
        text: 'Vous n\'avez pas les permissions pour accéder à cette page.',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      console.log('AppComponent: SweetAlert2 dialog confirmed');
    } else {
      console.log(`AppComponent: Access granted for ${status} to ${path}`);
    }
  }
}