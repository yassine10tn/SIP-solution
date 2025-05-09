import { Component, HostListener, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { MainComponent } from '../main/main.component';
import { LeftSidebarComponent } from '../left-sidebar/left-sidebar.component';
import { AssistantVirtualComponent } from "../pages/assistant-virtual/assistant-virtual.component";

@Component({
  selector: 'app-default-layout-component',
  standalone: true,
  imports: [
    NavbarComponent, 
    MainComponent, 
    LeftSidebarComponent, 
    RouterOutlet, 
    AssistantVirtualComponent
  ],
  templateUrl: './default-layout-component.component.html',
  styleUrl: './default-layout-component.component.css'
})
export class DefaultLayoutComponentComponent implements OnInit {
  isLeftSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);
  showChatbot = signal<boolean>(true);

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  ngOnInit(): void {
    this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
  }

  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
  }

  toggleChatbot(): void {
    this.showChatbot.update(show => !show);
  }
}