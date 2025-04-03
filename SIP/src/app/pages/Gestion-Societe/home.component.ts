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

    // Méthode pour récupérer la liste des TypeProjet depuis le service
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

    // Méthode pour récupérer la liste des pays depuis le service
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

    //  Méthode pour récupérer la liste des gouvernerats depuis le service
    getGouvernorats(): void {
      this.companyService.getGouvernorats().subscribe(
        (data) => {
          this.GouvernoratsList = data;
        },
        (error) => {
          console.error(
            'Erreur lors de la récupération des gouvernerats:',
            error
          );
        }
      );
    }

    //  Méthode pour récupérer la liste des FormeJuridique depuis le service
    getFormeJuridique(): void {
      this.companyService.getFormeJuridique().subscribe(
        (data) => {
          this.FormeJuridiqueList = data;
        },
        (error) => {
          console.error(
            'Erreur lors de la récupération des FormeJuridique:',
            error
          );
        }
      );
    }

    // Méthode pour récupérer la liste des SecteurEconomique depuis le service
    getSecteurEconomique(): void {
      this.companyService.getSecteurEconomique().subscribe(
        (data) => {
          this.SecteurEconomiqueList = data;
        },
        (error) => {
          console.error(
            'Erreur lors de la récupération des SecteurEconomique:',
            error
          );
        }
      );
    }

    // Méthode pour récupérer la liste des NatureProjet depuis le service
    getNatureProjet(): void {
      this.companyService.getNatureProjet().subscribe(
        (data) => {
          this.NatureProjetList = data;
        },
        (error) => {
          console.error(
            'Erreur lors de la récupération des NatureProjet:',
            error
          );
        }
      );
    }
    // Méthode pour récupérer la liste des TypeManagement depuis le service
    getTypeManagement(): void {
      this.companyService.getTypeManagement().subscribe(
        (data) => {
          this.TypeManagementList = data;
        },
        (error) => {
          console.error(
            'Erreur lors de la récupération des TypeManagement:',
            error
          );
        }
      );
    }

    // Méthode pour récupérer la liste des Devise depuis le service
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

    // Méthode pour récupérer la liste des TypeIdentifiant depuis le service
    getTypeIdentifiant(): void {
      this.companyService.getTypeIdentifiant().subscribe(
        (data) => {
          this.TypeIdentifiantList = data;
        },
        (error) => {
          console.error(
            'Erreur lors de la récupération des TypeIdentifiant:',
            error
          );
        }
      );
    }

    // Méthode pour récupérer la liste des TypeEntreprise depuis le service
    getTypeEntreprise(): void {
      this.companyService.getTypeEntreprise().subscribe(
        (data) => {
          this.TypeEntrepriseList = data;
        },
        (error) => {
          console.error(
            'Erreur lors de la récupération des TypeEntreprise:',
            error
          );
        }
      );
    }
    // Méthode pour récupérer la liste des ParametreRSM620 depuis le service
    getParametreRSM620(): void {
      this.companyService.getParametreRSM620().subscribe(
        (data) => {
          this.ParametreRSM620List = data;
        },
        (error) => {
          console.error(
            'Erreur lors de la récupération des ParametreRSM620:',
            error
          );
        }
      );
    }
    // Méthode pour récupérer la liste des ParametreRNL870 depuis le service
    getParametreRNL870(): void {
      this.companyService.getParametreRNL870().subscribe(
        (data) => {
          this.ParametreRNL870List = data;
        },
        (error) => {
          console.error(
            'Erreur lors de la récupération des ParametreRNL870:',
            error
          );
        }
      );
    }
    // for the files status and dossierjuridique
    selectedStatutsFileName: string = '';
    selectedDossierFileNames: string[] = [];
    
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
          this.companyForm.get(controlName)?.setValue(base64String.split(',')[1]); // Remove the data URL prefix
        };
        reader.readAsDataURL(files[0]);
      }
    }

    // Convertir les valeurs des listes déroulantes en indices pour les ids
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

    // Soumettre le formulaire
    async onSubmit() {
      // Marquer tous les champs comme touchés
      this.markFormGroupTouched(this.companyForm);
    
      if (!this.companyForm.valid) {
        await Swal.fire({
          title: 'Information manquante',
          text: 'Veuillez remplir tous les champs requis',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6'
        });
        return;
      }
    
      const formData = this.companyForm.value;
      const convertedData = this.convertToIndices(formData);
    
      console.log('Données envoyées:', convertedData);
    
      try {
        const response = await this.companyService.addCompany(convertedData).toPromise();
        
        console.log('Données enregistrées avec succès', response);
        
        await Swal.fire({
          title: 'Succès!',
          text: 'Données enregistrées avec succès',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6'
        });
    
        // Réinitialiser le formulaire
        this.resetForm();
    
        // Rechargement de la page après 1 seconde
        setTimeout(() => {
          window.location.reload();
        }, 1000);
    
      } catch (error) {
        console.error('Une erreur est survenue !', error);
        
        await Swal.fire({
          title: 'Erreur!',
          text: "Erreur lors de l'enregistrement des données. Veuillez réessayer.",
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#d33'
        });
      }
    }
    resetForm() {
      this.companyForm.reset(); // Réinitialise tous les champs du formulaire
      this.selectedStatutsFileName = ''; // Réinitialise le nom du fichier sélectionné pour les statuts
      this.selectedDossierFileNames = []; // Réinitialise le tableau des noms de fichiers pour le dossier juridique
    }
    // Méthode pour marquer tous les champs du formulaire comme touchés
    markFormGroupTouched(formGroup: FormGroup) {
      Object.values(formGroup.controls).forEach((control) => {
        control.markAsTouched();

        if (control instanceof FormGroup) {
          this.markFormGroupTouched(control);
        }
      });
    }

    // Passer à l'étape suivante
    nextStep() {
      const currentStepControls = this.getCurrentStepControls();

      if (this.isStepValid(currentStepControls)) {
        this.stepper.next();
      } else {
        this.snackBar.open(
          'Please fill in all required fields before proceeding.',
          'Close',
          {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
          }
        );
      }
    }

    // Revenir à l'étape précédente
    previousStep() {
      this.stepper.previous();
    }

    // Vérifier les champs de chaque étape
    private getCurrentStepControls(): string[] {
      switch (this.stepper.selectedIndex) {
        case 0:
          return [
            'exIdentifiant',
            'raisonSociale',
            'raisonSocialeAr',
            'siegeSocial',
            'siegeSocialAr',
          ];
        case 1:
          return ['idPays', 'IdGouvernorat', 'MF'];
        case 2:
          return [
            'dateCreation',
            'dateDossier',
            'IdFormeJuridique',
            'IdTypeProjet',
            'status',
          ];
        case 3:
          return ['objet', 'objetAr', 'IdSecteurEconomique'];
        case 4:
          return ['Telephone', 'Email'];
        case 5:
          return [
            'IdNatureProjet',
            'idTypeManagement',
            'identifiantSTB',
            'IdTypeIdentifiant',
            'idTypeEntreprise',
            'idParametreRSM620',
            'idParametreRNLPA870',
          ];
        default:
          return [];
      }
    }

    // Vérification de la validité des champs
    private isStepValid(controls: string[]): boolean {
      return controls.every((control) => this.companyForm.get(control)?.valid);
    }
  }
