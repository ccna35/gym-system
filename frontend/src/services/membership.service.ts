import axiosInstance from "../lib/axios";
import type { Membership, MembershipFormData, ApiResponse } from "../types";

export const membershipApi = {
  getAll: async (): Promise<Membership[]> => {
    const response = await axiosInstance.get<ApiResponse<Membership[]>>(
      `/memberships`
    );
    return response.data.data;
  },

  getById: async (id: number): Promise<Membership> => {
    const response = await axiosInstance.get<ApiResponse<Membership>>(
      `/memberships/${id}`
    );
    return response.data.data;
  },

  getByMember: async (memberId: number): Promise<Membership[]> => {
    const response = await axiosInstance.get<ApiResponse<Membership[]>>(
      `/memberships/member/${memberId}`
    );
    return response.data.data;
  },

  create: async (data: MembershipFormData): Promise<Membership> => {
    const response = await axiosInstance.post<ApiResponse<Membership>>(
      "/memberships",
      data
    );
    return response.data.data;
  },

  update: async (
    id: number,
    tenantId: number,
    data: Partial<MembershipFormData>
  ): Promise<Membership> => {
    const response = await axiosInstance.put<ApiResponse<Membership>>(
      `/memberships/${id}`,
      data,
      { params: { tenant_id: tenantId } }
    );
    return response.data.data;
  },

  delete: async (id: number, tenantId: number): Promise<void> => {
    await axiosInstance.delete(`/memberships/${id}`, {
      params: { tenant_id: tenantId },
    });
  },
};
