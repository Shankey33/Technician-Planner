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

import { Component } from '@angular/core';
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

  /** Mobile menu open/close state */
  isMobileMenuOpen = false;

  /**
   * Toggle mobile menu visibility
   */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  /**
   * Close mobile menu (called after navigation)
   */
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}

