import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentApi } from "../services/payment.service";
import { useAuthStore } from "../store/authStore";
import type { PaymentFormData } from "../types";
import { toast } from "../lib/toast";

export const usePayments = () => {
  const tenantId = useAuthStore((state) => state.user?.tenant_id);

  return useQuery({
    queryKey: ["payments", tenantId],
    queryFn: () => paymentApi.getAll(),
    enabled: !!tenantId,
  });
};

export const usePayment = (id: number) => {
  const tenantId = useAuthStore((state) => state.user?.tenant_id);

  return useQuery({
    queryKey: ["payment", id, tenantId],
    queryFn: () => paymentApi.getById(id, tenantId!),
    enabled: !!id && !!tenantId,
  });
};

export const useMembershipPayments = (membershipId: number) => {
  return useQuery({
    queryKey: ["payments", "membership", membershipId],
    queryFn: () => paymentApi.getByMembership(membershipId),
    enabled: !!membershipId,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PaymentFormData) => paymentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Payment recorded successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to record payment");
    },
  });
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();
  const tenantId = useAuthStore((state) => state.user?.tenant_id);

  return useMutation({
    mutationFn: (id: number) => paymentApi.delete(id, tenantId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Payment deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete payment");
    },
  });
};
