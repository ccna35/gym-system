import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../services/dashboard.service";
import { useAuthStore } from "../store/authStore";

export const useDashboardSummary = () => {
  const tenantId = useAuthStore((s) => s.user?.tenant_id);
  return useQuery({
    queryKey: ["dashboard-summary", tenantId],
    queryFn: () => dashboardApi.getSummary(),
    enabled: !!tenantId,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};
