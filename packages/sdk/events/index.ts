import type { PLEvent } from '../types';

// Event Bus Interface
export interface EventBus {
  publish(event: PLEvent): Promise<void>;
  subscribe(eventType: string, handler: EventHandler): () => void;
  unsubscribe(eventType: string, handler: EventHandler): void;
}

export type EventHandler = (event: PLEvent) => void | Promise<void>;

// In-Memory Event Bus (for development)
class InMemoryEventBus implements EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map();

  async publish(event: PLEvent): Promise<void> {
    const handlers = this.handlers.get(event.type) || new Set();
    
    // Execute all handlers
    await Promise.all(
      Array.from(handlers).map(handler => {
        try {
          return Promise.resolve(handler(event));
        } catch (error) {
          console.error(`Error in event handler for ${event.type}:`, error);
        }
      })
    );
  }

  subscribe(eventType: string, handler: EventHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    
    this.handlers.get(eventType)!.add(handler);
    
    // Return unsubscribe function
    return () => this.unsubscribe(eventType, handler);
  }

  unsubscribe(eventType: string, handler: EventHandler): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(eventType);
      }
    }
  }
}

// Event Bus Instance
export const eventBus: EventBus = new InMemoryEventBus();

// Event Creators
export function createEvent(
  type: string,
  source: string,
  data: Record<string, any>,
  options?: {
    correlation_id?: string;
    user_id?: string;
    org_id?: string;
  }
): PLEvent {
  return {
    id: generateEventId(),
    type,
    source,
    data,
    timestamp: new Date().toISOString(),
    ...options,
  };
}

// Common Event Types
export const EventTypes = {
  // HCP Events
  HCP_CREATED: 'hcp.created',
  HCP_UPDATED: 'hcp.updated',
  HCP_MERGED: 'hcp.merged',
  HCP_DELETED: 'hcp.deleted',

  // HCO Events
  HCO_CREATED: 'hco.created',
  HCO_UPDATED: 'hco.updated',
  HCO_DELETED: 'hco.deleted',

  // Job Events
  JOB_CREATED: 'job.created',
  JOB_UPDATED: 'job.updated',
  JOB_PUBLISHED: 'job.published',
  JOB_UNPUBLISHED: 'job.unpublished',
  JOB_DELETED: 'job.deleted',

  // Requisition Events
  REQUISITION_CREATED: 'requisition.created',
  REQUISITION_STAGE_CHANGED: 'requisition.stage_changed',
  CANDIDATE_STATUS_CHANGED: 'candidate.status_changed',

  // Communication Events
  MESSAGE_INBOUND: 'com.message.inbound',
  MESSAGE_OUTBOUND: 'com.message.outbound',
  OPTOUT_CHANGED: 'com.optout.changed',

  // CV Events
  CV_SAVED: 'cv.saved',
  CV_SHARED: 'cv.shared',

  // CME Events
  CME_CREDITS_ADDED: 'cme.credits.added',

  // Fair Events
  FAIR_REGISTRATION_CREATED: 'fair.registration.created',

  // System Events
  USER_LOGIN: 'user.login',
  USER_LOGOUT: 'user.logout',
  AUDIT_LOG: 'audit.write',
} as const;

// Event Publishers
export class EventPublisher {
  constructor(private source: string) {}

  async publish(type: string, data: Record<string, any>, options?: {
    correlation_id?: string;
    user_id?: string;
    org_id?: string;
  }): Promise<void> {
    const event = createEvent(type, this.source, data, options);
    await eventBus.publish(event);
  }
}

// Utility Functions
function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

// React Hook for Event Subscription
export function useEventSubscription(
  eventType: string,
  handler: EventHandler,
  deps: any[] = []
) {
  if (typeof window === 'undefined') return; // SSR guard

  // This would be implemented as a proper React hook in a real app
  // For now, just subscribe/unsubscribe
  const unsubscribe = eventBus.subscribe(eventType, handler);
  
  // In a real React hook, you'd use useEffect with cleanup
  return unsubscribe;
}