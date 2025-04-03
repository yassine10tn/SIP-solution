import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CompanyService, Projet, TypeSouscription } from '../../services/company.service';
import Aos from 'aos';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-participation',
  templateUrl: './participation.component.html',
  styleUrls: ['./participation.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class ParticipationComponent implements OnInit {
  isAccordionOpen: string | null = null;
  selectedFileNameSouscription: string | null = null;
  selectedFileNameOrdreAchat: string | null = null;
  participationForm: FormGroup;
  achatForm: FormGroup;
  venteForm: FormGroup;
  selectedFileSouscription: File | null = null;
  selectedFileBase64: string | null = null;

  // zedin 
  societes: Projet[] = []; // Liste des sociétés
  typesSouscription: TypeSouscription[] = []; // Liste des types de souscription

  constructor(private fb: FormBuilder, private companyService: CompanyService) {
// Initialize forms
this.participationForm = this.fb.group({
  societe: ['', Validators.required],
  dateSouscription: ['', Validators.required],
  typeSouscription: ['', Validators.required],
  quantite: [0, [Validators.required, Validators.min(1)]],
  prixUnitaire: [0, [
    Validators.required,
    Validators.min(0.001),
    Validators.pattern(/^\d+(\.\d{1,3})$/),
  ]],
  montantTotal: [, Validators.required],
  primeEmission: [, Validators.required],
  signataire: ['', Validators.required],
  fonction: ['', Validators.required],
  copieBulletin: [null, Validators.required]
});

this.achatForm = this.fb.group({
  societe: ['', Validators.required],
  dateAchat: ['', Validators.required],
  quantite: [0, [Validators.required, Validators.min(1)]],
  prixUnitaire: [0, [
    Validators.required,
    Validators.min(0.001),
    Validators.pattern(/^\d+(\.\d{1,3})$/),
  
  ]],
  montantTotal: [, Validators.required],
  signataire: ['', Validators.required],
  fonction: ['', Validators.required],
  copieOrdreAchat: [null, Validators.required]
});

this.venteForm = this.fb.group({
  societe: ['', Validators.required],
  dateVente: ['', Validators.required],
  quantite: [0, [Validators.required, Validators.min(1)]],
  prixUnitaire: [0, [
    Validators.required,
    Validators.min(0.001),
    Validators.pattern(/^\d+(\.\d{1,3})$/),
    
    
  ]],
  montantTotal: [, Validators.required],
  signataire: ['', Validators.required],
  fonction: ['', Validators.required],
  copieOrdreVente: [null, Validators.required]
});




    // Bind calculation method to quantity and unit price changes
    this.participationForm.get('quantite')?.valueChanges.subscribe(() => this.calculerMontantTotal());
    this.participationForm.get('prixUnitaire')?.valueChanges.subscribe(() => this.calculerMontantTotal());

    this.achatForm.get('quantite')?.valueChanges.subscribe(() => this.calculerMontantTotalAchat());
    this.achatForm.get('prixUnitaire')?.valueChanges.subscribe(() => this.calculerMontantTotalAchat());

    this.venteForm.get('quantite')?.valueChanges.subscribe(() => this.calculerMontantTotalVente());
    this.venteForm.get('prixUnitaire')?.valueChanges.subscribe(() => this.calculerMontantTotalVente());
  }
  ngOnInit(): void {
    this.loadSocietes();
    this.loadTypesSouscription();
    Aos.init();
  }

   // Charger les sociétés depuis l'API
   loadSocietes(): void {
    this.companyService.getCompanies().subscribe(
      (data: Projet[]) => {
        this.societes = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des sociétés', error);
      }
    );
  }

  // Charger les types de souscription depuis l'API
  loadTypesSouscription(): void {
    this.companyService.getTypesSouscription().subscribe(
      (data: TypeSouscription[]) => {
        this.typesSouscription = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des types de souscription', error);
      }
    );
  }

  // Method to navigate to the home page
  navigateToHome() {
    window.location.href = '/home';
  }

  // Method to toggle accordion sections
  toggleAccordion(section: string) {
    this.isAccordionOpen = this.isAccordionOpen === section ? null : section;
  }

  // Methods to handle form submissions
  async onSubmitSouscription() {
    // Marquer tous les champs comme touchés
    this.markFormGroupTouched(this.participationForm);
  
    if (!this.participationForm.valid || !this.selectedFileBase64) {
      await Swal.fire({
        title: 'Information manquante',
        text: 'Veuillez remplir tous les champs requis',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
  
    const formData = {
      IdProjet: Number(this.participationForm.get('societe')?.value),
      DateSouscription: this.participationForm.get('dateSouscription')?.value,
      IdTypeSouscription: Number(this.participationForm.get('typeSouscription')?.value),
      Quantite: Number(this.participationForm.get('quantite')?.value),
      PrixUnitaire: Number(this.participationForm.get('prixUnitaire')?.value),
      PrimeEmissionTotal: Number(this.participationForm.get('primeEmission')?.value),
      Signataire: this.participationForm.get('signataire')?.value,
      Fonction: this.participationForm.get('fonction')?.value,
      CopieBulletin: this.selectedFileBase64 
    };
  
    this.companyService.postSouscription(formData).subscribe(
      async (response) => {
        await Swal.fire({
          title: 'Succès!',
          text: 'Souscription enregistrée avec succès',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6'
        });
        
        // Rechargement de la page après 1 seconde
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      async (error) => {
        await Swal.fire({
          title: 'Erreur!',
          text: 'Une erreur est survenue lors de l\'enregistrement',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#d33'
        });
      }
    );
  }
  
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
  
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
    
  
  

  async onSubmitAchat() {
    // Marquer tous les champs comme touchés
    this.markFormGroupTouched(this.achatForm);
  
    if (!this.achatForm.valid || !this.selectedFileBase64) {
      await Swal.fire({
        title: 'Information manquante',
        text: 'Veuillez remplir tous les champs requis',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
  
    const formData = {
      IdProjet: Number(this.achatForm.get('societe')?.value),
      DateAchat: this.achatForm.get('dateAchat')?.value,
      Quantite: Number(this.achatForm.get('quantite')?.value),
      PrixUnitaire: Number(this.achatForm.get('prixUnitaire')?.value),
      Signataire: this.achatForm.get('signataire')?.value,
      Fonction: this.achatForm.get('fonction')?.value,
      CopieOrdreAchat: this.selectedFileBase64
    };
  
    this.companyService.postAchat(formData).subscribe(
      async (response) => {
        await Swal.fire({
          title: 'Succès!',
          text: 'Achat enregistré avec succès',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6'
        });
        
        // Rechargement de la page après 1 seconde
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      async (error) => {
        await Swal.fire({
          title: 'Erreur!',
          text: 'Une erreur est survenue lors de l\'enregistrement de l\'achat',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#d33'
        });
      }
    );
  }

  async onSubmitVente() {
    // Marquer tous les champs comme touchés
    this.markFormGroupTouched(this.venteForm);
  
    if (!this.venteForm.valid) {
      await Swal.fire({
        title: 'Information manquante',
        text: 'Veuillez remplir tous les champs requis',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
  
    const formData = {
      IdProjet: Number(this.venteForm.get('societe')?.value),
      DateVente: this.venteForm.get('dateVente')?.value,
      Quantite: Number(this.venteForm.get('quantite')?.value),
      PrixUnitaire: Number(this.venteForm.get('prixUnitaire')?.value),
      Signataire: this.venteForm.get('signataire')?.value,
      Fonction: this.venteForm.get('fonction')?.value,
      CopieOrdreVente: this.selectedFileBase64 // Si vous ajoutez un champ fichier plus tard
    };
  
    this.companyService.postVente(formData).subscribe(
      async (response) => {
        await Swal.fire({
          title: 'Succès!',
          text: 'Vente enregistrée avec succès',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6'
        });
        
        // Rechargement de la page après 1 seconde
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      async (error) => {
        await Swal.fire({
          title: 'Erreur!',
          text: 'Une erreur est survenue lors de l\'enregistrement de la vente',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#d33'
        });
      }
    );
  }

  // Methods to handle file changes
  onFileChange(event: any, controlName: string) {
    const files = event.target.files;
    if (files && files.length > 0) {
      //zeyed
      const file = files[0];
      this.selectedFileNameSouscription = file.name;
      
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      // Supprimer le préfixe "data:application/pdf;base64," si présent
      const base64Data = base64String.split(',')[1];

      // Stocker la valeur base64 dans selectedFileBase64
      this.selectedFileBase64 = base64Data;

      // Assigner la valeur base64 au contrôle du formulaire
      if (controlName === 'copieBulletin') {
        this.participationForm.get(controlName)?.setValue(base64Data);
      }
    };
    reader.readAsDataURL(file); // Lire le fichier et le convertir en base64
  } else {
    console.error('Aucun fichier sélectionné');
  }
}
onFileChangeOrdreAchat(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input?.files?.length) {
      const file = input.files[0];
      this.selectedFileNameOrdreAchat = file.name;

      // Convertir le fichier en base64
      const reader = new FileReader();
      reader.onload = () => {
          const base64String = reader.result as string;
          const base64Data = base64String.split(',')[1]; // Supprimer le préfixe "data:application/pdf;base64,"
          this.selectedFileBase64 = base64Data; // Stocker le fichier en base64

          // Assigner la valeur base64 au contrôle du formulaire
          this.achatForm.get('copieOrdreAchat')?.setValue(base64Data);
      };
      reader.readAsDataURL(file); // Lire le fichier et le convertir en base64
  } else {
      console.error('Aucun fichier sélectionné');
  }
}
  // Automatic calculation of total amount for subscription
  calculerMontantTotal() {
    const quantite = this.participationForm.get('quantite')?.value;
    const prixUnitaire = this.participationForm.get('prixUnitaire')?.value;
    this.participationForm.get('montantTotal')?.setValue(quantite * prixUnitaire);
  }

  // Automatic calculation of total amount for purchase
  calculerMontantTotalAchat() {
    const quantite = this.achatForm.get('quantite')?.value;
    const prixUnitaire = this.achatForm.get('prixUnitaire')?.value;
    this.achatForm.get('montantTotal')?.setValue(quantite * prixUnitaire);
  }

  // Automatic calculation of total amount for sale
  calculerMontantTotalVente() {
    const quantite = this.venteForm.get('quantite')?.value;
    const prixUnitaire = this.venteForm.get('prixUnitaire')?.value;
    this.venteForm.get('montantTotal')?.setValue(quantite * prixUnitaire);
  }
}
