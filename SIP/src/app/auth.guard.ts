import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Construct the full route path
    const fullPath = this.getFullRoutePath(route);
    console.log('AuthGuard: Checking access for route:', fullPath);
    console.log('AuthGuard: Navigation triggered at:', new Date().toISOString());

    if (!this.authService.isLoggedIn()) {
      console.log('AuthGuard: User is not logged in, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }

    const user = this.authService.getCurrentUser();
    console.log('AuthGuard: Current user:', user);
    if (!user || !user.status) {
      console.log('AuthGuard: No user or status found, showing unauthorized alert');
      this.showUnauthorizedAlert();
      return false;
    }

    const status = user.status;
    console.log(`AuthGuard: User status: ${status}, Requested path: ${fullPath}`);

    // Define allowed pages for each status
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

    // Allow empty parent route for all users, as it's a container for child routes
    if (fullPath === '') {
      console.log(`AuthGuard: Allowing access to empty parent route for ${status}`);
      return true;
    }

    // Check if the requested path is allowed for the user's status
    if (allowedPages[status]?.includes(fullPath)) {
      console.log(`AuthGuard: Access granted for ${status} to ${fullPath}`);
      return true;
    }

    // Show alert and redirect if access is denied
    console.log(`AuthGuard: Access denied for ${status} to ${fullPath}`);
    this.showUnauthorizedAlert();
    return false;
  }

  private getFullRoutePath(route: ActivatedRouteSnapshot): string {
    let path = '';
    if (route.routeConfig?.path !== undefined) {
      path = route.routeConfig.path;
    }
    // Traverse child routes to build the full path
    if (route.firstChild) {
      const childPath = this.getFullRoutePath(route.firstChild);
      path = path ? `${path}/${childPath}` : childPath;
    }
    console.log('AuthGuard: Constructed full path:', path);
    return path;
  }

  private async showUnauthorizedAlert(): Promise<void> {
    console.log('AuthGuard: Displaying unauthorized access alert');
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
    console.log('AuthGuard: SweetAlert2 dialog confirmed');
  }
}
