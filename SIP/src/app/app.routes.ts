import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { SettingsComponent } from './settings/settings.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './pages/login/login.component';
import { SocieteListComponent } from './pages/societe-list/societe-list.component';
import { ParticipationComponent } from './pages/participation/participation.component';
import { AffectationCommissaireComponent } from './pages/affectation-commissaire/affectation-commissaire.component';
import { SaisieCommissaireComponent } from './pages/saisie-commissaire/saisie-commissaire.component';
import { SaisieContactsComponent } from './pages/saisie-contacts/saisie-contacts.component';
import { HomeComponent } from './pages/Gestion-Societe/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'participation', component: ParticipationComponent },
  {path: 'home', component: HomeComponent},
  {path: 'nav',component:NavbarComponent},
  { path: 'societe-list', component: SocieteListComponent },
  {path: 'login', component: LoginComponent},
  {path: 'affectation-commissaire', component: AffectationCommissaireComponent},
  {path: 'saisie-commissaire', component: SaisieCommissaireComponent},
  {path: 'saisie-contacts', component: SaisieContactsComponent}
];