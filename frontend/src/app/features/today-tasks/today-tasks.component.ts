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

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
    this.loadTasks();
  }

  /**
   * Fetch today's tasks from API
   */
  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.taskService.getTodayTasks().subscribe({
      next: (tasks) => {
        this.tasks = this.sortTasks(tasks);
        this.isLoading = false;
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
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
        // Update local task state directly
        const index = this.tasks.findIndex(t => t._id === taskId);
        if (index !== -1) {
          this.tasks[index] = {
            ...this.tasks[index],
            status: 'Completed',
            completedAt
          };
          // Re-sort to move completed task to bottom
          this.tasks = this.sortTasks(this.tasks);
        }
      },
      error: (error: Error) => {
        // Show error but don't disrupt UI
        alert(`Failed to complete task: ${error.message}`);
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
      },
      error: (error: Error) => {
        alert(`Failed to delete task: ${error.message}`);
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
