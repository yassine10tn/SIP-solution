import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  private userSubscription!: Subscription;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  confirmLogout(): void {
    Swal.fire({
      title: 'Déconnexion',
      text: 'Voulez-vous vraiment vous déconnecter ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, déconnecter',
      cancelButtonText: 'Annuler',
      backdrop: `
        rgba(0,0,0,0.4)
        url("/assets/images/logout.gif")
        left top
        no-repeat
      `
      
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Déconnexion réussie',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }
}