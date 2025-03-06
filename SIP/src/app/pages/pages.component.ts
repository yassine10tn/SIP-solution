import { Component } from '@angular/core';

@Component({
  selector: 'app-pages',
  imports: [],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.css'
})
export class PagesComponent {
  navigateToLogin() {
    window.location.href = '/login';
  }

}
