import { CommonModule, NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NgClass, ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  isDropdownOpen : boolean = false; 
  isLeftSidebarCollapsed = input.required<boolean>();
  screenWidth = input.required<number>();
  sizeClass = computed(() => {
    const isLeftSidebarCollapsed = this.isLeftSidebarCollapsed();
    if (isLeftSidebarCollapsed) {
      return '';
    }
    return this.screenWidth() > 768 ? 'body-trimmed' : 'body-md-screen';
  });

    // Add this method
    toggleDropdown(): void {
      this.isDropdownOpen = !this.isDropdownOpen;
    }
    clickOutside():void {
      this.isDropdownOpen = false;
    }

}