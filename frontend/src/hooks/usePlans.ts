import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { planApi } from "../services/plan.service";
import { useAuthStore } from "../store/authStore";
import type { PlanFormData } from "../types";
import { toast } from "../lib/toast";

export const usePlans = () => {
  const tenantId = useAuthStore((state) => state.user?.tenant_id);

  return useQuery({
    queryKey: ["plans", tenantId],
    queryFn: () => planApi.getAll(tenantId!),
    enabled: !!tenantId,
  });
};

export const usePlan = (id: number) => {
  const tenantId = useAuthStore((state) => state.user?.tenant_id);

  return useQuery({
    queryKey: ["plan", id, tenantId],
    queryFn: () => planApi.getById(id, tenantId!),
    enabled: !!id && !!tenantId,
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PlanFormData) => planApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Plan created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create plan");
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  const tenantId = useAuthStore((state) => state.user?.tenant_id);

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PlanFormData> }) =>
      planApi.update(id, tenantId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Plan updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update plan");
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();
  const tenantId = useAuthStore((state) => state.user?.tenant_id);

  return useMutation({
    mutationFn: (id: number) => planApi.delete(id, tenantId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Plan deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete plan");
    },
  });
};
