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
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};

export const usePayment = (id: number) => {
  const tenantId = useAuthStore((state) => state.user?.tenant_id);

  return useQuery({
    queryKey: ["payment", id, tenantId],
    queryFn: () => paymentApi.getById(id, tenantId!),
    enabled: !!id && !!tenantId,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};

export const useMembershipPayments = (membershipId: number) => {
  return useQuery({
    queryKey: ["payments", "membership", membershipId],
    queryFn: () => paymentApi.getByMembership(membershipId),
    enabled: !!membershipId,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PaymentFormData) => paymentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("تم تسجيل الدفعة بنجاح!");
    },
    onError: (error: unknown) => {
      let msg = "فشل تسجيل الدفعة";
      if (typeof error === "object" && error !== null) {
        // @ts-expect-error: error may have response/message from API
        msg = error?.response?.data?.message || error?.message || msg;
      }
      if (msg === "Failed to record payment") msg = "فشل تسجيل الدفعة";
      toast.error(msg);
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
      toast.success("تم حذف الدفعة بنجاح!");
    },
    onError: (error: unknown) => {
      let msg = "فشل حذف الدفعة";
      if (typeof error === "object" && error !== null) {
        // @ts-expect-error: error may have response/message from API
        msg = error?.response?.data?.message || error?.message || msg;
      }
      if (msg === "Failed to delete payment") msg = "فشل حذف الدفعة";
      toast.error(msg);
    },
  });
};

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: "PAID" | "VOID" }) =>
      paymentApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["member"] });
      toast.success("تم تحديث حالة الدفعة بنجاح!");
    },
    onError: (error: unknown) => {
      let msg = "فشل تحديث حالة الدفعة";
      if (typeof error === "object" && error !== null) {
        // @ts-expect-error: error may have response/message from API
        msg = error?.response?.data?.message || error?.message || msg;
      }
      toast.error(msg);
    },
  });
};
