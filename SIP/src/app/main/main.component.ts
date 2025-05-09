import { CommonModule, NgClass } from '@angular/common';
import { Component, computed, input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NgClass],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements AfterViewInit, OnDestroy {
  isDropdownOpen: boolean = false;
  isLeftSidebarCollapsed = input.required<boolean>();
  screenWidth = input.required<number>();

  @ViewChild('mainContent') mainContent!: ElementRef;
  private resizeObserver!: ResizeObserver;

  sizeClass = computed(() => {
    const isLeftSidebarCollapsed = this.isLeftSidebarCollapsed();
    if (isLeftSidebarCollapsed) {
      return '';
    }
    return this.screenWidth() > 768 ? 'body-trimmed' : 'body-md-screen';
  });

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => {
      // This will trigger whenever the main content resizes
    });
    this.resizeObserver.observe(this.mainContent.nativeElement);
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  clickOutside(): void {
    this.isDropdownOpen = false;
  }
}