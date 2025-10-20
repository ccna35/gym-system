import axiosInstance from "../lib/axios";

export interface DashboardSummary {
  total_members: number;
  active_members: number;
  expiring_soon_members: number;
  expired_members: number;
  totalRevenue?: number;
}

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    const res = await axiosInstance.get<{
      success: boolean;
      data: DashboardSummary;
    }>("/dashboard/summary");
    return res.data.data;
  },
};
