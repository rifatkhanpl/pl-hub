import type { APIResponse, APIError } from '../types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_GATEWAY_PUBLIC_URL || 'http://localhost:3001';

export class PLAPIClient {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new APIError(data.code || 'API_ERROR', data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('NETWORK_ERROR', 'Network request failed');
    }
  }

  // Generic CRUD methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<APIResponse<T>> {
    const searchParams = params ? new URLSearchParams(params).toString() : '';
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint;
    return this.request<T>(url);
  }

  async post<T>(endpoint: string, data?: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Service-specific API clients
export class HCPAPIClient extends PLAPIClient {
  constructor() {
    super();
  }

  async getHCPs(params?: { page?: number; limit?: number; search?: string }) {
    return this.get('/api/udb-hcp/hcps', params);
  }

  async getHCP(id: string) {
    return this.get(`/api/udb-hcp/hcps/${id}`);
  }

  async createHCP(data: any) {
    return this.post('/api/udb-hcp/hcps', data);
  }

  async updateHCP(id: string, data: any) {
    return this.put(`/api/udb-hcp/hcps/${id}`, data);
  }

  async deleteHCP(id: string) {
    return this.delete(`/api/udb-hcp/hcps/${id}`);
  }

  async searchHCPs(query: string, filters?: Record<string, any>) {
    return this.get('/api/udb-hcp/hcps/search', { q: query, ...filters });
  }
}

export class JobAPIClient extends PLAPIClient {
  constructor() {
    super();
  }

  async getJobs(params?: { page?: number; limit?: number; status?: string }) {
    return this.get('/api/jam/jobs', params);
  }

  async getJob(id: string) {
    return this.get(`/api/jam/jobs/${id}`);
  }

  async createJob(data: any) {
    return this.post('/api/jam/jobs', data);
  }

  async updateJob(id: string, data: any) {
    return this.put(`/api/jam/jobs/${id}`, data);
  }

  async publishJob(id: string) {
    return this.post(`/api/jam/jobs/${id}/publish`);
  }

  async unpublishJob(id: string) {
    return this.post(`/api/jam/jobs/${id}/unpublish`);
  }
}

// Default API client instance
export const apiClient = new PLAPIClient();
export const hcpAPI = new HCPAPIClient();
export const jobAPI = new JobAPIClient();

// Custom API Error class
export class APIError extends Error {
  constructor(public code: string, message: string, public details?: any) {
    super(message);
    this.name = 'APIError';
  }
}