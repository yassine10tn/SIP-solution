import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ParametrageService, User } from '../../services/parametrage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-liste-utilisateur',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './liste-utilisateur.component.html',
  styleUrls: ['./liste-utilisateur.component.css']
})
export class ListeUtilisateurComponent implements OnInit {
  users: User[] = [];
  searchTerm: string = '';
  statusFilter: string = '';
  statusOptions: string[] = [];

  constructor(private parametrageService: ParametrageService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadStatusOptions();
  }

  loadUsers(): void {
    this.parametrageService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: () => {
        // Error handled by service
      }
    });
  }

  loadStatusOptions(): void {
    this.parametrageService.getStatusOptions().subscribe({
      next: (statusOptions) => {
        this.statusOptions = statusOptions;
      },
      error: () => {
        // Error handled by service
      }
    });
  }

  get showNomColumn(): boolean {
    return this.statusFilter === 'representantPerma' || this.statusFilter === 'representantPonct';
  }

  get filteredUsers(): User[] {
    return this.users.filter(user => {
      const matchesSearch = 
        (user.nomPrenomUtilisateur?.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
         user.matricule.toLowerCase().includes(this.searchTerm.toLowerCase()));
      const matchesStatus = !this.statusFilter || user.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  deleteUser(matricule: string): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.parametrageService.deleteUser(matricule).subscribe({
          next: () => {
            this.users = this.users.filter(user => user.matricule !== matricule);
            Swal.fire(
              'Supprimé!',
              'L\'utilisateur a été supprimé.',
              'success'
            );
          },
          error: () => {
            // Error handled by service
          }
        });
      }
    });
  }
}