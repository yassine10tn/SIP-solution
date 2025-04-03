import { Component, OnInit } from '@angular/core';
import { CompanyService, Projet, ProjetUpdateDto, Pays, Gouvernorats, FormeJuridique, TypeProjet, SecteurEconomique, NatureProjet, TypeManagement, Devise, TypeIdentifiant, TypeEntreprise, ParametreRSM620, ParametreRNL870 } from '../../services/company.service';
import { FormBuilder, FormGroup, NgModel, ReactiveFormsModule , Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importer FormsModule pour utiliser [(ngModel)]
import Swal from 'sweetalert2';



@Component({
  selector: 'app-societe-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './societe-list.component.html',
  styleUrls: ['./societe-list.component.css'],
})
export class SocieteListComponent implements OnInit {
  societes: Projet[] = []; // Liste des sociétés
  editForm: FormGroup; // Formulaire pour l'édition
  editingSociete: Projet | null = null; // Société en cours d'édition
  editingField: keyof Projet | null = null; // Champ en cours d'édition (typé comme une clé de Projet)
  selectedFile: File | null = null; // Fichier sélectionné pour l'upload
  filteredSocietes: Projet[] = []; // Liste filtrée des sociétés
  searchId: string = ''; // ID saisi pour la recherche

  // Listes déroulantes
  paysList: Pays[] = [];
  gouvernoratsList: Gouvernorats[] = [];
  formeJuridiqueList: FormeJuridique[] = [];
  typeProjetList: TypeProjet[] = [];
  secteurEconomiqueList: SecteurEconomique[] = [];
  natureProjetList: NatureProjet[] = [];
  typeManagementList: TypeManagement[] = [];
  deviseList: Devise[] = [];
  typeIdentifiantList: TypeIdentifiant[] = [];
  typeEntrepriseList: TypeEntreprise[] = [];
  parametreRSM620List: ParametreRSM620[] = [];
  parametreRNL870List: ParametreRNL870[] = [];

  constructor(private companyService: CompanyService, private fb: FormBuilder, 
    private cdr: ChangeDetectorRef // Ajoutez ceci
  ) {
    // Initialiser le formulaire
    this.editForm = this.fb.group({
      newValue: [''], // Champ pour la nouvelle valeur
      file: [null], // Champ pour le fichier

    });
  }

  ngOnInit() {
    this.getCompanies(); // Charger les sociétés
    this.loadDropdowns(); // Charger les listes déroulantes

    
  }

  // Récupérer toutes les sociétés
  getCompanies(): void {
    this.companyService.getCompanies().subscribe(
      (data: Projet[]) => {
        this.societes = data;
        this.filteredSocietes = data; // Initialisez filteredSocietes avec les données récupérées
        console.log('Sociétés récupérées :', this.societes);
      },
      (error) => {
        console.error('Erreur lors de la récupération des sociétés:', error);
      }
    );
  }

  // Méthode pour supprimer une société
  deleteSociete(id: number): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir supprimer ce projet ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.companyService.deleteCompany(id).subscribe(
          (response) => {
            Swal.fire(
              'Supprimé!',
              'Le projet a été supprimé avec succès.',
              'success'
            );
            this.getCompanies();
          },
          (error) => {
            Swal.fire(
              'Erreur!',
              'Une erreur est survenue lors de la suppression.',
              'error'
            );
            console.error('Erreur lors de la suppression du projet :', error);
          }
        );
      }
    });
  }
   // Méthode pour rechercher une société par ID
   searchById(): void {
    console.log('Search ID:', this.searchId); // Vérifiez que ce log apparaît
    if (this.searchId) {
      this.filteredSocietes = this.societes.filter(societe =>
        societe.idProjet.toString().includes(this.searchId)
      );
    } else {
      this.filteredSocietes = this.societes; // Si aucun ID n'est saisi, afficher toutes les sociétés
    }
  }

  // Charger les listes déroulantes
  loadDropdowns(): void {
    this.companyService.getPays().subscribe((data) => (this.paysList = data));
    this.companyService.getGouvernorats().subscribe((data) => (this.gouvernoratsList = data));
    this.companyService.getFormeJuridique().subscribe((data) => (this.formeJuridiqueList = data));
    this.companyService.getTypeProjet().subscribe((data) => (this.typeProjetList = data));
    this.companyService.getSecteurEconomique().subscribe((data) => (this.secteurEconomiqueList = data));
    this.companyService.getNatureProjet().subscribe((data) => (this.natureProjetList = data));
    this.companyService.getTypeManagement().subscribe((data) => (this.typeManagementList = data));
    this.companyService.getDevise().subscribe((data) => (this.deviseList = data));
    this.companyService.getTypeIdentifiant().subscribe((data) => (this.typeIdentifiantList = data));
    this.companyService.getTypeEntreprise().subscribe((data) => (this.typeEntrepriseList = data));
    this.companyService.getParametreRSM620().subscribe((data) => (this.parametreRSM620List = data));
    this.companyService.getParametreRNL870().subscribe((data) => (this.parametreRNL870List = data));
  }

  // Activer le mode édition pour un champ
  enableEdit(societe: Projet, field: keyof Projet): void {
    this.editingSociete = societe;
    this.editingField = field;
    this.editForm.patchValue({
      newValue: societe[field], // Pré-remplir le formulaire avec la valeur actuelle
    });
    this.selectedFile = null; // Réinitialiser le fichier sélectionné
  }

  // Annuler l'édition
  cancelEdit(): void {
    this.editingSociete = null;
    this.editingField = null;
    this.selectedFile = null; // Réinitialiser le fichier sélectionné
  }

  // Convertir un fichier en base64
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  
 // Sauvegarder les modifications
 async saveEdit(societe: Projet): Promise<void> {
  const field = this.editingField as keyof Projet;

  if (!field) {
    return;
  }
  


  if (field === 'status' || field === 'dossierJuridique') {
    if (this.selectedFile) {
      try {
        const base64 = await this.fileToBase64(this.selectedFile);
        const updateData: ProjetUpdateDto = {
          [field]: base64.split(',')[1], // Enlever le préfixe "data:application/pdf;base64,"
        };

        this.companyService.updateCompany(societe.idProjet, updateData).subscribe(
          (response) => {
            console.log('Mise à jour réussie :', response);

            // Créer un nouvel objet avec les modifications
            const updatedSociete = { ...societe, [field]: base64.split(',')[1] };

            // Remplacer l'ancien objet par le nouvel objet dans la liste
            const index = this.societes.findIndex(s => s.idProjet === societe.idProjet);
            if (index !== -1) {
              this.societes = [
                ...this.societes.slice(0, index),
                updatedSociete,
                ...this.societes.slice(index + 1),
              ];
            }

            this.cancelEdit();
          },
          (error) => {
            console.error('Erreur lors de la mise à jour :', error);
          }
        );
      } catch (error) {
        console.error('Erreur lors de la conversion du fichier en base64 :', error);
      }
    }
  } else {
    const newValue = this.editForm.value.newValue;
    const updateData: ProjetUpdateDto = {
      [field]: newValue,
    };

    this.companyService.updateCompany(societe.idProjet, updateData).subscribe(
      (response) => {
        console.log('Mise à jour réussie :', response);
        console.log('Nouvelle valeur :', newValue);
        
        console.log('Liste des pays :', this.paysList);
        console.log('Société mise à jour :', societe);

        // Mettre à jour le libellé correspondant si nécessaire
        if (field === 'idPays') {
          const selectedPays = this.paysList.find(pays => pays.id === newValue);
          societe.libellePays = selectedPays ? selectedPays.nom : null;
          console.log('Libellé correspondant :', societe.libellePays);
        } else if (field === 'idGouvernorat') {
          const selectedGouvernorat = this.gouvernoratsList.find(gouv => gouv.id === newValue);
          societe.libelleGouvernorat = selectedGouvernorat ? selectedGouvernorat.nom : null;
        } else if (field === 'idFormeJuridique') {
          const selectedFormeJuridique = this.formeJuridiqueList.find(fj => fj.id === newValue);
          societe.libelleFormeJuridique = selectedFormeJuridique ? selectedFormeJuridique.nom : null;
        } else if (field === 'idSecteurEconomique') {
          const selectedSecteurEconomique = this.secteurEconomiqueList.find(se => se.id === newValue);
          societe.libelleSecteurEconomique = selectedSecteurEconomique ? selectedSecteurEconomique.nom : null;
        } else if (field === 'idNatureProjet') {
          const selectedNatureProjet = this.natureProjetList.find(np => np.id === newValue);
          societe.libelleNatureProjet = selectedNatureProjet ? selectedNatureProjet.nom : null;
        } else if (field === 'idTypeManagement') {
          const selectedTypeManagement = this.typeManagementList.find(tm => tm.id === newValue);
          societe.libelleTypeManagement = selectedTypeManagement ? selectedTypeManagement.nom : null;
        } else if (field === 'idDevise') {
          const selectedDevise = this.deviseList.find(dev => dev.id === newValue);
          societe.libelleDevise = selectedDevise ? selectedDevise.nom : null;
        } else if (field === 'idTypeIdentifiant') {
          const selectedTypeIdentifiant = this.typeIdentifiantList.find(ti => ti.id === newValue);
          societe.libelleTypeIdentifiant = selectedTypeIdentifiant ? selectedTypeIdentifiant.nom : null;
        } else if (field === 'idTypeEntreprise') {
          const selectedTypeEntreprise = this.typeEntrepriseList.find(te => te.id === newValue);
          societe.libelleTypeEntreprise = selectedTypeEntreprise ? selectedTypeEntreprise.nom : null;
        } else if (field === 'idTypeProjet') {
          const selectedTypeProjet = this.typeProjetList.find(tp => tp.id === newValue);
          societe.libelleTypeProjet = selectedTypeProjet ? selectedTypeProjet.nom : null;
        } else if (field === 'idParametreRSM620') {
          const selectedParametreRSM620 = this.parametreRSM620List.find(prsm => prsm.id === newValue);
          societe.libelleParametreRSM620 = selectedParametreRSM620 ? selectedParametreRSM620.nom : null;
        } else if (field === 'idParametreRNLPA870') {
          const selectedParametreRNL870 = this.parametreRNL870List.find(prnl => prnl.id === newValue);
          societe.libelleParametreRNLPA870 = selectedParametreRNL870 ? selectedParametreRNL870.nom : null;
        }
        //zeyda
        this.getCompanies();
        // Créer un nouvel objet avec les modifications
        const updatedSociete = { ...societe, [field]: newValue };

        // Remplacer l'ancien objet par le nouvel objet dans la liste
        const index = this.societes.findIndex(s => s.idProjet === societe.idProjet);
        if (index !== -1) {
          this.societes[index] = { ...societe, [field]: newValue };
        }

        this.cancelEdit();
      },
      (error) => {
        console.error('Erreur lors de la mise à jour :', error);
      }
    );
  }
}


  // Gérer la sélection de fichier
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.selectedFile = file;
  }

  // Fonction générique pour mettre à jour un champ
  updateSocieteField<T extends keyof Projet>(societe: Projet, field: T, newValue: Projet[T]): void {
    societe[field] = newValue; // Pas d'erreur grâce au type générique
  }

  // Télécharger un PDF
  downloadPdf(base64Data: string | null, fileName: string): void {
    if (!base64Data) {
      console.error('No PDF data available.');
      return;
    }

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
