import axiosInstance from "../lib/axios";
import type { Member, MemberFormData, ApiResponse } from "../types";

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
};
