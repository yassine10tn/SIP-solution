import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ReunionService } from '../../services/reunion.service';
import { CompanyService } from '../../services/company.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-suivi-reunion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './suivi-reunion.component.html',
  styleUrls: ['./suivi-reunion.component.css']
})
export class SuiviReunionComponent implements OnInit {
  companies: Projet[] = [];
  selectedResultSociete: string = '';
  selectedProjetId: number | null = null;
  tenueMeetings: any[] = [];
  suiviMeetings: any[] = [];
  filteredTenueMeetings: any[] = [];
  filteredSuiviMeetings: any[] = [];
  loading = false;

  // Stocker les valeurs originales avant modification
  originalValues: { [key: string]: any } = {};

  constructor(
    private reunionService: ReunionService,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
    this.loadSuiviReunions();
  }

  loadCompanies(): void {
    this.loading = true;
    this.companyService.getCompanies().subscribe({
      next: (data: Projet[]) => {
        this.companies = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.showError('Erreur lors du chargement des sociétés');
      }
    });
  }

  loadSuiviReunions(): void {
    this.loading = true;
    this.reunionService.getAllSuiviReunions().subscribe({
      next: (data: any[]) => {
        console.log('Données brutes reçues du service:', data);
        this.suiviMeetings = data.map(meeting => ({
          ...meeting,
          docPVBase64: meeting.docPV,
          docCRBase64: meeting.docCR,
          autreDocBase64: meeting.autreDoc,
          documentAJoindreCR: null,
          documentAJoindrePV: null,
          autreDocument: null,
          datePremierRappelCR: meeting.dateRapellePremCR,
          dateDeuxiemeRappelCR: meeting.dateRapelleDeuxCR,
          datePremierRappelPV: meeting.dateRapellePremPV,
          dateDeuxiemeRappelPV: meeting.dateRapelleDeuxPV,
          motifReplacement: meeting.motifReplacement,
          isEditing: {
            tenueReunion: false,
            motifReplacement: false,
            tenueMotifAnnulation: false,
            observation: false,
            datePremierRappelCR: false,
            dateDeuxiemeRappelCR: false,
            documentAJoindreCR: false,
            datePremierRappelPV: false,
            dateDeuxiemeRappelPV: false,
            documentAJoindrePV: false,
            autreDocument: false
          }
        }));
        console.log('Données transformées:', this.suiviMeetings); // Ajouté
        this.tenueMeetings = [...this.suiviMeetings];
        this.filterTables();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.showError('Erreur lors du chargement des suivis de réunion');
      }
    });
  }

  onDocumentSelected(event: any, index: number, type: 'CR' | 'PV' | 'autre'): void {
    const file: File = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      
      if (type === 'CR') {
        this.filteredSuiviMeetings[index].documentAJoindreCR = file.name;
        this.filteredSuiviMeetings[index].docCRBase64 = base64String;
      } else if (type === 'PV') {
        this.filteredSuiviMeetings[index].documentAJoindrePV = file.name;
        this.filteredSuiviMeetings[index].docPVBase64 = base64String;
      } else {
        this.filteredSuiviMeetings[index].autreDocument = file.name;
        this.filteredSuiviMeetings[index].autreDocBase64 = base64String;
      }
      
      // Show preview for images
      if (file.type.match('image.*')) {
        this.showFilePreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  }

  showFilePreview(src: string): void {
    Swal.fire({
      title: 'Aperçu du fichier',
      imageUrl: src,
      imageAlt: 'Aperçu du fichier',
      showConfirmButton: true
    });
  }

  downloadDocument(idSuivi: number, type: string, fileName: string): void {
    this.loading = true;
    this.reunionService.downloadDocument(idSuivi, type).subscribe({
      next: (blob: Blob) => {
        saveAs(blob, fileName || `${type}_${idSuivi}.pdf`);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.showError('Erreur lors du téléchargement du document');
      }
    });
  }

  filterTables(): void {
    if (this.selectedResultSociete) {
      this.filteredTenueMeetings = this.tenueMeetings.filter(meeting => 
        meeting.raisonSociale === this.selectedResultSociete);
      this.filteredSuiviMeetings = this.suiviMeetings.filter(meeting => 
        meeting.raisonSociale === this.selectedResultSociete);
    } else if (this.selectedProjetId) {
      const selectedCompany = this.companies.find(c => c.idProjet === this.selectedProjetId);
      if (selectedCompany) {
        this.filteredTenueMeetings = this.tenueMeetings.filter(meeting => 
          meeting.raisonSociale === selectedCompany.raisonSociale);
        this.filteredSuiviMeetings = this.suiviMeetings.filter(meeting => 
          meeting.raisonSociale === selectedCompany.raisonSociale);
      }
    } else {
      this.filteredTenueMeetings = [...this.tenueMeetings];
      this.filteredSuiviMeetings = [...this.suiviMeetings];
    }
    console.log('Tableau tenueMeetings filtré:', this.filteredTenueMeetings); // Ajouté
    console.log('Tableau suiviMeetings filtré:', this.filteredSuiviMeetings); // Ajouté
  }

  toggleEdit(index: number, field: string, table: 'tenue' | 'suivi'): void {
    const meetings = table === 'tenue' ? this.filteredTenueMeetings : this.filteredSuiviMeetings;
    
    // Stocker la valeur originale avant modification
    if (!meetings[index].isEditing[field]) {
      this.originalValues[`${table}_${index}_${field}`] = meetings[index][field];
    }
    
    meetings[index].isEditing[field] = !meetings[index].isEditing[field];
  }

  confirmFieldUpdate(index: number, field: string, table: 'tenue' | 'suivi'): void {
    const meetings = table === 'tenue' ? this.filteredTenueMeetings : this.filteredSuiviMeetings;
    const meeting = meetings[index];

    if (field === 'tenueReunion' && !['Oui', 'Non'].includes(meeting.tenueReunion)) {
        this.showError('La tenue de réunion doit être "Oui" ou "Non"');
        return;
    }

    if (!meeting.idSuivi) {
        this.showError('ID du suivi de réunion manquant');
        return;
    }

    // Préparer l'objet de mise à jour avec seulement le champ concerné
    const updateData: any = {};
    
    // Ajouter seulement le champ qui est en cours d'édition
    switch (field) {
        case 'tenueReunion':
            updateData.TenueReunion = meeting.tenueReunion;
            break;
        case 'motifReplacement':
            updateData.MotifReplacement = meeting.motifReplacement;
            break;
        case 'tenueMotifAnnulation':
            updateData.TenueMotifAnnulation = meeting.tenueMotifAnnulation;
            break;
        case 'observation':
            updateData.Observation = meeting.observation;
            break;
        case 'datePremierRappelCR':
            updateData.DateRapellePremCR = meeting.datePremierRappelCR;
            break;
        case 'dateDeuxiemeRappelCR':
            updateData.DateRapelleDeuxCR = meeting.dateDeuxiemeRappelCR;
            break;
        case 'documentAJoindreCR':
            updateData.DocCR = meeting.docCRBase64;
            break;
        case 'datePremierRappelPV':
            updateData.DateRapellePremPV = meeting.datePremierRappelPV;
            break;
        case 'dateDeuxiemeRappelPV':
            updateData.DateRapelleDeuxPV = meeting.dateDeuxiemeRappelPV;
            break;
        case 'documentAJoindrePV':
            updateData.DocPV = meeting.docPVBase64;
            break;
        case 'autreDocument':
            updateData.AutreDoc = meeting.autreDocBase64;
            break;
    }

    this.loading = true;
    this.reunionService.updateSuiviReunion(meeting.idSuivi, updateData).subscribe({
        next: () => {
            this.loading = false;
            Swal.fire('Succès', 'Le champ a été mis à jour avec succès', 'success');
            meeting.isEditing[field] = false;
            delete this.originalValues[`${table}_${index}_${field}`];
            
            
        },
        error: (err) => {
            this.loading = false;
            console.error('Erreur lors de la mise à jour:', err);
            this.showError('Erreur lors de la mise à jour: ' + (err.error?.message || err.message || 'Erreur inconnue'));
            this.cancelEdit(index, field, table);
        }
    });
}

  private getApiFieldName(field: string): string {
    const fieldMap: { [key: string]: string } = {
      tenueReunion: 'TenueReunion',
      motifReplacement: 'MotifReplacement',
      tenueMotifAnnulation: 'TenueMotifAnnulation',
      observation: 'Observation',
      datePremierRappelCR: 'DateRapellePremCR',
      dateDeuxiemeRappelCR: 'DateRapelleDeuxCR',
      documentAJoindreCR: 'DocCR',
      datePremierRappelPV: 'DateRapellePremPV',
      dateDeuxiemeRappelPV: 'DateRapelleDeuxPV',
      documentAJoindrePV: 'DocPV',
      autreDocument: 'AutreDoc'
    };
    return fieldMap[field] || field;
  }

  private getFieldValue(meeting: any, field: string): any {
    switch (field) {
      case 'tenueReunion': return meeting.tenueReunion;
      case 'motifReplacement': return meeting.motifReplacement;
      case 'tenueMotifAnnulation': return meeting.tenueMotifAnnulation;
      case 'observation': return meeting.observation;
      case 'datePremierRappelCR': return meeting.datePremierRappelCR;
      case 'dateDeuxiemeRappelCR': return meeting.dateDeuxiemeRappelCR;
      case 'documentAJoindreCR': return meeting.docCRBase64;
      case 'datePremierRappelPV': return meeting.datePremierRappelPV;
      case 'dateDeuxiemeRappelPV': return meeting.dateDeuxiemeRappelPV;
      case 'documentAJoindrePV': return meeting.docPVBase64;
      case 'autreDocument': return meeting.autreDocBase64;
      default: return null;
    }
  }

  cancelEdit(index: number, field: string, table: 'tenue' | 'suivi'): void {
    const meetings = table === 'tenue' ? this.filteredTenueMeetings : this.filteredSuiviMeetings;
    
    // Restaurer la valeur originale
    const originalValueKey = `${table}_${index}_${field}`;
    if (this.originalValues[originalValueKey] !== undefined) {
      meetings[index][field] = this.originalValues[originalValueKey];
      delete this.originalValues[originalValueKey];
    }
    
    meetings[index].isEditing[field] = false;
  }

  private showError(message: string): void {
    Swal.fire('Erreur', message, 'error');
  }
}

export interface Projet {
  idProjet: number;
  raisonSociale: string;
}