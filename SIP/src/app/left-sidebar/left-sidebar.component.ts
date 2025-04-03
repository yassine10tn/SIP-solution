// left-sidebar.component.ts
import { Component, input, output, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';

interface MenuItem {
  routeLink?: string;  // Rendons ce champ optionnel
  icon: string;
  label: string;
  subItems?: SubMenuItem[];
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
  isSocieteMenuOpen = false;

  items: MenuItem[] = [
    {
      routeLink: 'home',
      icon: 'fas fa-users-cog',
      label: 'Gestion de la Société',
      subItems: [
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
      routeLink: 'products',
      icon: 'fas fa-project-diagram',
      label: 'Workflow',
    },
    {
      routeLink: 'settings',
      icon: 'fas fa-coins',
      label: 'Fonds Gérés',
    },
    {
      routeLink: 'jsp',
      icon: 'fas fa-chart-line',
      label: 'FCPR',
    },
    {
      routeLink: 'idk',
      icon: 'fas fa-building',
      label: 'Gestion des Filiales',
    },
    {
      routeLink: 'aa',
      icon: 'fas fa-cogs',
      label: 'Paramétrage',
    },
  ];

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }

  toggleSocieteMenu(): void {
    this.isSocieteMenuOpen = !this.isSocieteMenuOpen;
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