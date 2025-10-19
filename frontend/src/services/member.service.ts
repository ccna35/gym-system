import axiosInstance from "../lib/axios";
import type { Member, MemberFormData, ApiResponse } from "../types";

export interface MemberDetails {
  member: Member;
  memberships: Array<any>; // can be typed more strictly if needed
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
