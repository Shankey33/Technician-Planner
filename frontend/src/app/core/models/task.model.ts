/**
 * Task Model Interface
 * 
 * This interface defines the structure of a Task object as returned by the backend API.
 * All task-related components and services should use this interface for type safety.
 * 
 * Backend API returns tasks in this exact shape from MongoDB.
 */

/**
 * Allowed task types - matches backend enum validation
 */
export type TaskType = 'Installation' | 'Repair' | 'Maintenance' | 'Inspection';

/**
 * Task status - managed by backend, not sent during creation
 */
export type TaskStatus = 'Pending' | 'Completed';

/**
 * Main Task interface matching backend MongoDB schema
 */
export interface Task {
  /** MongoDB ObjectId - unique identifier */
  _id: string;
  
  /** Customer's full name */
  customerName: string;
  
  /** Service location/address */
  location: string;
  
  /** Type of service to be performed */
  taskType: TaskType;
  
  /** Scheduled date and time (ISO 8601 format) */
  scheduledTime: string;
  
  /** Optional notes about the task */
  notes?: string;
  
  /** Current status - defaults to 'Pending' on creation */
  status: TaskStatus;
  
  /** Actual completion timestamp - set when task is marked complete */
  completedAt?: string;
  
  /** MongoDB timestamps */
  createdAt?: string;
  updatedAt?: string;
}

/**
 * DTO for creating a new task
 * Excludes _id, status, completedAt as these are managed by backend
 */
export interface CreateTaskDto {
  customerName: string;
  location: string;
  taskType: TaskType;
  scheduledTime: string;
  notes?: string;
}

/**
 * DTO for updating task completion
 */
export interface CompleteTaskDto {
  completedAt: string;
}

/**
 * Standard API response with message
 */
export interface ApiMessageResponse {
  message: string;
}
