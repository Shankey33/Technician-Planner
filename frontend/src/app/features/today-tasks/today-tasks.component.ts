/**
 * Today Tasks Component
 * 
 * Main page component displaying today's scheduled tasks.
 * Includes a summary dashboard and sortable task list.
 * 
 * Features:
 * - Dashboard with task counts (total, completed, pending)
 * - Dynamic count updates on task completion
 * - Task list sorted: pending first, completed last
 * - Loading state while fetching
 * - Empty state when no tasks
 * - Error handling for API failures
 * 
 * API Integration:
 * - GET /tasks/today on init
 * - PATCH /tasks/:id on completion
 * - DELETE /tasks/:id on delete
 */

import { Component, OnInit, inject, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { TaskService } from '../../core/services/task.service';
import { TaskCardComponent } from '../../shared/components/task-card/task-card.component';
import type { Task } from '../../core/models/task.model';

@Component({
  selector: 'app-today-tasks',
  standalone: true,
  imports: [CommonModule, RouterLink, TaskCardComponent],
  templateUrl: './today-tasks.component.html'
})
export class TodayTasksComponent implements OnInit {
  /** Inject TaskService for API calls */
  private readonly taskService = inject(TaskService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly platformId = inject(PLATFORM_ID);

  /** All tasks fetched from API */
  tasks: Task[] = [];

  /** Loading state for initial fetch */
  isLoading = true;

  /** Error message if fetch fails */
  errorMessage = '';

  /**
   * Lifecycle hook - fetch tasks on component init
   */
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadTasks();
    } else {
      // Don't fetch tasks on server/prerender
      this.isLoading = false;
    }
  }

  /**
   * Fetch today's tasks from API
   */
  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';
    console.log('Loading tasks...');

    // Force change detection updates
    this.taskService.getTodayTasks().subscribe({
        next: (tasks) => {
          console.log('Tasks loaded:', tasks.length);
          this.tasks = this.sortTasks(tasks);
          this.isLoading = false;
          this.cdr.detectChanges(); // Manually trigger update
        },
        error: (error: Error) => {
          console.error('Error loading tasks:', error);
          this.errorMessage = error.message;
          this.isLoading = false;
          this.cdr.detectChanges(); // Manually trigger update
        }
    });
  }

  /**
   * Sort tasks: Pending first, then Completed
   * Within each group, sort by scheduled time
   */
  private sortTasks(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      // First sort by status (Pending before Completed)
      if (a.status !== b.status) {
        return a.status === 'Pending' ? -1 : 1;
      }
      // Then sort by scheduled time
      return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
    });
  }

  /**
   * Handle task completion from TaskCardComponent
   * Calls PATCH API and updates local state
   */
  onTaskComplete(event: { taskId: string; completedAt: string }): void {
    const { taskId, completedAt } = event;

    this.taskService.completeTask(taskId, completedAt).subscribe({
      next: () => {
        // Find task index
        const index = this.tasks.findIndex(t => t._id === taskId);
        if (index !== -1) {
          // Create new task object with updated status
          const updatedTask: Task = {
            ...this.tasks[index],
            status: 'Completed',
            completedAt
          };
          
          // Create new tasks array with updated task
          const updatedTasks = [...this.tasks];
          updatedTasks[index] = updatedTask;
          
          // Sort and assign to trigger change detection
          this.tasks = this.sortTasks(updatedTasks);
          
          // Force UI update
          this.cdr.detectChanges();
        }
      },
      error: (error: Error) => {
        // Show error but don't disrupt UI
        alert(`Failed to complete task: ${error.message}`);
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Handle task deletion from TaskCardComponent
   * Calls DELETE API and removes from local state
   */
  onTaskDelete(taskId: string): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        // Remove task from local array
        this.tasks = this.tasks.filter(t => t._id !== taskId);
        this.cdr.detectChanges();
      },
      error: (error: Error) => {
        alert(`Failed to delete task: ${error.message}`);
      }
    });
  }

  /**
   * Delete all completed tasks
   * Iterates through completed tasks and deletes them one by one
   */
  onClearCompleted(): void {
    const completedTasks = this.tasks.filter(t => t.status === 'Completed');
    
    if (completedTasks.length === 0) return;

    if (!confirm(`Are you sure you want to remove ${completedTasks.length} completed task(s)?`)) {
      return;
    }

    const completedIds = completedTasks.map(t => t._id);
    this.isLoading = true; // Show loading while processing
    this.cdr.detectChanges();

    this.taskService.deleteMultipleTasks(completedIds)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: () => {
          // Remove all completed tasks from local state
          this.tasks = this.tasks.filter(t => t.status !== 'Completed');
        },
        error: (error: Error) => {
          alert(`Failed to clear completed tasks: ${error.message}`);
        }
      });
  }

  // ============ Dashboard Computed Properties ============

  /**
   * Total number of tasks
   */
  get totalTasks(): number {
    return this.tasks.length;
  }

  /**
   * Number of completed tasks
   */
  get completedTasks(): number {
    return this.tasks.filter(t => t.status === 'Completed').length;
  }

  /**
   * Number of pending tasks
   */
  get pendingTasks(): number {
    return this.tasks.filter(t => t.status === 'Pending').length;
  }

  /**
   * Check if there are any tasks
   */
  get hasTasks(): boolean {
    return this.tasks.length > 0;
  }
}
