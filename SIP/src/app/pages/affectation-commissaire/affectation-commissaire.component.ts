import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Commissaire, Projet, CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-affectation-commissaire',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './affectation-commissaire.component.html',
  styleUrls: ['./affectation-commissaire.component.css']
})
export class AffectationCommissaireComponent {
  formData = {
    societe: '',
    societeId: null as number | null, // Ajouté pour stocker l'ID de la société
  cabinet: '',
  commissaire: '', // Gardé pour l'affichage
  commissaireId: null, // Ajouté pour stocker l'ID
  mandat: '',
  dateAffectation: '',
  observation: '',
  numeroMandat: ''
  };
  
  projets: Projet[] = []; // Liste complète des projets
  raisonsSociales: string[] = []; // Liste des raisons sociales
  commissaires: Commissaire[] = [];

  formSubmitted = false;

  constructor(private companyService: CompanyService) {} // Injectez le service

  ngOnInit(): void {
    this.loadProjets();
    this.loadCommissaires();
  }

  loadProjets(): void {
    this.companyService.getCompanies().subscribe({
      next: (data: any[]) => {
        this.projets = data;
        console.log('[DEBUG] Liste des projets chargée:', this.projets);
        this.raisonsSociales = data.map(projet => projet.raisonSociale);
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des projets', err);
      }
    });
  }

  loadCommissaires(): void {
    this.companyService.getCommissaires().subscribe({
      next: (data: Commissaire[]) => {
        this.commissaires = data;
        console.log('Données chargées:', this.commissaires); // <-- Ajoutez ceci
      },
      error: (err) => console.error(err)
    });
  }

  onCommissaireChange(): void {
    console.log('Valeur sélectionnée:', this.formData.commissaireId);
    console.log('Liste des commissaires:', this.commissaires);
  
    if (!this.formData.commissaireId) {
      this.formData.cabinet = '';
      return;
    }
  

   
    // Notez le changement de cac_ID à caC_ID
    const selectedCommissaire = this.commissaires.find(c => c.caC_ID === this.formData.commissaireId);
  
    if (selectedCommissaire) {
      this.formData.cabinet = selectedCommissaire.cabinet_Nom;
      console.log('Cabinet trouvé:', this.formData.cabinet);
    } else {
      console.warn('Aucun commissaire trouvé pour ID:', this.formData.commissaireId);
      this.formData.cabinet = '';
    }
  }
  
  onSocieteChange(): void {
    console.log('ID sélectionné (type:', typeof this.formData.societeId, '):', this.formData.societeId);
    
    if (this.formData.societeId !== null) {
      const selectedProjet = this.projets.find(p => p.idProjet === this.formData.societeId);
      
      if (selectedProjet) {
        this.formData.societe = selectedProjet.raisonSociale;
        console.log('Société sélectionnée:', {
          id: selectedProjet.idProjet,
          nom: selectedProjet.raisonSociale
        });
      } else {
        console.warn('Aucun projet trouvé pour ID:', this.formData.societeId);
        this.formData.societe = '';
      }
    } else {
      console.log('Aucune société sélectionnée (valeur null)');
      this.formData.societe = '';
    }
  }


  checkFieldValidity(field: any) {
    field.control?.markAsTouched();
    field.control?.markAsDirty();
    field.control?.updateValueAndValidity();
  }

  onSubmit() {
    this.formSubmitted = true;
  
    if (this.isFormValid()) {
      // Préparer les données pour l'envoi
      const affectationData = {
        idProjet: Number(this.formData.societeId),
        cac_ID: Number(this.formData.commissaireId),
        mandat: this.formData.mandat,
        dateAffectation: this.formData.dateAffectation,
        observation: this.formData.observation,
        numeroMandat: Number(this.formData.numeroMandat)
      };
  
      console.log('Données à envoyer:', affectationData);
  
      this.companyService.addAffectationCAC(affectationData).subscribe({
        next: (response) => {
          console.log('Réponse du serveur:', response);
          Swal.fire({
            title: 'Succès!',
            text: 'L\'affectation a été enregistrée avec succès',
            icon: 'success',
            confirmButtonText: 'OK',
            allowOutsideClick: false
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        },
        error: (err) => {
          console.error('Erreur lors de l\'enregistrement:', err);
          Swal.fire({
            title: 'Erreur',
            text: 'Une erreur est survenue lors de l\'enregistrement',
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

  isFormValid(): boolean {
    return this.formData.societeId !== null && 
           this.formData.cabinet.trim() !== '' && 
           this.formData.commissaireId !== null && 
           this.formData.mandat.trim() !== '' && 
           this.formData.dateAffectation.trim() !== '' && 
           this.formData.numeroMandat!== null;
  }
}