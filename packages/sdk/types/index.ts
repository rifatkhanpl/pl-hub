// Core Platform Types
export interface PLUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  org_id: string;
  roles: string[];
  scopes: string[];
  created_at: string;
  updated_at: string;
}

export interface PLOrganization {
  id: string;
  name: string;
  slug: string;
  type: 'hcp' | 'hco' | 'vendor';
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PLSession {
  user: PLUser;
  organization: PLOrganization;
  access_token: string;
  refresh_token?: string;
  expires_at: number;
}

// API Response Types
export interface APIResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    has_more?: boolean;
  };
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Event Types
export interface PLEvent {
  id: string;
  type: string;
  source: string;
  data: Record<string, any>;
  timestamp: string;
  correlation_id?: string;
  user_id?: string;
  org_id?: string;
}

// HCP Types
export interface HCP {
  id: string;
  npi?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  specialty_primary: string;
  specialty_secondary?: string[];
  license_states: string[];
  board_certifications: string[];
  medical_school?: string;
  residency?: string;
  fellowship?: string[];
  years_experience?: number;
  current_position?: string;
  current_employer?: string;
  location: {
    city: string;
    state: string;
    country: string;
    zip_code?: string;
  };
  preferences: {
    job_types: string[];
    locations: string[];
    salary_range?: {
      min: number;
      max: number;
    };
    remote_work: boolean;
    travel_willingness: number; // 0-100%
  };
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
}

// HCO Types
export interface HCO {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'practice' | 'health_system' | 'other';
  size: 'small' | 'medium' | 'large' | 'enterprise';
  locations: HCOLocation[];
  contact: {
    primary_contact: string;
    email: string;
    phone: string;
  };
  specialties: string[];
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface HCOLocation {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  is_primary: boolean;
  bed_count?: number;
  trauma_level?: string;
}

// Job/Requisition Types
export interface JobRequisition {
  id: string;
  hco_id: string;
  title: string;
  specialty: string;
  department: string;
  type: 'permanent' | 'locum' | 'contract';
  location: {
    city: string;
    state: string;
    remote_allowed: boolean;
  };
  compensation: {
    salary_min?: number;
    salary_max?: number;
    hourly_rate?: number;
    benefits: string[];
  };
  requirements: {
    years_experience_min: number;
    board_certification_required: boolean;
    license_states: string[];
    skills: string[];
  };
  description: string;
  status: 'draft' | 'active' | 'paused' | 'filled' | 'cancelled';
  posted_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}