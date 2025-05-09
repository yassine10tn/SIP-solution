import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyService } from '../../services/company.service';
@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  searchTerm = '';
  allContacts: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.companyService.getContacts().subscribe({
      next: (contacts) => {
        this.allContacts = contacts.map(contact => ({
          id: contact.contact_ID,
          prenom: this.extractFirstName(contact.nomPrenom),
          nom: this.extractLastName(contact.nomPrenom),
          fonction: contact.fonction_Libelle || 'Non spécifié',
          emailPrincipal: contact.email1,
          telephonePrincipal: contact.telephone1?.toString() || '',
          emailSecondaire: contact.email2,
          telephoneSecondaire: contact.telephone2?.toString(),
          societe: contact.raisonSociale || 'Non spécifié',
          observation: contact.observation,
          situation: contact.situation_Libelle
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading contacts:', err);
        this.errorMessage = 'Erreur lors du chargement des contacts. Veuillez réessayer.';
        this.isLoading = false;
      }
    });
  }

  private extractFirstName(fullName: string): string {
    if (!fullName) return '';
    return fullName.split(' ')[0];
  }

  private extractLastName(fullName: string): string {
    if (!fullName) return '';
    const parts = fullName.split(' ');
    return parts.length > 1 ? parts.slice(1).join(' ') : '';
  }

  get filteredContacts(): any[] {
    if (!this.searchTerm) {
      return this.allContacts;
    }
    const term = this.searchTerm.toLowerCase();
    return this.allContacts.filter(contact => 
      `${contact.prenom} ${contact.nom}`.toLowerCase().includes(term) ||
      contact.fonction.toLowerCase().includes(term) ||
      contact.societe.toLowerCase().includes(term) ||
      contact.emailPrincipal.toLowerCase().includes(term)
    );
  }

  getInitials(prenom: string, nom: string): string {
    return `${prenom?.charAt(0) || ''}${nom?.charAt(0) || ''}`.toUpperCase();
  }

  navigateToContactForm() {
    this.router.navigate(['/saisie-contacts']);
  }

  refreshContacts() {
    this.loadContacts();
  }
}
