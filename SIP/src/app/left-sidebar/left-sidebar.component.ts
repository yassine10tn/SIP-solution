import { Component, input, output, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';

interface MenuItem {
  routeLink?: string;
  icon: string;
  label: string;
  subItems?: SubMenuItem[];
  isOpen?: boolean; 
}

interface SubMenuItem {
  routeLink: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule, NgClass],
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent {
  private router = inject(Router);

  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();

  items: MenuItem[] = [
    {
      label: 'Accueil',
      routeLink: '/accueil',
      icon: 'fas fa-home'
    },
    {
      
      icon: 'fas fa-users-cog',
      label: 'Gestion de la Société',
      isOpen: false, // Initialize isOpen
      subItems: [
        {
          routeLink: 'gestion-societe',
          icon: 'fas fa-users-cog',
          label: 'Gestion de la société'
        },
        {
          routeLink: 'saisie-commissaire',
          icon: 'fas fa-user-tie',
          label: 'Saisie Commissaire aux comptes'
        },
        {
          routeLink: 'affectation-commissaire',
          icon: 'fas fa-tasks',
          label: 'Affectation commissaire aux comptes'
        },
        {
          routeLink: 'saisie-contacts',
          icon: 'fas fa-address-book',
          label: 'Saisie des contacts'
        }
      ]
    },
    {
      routeLink: 'participation',
      icon: 'fas fa-handshake',
      label: 'Participation',
    },
    {
      
      icon: 'fas fa-calendar-alt',
      label: 'Réunion',
      isOpen: false, 
      subItems: [
        {
          routeLink: 'Creation-Reunion',
          icon: 'fas fa-calendar-day',
          label: 'Creation de réunion'
        },
        {
          routeLink: 'Saisie-Representant',
          icon: 'fas fa-user-tie',
          label: 'Saisie Représentant'
        },
        {
          routeLink: 'Suivi-Reunion',
          icon: 'fas fa-calendar-day',
          label: 'Suivi de réunion'
        },
      ]
    },
    {
      icon: 'fas fa-cogs',
      label: 'Paramétrage',
      isOpen: false, 
      subItems: [ 
        {
          routeLink: 'parametrage',
          icon: 'fas fa-cogs',
          label: 'gestion des droits d\'accès'
        },
        {
          routeLink: 'liste-utilisateur',
          icon: 'fas fa-calendar-day',
          label: 'liste des utilisateurs'
        }
      ]

    },
  ];

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }

  toggleMenu(item: MenuItem): void {
    if (item.subItems) {
      item.isOpen = !item.isOpen; // Toggle the specific menu's isOpen state
    }
  }

  isAnySubItemActive(item: MenuItem): boolean {
    if (!item.subItems) return false;
    return item.subItems.some(subItem =>
      this.router.isActive(subItem.routeLink, {
        paths: 'subset',
        queryParams: 'subset',
        fragment: 'ignored',
        matrixParams: 'ignored'
      })
    );
  }
}