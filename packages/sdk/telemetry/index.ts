// Telemetry and Observability
export interface TelemetryEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: string;
  user_id?: string;
  org_id?: string;
  session_id?: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percentage';
  tags?: Record<string, string>;
  timestamp?: string;
}

export interface ErrorReport {
  error: Error;
  context?: Record<string, any>;
  user_id?: string;
  org_id?: string;
  timestamp?: string;
}

class TelemetryClient {
  private sessionId: string;
  private userId?: string;
  private orgId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  setUser(userId: string, orgId: string) {
    this.userId = userId;
    this.orgId = orgId;
  }

  // Track user events
  track(name: string, properties?: Record<string, any>) {
    const event: TelemetryEvent = {
      name,
      properties,
      timestamp: new Date().toISOString(),
      user_id: this.userId,
      org_id: this.orgId,
      session_id: this.sessionId,
    };

    this.sendEvent(event);
  }

  // Track page views
  page(name: string, properties?: Record<string, any>) {
    this.track('page_view', {
      page_name: name,
      ...properties,
    });
  }

  // Track performance metrics
  metric(name: string, value: number, unit: PerformanceMetric['unit'], tags?: Record<string, string>) {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      tags,
      timestamp: new Date().toISOString(),
    };

    this.sendMetric(metric);
  }

  // Report errors
  error(error: Error, context?: Record<string, any>) {
    const report: ErrorReport = {
      error,
      context,
      user_id: this.userId,
      org_id: this.orgId,
      timestamp: new Date().toISOString(),
    };

    this.sendError(report);
  }

  // Measure function execution time
  time<T>(name: string, fn: () => T): T {
    const start = performance.now();
    try {
      const result = fn();
      const duration = performance.now() - start;
      this.metric(`${name}_duration`, duration, 'ms');
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.metric(`${name}_duration`, duration, 'ms', { status: 'error' });
      this.error(error as Error, { operation: name });
      throw error;
    }
  }

  // Measure async function execution time
  async timeAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.metric(`${name}_duration`, duration, 'ms');
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.metric(`${name}_duration`, duration, 'ms', { status: 'error' });
      this.error(error as Error, { operation: name });
      throw error;
    }
  }

  private sendEvent(event: TelemetryEvent) {
    // In production, send to your analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Telemetry Event:', event);
    }
    
    // Example: Send to analytics service
    // fetch('/api/telemetry/events', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event),
    // });
  }

  private sendMetric(metric: PerformanceMetric) {
    if (process.env.NODE_ENV === 'development') {
      console.log('📈 Performance Metric:', metric);
    }
    
    // Example: Send to metrics service
    // fetch('/api/telemetry/metrics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(metric),
    // });
  }

  private sendError(report: ErrorReport) {
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 Error Report:', report);
    }
    
    // Example: Send to error tracking service
    // fetch('/api/telemetry/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     ...report,
    //     error: {
    //       name: report.error.name,
    //       message: report.error.message,
    //       stack: report.error.stack,
    //     },
    //   }),
    // });
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}

// Global telemetry instance
export const telemetry = new TelemetryClient();

// Common tracking functions
export const analytics = {
  // User actions
  userSignIn: (method: string) => telemetry.track('user_sign_in', { method }),
  userSignOut: () => telemetry.track('user_sign_out'),
  
  // Navigation
  pageView: (page: string) => telemetry.page(page),
  
  // Feature usage
  featureUsed: (feature: string, properties?: Record<string, any>) => 
    telemetry.track('feature_used', { feature, ...properties }),
  
  // Search
  searchPerformed: (query: string, results: number, module: string) =>
    telemetry.track('search_performed', { query, results, module }),
  
  // API calls
  apiCall: (endpoint: string, method: string, duration: number, status: number) =>
    telemetry.metric('api_call_duration', duration, 'ms', { endpoint, method, status: status.toString() }),
  
  // Errors
  apiError: (endpoint: string, error: Error) =>
    telemetry.error(error, { endpoint, type: 'api_error' }),
  
  // Performance
  pageLoad: (page: string, duration: number) =>
    telemetry.metric('page_load_time', duration, 'ms', { page }),
};