import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ReunionService } from '../../services/reunion.service';
import { CompanyService } from '../../services/company.service';

interface Projet {
  idProjet: number;
  raisonSociale: string;
}

interface TypeReunion {
  idTypeReunion: number;
  libelleTypereunion: string;
}

interface SuiviReunion {
  idProjet: number;
  idReunion: number;
  tenueReunion: string;
  motifRemplacement: string;
  tenueMotifAnnulation: string;
  observation: string;
  dateRapellePremCR: string;
  dateRapelleDeuxCR: string;
  docCR: string;
  docCRBase64?: string;
  dateRapellePremPV: string;
  dateRapelleDeuxPV: string;
  docPV: string;
  docPVBase64?: string;
  autreDoc: string;
  autreDocBase64?: string;
}

@Component({
  selector: 'app-creation-reunion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './creation-reunion.component.html',
  styleUrls: ['./creation-reunion.component.css']
})
export class CreationReunionComponent implements OnInit {
  meetingForm: FormGroup;
  companies: Projet[] = [];
  meetingTypes: TypeReunion[] = [];
  selectedFile: File | null = null;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private reunionService: ReunionService,
    private companyService: CompanyService
  ) {
    this.meetingForm = this.fb.group({
      societe: ['', Validators.required],
      dateReunion: ['', Validators.required],
      typeReunion: ['', Validators.required],
      ordreDuJour: ['', Validators.required],
      convocation: ['', Validators.required],
      heureReunion: ['', Validators.required],
      lieuReunion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
    this.loadMeetingTypes();
  }

  loadCompanies(): void {
    this.companyService.getCompanies().subscribe({
      next: (data: Projet[]) => {
        this.companies = data;
        console.log('Sociétés chargées:', this.companies);
      },
      error: (err) => {
        Swal.fire({
          title: 'Erreur',
          text: 'Erreur lors du chargement des sociétés.',
          icon: 'error',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  loadMeetingTypes(): void {
    this.reunionService.getAllTypeReunion().subscribe({
      next: (data: TypeReunion[]) => {
        this.meetingTypes = data;
        console.log('Types de réunion chargés:', this.meetingTypes);
        const caType = this.meetingTypes.find(t => t.libelleTypereunion === 'CA');
        if (!caType) {
          console.warn('Type "CA" non trouvé dans les données');
          Swal.fire({
            title: 'Erreur',
            text: 'Type de réunion "CA" non disponible.',
            icon: 'error',
            confirmButtonColor: '#d33'
          });
        } else {
          console.log('Type CA:', caType);
        }
      },
      error: (err) => {
        console.error('Erreur chargement types réunion:', err);
        Swal.fire({
          title: 'Erreur',
          text: 'Erreur lors du chargement des types de réunion.',
          icon: 'error',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.meetingForm.patchValue({ convocation: file.name });
      this.meetingForm.get('convocation')?.markAsTouched();

      if (file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.showFilePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  showFilePreview(src: string): void {
    Swal.fire({
      title: 'Aperçu du fichier',
      imageUrl: src,
      imageAlt: 'Aperçu du fichier',
      showConfirmButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#3085d6'
    });
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;

    if (this.meetingForm.invalid) {
      Object.keys(this.meetingForm.controls).forEach(field => {
        const control = this.meetingForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      Swal.fire({
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs obligatoires correctement.',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
      return;
    }

    const formValue = this.meetingForm.value;
    console.log('Form values:', formValue);

    const selectedCompany = this.companies.find(c => c.raisonSociale === formValue.societe);
    const selectedTypeReunion = this.meetingTypes.find(t => t.libelleTypereunion === formValue.typeReunion);

    if (!selectedCompany) {
      console.error('Société non trouvée:', formValue.societe);
      Swal.fire({
        title: 'Erreur',
        text: 'Société invalide.',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
      return;
    }

    if (!selectedTypeReunion) {
      console.error('Type de réunion non trouvé:', formValue.typeReunion, 'Meeting types:', this.meetingTypes);
      Swal.fire({
        title: 'Erreur',
        text: 'Type de réunion invalide.',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
      return;
    }

    const reunionData = {
      idProjet: Number(selectedCompany.idProjet),
      idTypeReunion: Number(selectedTypeReunion.idTypeReunion),
      dateReunion: formValue.dateReunion,
      heureReunion: formValue.heureReunion,
      ordre: formValue.ordreDuJour || '',
      convocation: this.selectedFile ? this.selectedFile.name : '',
      convocationBase64: this.selectedFile ? await this.convertFileToBase64(this.selectedFile) : '',
      lieuReunion: formValue.lieuReunion || ''
    };

    console.log('reunionData:', reunionData);

    this.reunionService.createReunion(reunionData).subscribe({
      next: (response: any) => {
        console.log('Réponse createReunion:', response);
        const idReunion = Number(response.idReunion);
        if (!idReunion || isNaN(idReunion)) {
          console.error('idReunion invalide:', response);
          Swal.fire({
            title: 'Erreur',
            text: 'ID de réunion invalide.',
            icon: 'error',
            confirmButtonColor: '#d33'
          });
          return;
        }

        Swal.fire({
          title: 'Succès!',
          text: `La réunion a été créée avec succès. ID de la réunion: ${idReunion}`,
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        }).then(() => {
          this.reunionService.checkRepresentativeExists(selectedCompany.idProjet, idReunion).subscribe({
            next: async (repExists: boolean) => {
              if (repExists) {
                const suiviData: SuiviReunion = {
                  idProjet: Number(selectedCompany.idProjet),
                  idReunion: idReunion,
                  tenueReunion: 'Non',
                  motifRemplacement: '',
                  tenueMotifAnnulation: '',
                  observation: '',
                  dateRapellePremCR: '',
                  dateRapelleDeuxCR: '',
                  docCR: '',
                  docCRBase64: '',
                  dateRapellePremPV: '',
                  dateRapelleDeuxPV: '',
                  docPV: '',
                  docPVBase64: '',
                  autreDoc: '',
                  autreDocBase64: ''
                };

                console.log('suiviData:', suiviData);

                (await this.reunionService.createSuiviReunion(suiviData)).subscribe({
                  next: () => {
                    Swal.fire({
                      title: 'Succès!',
                      text: 'Le suivi de la réunion a été créé avec succès. Un représentant (permanent ou ponctuel) a été trouvé.',
                      icon: 'success',
                      confirmButtonColor: '#3085d6',
                      confirmButtonText: 'OK'
                    }).then(() => {
                      this.meetingForm.reset();
                      this.selectedFile = null;
                      this.submitted = false;
                    });
                  },
                  error: (err: any) => {
                    console.error('Erreur lors de la création du suivi de réunion:', {
                      error: err,
                      status: err.status,
                      message: err.message,
                      response: err.error
                    });

                    let errorMessage: string;
                    if (err.status === 400) {
                      errorMessage = err.error?.message || 'Données invalides. Vérifiez les informations fournies.';
                    } else if (err.status === 500) {
                      errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
                    } else {
                      errorMessage = err.error?.message || err.message || 'Une erreur inconnue s\'est produite.';
                    }

                    Swal.fire({
                      title: 'Erreur',
                      text: `Erreur lors de la création du suivi de réunion : ${errorMessage}`,
                      icon: 'error',
                      confirmButtonColor: '#d33',
                      confirmButtonText: 'OK'
                    });
                  }
                });
              } else {
                const repType = formValue.typeReunion === 'CA' ? 'permanent' : 'ponctuel';
                Swal.fire({
                  title: 'Représentant requis',
                  text: `Aucun représentant ${repType} trouvé pour la société ${selectedCompany.raisonSociale}. Veuillez créer un représentant ${repType} pour continuer.`,
                  icon: 'warning',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK'
                }).then(() => {
                  this.meetingForm.reset();
                  this.selectedFile = null;
                  this.submitted = false;
                });
              }
            },
            error: (err) => {
              console.error('Erreur vérification représentant:', err);
              Swal.fire({
                title: 'Erreur',
                text: 'Erreur lors de la vérification du représentant.',
                icon: 'error',
                confirmButtonColor: '#d33'
              });
            }
          });
        });
      },
      error: (err) => {
        console.error('Erreur création réunion:', err);
        const errorMessage = err.error?.message || err.message || 'Erreur inconnue. Vérifiez les données envoyées.';
        Swal.fire({
          title: 'Erreur',
          text: `Erreur lors de la création de la réunion: ${errorMessage}`,
          icon: 'error',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  private async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          resolve(base64String);
        } else {
          reject(new Error('Failed to convert file to Base64'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsDataURL(file);
    });
  }

  get f() {
    return this.meetingForm.controls;
  }
}
