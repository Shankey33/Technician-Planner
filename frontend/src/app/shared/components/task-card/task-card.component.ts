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

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-card.component.html'
})
export class TaskCardComponent {
  /** The task to display */
  @Input({ required: true }) task!: Task;
  
  /** Emits task ID and completion time when marked complete */
  @Output() onComplete = new EventEmitter<{ taskId: string; completedAt: string }>();
  
  /** Emits task ID when delete is requested */
  @Output() onDelete = new EventEmitter<string>();

  /** Visibility of the completion modal */
  showModal = false;
  
  /** Visibility of the delete confirmation modal */
  showDeleteModal = false;
  
  /** Selected completion time string */
  completionTime = '';

  /**
   * Handle checkbox click - open modal instead of immediate change
   */
  onCheckboxClick(event: Event): void {
    if (this.task.status === 'Completed') return;
    
    // Prevent checkbox from changing state immediately
    event.preventDefault();
    
    // Set default time to now
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.completionTime = now.toISOString().slice(0, 16);
    
    this.showModal = true;
  }

  /**
   * Close the completion modal without saving
   */
  closeModal(): void {
    this.showModal = false;
  }

  /**
   * Confirm completion with selected time
   */
  confirmComplete(): void {
    const completedAt = this.completionTime 
      ? new Date(this.completionTime).toISOString() 
      : new Date().toISOString();
    
    this.onComplete.emit({ 
      taskId: this.task._id, 
      completedAt 
    });
    
    this.showModal = false;
  }

  /**
   * Handle delete button click
   * Opens confirmation modal
   */
  handleDelete(): void {
    this.showDeleteModal = true;
  }

  /**
   * Close delete confirmation modal
   */
  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  /**
   * Confirm deletion and emit delete event
   */
  confirmDelete(): void {
    this.onDelete.emit(this.task._id);
    this.showDeleteModal = false;
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
