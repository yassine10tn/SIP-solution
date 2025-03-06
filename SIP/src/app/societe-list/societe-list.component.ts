import { Component, OnInit } from '@angular/core';
import { CompanyService, Projet } from '../services/company.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-societe-list',
  standalone: true, // Ajouter ce décorateur pour un composant standalone
  imports: [CommonModule], // Importer CommonModule pour utiliser *ngFor
  templateUrl: './societe-list.component.html',
  styleUrl: './societe-list.component.css'
})
export class SocieteListComponent implements OnInit {
  societes: Projet[] = []; // Utiliser l'interface Projet pour typer les données
  

  constructor(private companyService: CompanyService) {}

  ngOnInit() {
    this.getCompanies(); // Appeler la méthode getCompanies()
  }

  getCompanies(): void {
    this.companyService.getCompanies().subscribe(
      (data: Projet[]) => {
        this.societes = data; // Stocker les données dans la variable societes
        console.log('Sociétés récupérées :', this.societes); // Log pour déboguer
      },
      (error) => {
        console.error('Erreur lors de la récupération des sociétés:', error);
      }
    );
  }
}