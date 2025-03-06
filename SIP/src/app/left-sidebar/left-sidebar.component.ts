import { CommonModule, NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-left-sidebar',
  imports: [RouterModule,CommonModule,NgClass],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.css'
})
export class LeftSidebarComponent {
  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
  
  items = [
    {
      routeLink: 'home',
      icon: 'fas fa-briefcase',
      label: 'Gestion de la société',
    },
    {
      routeLink: 'dashboard',
      icon: 'fas fa-users-cog',
      label: ' Gestion des Tiers',
    },
    {
      routeLink: 'products',
      icon: 'fas fa-handshake',
      label: ' Participation',
    },
    {
      routeLink: 'pages',
      icon: 'fas fa-project-diagram',
      label: ' workflow',
    },
    {
      routeLink: 'settings',
      icon: 'fas fa-coins',
      label: ' Fonds Gérés',
    },
    {
      routeLink: 'jsp',
      icon: 'fas fa-chart-line',
      label: ' FCPR',
    },
    {
      routeLink: 'idk',
      icon: 'fas fa-building',
      label: ' Gestion des Filiales',
    },
    {
      routeLink: 'aa',
      icon: 'fas fa-cogs',
      label: ' Paramétrage  ',
    },
  ];

  toggleCollapse() : void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }
  closeSidenav():void{
    this.changeIsLeftSidebarCollapsed.emit(true);
  }
}
