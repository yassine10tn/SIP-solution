import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  matricule: string = '';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    if (!this.matricule || !this.password) {
      this.showError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.isLoading = true;

    this.authService.login({
      Matricule: this.matricule,
      Mdp: this.password
    }).subscribe({
      error: (error) => {
        console.error('Login error:', error);
        this.showError('Matricule ou mot de passe incorrect');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private showError(message: string): void {
    Swal.fire({
      title: 'Erreur',
      text: message,
      icon: 'error',
      confirmButtonColor: '#4f46e5',
      confirmButtonText: 'OK'
    });
  }
}