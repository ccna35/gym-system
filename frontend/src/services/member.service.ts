import axiosInstance from "../lib/axios";
import type { Member, MemberFormData, ApiResponse } from "../types";

export interface MemberDetailsMembership {
  id: number;
  tenant_id?: number;
  member_id: number;
  plan_id?: number | null;
  start_date: string;
  end_date: string | null;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  notes?: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  // Enriched fields from controller
  price_cents?: number; // raw from DB
  price?: number; // sometimes formatted to dollars
  payments?: import("../types").Payment[];
  paid?: number;
  remaining?: number;
}

export interface MemberDetails {
  member: Member;
  memberships: Array<MemberDetailsMembership>;
  stats: {
    totalPaid: number;
    totalRemaining: number;
  };
}

export const memberApi = {
  getAll: async (): Promise<Member[]> => {
    const response = await axiosInstance.get<ApiResponse<Member[]>>(`/members`);
    return response.data.data;
  },

  getById: async (id: number, tenantId: number): Promise<Member> => {
    const response = await axiosInstance.get<ApiResponse<Member>>(
      `/members/${id}`,
      { params: { tenant_id: tenantId } }
    );
    return response.data.data;
  },

  create: async (data: MemberFormData): Promise<Member> => {
    const response = await axiosInstance.post<ApiResponse<Member>>(
      "/members",
      data
    );
    return response.data.data;
  },

  update: async (
    id: number,
    data: Partial<MemberFormData>
  ): Promise<Member> => {
    const response = await axiosInstance.put<ApiResponse<Member>>(
      `/members/${id}`,
      data
    );
    return response.data.data;
  },

  delete: async (id: number, tenantId: number): Promise<void> => {
    await axiosInstance.delete(`/members/${id}`, {
      params: { tenant_id: tenantId },
    });
  },

  // New: Get member details (info, memberships, payments, stats)
  getDetails: async (id: number): Promise<MemberDetails> => {
    const response = await axiosInstance.get<ApiResponse<MemberDetails>>(
      `/members/${id}/details`
    );
    return response.data.data;
  },
};
