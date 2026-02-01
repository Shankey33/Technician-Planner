/**
 * Environment Configuration
 * 
 * This file contains environment-specific settings for the application.
 * The API_URL should point to your backend server.
 * 
 * For production deployment:
 * - Update API_URL to your production backend URL
 * - Set production flag to true
 */

export const environment = {
  production: false,
  
  /**
   * Backend API base URL
   * Change this to your deployed backend URL for production
   * Example: 'https://your-backend.onrender.com/api'
   */
  API_URL: 'http://localhost:5000/api'
};
