import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membershipApi } from "../services/membership.service";
import { useAuthStore } from "../store/authStore";
import type { MembershipFormData } from "../types";
import { toast } from "../lib/toast";

export const useMemberships = () => {
  const tenantId = useAuthStore((state) => state.user?.tenant_id);

  return useQuery({
    queryKey: ["memberships", tenantId],
    queryFn: () => membershipApi.getAll(),
    enabled: !!tenantId,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};

export const useMembership = (id: number) => {
  return useQuery({
    queryKey: ["membership", id],
    queryFn: () => membershipApi.getById(id),
    enabled: !!id,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};

export const useMemberMemberships = (memberId: number) => {
  return useQuery({
    queryKey: ["memberships", "member", memberId],
    queryFn: () => membershipApi.getByMember(memberId),
    enabled: !!memberId,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};

export const useCreateMembership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MembershipFormData) => membershipApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
      toast.success("Membership created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create membership");
    },
  });
};

export const useUpdateMembership = () => {
  const queryClient = useQueryClient();
  const tenantId = useAuthStore((state) => state.user?.tenant_id);

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<MembershipFormData>;
    }) => membershipApi.update(id, tenantId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
      toast.success("Membership updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update membership");
    },
  });
};

export const useDeleteMembership = () => {
  const queryClient = useQueryClient();
  const tenantId = useAuthStore((state) => state.user?.tenant_id);

  return useMutation({
    mutationFn: (id: number) => membershipApi.delete(id, tenantId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
      toast.success("Membership deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete membership");
    },
  });
};
