import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { SocieteListComponent } from './pages/societe-list/societe-list.component';
import { ParticipationComponent } from './pages/participation/participation.component';
import { AffectationCommissaireComponent } from './pages/affectation-commissaire/affectation-commissaire.component';
import { SaisieCommissaireComponent } from './pages/saisie-commissaire/saisie-commissaire.component';
import { SaisieContactsComponent } from './pages/saisie-contacts/saisie-contacts.component';
import { HomeComponent } from './pages/Gestion-Societe/home.component';
import { CommissaireListComponent } from './pages/commissaire-list/commissaire-list.component';
import { ContactListComponent } from './pages/contact-list/contact-list.component';
import { DefaultLayoutComponentComponent } from './default-layout-component/default-layout-component.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { AssistantVirtualComponent } from './pages/assistant-virtual/assistant-virtual.component';
import { AuthGuard } from './auth.guard';
import { SaisieRepresentantComponent } from './pages/saisie-representant/saisie-representant.component';
import { SuiviReunionComponent } from './pages/suivi-reunion/suivi-reunion.component';
import { CreationReunionComponent } from './pages/creation-reunion/creation-reunion.component';
import { ParametrageComponent } from './pages/parametrage/parametrage.component';
import { ListeUtilisateurComponent } from './pages/liste-utilisateur/liste-utilisateur.component';


export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  {
    path: '',
    component: DefaultLayoutComponentComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'accueil', component: AccueilComponent },
      { path: 'gestion-societe', component: HomeComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'participation', component: ParticipationComponent },
      { path: 'societe-list', component: SocieteListComponent },
      { path: 'affectation-commissaire', component: AffectationCommissaireComponent },
      { path: 'saisie-commissaire', component: SaisieCommissaireComponent },
      { path: 'saisie-contacts', component: SaisieContactsComponent },
      { path: 'commissaire-list', component: CommissaireListComponent },
      { path: 'contact-list', component: ContactListComponent },
      { path: 'assistant-virtual', component: AssistantVirtualComponent },
      { path: 'Saisie-Representant', component: SaisieRepresentantComponent },
      { path: 'Suivi-Reunion', component: SuiviReunionComponent },
      { path: 'Creation-Reunion', component: CreationReunionComponent },
      { path: 'parametrage', component:ParametrageComponent},
      { path:'liste-utilisateur', component:ListeUtilisateurComponent}
    ]
  },
  { path: 'login', component: LoginComponent },
  { 
    path: '**',
    redirectTo: 'login' 
  }
];