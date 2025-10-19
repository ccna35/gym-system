// API Types based on backend models

export interface User {
  id: number;
  tenant_id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  role_id: number;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: number;
  tenant_id: number;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  dob?: string | null;
  emergency_contact?: string | null;
  medical_notes?: string | null;
  photo_url?: string | null;
  status: "ACTIVE" | "EXPIRED" | "SUSPENDED";
  membership_status: "ACTIVE" | "EXPIRING_SOON" | "EXPIRED";
  remaining_amount: string;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: number;
  tenant_id: number;
  name: string;
  description?: string | null;
  duration_days: number;
  price_cents: number;
  created_at: string;
  updated_at: string;
}

export interface Membership {
  id: number;
  tenant_id: number;
  member_id: number;
  member_name: string;
  plan_id: number;
  price: number;
  start_date: string;
  end_date: string;
  status: "ACTIVE" | "EXPIRED" | "SUSPENDED";
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  tenant_id: number;
  membership_id: number;
  member_name: string;
  amount: number;
  payment_date: string;
  method: "CASH" | "CARD" | "BANK_TRANSFER";
  status: "PAID" | "VOID";
  created_by_name: string;
  notes?: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}

// Auth Types
export interface LoginRequest {
  tenant_id: number;
  email: string;
  password: string;
}

export interface RegisterRequest {
  tenant_id: number;
  full_name: string;
  email: string;
  phone?: string;
  password: string;
  role_id: number;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
}

// Form Types
export interface MemberFormData {
  full_name: string;
  email?: string;
  phone?: string;
  dob?: string;
  emergency_contact?: string;
  medical_notes?: string;
  photo_url?: string;
  status: "ACTIVE" | "EXPIRED" | "SUSPENDED";
}

export interface PlanFormData {
  name: string;
  description?: string;
  duration_months: number;
  price: number;
}

export interface MembershipFormData {
  member_id: number;
  start_date: string;
}

export interface PaymentFormData {
  membership_id: number;
  amount: number;
  payment_date: string;
  method?: "CASH" | "CARD" | "BANK_TRANSFER";
  notes?: string;
}
