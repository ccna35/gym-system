import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import {
  membershipSchema,
  type MembershipFormData,
} from "../../lib/validations";
import {
  useCreateMembership,
  useUpdateMembership,
} from "../../hooks/useMemberships";
import { useMembers } from "../../hooks/useMembers";
import { usePlans } from "../../hooks/usePlans";
import type { Membership } from "../../types";
import { useAuthStore } from "../../store/authStore";
import { calculateEndDate } from "../../lib/utils";

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  membership?: Membership | null;
}

export const MembershipModal = ({
  isOpen,
  onClose,
  membership,
}: MembershipModalProps) => {
  const tenantId = useAuthStore((state) => state.user?.tenant_id);
  const { data: members } = useMembers();
  const { data: plans } = usePlans();
  const createMembership = useCreateMembership();
  const updateMembership = useUpdateMembership();
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MembershipFormData>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      status: "ACTIVE",
    },
  });

  const startDate = watch("start_date");
  const planId = watch("plan_id");

  // Auto-calculate end date when start date or plan changes
  useEffect(() => {
    if (startDate && planId) {
      const plan = plans?.find((p) => p.id === Number(planId));
      if (plan) {
        const endDate = calculateEndDate(startDate, plan.duration_months);
        setValue("end_date", endDate);
      }
    }
  }, [startDate, planId, plans, setValue]);

  useEffect(() => {
    if (membership) {
      reset({
        member_id: membership.member_id,
        plan_id: membership.plan_id,
        start_date: membership.start_date.split("T")[0],
        end_date: membership.end_date.split("T")[0],
        status: membership.status,
      });
      setSelectedPlanId(membership.plan_id);
    } else {
      reset({
        member_id: 0,
        plan_id: 0,
        start_date: new Date().toISOString().split("T")[0],
        end_date: "",
        status: "ACTIVE",
      });
      setSelectedPlanId(null);
    }
  }, [membership, reset]);

  const onSubmit = async (data: MembershipFormData) => {
    if (membership) {
      await updateMembership.mutateAsync({
        id: membership.id,
        data,
      });
    } else {
      await createMembership.mutateAsync({
        ...data,
        tenant_id: tenantId!,
      } as any);
    }
    onClose();
    reset();
  };

  if (!isOpen) return null;

  const isPending = createMembership.isPending || updateMembership.isPending;
  const selectedPlan = plans?.find((p) => p.id === selectedPlanId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {membership ? "Edit Membership" : "New Membership"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Member Selection */}
            <div>
              <label htmlFor="member_id" className="label">
                Member *
              </label>
              <select
                id="member_id"
                className="input"
                {...register("member_id", { valueAsNumber: true })}
              >
                <option value={0}>Select a member</option>
                {members?.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.full_name}
                  </option>
                ))}
              </select>
              {errors.member_id && (
                <p className="error-message">{errors.member_id.message}</p>
              )}
            </div>

            {/* Plan Selection */}
            <div>
              <label htmlFor="plan_id" className="label">
                Plan *
              </label>
              <select
                id="plan_id"
                className="input"
                {...register("plan_id", {
                  valueAsNumber: true,
                  onChange: (e) => setSelectedPlanId(Number(e.target.value)),
                })}
              >
                <option value={0}>Select a plan</option>
                {plans?.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - ${plan.price} ({plan.duration_months}{" "}
                    {plan.duration_months === 1 ? "month" : "months"})
                  </option>
                ))}
              </select>
              {errors.plan_id && (
                <p className="error-message">{errors.plan_id.message}</p>
              )}
              {selectedPlan && (
                <p className="text-sm text-gray-600 mt-2">
                  Duration: {selectedPlan.duration_months} month(s) | Price: $
                  {selectedPlan.price}
                </p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="start_date" className="label">
                Start Date *
              </label>
              <input
                id="start_date"
                type="date"
                className="input"
                {...register("start_date")}
              />
              {errors.start_date && (
                <p className="error-message">{errors.start_date.message}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="end_date" className="label">
                End Date *
              </label>
              <input
                id="end_date"
                type="date"
                className="input"
                {...register("end_date")}
              />
              {errors.end_date && (
                <p className="error-message">{errors.end_date.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Auto-calculated based on plan duration
              </p>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="label">
                Status *
              </label>
              <select id="status" className="input" {...register("status")}>
                <option value="ACTIVE">Active</option>
                <option value="EXPIRED">Expired</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
              {errors.status && (
                <p className="error-message">{errors.status.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex items-center"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Saving...
                  </>
                ) : (
                  <>{membership ? "Update" : "Create"} Membership</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
