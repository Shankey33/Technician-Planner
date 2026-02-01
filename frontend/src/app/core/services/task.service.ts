/**
 * Task Service
 * 
 * Centralized service for all task-related HTTP operations.
 * This is the ONLY place where HTTP calls to the task API should be made.
 * Components should inject this service and use its methods.
 * 
 * API Endpoints:
 * - POST   /tasks      → Create a new task
 * - GET    /tasks      → Get all tasks
 * - PATCH  /tasks/:id  → Mark task as completed
 * - DELETE /tasks/:id  → Delete a task
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, forkJoin, from, of } from 'rxjs';
import { catchError, mergeMap, toArray } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import type { Task, CreateTaskDto, CompleteTaskDto, ApiMessageResponse } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  /**
   * Base URL for task API endpoints
   * Configured in environment.ts - never hardcode URLs here
   */
  private readonly apiUrl = `${environment.API_URL}/tasks`;
  
  /** Angular HttpClient for making HTTP requests */
  private readonly http = inject(HttpClient);

  /**
   * Create a new task
   * 
   * @param taskData - Task creation data (excludes _id, status, completedAt)
   * @returns Observable<ApiMessageResponse> - Success message from server
   * 
   * API: POST /tasks
   * Request Body: { customerName, location, taskType, scheduledTime, notes? }
   * Response: { message: "Task created successfully" }
   */
  createTask(taskData: CreateTaskDto): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(this.apiUrl, taskData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get all tasks
   * 
   * @returns Observable<Task[]> - Array of all tasks
   * 
   * API: GET /tasks
   * Response: Array of task objects
   */
  getTodayTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  /**
   * Mark a task as completed
   * 
   * @param taskId - MongoDB ObjectId of the task to complete
   * @param completedAt - ISO timestamp of actual completion time
   * @returns Observable<ApiMessageResponse> - Success message from server
   * 
   * API: PATCH /tasks/:id
   * Request Body: { completedAt: "ISO datetime string" }
   * Response: { message: "Task updated successfully" }
   */
  completeTask(taskId: string, completedAt: string): Observable<ApiMessageResponse> {
    const payload: CompleteTaskDto = { completedAt };
    return this.http.patch<ApiMessageResponse>(`${this.apiUrl}/${taskId}`, payload)
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete a task
   * 
   * @param taskId - MongoDB ObjectId of the task to delete
   * @returns Observable<ApiMessageResponse> - Success message from server
   * 
   * API: DELETE /tasks/:id
   * Response: { message: "Task deleted successfully" }
   */
  deleteTask(taskId: string): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(`${this.apiUrl}/${taskId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete multiple tasks in parallel with concurrency limit
   * Used for bulk deletion of completed tasks
   * 
   * @param taskIds - Array of task IDs to delete
   * @returns Observable<ApiMessageResponse[]> - Array of responses
   */
  deleteMultipleTasks(taskIds: string[]): Observable<ApiMessageResponse[]> {
    return from(taskIds).pipe(
      // Limit concurrency to 3 requests at a time to prevent browser stalling
      mergeMap(id => this.deleteTask(id).pipe(
        // Catch individual errors so one failure doesn't stop the whole process
        catchError(() => of({ message: `Failed to delete task ${id}` } as ApiMessageResponse))
      ), 3),
      toArray()
    );
  }

  /**
   * Centralized error handler for HTTP requests
   * 
   * Logs errors and returns user-friendly error messages.
   * Components should handle these errors in their subscriptions.
   * 
   * @param error - HttpErrorResponse from failed request
   * @returns Observable that errors with a user-friendly message
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.status === 0) {
      // Network error - server unreachable
      errorMessage = 'Unable to connect to server. Please check your connection.';
    } else if (error.status === 400) {
      // Validation error from backend
      errorMessage = error.error?.message || 'Invalid request data';
    } else if (error.status === 404) {
      // Resource not found
      errorMessage = 'Task not found';
    } else if (error.status === 500) {
      // Server error
      errorMessage = 'Server error. Please try again later.';
    }
    
    console.error('TaskService Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
