import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyService, } from '../../services/company.service';

interface Commissaire {
  id: number;
  nomCabinet: string;
  
  nomCommissaire: string;
  emailCabinet: string | null | undefined;
  telephoneCabinet: number | null| undefined;
  emailSecondaire: string | null | undefined;
  telephoneSecondaire: number | null | undefined;
  emailSecondaire2: string | null | undefined;
  telephoneSecondaire2: number | null | undefined;
}

@Component({
  selector: 'app-commissaire-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commissaire-list.component.html',
  styleUrls: ['./commissaire-list.component.css']
})
export class CommissaireListComponent implements OnInit {
  searchTerm = '';
  allCommissaires: Commissaire[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.loadCommissaires();
  }

  loadCommissaires(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.companyService.getCommissaires().subscribe({
      next: (commissaires) => {
        this.allCommissaires = commissaires.map(c => ({
          id: c.caC_ID,
          nomCabinet: c.cabinet_Nom,
          nomCommissaire: c.commissaire_NomPrenom,
          emailCabinet: c.cabinet_Email,
          telephoneCabinet: c.cabinet_Telephone,
          emailSecondaire: c.email1,
          telephoneSecondaire: c.telephone1,
          emailSecondaire2: c.email2,
          telephoneSecondaire2: c.telephone2
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading commissaires:', err);
        this.errorMessage = 'Erreur lors du chargement des commissaires. Veuillez rÃ©essayer.';
        this.isLoading = false;
      }
    });
  }

  get filteredCommissaires(): Commissaire[] {
    if (!this.searchTerm) {
      return this.allCommissaires;
    }
    const term = this.searchTerm.toLowerCase();
    return this.allCommissaires.filter(commissaire => 
      commissaire.nomCabinet.toLowerCase().includes(term) ||
      (commissaire.nomCommissaire && commissaire.nomCommissaire.toLowerCase().includes(term)) ||
      (commissaire.emailCabinet && commissaire.emailCabinet.toLowerCase().includes(term))
    );
  }

  getInitials(name: string): string {
    if (!name) return 'CA';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  }

  navigateToCommissaireForm() {
    this.router.navigate(['/saisie-commissaire']);
  }
  refreshCommissaires(): void {
    this.isLoading = true;
    this.searchTerm = ''; // Optionnel: réinitialiser la recherche
    this.loadCommissaires();
  }
}

