/**
 * Root Application Component
 * 
 * The main entry point component for the Technician Planner app.
 * Contains the responsive navigation bar and router outlet.
 * 
 * Features:
 * - Responsive navbar with hamburger menu on mobile
 * - Navigation links to Today and Add Task pages
 * - Router outlet for page content
 */

import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  /** App title displayed in navbar */
  readonly title = 'Technician Planner';

  /** Whether the user has scrolled down */
  isScrolled = signal(false);

  /**
   * Listen to window scroll events
   */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || 0;
    this.isScrolled.set(scrollPosition > 100);
  }

  /**
   * Scroll window to top
   */
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

