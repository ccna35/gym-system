import axiosInstance from "../lib/axios";
import type { Plan, PlanFormData, ApiResponse } from "../types";

export const planApi = {
  getAll: async (): Promise<Plan[]> => {
    const response = await axiosInstance.get<ApiResponse<Plan[]>>(`/plans`);
    return response.data.data;
  },

  getById: async (id: number, tenantId: number): Promise<Plan> => {
    const response = await axiosInstance.get<ApiResponse<Plan>>(
      `/plans/${id}`,
      { params: { tenant_id: tenantId } }
    );
    return response.data.data;
  },

  create: async (data: PlanFormData): Promise<Plan> => {
    const response = await axiosInstance.post<ApiResponse<Plan>>(
      "/plans",
      data
    );
    return response.data.data;
  },

  update: async (
    id: number,
    tenantId: number,
    data: Partial<PlanFormData>
  ): Promise<Plan> => {
    const response = await axiosInstance.put<ApiResponse<Plan>>(
      `/plans/${id}`,
      data,
      { params: { tenant_id: tenantId } }
    );
    return response.data.data;
  },

  delete: async (id: number, tenantId: number): Promise<void> => {
    await axiosInstance.delete(`/plans/${id}`, {
      params: { tenant_id: tenantId },
    });
  },
};
