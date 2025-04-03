import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-saisie-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './saisie-contacts.component.html',
  styleUrls: ['./saisie-contacts.component.css']
})
export class SaisieContactsComponent {
  contact = {
    nomPrenom: '',
    fonction_ID: null as number | null,
    email1: '',
    telephone1: '', // Gardé comme string pour la saisie
    email2: '',
    telephone2: '', // Gardé comme string pour la saisie
    idProjet: null as number | null,
    situation_ID: null as number | null,
    observation: ''
  };

  fonctions: any[] = [];
  situations: any[] = [];
  societes: any[] = [];
  formSubmitted = false;

  constructor(private companyService: CompanyService) {}
  ngOnInit(): void {
    this.loadFonctions();
    this.loadSituations();
    this.loadSocietes();
  }

  loadFonctions(): void {
    this.companyService.getFonctions().subscribe({
      next: (data) => (this.fonctions = data),
      error: (error) => console.error('Erreur lors du chargement des fonctions:', error)
    });
  }

  loadSituations(): void {
    this.companyService.getSituations().subscribe({
      next: (data) => (this.situations = data),
      error: (error) => console.error('Erreur lors du chargement des situations:', error)
    });
  }

  loadSocietes(): void {
    this.companyService.getCompanies().subscribe({
      next: (data: any[]) => (this.societes = data),
      error: (error: any) => console.error('Erreur lors du chargement des sociétés:', error)
    });
  }

  checkFieldValidity(field: any) {
    field.control?.markAsTouched();
    field.control?.markAsDirty();
    field.control?.updateValueAndValidity();
  }

  onSubmit() {
    this.formSubmitted = true;

    if (this.isFormValid()) {
      const contactData = {
        ...this.contact,
        telephone1: this.contact.telephone1 ? Number(this.contact.telephone1) : null, // Conversion en number
        telephone2: this.contact.telephone2 ? Number(this.contact.telephone2) : null, // Conversion en number ou null si vide
        email2: this.contact.email2 || null // Envoi de null si vide
      };
      console.log('Formulaire soumis:', contactData);

      this.companyService.addContact(contactData).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Succès!',
            text: 'Le contact a été enregistré avec succès',
            icon: 'success',
            confirmButtonText: 'OK',
            allowOutsideClick: false
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        },
        error: (error) => {
          console.error('Erreur lors de l\'enregistrement:', error);
          Swal.fire({
            title: 'Erreur',
            text: 'Une erreur est survenue lors de l\'enregistrement du contact',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Attention',
        text: 'Veuillez vérifier les informations saisies',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
    }
  }

  resetForm(): void {
    this.contact = {
      nomPrenom: '',
      fonction_ID: null,
      email1: '',
      telephone1: '',
      email2: '',
      telephone2: '',
      idProjet: null,
      situation_ID: null,
      observation: ''
    };
    this.formSubmitted = false;
  }

  isFormValid(): boolean {
    const isEmail2Valid = !this.contact.email2 || this.isValidEmail(this.contact.email2); // Valide si vide ou format correct
    const isTelephone2Valid = !this.contact.telephone2 || this.isValidPhone(this.contact.telephone2); // Valide si vide ou 8 chiffres

    return (
      this.contact.nomPrenom.trim() !== '' &&
      this.contact.fonction_ID !== null &&
      this.contact.email1.trim() !== '' &&
      this.contact.telephone1.trim() !== '' &&
      this.contact.idProjet !== null &&
      this.contact.situation_ID !== null &&
      this.isValidEmail(this.contact.email1) &&
      this.isValidPhone(this.contact.telephone1) &&
      isEmail2Valid &&
      isTelephone2Valid
    );
  }

  isValidEmail(email: string): boolean {
    const pattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return pattern.test(email);
  }

  isValidPhone(phone: string): boolean {
    const pattern = /^\d{8}$/;
    return pattern.test(phone);
  }
}