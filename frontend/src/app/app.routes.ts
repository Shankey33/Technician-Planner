/**
 * Application Routes Configuration
 * 
 * Defines the main navigation routes for the Technician Planner app.
 * Uses lazy loading for feature components to optimize bundle size.
 * 
 * Routes:
 * - /home      → Today's Tasks page (main dashboard)
 * - /add-task  → Add new task form
 * - /          → Redirects to /home (default route)
 * - **         → Redirects to /home (fallback for unknown routes)
 */

import type { Routes } from '@angular/router';

export const routes: Routes = [
  /**
   * Default route - redirects to home
   * This ensures users always land on a meaningful page
   */
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  
  /**
   * Home page
   * Main dashboard showing scheduled tasks for today
   * Includes summary counts and task list
   */
  {
    path: 'home',
    loadComponent: () => 
      import('./features/today-tasks/today-tasks.component')
        .then(m => m.TodayTasksComponent),
    title: 'Home - Technician Planner'
  },
  
  /**
   * Add Task page
   * Form to create a new customer visit task
   * Redirects to /today on successful creation
   */
  {
    path: 'add-task',
    loadComponent: () => 
      import('./features/add-task/add-task.component')
        .then(m => m.AddTaskComponent),
    title: 'Add Task - Technician Planner'
  },
  
  /**
   * Wildcard route - catches all unknown routes
   * Redirects to /home to prevent 404 errors
   */
  {
    path: '**',
    redirectTo: 'home'
  }
];
