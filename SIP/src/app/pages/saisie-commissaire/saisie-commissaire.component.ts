import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CAC, CompanyService } from '../../services/company.service'; // Importez votre service

@Component({
  selector: 'app-saisie-commissaire',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './saisie-commissaire.component.html',
  styleUrls: ['./saisie-commissaire.component.css']
})
export class SaisieCommissaireComponent {
  formData = {
    cabinetName: '',
    nature: '',
    commissaireName: '',
    cabinetEmail: '',
    cabinetPhone: '',
    email1: '',
    phone1: '',
    email2: '',
    phone2: ''
  };

  natures: any[] = []; // Pour stocker les natures récupérées
  formSubmitted = false;
 
  constructor(private companyService: CompanyService) {} // Injectez le service

  ngOnInit() {
    this.loadNatures();
  }

  loadNatures() {
    this.companyService.getCACNature().subscribe({
      next: (data) => {
        this.natures = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des natures:', error);
        
      }
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
      // Préparer les données pour l'API avec conversion des téléphones en nombres
      const cacData: CAC = {
        cabinet_Nom: this.formData.cabinetName,
        nature_ID: Number(this.formData.nature),
        commissaire_NomPrenom: this.formData.commissaireName,
        cabinet_Email: this.formData.cabinetEmail || null,
        cabinet_Telephone: this.formData.cabinetPhone ? Number(this.formData.cabinetPhone) : null,
        email1: this.formData.email1 || null,
        telephone1: this.formData.phone1 ? Number(this.formData.phone1) : null,
        email2: this.formData.email2 || null,
        telephone2: this.formData.phone2 ? Number(this.formData.phone2) : null
      };

      // Envoyer les données au backend
      console.log('Données CAC envoyées au backend :', cacData);
      this.companyService.addCAC(cacData).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Succès!',
            text: 'Le commissaire aux comptes a été enregistré avec succès',
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
            text: error.error.message || 'Une erreur est survenue lors de l\'enregistrement',
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
  resetForm() {
    throw new Error('Method not implemented.');
  }

  isFormValid(): boolean {
    return this.formData.cabinetName.trim() !== '' && 
           this.formData.nature.trim() !== '' && 
           this.formData.commissaireName.trim() !== '' && 
           (this.formData.cabinetEmail === '' || this.isValidEmail(this.formData.cabinetEmail)) &&
           (this.formData.cabinetPhone === '' || this.isValidPhone(this.formData.cabinetPhone)) &&
           (this.formData.email1 === '' || this.isValidEmail(this.formData.email1)) &&
           (this.formData.phone1 === '' || this.isValidPhone(this.formData.phone1)) &&
           (this.formData.email2 === '' || this.isValidEmail(this.formData.email2)) &&
           (this.formData.phone2 === '' || this.isValidPhone(this.formData.phone2));
           
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
