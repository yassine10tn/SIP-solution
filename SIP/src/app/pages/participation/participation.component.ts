import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CompanyService, Projet, TypeSouscription } from '../../services/company.service';
import Swal from 'sweetalert2';
import { ActionnaireService } from '../../services/actionnaire.service';

// Validateur personnalisé pour date minimale
function minDateValidator(minDate: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null; // Laisser Validators.required gérer le cas vide
    const inputDate = new Date(control.value);
    return inputDate >= minDate ? null : { minDate: { min: minDate, actual: control.value } };
  };
}

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
  liberationForm: FormGroup;
  actionnairesForm: FormGroup;
  shareholdersForm: FormGroup;
  showSouscriptionTable = false;

  selectedFileSouscription: File | null = null;
  selectedFileBase64: string | null = null;
  selectedSocieteId: number | null = null;
  souscriptionData: any = null;
  liberationData: any[] = [];
  montantSouscrit: number = 0;
  montantLibere: number = 0;
  montantEnCours: number = 0;
  montantRestantALiberer: number = 0;

  societes: Projet[] = [];
  typesSouscription: TypeSouscription[] = [];
  nationalites: any[] = [];
  naturesActionnaire: any[] = [];
  typesActionnaire: any[] = [];

  actionnairesList: any[] = []; // Liste des actionnaires (STB + standards)

  constructor(private fb: FormBuilder, private companyService: CompanyService, private actionnaireService: ActionnaireService) {
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
      montantTotal: [0, Validators.required],
      signataire: ['', Validators.required],
      fonction: ['', Validators.required],
      copieOrdreVente: [null] // Removed Validators.required as per specifications
    });

    this.liberationForm = this.fb.group({
      societe: ['', Validators.required],
      dateLiberation: ['', [Validators.required, minDateValidator(new Date(2000, 0, 1))]],
      pourcentageLiberation: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      montant: [{ value: '', disabled: true }],
      rib: ['', [Validators.required, Validators.pattern(/^\d{20}$/)]]
    });

    this.actionnairesForm = this.fb.group({
      societe: ['', Validators.required],
      nombreActions: [0, [Validators.required, Validators.min(1)]],
      montantNominal: [0, [Validators.required, Validators.min(0.001)]],
      capitalSociete: [{ value: 0, disabled: false }, Validators.required]
    });

    this.shareholdersForm = this.fb.group({
      societe: ['', Validators.required],
      dateOperation: ['', Validators.required],
      raisonSociale: ['', Validators.required],
      typeShareholder: ['', Validators.required],
      nationalite: ['', Validators.required],
      nature: ['', Validators.required],
      nombreActionShareholder: [0, [Validators.required, Validators.min(1)]]
    });

    // Bind calculation method to quantity and unit price changes
    this.participationForm.get('quantite')?.valueChanges.subscribe(() => this.calculerMontantTotal());
    this.participationForm.get('prixUnitaire')?.valueChanges.subscribe(() => this.calculerMontantTotal());

    this.achatForm.get('quantite')?.valueChanges.subscribe(() => this.calculerMontantTotalAchat());
    this.achatForm.get('prixUnitaire')?.valueChanges.subscribe(() => this.calculerMontantTotalAchat());

    this.venteForm.get('quantite')?.valueChanges.subscribe(() => this.calculerMontantTotalVente());
    this.venteForm.get('prixUnitaire')?.valueChanges.subscribe(() => this.calculerMontantTotalVente());
    this.liberationForm.get('pourcentageLiberation')?.valueChanges.subscribe(() => {
      this.calculerMontantLiberation();
    });
  }

  ngOnInit(): void {
    this.loadSocietes();
    this.loadTypesSouscription();
    this.loadNationalites();
    this.loadNaturesActionnaire();
    this.loadTypesActionnaire();
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
  loadNationalites(): void {
    this.actionnaireService.getNationalites().subscribe({
      next: (data) => {
        this.nationalites = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des nationalités', error);
      }
    });
  }

  loadNaturesActionnaire(): void {
    this.actionnaireService.getNaturesActionnaire().subscribe({
      next: (data) => {
        this.naturesActionnaire = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des natures d\'actionnaire', error);
      }
    });
  }

  loadTypesActionnaire(): void {
    this.actionnaireService.getTypesActionnaire().subscribe({
      next: (data) => {
        this.typesActionnaire = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des types d\'actionnaire', error);
      }
    });
  }

  calculerCapital(): void {
    const nombreActions = this.actionnairesForm.get('nombreActions')?.value;
    const montantNominal = this.actionnairesForm.get('montantNominal')?.value;
    
    if (nombreActions && montantNominal) {
      const capital = nombreActions * montantNominal;
      this.actionnairesForm.get('capitalSociete')?.setValue(capital.toFixed(3));
    } else {
      this.actionnairesForm.get('capitalSociete')?.setValue(0);
    }
  }

  onSocieteChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedSocieteId = Number(selectElement.value);
    this.liberationForm.get('societe')?.setValue(this.selectedSocieteId);
  
    if (this.selectedSocieteId) {
      this.loadSouscriptionData(this.selectedSocieteId);
      this.loadLiberationData(this.selectedSocieteId);
      this.loadActionnaires(this.selectedSocieteId); // Charger les actionnaires
    } else {
      this.resetLiberationData();
      this.actionnairesList = []; // Réinitialiser la liste des actionnaires
    }
  }

  loadSouscriptionData(idProjet: number): void {
    this.companyService.getSouscriptionByProjet(idProjet).subscribe(
      (data) => {
        this.souscriptionData = data;
        if (Array.isArray(data)) {
          this.montantSouscrit = data.reduce((sum: number, sous: any) => sum + sous.montantTotal, 0);
        } else {
          this.montantSouscrit = data?.montantTotal || 0;
        }
        this.calculerMontantRestant();
        this.calculerMontantLiberation();
      },
      (error) => {
        console.error('Erreur lors du chargement des données de souscription', error);
        this.resetLiberationData();
      }
    );
  }

  loadLiberationData(idProjet: number): void {
    this.companyService.getLiberationsByProjet(idProjet).subscribe(
      (data) => {
        this.liberationData = data;
        this.montantLibere = data.reduce((sum: number, lib: any) => sum + lib.montant, 0);
        this.calculerMontantRestant();
      },
      (error) => {
        console.error('Erreur lors du chargement des données de libération', error);
        this.montantLibere = 0;
        this.calculerMontantRestant();
      }
    );
  }

  calculerMontantRestant(): void {
    this.montantRestantALiberer = this.montantSouscrit - (this.montantLibere + this.montantEnCours);
  }

  resetLiberationData(): void {
    this.souscriptionData = null;
    this.liberationData = [];
    this.montantSouscrit = 0;
    this.montantLibere = 0;
    this.montantEnCours = 0;
    this.montantRestantALiberer = 0;
    this.liberationForm.get('montant')?.setValue('');
  }

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

  navigateToHome() {
    window.location.href = '/home';
  }

  toggleAccordion(section: string) {
    this.isAccordionOpen = this.isAccordionOpen === section ? null : section;
  }

  async onSubmitSouscription() {
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

  async onSubmitAchat() {
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
    this.markFormGroupTouched(this.venteForm);
  
    console.log('Formulaire valide ?', this.venteForm.valid);
    console.log('État du formulaire :', this.venteForm.value);
    console.log('Erreurs du formulaire :', this.venteForm.errors);
    Object.keys(this.venteForm.controls).forEach(key => {
      const control = this.venteForm.get(key);
      console.log(`${key} valide ?`, control?.valid, 'Valeur :', control?.value, 'Erreurs :', control?.errors);
    });
  
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
      CopieOrdreVente: this.selectedFileBase64 || null // Optional field
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

  async onSubmitLiberation() {
    this.markFormGroupTouched(this.liberationForm);
    console.log('Formulaire valide ?', this.liberationForm.valid);
    console.log('État du formulaire :', this.liberationForm.value);
    console.log('Erreurs du formulaire :', this.liberationForm.errors);
    Object.keys(this.liberationForm.controls).forEach(key => {
      const control = this.liberationForm.get(key);
      console.log(`${key} valide ?`, control?.valid, 'Valeur :', control?.value, 'Erreurs :', control?.errors);
    });
    if (!this.liberationForm.valid) {
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
      idProjet: Number(this.liberationForm.get('societe')?.value),
      dateLiberation: this.liberationForm.get('dateLiberation')?.value,
      pourcentageLiberation: Number(this.liberationForm.get('pourcentageLiberation')?.value) / 100,
      montant: Number(this.liberationForm.get('montant')?.value) || 0,
      rib: this.liberationForm.get('rib')?.value
    };
    console.log('Données envoyées à l\'API :', formData);
    this.companyService.postLiberation(formData).subscribe(
      async (response) => {
        await Swal.fire({
          title: 'Succès!',
          text: 'Libération enregistrée avec succès',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6'
        });
        
        if (this.selectedSocieteId) {
          this.loadLiberationData(this.selectedSocieteId);
        }
        this.montantEnCours = 0;
        this.liberationForm.reset({ societe: this.selectedSocieteId, montant: { value: '', disabled: true } });
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

  async onSubmitActionnaires() {
    this.markFormGroupTouched(this.actionnairesForm);
  
    if (!this.actionnairesForm.valid) {
      await Swal.fire({
        title: 'Information manquante',
        text: 'Veuillez remplir tous les champs requis',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
  
    const capitalData = {
      IdProjet: Number(this.actionnairesForm.get('societe')?.value),
      NombreActions: Number(this.actionnairesForm.get('nombreActions')?.value),
      MontantNominalAction: Number(this.actionnairesForm.get('montantNominal')?.value)
    };
  
    this.actionnaireService.addCapital(capitalData).subscribe({
      next: async (response) => {
        const actionnaireSTBData = {
          idProjet: capitalData.IdProjet
        };
  
        this.actionnaireService.addActionnaireSTB(actionnaireSTBData).subscribe({
          next: async (stbResponse) => {
            this.loadActionnaires(capitalData.IdProjet);
            this.showSouscriptionTable = true;
  
            await Swal.fire({
              title: 'Succès!',
              text: 'Capital et actionnaire STB enregistrés avec succès',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#3085d6'
            });
  
            this.actionnairesForm.reset();
          },
          error: async (error) => {
            await Swal.fire({
              title: 'Erreur!',
              text: 'Erreur lors de l\'enregistrement de l\'actionnaire STB',
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#d33'
            });
          }
        });
      },
      error: async (error) => {
        await Swal.fire({
          title: 'Erreur!',
          text: 'Erreur lors de l\'enregistrement du capital',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  loadActionnaires(idProjet: number): void {
    this.actionnaireService.getAllActionnairesByProjet(idProjet).subscribe({
      next: (data) => {
        this.actionnairesList = data.actionnaires; // Stocke les actionnaires
        console.log('Actionnaires chargés:', this.actionnairesList);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des actionnaires', error);
        Swal.fire({
          title: 'Erreur!',
          text: 'Impossible de charger les actionnaires',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  async onSubmitShareholders() {
    this.markFormGroupTouched(this.shareholdersForm);
  
    if (!this.shareholdersForm.valid) {
      await Swal.fire({
        title: 'Information manquante',
        text: 'Veuillez remplir tous les champs requis pour l\'actionnaire',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
  
    const actionnaireData = {
      idProjet: Number(this.shareholdersForm.get('societe')?.value),
      Nature_ID: Number(this.shareholdersForm.get('typeShareholder')?.value) || null,
      idNationalite: Number(this.shareholdersForm.get('nationalite')?.value) || null,
      idNatureActionnaire: Number(this.shareholdersForm.get('nature')?.value) || null,
      NombredactionActionnaire: Number(this.shareholdersForm.get('nombreActionShareholder')?.value),
      RaisonSociale: this.shareholdersForm.get('raisonSociale')?.value
    };
  
    console.log('Données envoyées à l\'API add_Actionnaire:', actionnaireData);
  
    this.actionnaireService.addActionnaire(actionnaireData).subscribe({
      next: async (response) => {
        this.loadActionnaires(actionnaireData.idProjet);
        this.showSouscriptionTable = true;
  
        await Swal.fire({
          title: 'Succès!',
          text: 'Actionnaire enregistré avec succès',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6'
        });
  
        this.shareholdersForm.reset();
      },
      error: async (error) => {
        console.error('Erreur API:', error);
        const errorMessage = error.error?.message || 'Erreur lors de l\'enregistrement de l\'actionnaire';
        await Swal.fire({
          title: 'Erreur!',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onFileChange(event: any, controlName: string) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.selectedFileNameSouscription = file.name;
      
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        this.selectedFileBase64 = base64Data;

        if (controlName === 'copieBulletin') {
          this.participationForm.get(controlName)?.setValue(base64Data);
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.error('Aucun fichier sélectionné');
    }
  }

  onFileChangeOrdreAchat(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.selectedFileNameOrdreAchat = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        this.selectedFileBase64 = base64Data;
        this.achatForm.get('copieOrdreAchat')?.setValue(base64Data);
      };
      reader.readAsDataURL(file);
    } else {
      console.error('Aucun fichier sélectionné');
    }
  }

  downloadBulletin(souscription: any) {
    if (!souscription.copieBulletin) return;
  
    const link = document.createElement('a');
    link.href = 'data:application/pdf;base64,' + souscription.copieBulletin;
    link.download = `bulletin_souscription_${souscription.idProjet}_${souscription.dateSouscription}.pdf`;
    link.click();
  }

  calculerMontantTotal() {
    const quantite = this.participationForm.get('quantite')?.value;
    const prixUnitaire = this.participationForm.get('prixUnitaire')?.value;
    this.participationForm.get('montantTotal')?.setValue(quantite * prixUnitaire);
  }

  calculerMontantTotalAchat() {
    const quantite = this.achatForm.get('quantite')?.value;
    const prixUnitaire = this.achatForm.get('prixUnitaire')?.value;
    this.achatForm.get('montantTotal')?.setValue(quantite * prixUnitaire);
  }

  calculerMontantTotalVente() {
    const quantite = this.venteForm.get('quantite')?.value;
    const prixUnitaire = this.venteForm.get('prixUnitaire')?.value;
    const montantTotal = quantite && prixUnitaire ? (quantite * prixUnitaire).toFixed(3) : 0;
    this.venteForm.get('montantTotal')?.setValue(montantTotal);
  }

  calculerMontantLiberation(): void {
    const pourcentage = this.liberationForm.get('pourcentageLiberation')?.value;
    if (pourcentage !== null && pourcentage !== undefined && this.montantSouscrit) {
      const montant = (pourcentage / 100) * this.montantSouscrit;
      this.liberationForm.get('montant')?.setValue(montant.toFixed(3));
      this.montantEnCours = Number(montant.toFixed(3));
      this.calculerMontantRestant();
    } else {
      this.liberationForm.get('montant')?.setValue('');
      this.montantEnCours = 0;
      this.calculerMontantRestant();
    }
  }
}
