/**
 * Add Task Component
 * 
 * Page component for creating new tasks.
 * Contains a reactive form with validation for all required fields.
 * 
 * Features:
 * - Reactive form with validation
 * - Required field indicators
 * - Inline validation error messages
 * - Loading state during submission
 * - Success/error feedback
 * - Redirect to /today on successful creation
 * 
 * Form Fields:
 * - customerName (required)
 * - location (required)
 * - taskType (required, dropdown)
 * - scheduledTime (required, datetime)
 * - notes (optional)
 * 
 * Does NOT send: status, completedAt (managed by backend)
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  Validators 
} from '@angular/forms';
import { TaskService } from '../../core/services/task.service';
import type { CreateTaskDto, TaskType } from '../../core/models/task.model';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-task.component.html'
})
export class AddTaskComponent {
  /** Inject dependencies */
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);

  /** Loading state for submit button */
  isLoading = false;

  /** Error message to display */
  errorMessage = '';

  /** Success message to display */
  successMessage = '';

  /** Available task types - matches backend enum */
  readonly taskTypes: TaskType[] = [
    'Installation',
    'Repair',
    'Maintenance',
    'Inspection'
  ];

  /**
   * Reactive form with validation rules
   * All fields except notes are required
   */
  taskForm: FormGroup = this.fb.group({
    customerName: ['', [Validators.required, Validators.minLength(2)]],
    location: ['', [Validators.required, Validators.minLength(5)]],
    taskType: ['', Validators.required],
    scheduledTime: ['', Validators.required],
    notes: [''] // Optional field
  });

  /**
   * Convenience getter for form controls
   * Used in template for validation messages
   */
  get f() {
    return this.taskForm.controls;
  }

  /**
   * Handle form submission
   * Validates form, calls API, handles response
   */
  onSubmit(): void {
    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';

    // Mark all fields as touched to show validation errors
    this.taskForm.markAllAsTouched();

    // Don't submit if form is invalid
    if (this.taskForm.invalid) {
      return;
    }

    // Set loading state
    this.isLoading = true;

    // Prepare task data - only send fields expected by backend
    const taskData: CreateTaskDto = {
      customerName: this.taskForm.value.customerName.trim(),
      location: this.taskForm.value.location.trim(),
      taskType: this.taskForm.value.taskType,
      scheduledTime: new Date(this.taskForm.value.scheduledTime).toISOString(),
      // Only include notes if provided
      ...(this.taskForm.value.notes && { notes: this.taskForm.value.notes.trim() })
    };

    // Call API to create task
    this.taskService.createTask(taskData).subscribe({
      next: () => {
        // Success - show message and redirect
        this.successMessage = 'Task created successfully!';
        this.isLoading = false;
        
        // Redirect to home after brief delay
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      },
      error: (error: Error) => {
        // Handle error - show message
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }

  /**
   * Reset form to initial state
   */
  resetForm(): void {
    this.taskForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }
}
