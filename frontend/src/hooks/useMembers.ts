import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memberApi } from "../services/member.service";
import { useAuthStore } from "../store/authStore";
import type { MemberFormData } from "../types";

import type { MemberDetails } from "../services/member.service";
import { toast } from "../lib/toast";

export const useMembers = () => {
  const tenantId = useAuthStore((state) => state.user?.tenant_id);

  return useQuery({
    queryKey: ["members", tenantId],
    queryFn: () => memberApi.getAll(),
    enabled: !!tenantId,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};

export const useMember = (id: number) => {
  const tenantId = useAuthStore((state) => state.user?.tenant_id);

  return useQuery({
    queryKey: ["member", id, tenantId],
    queryFn: () => memberApi.getById(id, tenantId!),
    enabled: !!id && !!tenantId,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MemberFormData) => memberApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Member created successfully!");
    },
    onError: (error: Error) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to create member");
    },
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MemberFormData> }) =>
      memberApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Member updated successfully!");
    },
    onError: (error: Error) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to update member");
    },
  });
};

// New: Hook to fetch member details (info, memberships, payments, stats)
export const useMemberDetails = (id: number) => {
  return useQuery<MemberDetails>({
    queryKey: ["memberDetails", id],
    queryFn: () => memberApi.getDetails(id),
    enabled: !!id,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  const tenantId = useAuthStore((state) => state.user?.tenant_id);

  return useMutation({
    mutationFn: (id: number) => memberApi.delete(id, tenantId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Member deleted successfully!");
    },
    onError: (error: Error) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to delete member");
    },
  });
};
