/**
 * Task Card Component
 * 
 * Reusable component to display a single task in card format.
 * Used in the Today Tasks list to show task details and actions.
 * 
 * Features:
 * - Displays task details (customer, location, type, time)
 * - Checkbox to mark task as completed
 * - Visual distinction for completed tasks (muted styling)
 * - Delete button for task removal
 * - Emits events for parent component to handle API calls
 * 
 * Inputs:
 * - task: Task object to display
 * 
 * Outputs:
 * - onComplete: Emits when checkbox is checked (with completion time)
 * - onDelete: Emits when delete button is clicked
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html'
})
export class TaskCardComponent {
  /** The task to display */
  @Input({ required: true }) task!: Task;
  
  /** Emits task ID and completion time when marked complete */
  @Output() onComplete = new EventEmitter<{ taskId: string; completedAt: string }>();
  
  /** Emits task ID when delete is requested */
  @Output() onDelete = new EventEmitter<string>();

  /**
   * Handle checkbox change - prompt for completion time and emit event
   * Only triggers when checking (not unchecking)
   */
  handleComplete(): void {
    // Don't process if already completed
    if (this.task.status === 'Completed') {
      return;
    }

    // Prompt user for actual completion time
    const completionTime = prompt(
      'Enter completion time (leave empty for current time):',
      new Date().toISOString().slice(0, 16) // Default to current datetime
    );

    if (completionTime !== null) {
      // User confirmed - emit completion event
      const completedAt = completionTime 
        ? new Date(completionTime).toISOString() 
        : new Date().toISOString();
      
      this.onComplete.emit({ 
        taskId: this.task._id, 
        completedAt 
      });
    }
  }

  /**
   * Handle delete button click
   * Confirms with user before emitting delete event
   */
  handleDelete(): void {
    if (confirm(`Delete task for ${this.task.customerName}?`)) {
      this.onDelete.emit(this.task._id);
    }
  }

  /**
   * Format scheduled time for display
   * Converts ISO string to readable format
   */
  get formattedTime(): string {
    return new Date(this.task.scheduledTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Format scheduled date for display
   */
  get formattedDate(): string {
    return new Date(this.task.scheduledTime).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Get badge color class based on task type
   */
  get taskTypeBadgeClass(): string {
    const classes: Record<string, string> = {
      'Installation': 'bg-blue-100 text-blue-800',
      'Repair': 'bg-red-100 text-red-800',
      'Maintenance': 'bg-yellow-100 text-yellow-800',
      'Inspection': 'bg-purple-100 text-purple-800'
    };
    return classes[this.task.taskType] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Check if task is completed
   */
  get isCompleted(): boolean {
    return this.task.status === 'Completed';
  }
}
