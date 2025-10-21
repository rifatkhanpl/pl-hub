// Main SDK Exports
export * from './types';
export * from './auth';
export * from './api';
export * from './events';
export * from './telemetry';

// Re-export commonly used items
export { apiClient, hcpAPI, jobAPI } from './api';
export { eventBus, EventTypes, EventPublisher } from './events';
export { telemetry, analytics } from './telemetry';
export { supabase, signInWithEmail, signOut, hasScope, hasRole, isAuthenticated } from './auth';