import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ReunionService } from '../../services/reunion.service';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-saisie-representant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './saisie-representant.component.html',
  styleUrls: ['./saisie-representant.component.css']
})
export class SaisieRepresentantComponent implements OnInit {
  permanentForm: FormGroup;
  ponctuelForm: FormGroup;
  isPermanent: boolean = true;
  societes: any[] = [];
  filteredSocietes: any[] = [];
  employes: any[] = [];
  reunions: any[] = [];
  filteredReunions: any[] = [];
  
  constructor(
    private fb: FormBuilder,
    private reunionService: ReunionService,
    private companyService: CompanyService
  ) {
    // Initialisation des formulaires
    this.permanentForm = this.fb.group({
      societe: ['', Validators.required],
      matricule: ['', Validators.required],
      nomPrenom: ['', Validators.required],
      dateNomination: ['', Validators.required]
    });

    this.ponctuelForm = this.fb.group({
      societe: ['', Validators.required],
      matricule: ['', Validators.required],
      nomPrenom: ['', Validators.required],
      dateNomination: ['', Validators.required],
      dateReunion: ['', Validators.required],
      motif: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadSocietes();
    this.loadUtilisateurRep();
    this.loadReunions();

    // Gestion du changement de société pour filtrer les réunions (ponctuel)
    this.ponctuelForm.get('societe')?.valueChanges.subscribe(societeId => {
      this.filterReunions(societeId ? Number(societeId) : null);
    });

    // Gestion du changement de matricule pour remplir nomPrenom (permanent)
    this.permanentForm.get('matricule')?.valueChanges.subscribe(matricule => {
      this.updateNomPrenom(this.permanentForm, matricule);
    });

    // Gestion du changement de matricule pour remplir nomPrenom (ponctuel)
    this.ponctuelForm.get('matricule')?.valueChanges.subscribe(matricule => {
      this.updateNomPrenom(this.ponctuelForm, matricule);
    });
  }

  loadSocietes(): void {
    this.companyService.getCompanies().subscribe({
      next: (projets) => {
        this.societes = projets.map(projet => ({
          id: projet.idProjet,
          name: projet.raisonSociale
        }));
        // Filter societes after reunions are loaded
        this.filterSocietesWithReunions();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des sociétés:', err);
        Swal.fire('Erreur', 'Erreur lors du chargement des sociétés.', 'error');
      }
    });
  }

  loadUtilisateurRep(): void {
    this.reunionService.getAllUtilisateurRep().subscribe({
      next: (utilisateurs) => {
        this.employes = utilisateurs.map((user: { idUtilisateurRep: any; matricule: any; nomPrenomUtilisateur: string; }) => ({
          idUtilisateurRep: user.idUtilisateurRep,
          matricule: user.matricule,
          nom: user.nomPrenomUtilisateur?.split(' ')[0] || '',
          prenom: user.nomPrenomUtilisateur?.split(' ').slice(1).join(' ') || ''
        }));
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs:', err);
        Swal.fire('Erreur', 'Erreur lors du chargement des utilisateurs.', 'error');
      }
    });
  }

  loadReunions(): void {
    this.reunionService.getAllReunions().subscribe({
      next: (reunions) => {
        this.reunions = reunions.map((reunion: { idReunion: any; dateReunion: any; idProjet: any; typeR: any; }) => ({
          id: reunion.idReunion,
          date: reunion.dateReunion,
          societeId: reunion.idProjet,
          type: reunion.typeR
        }));
        // Filter societes after loading reunions
        this.filterSocietesWithReunions();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des réunions:', err);
        Swal.fire('Erreur', 'Erreur lors du chargement des réunions.', 'error');
      }
    });
  }

  filterSocietesWithReunions(): void {
    if (this.societes.length > 0 && this.reunions.length > 0) {
      const societeIdsWithReunions = new Set(this.reunions.map(reunion => reunion.societeId));
      this.filteredSocietes = this.societes.filter(societe => societeIdsWithReunions.has(societe.id));
    } else {
      this.filteredSocietes = [];
    }
  }

  filterReunions(societeId: number | null): void {
    if (societeId) {
      this.filteredReunions = this.reunions.filter(r => r.societeId === societeId);
    } else {
      this.filteredReunions = [];
    }
    // Reset dateReunion if societe changes to avoid invalid selections
    this.ponctuelForm.get('dateReunion')?.reset();
  }

  updateNomPrenom(form: FormGroup, matricule: string): void {
    const employe = this.employes.find(e => e.matricule === matricule);
    form.patchValue({
      nomPrenom: employe ? `${employe.nom} ${employe.prenom}` : ''
    });
  }

  onSubmit(isPermanent: boolean): void {
    const form = isPermanent ? this.permanentForm : this.ponctuelForm;
    
    if (form.invalid) {
      Object.keys(form.controls).forEach(field => {
        const control = form.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires correctement.', 'error');
      return;
    }

    const formData = form.value;
    const requestData = {
      idProjet: Number(formData.societe),
      idUtilisateurRep: this.employes.find(e => e.matricule === formData.matricule)?.idUtilisateurRep,
      datePouvoir: formData.dateNomination,
      ...(!isPermanent && {
        idReunion: Number(formData.dateReunion),
        motif: formData.motif
      })
    };

    if (!requestData.idUtilisateurRep) {
      Swal.fire('Erreur', 'Utilisateur représentant non trouvé pour le matricule sélectionné.', 'error');
      return;
    }

    const serviceCall = isPermanent 
      ? this.reunionService.createRepPermanent(requestData)
      : this.reunionService.createRepPonctuel(requestData);

    serviceCall.subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Succès!',
          text: `Le représentant ${isPermanent ? 'permanent' : 'ponctuel'} a été enregistré avec succès.`,
          icon: 'success',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        }).then(async () => {
          // Handle suivi-reunion creation
          if (!isPermanent) {
            // For Représentant Ponctuel
            const suiviData = {
              idProjet: requestData.idProjet,
              idReunion: requestData.idReunion,
              tenueReunion: 'Non',
              motifReplacement: '',
              tenueMotifAnnulation: '',
              observation: '',
              dateRapellePremCR: '',
              dateRapelleDeuxCR: '',
              docCR: '',
              dateRapellePremPV: '',
              dateRapelleDeuxPV: '',
              docPV: '',
              autreDoc: ''
            };

            (await this.reunionService.createSuiviReunion(suiviData)).subscribe({
              next: () => {
                Swal.fire({
                  title: 'Succès!',
                  text: 'Le suivi de réunion a été créé avec succès pour le représentant ponctuel.',
                  icon: 'success',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK'
                }).then(() => {
                  form.reset();
                  this.filteredReunions = [];
                });
              },
              error: (err: { message: any; }) => {
                console.error('Erreur création suivi:', err);
                Swal.fire('Erreur', `Erreur lors de la création du suivi de réunion: ${err.message || 'Erreur inconnue'}`, 'error');
              }
            });
          } else {
            // For Représentant Permanent
            this.reunionService.getReunionByProjetAndType(requestData.idProjet, 'CA').subscribe({
              next: async (reunions: any[]) => {
                if (reunions && reunions.length > 0) {
                  const reunion = reunions[0]; // Take the first matching reunion
                  const suiviData = {
                    idProjet: requestData.idProjet,
                    idReunion: reunion.idReunion,
                    tenueReunion: 'Non',
                    motifReplacement: '',
                    tenueMotifAnnulation: '',
                    observation: '',
                    dateRapellePremCR: '',
                    dateRapelleDeuxCR: '',
                    docCR: '',
                    dateRapellePremPV: '',
                    dateRapelleDeuxPV: '',
                    docPV: '',
                    autreDoc: ''
                  };

                  (await this.reunionService.createSuiviReunion(suiviData)).subscribe({
                    next: () => {
                      Swal.fire({
                        title: 'Succès!',
                        text: 'Le suivi de réunion a été créé avec succès pour le représentant permanent.',
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'OK'
                      }).then(() => {
                        form.reset();
                        this.filteredReunions = [];
                      });
                    },
                    error: (err) => {
                      console.error('Erreur création suivi:', err);
                      Swal.fire('Erreur', `Erreur lors de la création du suivi de réunion: ${err.message || 'Erreur inconnue'}`, 'error');
                    }
                  });
                } else {
                  Swal.fire({
                    title: 'Information',
                    text: 'Aucune réunion de type CA trouvée pour ce projet. Aucun suivi de réunion n\'a été créé.',
                    icon: 'info',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                  }).then(() => {
                    form.reset();
                    this.filteredReunions = [];
                  });
                }
              },
              error: (err) => {
                console.error('Erreur lors de la recherche de réunion:', err);
                Swal.fire('Erreur', 'Erreur lors de la recherche de réunion de type CA.', 'error');
              }
            });
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de l\'enregistrement:', err);
        Swal.fire('Erreur', `Une erreur est survenue lors de l'enregistrement: ${err.message || 'Erreur inconnue'}`, 'error');
      }
    });
  }

  onGenerateList(): void {
    const serviceCall = this.isPermanent 
      ? this.reunionService.getAllRepPermanents()
      : this.reunionService.getAllRepPonctuels();

    serviceCall.subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Liste générée',
          text: 'La liste des représentants a été générée avec succès.',
          icon: 'success',
          confirmButtonText: 'Télécharger',
          showCancelButton: true,
          cancelButtonText: 'Fermer'
        }).then((result) => {
          if (result.isConfirmed) {
            this.exportToExcel(data);
          }
        });
      },
      error: (err) => {
        Swal.fire('Erreur', 'Impossible de générer la liste', 'error');
        console.error(err);
      }
    });
  }

  private exportToExcel(data: any[]): void {
    // Implémentation simplifiée de l'exportation Excel
    const csvContent = [
      ['ID Projet', 'ID Utilisateur', 'Date Pouvoir', 'ID Réunion', 'Motif'],
      ...data.map(item => [
        item.idProjet || '',
        item.idUtilisateurRep || '',
        item.datePouvoir || '',
        item.idReunion || '',
        item.motif || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `representants_${this.isPermanent ? 'permanents' : 'ponctuels'}.csv`;
    link.click();
  }
}

export interface Projet {
  idProjet: number;
  raisonSociale: string;
}
