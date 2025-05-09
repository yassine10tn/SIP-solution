import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent {
  @ViewChild('newsContainer') newsContainer!: ElementRef;

  features = [
    {
      icon: 'pi-eye',
      title: 'Visibilité complète',
      description: 'Accès instantané à l\'ensemble des positions et mouvements des portefeuilles gérés',
      color: 'blue'
    },
    {
      icon: 'pi-file',
      title: 'Reporting avancé',
      description: 'Génération automatique de rapports personnalisés avec analyse des tendances',
      color: 'indigo'
    },
    {
      icon: 'pi-sync',
      title: 'Synchronisation',
      description: 'Intégration transparente avec les systèmes existants de la banque',
      color: 'purple'
    }
  ];



}