import axiosInstance from "../lib/axios";
import type { Payment, PaymentFormData, ApiResponse } from "../types";

export const paymentApi = {
  getAll: async (): Promise<Payment[]> => {
    const response = await axiosInstance.get<ApiResponse<Payment[]>>(
      `/payments`
    );
    return response.data.data;
  },

  getById: async (id: number, tenantId: number): Promise<Payment> => {
    const response = await axiosInstance.get<ApiResponse<Payment>>(
      `/payments/${id}`,
      { params: { tenant_id: tenantId } }
    );
    return response.data.data;
  },

  getByMembership: async (membershipId: number): Promise<Payment[]> => {
    const response = await axiosInstance.get<ApiResponse<Payment[]>>(
      `/payments/membership/${membershipId}`
    );
    return response.data.data;
  },

  create: async (data: PaymentFormData): Promise<Payment> => {
    const response = await axiosInstance.post<ApiResponse<Payment>>(
      "/payments",
      data
    );
    return response.data.data;
  },

  delete: async (id: number, tenantId: number): Promise<void> => {
    await axiosInstance.delete(`/payments/${id}`, {
      params: { tenant_id: tenantId },
    });
  },

  updateStatus: async (
    id: number,
    status: "PAID" | "VOID"
  ): Promise<Payment> => {
    const response = await axiosInstance.patch<ApiResponse<Payment>>(
      `/payments/${id}/status`,
      { status }
    );
    return response.data.data;
  },
};
