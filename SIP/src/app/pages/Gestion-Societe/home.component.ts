import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { CompanyService } from '../../services/company.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatStepperModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;

  companyForm: FormGroup;
  // Liste des valeurs pour les listes déroulantes
  paysList: any[] = [];
  GouvernoratsList: any[] = [];
  FormeJuridiqueList: any[] = [];
  TypeProjetList: any[] = [];
  SecteurEconomiqueList: any[] = [];
  NatureProjetList: any[] = [];
  TypeManagementList: any[] = [];
  DeviseList: any[] = [];
  TypeIdentifiantList: any[] = [];
  TypeEntrepriseList: any[] = [];
  ParametreRSM620List: any[] = [];
  ParametreRNL870List: any[] = [];

  // Variables pour les fichiers
  selectedStatutsFileName: string = '';
  selectedDossierFileNames: string[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private companyService: CompanyService
  ) {
    this.companyForm = this.fb.group({
      exIdentifiant: ['', Validators.required],
      raisonSociale: ['', Validators.required],
      raisonSocialeAr: ['', Validators.required],
      libelleCourt: [''],
      siegeSocial: ['', Validators.required],
      siegeSocialAr: ['', Validators.required],
      pays: ['', Validators.required],
      gouvernorat: ['', Validators.required],
      MF: ['', Validators.required],
      dateCreation: ['', Validators.required],
      dateDossier: ['', Validators.required],
      formeJuridique: ['', Validators.required],
      typeProjet: ['', Validators.required],
      status: ['', Validators.required],
      dossierJuridique: [''],
      objet: ['', Validators.required],
      objetAr: ['', Validators.required],
      secteurEconomique: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      NatureProjet: ['', Validators.required],
      typeManagement: ['', Validators.required],
      devise: ['', Validators.required],
      identifiant: ['', Validators.required],
      typeIdentifiant: ['', Validators.required],
      typeEntreprise: ['', Validators.required],
      parametreRSM620: ['', Validators.required],
      parametreRNL870: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getPays();
    this.getGouvernorats();
    this.getFormeJuridique();
    this.getSecteurEconomique();
    this.getNatureProjet();
    this.getTypeManagement();
    this.getDevise();
    this.getTypeIdentifiant();
    this.getTypeEntreprise();
    this.getParametreRSM620();
    this.getParametreRNL870();
    this.getTypeProjet();
  }

  // Méthodes pour récupérer les listes depuis le service
  getTypeProjet(): void {
    this.companyService.getTypeProjet().subscribe(
      (data) => {
        this.TypeProjetList = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des TypeProjet:', error);
      }
    );
  }

  getPays(): void {
    this.companyService.getPays().subscribe(
      (data) => {
        this.paysList = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des pays:', error);
      }
    );
  }

  getGouvernorats(): void {
    this.companyService.getGouvernorats().subscribe(
      (data) => {
        this.GouvernoratsList = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des gouvernerats:', error);
      }
    );
  }

  getFormeJuridique(): void {
    this.companyService.getFormeJuridique().subscribe(
      (data) => {
        this.FormeJuridiqueList = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des FormeJuridique:', error);
      }
    );
  }

  getSecteurEconomique(): void {
    this.companyService.getSecteurEconomique().subscribe(
      (data) => {
        this.SecteurEconomiqueList = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des SecteurEconomique:', error);
      }
    );
  }

  getNatureProjet(): void {
    this.companyService.getNatureProjet().subscribe(
      (data) => {
        this.NatureProjetList = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des NatureProjet:', error);
      }
    );
  }

  getTypeManagement(): void {
    this.companyService.getTypeManagement().subscribe(
      (data) => {
        this.TypeManagementList = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des TypeManagement:', error);
      }
    );
  }

  getDevise(): void {
    this.companyService.getDevise().subscribe(
      (data) => {
        this.DeviseList = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des Devise:', error);
      }
    );
  }

  getTypeIdentifiant(): void {
    this.companyService.getTypeIdentifiant().subscribe(
      (data) => {
        this.TypeIdentifiantList = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des TypeIdentifiant:', error);
      }
    );
  }

  getTypeEntreprise(): void {
    this.companyService.getTypeEntreprise().subscribe(
      (data) => {
        this.TypeEntrepriseList = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des TypeEntreprise:', error);
      }
    );
  }

  getParametreRSM620(): void {
    this.companyService.getParametreRSM620().subscribe(
      (data) => {
        this.ParametreRSM620List = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des ParametreRSM620:', error);
      }
    );
  }

  getParametreRNL870(): void {
    this.companyService.getParametreRNL870().subscribe(
      (data) => {
        this.ParametreRNL870List = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des ParametreRNL870:', error);
      }
    );
  }

  // Gestion des fichiers
  onFileChange(event: any, controlName: string) {
    const files = event.target.files;
    if (files && files.length > 0) {
      if (controlName === 'status') {
        this.selectedStatutsFileName = files[0].name;
      } else if (controlName === 'dossierJuridique') {
        this.selectedDossierFileNames = Array.from(files).map((file: any) => file.name);
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.companyForm.get(controlName)?.setValue(base64String.split(',')[1]);
      };
      reader.readAsDataURL(files[0]);
    }
  }

  // Conversion des valeurs pour l'API
  private convertToIndices(formData: any): any {
    return {
      exIdentifiant: formData.exIdentifiant,
      raisonSociale: formData.raisonSociale,
      raisonSocialeAr: formData.raisonSocialeAr,
      libelleCourt: formData.libelleCourt,
      siegeSocial: formData.siegeSocial,
      siegeSocialAr: formData.siegeSocialAr,
      idPays: formData.pays,
      IdGouvernorat: formData.gouvernorat,
      MF: formData.MF,
      dateCreation: formData.dateCreation,
      dateDossier: formData.dateDossier,
      IdFormeJuridique: formData.formeJuridique,
      IdTypeProjet: formData.typeProjet,
      status: formData.status,
      DossierJuridique: formData.dossierJuridique,
      objet: formData.objet,
      objetAr: formData.objetAr,
      IdSecteurEconomique: formData.secteurEconomique,
      Telephone: formData.telephone,
      Email: formData.email,
      IdNatureProjet: formData.NatureProjet,
      idTypeManagement: formData.typeManagement,
      IdDevise: formData.devise,
      identifiant: formData.identifiant,
      IdTypeIdentifiant: formData.typeIdentifiant,
      idTypeEntreprise: formData.typeEntreprise,
      idParametreRSM620: formData.parametreRSM620,
      idParametreRNLPA870: formData.parametreRNL870,
    };
  }

  // Soumission du formulaire avec gestion des erreurs détaillées
  async onSubmit() {
    this.markFormGroupTouched(this.companyForm);

    if (!this.companyForm.valid) {
      const invalidFields = this.getInvalidFields();
      const errorMessages = this.getErrorMessages(invalidFields);
      
      await Swal.fire({
        title: 'Erreur de validation',
        html: `Veuillez corriger les erreurs suivantes :<ul>${errorMessages.map(msg => `<li>${msg}</li>`).join('')}</ul>`,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33'
      });

      this.scrollToFirstInvalidControl();
      return;
    }

    const formData = this.companyForm.value;
    const convertedData = this.convertToIndices(formData);

    try {
      const response = await this.companyService.addCompany(convertedData).toPromise();
      
      await Swal.fire({
        title: 'Succès!',
        text: 'Données enregistrées avec succès',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });

      this.resetForm();
      setTimeout(() => window.location.reload(), 1000);

    } catch (error) {
      console.error('Erreur:', error);
      await Swal.fire({
        title: 'Erreur!',
        text: "Une erreur est survenue lors de l'enregistrement.",
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33'
      });
    }
  }

  // Méthodes utilitaires pour la gestion des erreurs
  private getInvalidFields(): string[] {
    return Object.keys(this.companyForm.controls)
      .filter(key => this.companyForm.get(key)?.invalid);
  }

  private getErrorMessages(invalidFields: string[]): string[] {
    const fieldMessages: {[key: string]: string} = {
      'exIdentifiant': 'Ancien identifiant est requis',
      'raisonSociale': 'Raison sociale est requise',
      'raisonSocialeAr': 'Raison sociale (arabe) est requise',
      'siegeSocial': 'Siège social est requis',
      'siegeSocialAr': 'Siège social (arabe) est requis',
      'pays': 'Pays est requis',
      'gouvernorat': 'Gouvernorat est requis',
      'MF': 'Matricule fiscal est requis',
      'dateCreation': 'Date de création est requise',
      'dateDossier': 'Date de dossier est requise',
      'formeJuridique': 'Forme juridique est requise',
      'typeProjet': 'Type de projet est requis',
      'status': 'Statuts sont requis',
      'objet': 'Objet est requis',
      'objetAr': 'Objet (arabe) est requis',
      'secteurEconomique': 'Secteur économique est requis',
      'telephone': 'Téléphone doit contenir 8 chiffres',
      'email': 'Email doit être valide',
      'NatureProjet': 'Nature du projet est requise',
      'typeManagement': 'Type de management est requis',
      'devise': 'Devise est requise',
      'identifiant': 'Identifiant est requis',
      'typeIdentifiant': 'Type d\'identifiant est requis',
      'typeEntreprise': 'Type d\'entreprise est requis',
      'parametreRSM620': 'Paramètre RSM620 est requis',
      'parametreRNL870': 'Paramètre RNL870 est requis'
    };

    return invalidFields.map(field => fieldMessages[field] || `Le champ ${field} est invalide`);
  }

  private scrollToFirstInvalidControl() {
    const firstInvalidControl = document.querySelector('.ng-invalid');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (firstInvalidControl as HTMLElement).focus();
    }
  }

  // Réinitialisation du formulaire
  resetForm() {
    this.companyForm.reset();
    this.selectedStatutsFileName = '';
    this.selectedDossierFileNames = [];
  }

  // Marquer tous les champs comme touchés
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Navigation dans le stepper
  nextStep() {
    const currentStepControls = this.getCurrentStepControls();
    if (this.isStepValid(currentStepControls)) {
      this.stepper.next();
    } else {
      this.snackBar.open('Veuillez remplir tous les champs requis', 'Fermer', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
      });
    }
  }

  previousStep() {
    this.stepper.previous();
  }

  private getCurrentStepControls(): string[] {
    switch (this.stepper.selectedIndex) {
      case 0: return ['exIdentifiant', 'raisonSociale', 'raisonSocialeAr', 'siegeSocial', 'siegeSocialAr'];
      case 1: return ['pays', 'gouvernorat', 'MF'];
      case 2: return ['dateCreation', 'dateDossier', 'formeJuridique', 'typeProjet', 'status'];
      case 3: return ['objet', 'objetAr', 'secteurEconomique'];
      case 4: return ['telephone', 'email'];
      case 5: return ['NatureProjet', 'typeManagement', 'identifiant', 'typeIdentifiant', 'typeEntreprise', 'parametreRSM620', 'parametreRNL870'];
      default: return [];
    }
  }

  private isStepValid(controls: string[]): boolean {
    return controls.every(control => this.companyForm.get(control)?.valid);
  }
}
