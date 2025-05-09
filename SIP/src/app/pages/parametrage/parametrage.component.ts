import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ParametrageService } from '../../services/parametrage.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-parametrage',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './parametrage.component.html',
  styleUrls: ['./parametrage.component.css']
})
export class ParametrageComponent {
  // Formulaire 1 - Droits d'accès
  statusOptions: { value: string, label: string }[] = []; // Initialisé vide
  

  
  accessForm = {
    status: '',
    matricule: '',
    password: ''
  };

  accessFormErrors = {
    status: false,
    matricule: false,
    password: false
  };

  // Formulaire 2 - Représentant
  representantMatricules: string[] = [];

  representativeForm = {
    nom: '',
    matricule: '' 
  };

  representativeFormErrors = {
    nom: false,
    matricule: false
  };
  isLoading: boolean | undefined;
  constructor(private parametrageService: ParametrageService) {}
  ngOnInit() {
    this.loadStatusOptions();
    this.loadRepresentantMatricules();
  }
  // Charger les options de statut depuis le backend
  loadStatusOptions() {
    this.parametrageService.getStatusOptions().subscribe({
      next: (statuses) => {
        this.statusOptions = statuses.map(status => ({
          value: status,
          label: this.formatStatusLabel(status)
        }));
      },
      error: (error) => console.error('Erreur lors du chargement des statuts', error)
    });
  }
  loadRepresentantMatricules() {
    this.parametrageService.getRepresentantMatricules().subscribe({
      next: (matricules) => {
        this.representantMatricules = matricules;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des matricules', error);
        this.showError('Impossible de charger les matricules des représentants');
      }
    });
  }
  // Formater le libellé pour un affichage plus lisible
   formatStatusLabel(status: string): string {
    const map: Record<string, string> = {
      'Administrateur': 'Administrateur',
      'Metier': 'Utilisateur métier',
      'reporting': 'Utilisateur de reporting',
      'representantPerma': 'Représentant permanent',
      'representantPonct': 'Représentant ponctuel'
    };
    return map[status] || status;
  }

  // Basculer la visibilité du mot de passe
  togglePasswordVisibility(fieldId: string) {
    const field = document.getElementById(fieldId) as HTMLInputElement;
    if (field) {
      field.type = field.type === 'password' ? 'text' : 'password';
    }
  }

  // Validation des champs au blur
  validateField(form: string, field: string) {
    if (form === 'access') {
      this.accessFormErrors[field as keyof typeof this.accessFormErrors] = 
        !this.accessForm[field as keyof typeof this.accessForm];
    } else {
      this.representativeFormErrors[field as keyof typeof this.representativeFormErrors] = 
        !this.representativeForm[field as keyof typeof this.representativeForm];
    }
  }

  // Vérification globale avant soumission
  validateForm(formData: any, formErrors: any): boolean {
    let isValid = true;
    Object.keys(formData).forEach(key => {
      formErrors[key] = !formData[key];
      if (!formData[key]) isValid = false;
    });
    return isValid;
  }

  // Soumission du formulaire de droits d'accès
  submitAccessForm() {
    if (!this.validateForm(this.accessForm, this.accessFormErrors)) {
      this.showError('Veuillez remplir tous les champs obligatoires');
      return;
    }
  
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous enregistrer ces droits d\'accès?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Oui, enregistrer',
      cancelButtonText: 'Annuler',
      backdrop: 'rgba(0,0,0,0.4)'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        
        this.parametrageService.createUser(
          this.accessForm.matricule,
          this.accessForm.password,
          this.accessForm.status
        ).pipe(
          finalize(() => this.isLoading = false)
        ).subscribe({
          next: () => {
            Swal.fire({
              title: 'Succès!',
              text: 'Les droits d\'accès ont été enregistrés.',
              icon: 'success',
              confirmButtonColor: '#3b82f6',
              timer: 2000,
              timerProgressBar: true
            });
            
            // Réinitialisation
            this.accessForm = {
              status: '',
              matricule: '',
              password: ''
            };
            this.accessFormErrors = {
              status: false,
              matricule: false,
              password: false
            };
          },
          error: (error) => {
            console.error('Erreur création utilisateur:', error);
            this.showError('Erreur lors de la création de l\'utilisateur');
          }
        });
      }
    });
  }

  // Soumission du formulaire de représentant
  submitRepresentativeForm() {
    if (!this.validateForm(this.representativeForm, this.representativeFormErrors)) {
      this.showError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous enregistrer ce représentant?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Oui, enregistrer',
      cancelButtonText: 'Annuler',
      backdrop: 'rgba(0,0,0,0.4)'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        
        this.parametrageService.createRepresentant(
          this.representativeForm.nom,
          this.representativeForm.matricule
        ).pipe(
          finalize(() => this.isLoading = false)
        ).subscribe({
          next: () => {
            Swal.fire({
              title: 'Succès!',
              text: 'Le représentant a été enregistré.',
              icon: 'success',
              confirmButtonColor: '#3b82f6',
              timer: 2000,
              timerProgressBar: true
            });
            
            // Réinitialisation
            this.representativeForm = {
              nom: '',
              matricule: ''
            };
            this.representativeFormErrors = {
              nom: false,
              matricule: false
            };
          },
          error: (error) => console.error('Erreur création représentant:', error)
        });
      }
    });
  }

   

  private showError(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: message,
      confirmButtonColor: '#3b82f6',
      backdrop: 'rgba(0,0,0,0.4)'
    });
  }
}
