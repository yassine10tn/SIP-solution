import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  navigateToLogin() {
    window.location.href = '/login';
  }
  navigateToHome(){
    window.location.href = '/home'
  }
  navigateToSocieteList(){
    window.location.href = '/societe-list'
  }
}
