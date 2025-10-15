import { useEffect } from "react";
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
import type { Membership } from "../../types";
import { useAuthStore } from "../../store/authStore";
import { t } from "../../i18n";

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
  const createMembership = useCreateMembership();
  const updateMembership = useUpdateMembership();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MembershipFormData>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      status: "ACTIVE",
      price: membership?.price ?? 250,
    },
  });

  useEffect(() => {
    if (membership) {
      reset({
        member_id: membership.member_id,
        start_date: membership.start_date.split("T")[0],
        status: membership.status,
        price: membership.price,
      });
    } else {
      reset({
        member_id: 0,
        start_date: new Date().toISOString().split("T")[0],
        status: "ACTIVE",
        price: 250,
      });
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
      } as Membership);
    }
    onClose();
    reset();
  };

  if (!isOpen) return null;

  const isPending = createMembership.isPending || updateMembership.isPending;

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
              {membership
                ? t.memberships.editMembership
                : t.memberships.newMembership}
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
            {/* Price */}
            <div>
              <label htmlFor="price" className="label">
                {t.memberships.price} *
              </label>
              <input
                id="price"
                type="number"
                className="input"
                min={0}
                step={1}
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="error-message">{errors.price.message}</p>
              )}
            </div>
            {/* Member Selection */}
            <div>
              <label htmlFor="member_id" className="label">
                {t.memberships.member} *
              </label>
              <select
                id="member_id"
                className="input"
                {...register("member_id", { valueAsNumber: true })}
              >
                <option value={0}>{t.memberships.selectMember}</option>
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

            {/* Start Date */}
            <div>
              <label htmlFor="start_date" className="label">
                {t.memberships.startDate} *
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

            {/* Status */}
            <div>
              <label htmlFor="status" className="label">
                {t.common.status} *
              </label>
              <select id="status" className="input" {...register("status")}>
                <option value="ACTIVE">{t.memberships.active}</option>
                <option value="EXPIRED">{t.memberships.expired}</option>
                <option value="SUSPENDED">{t.memberships.suspended}</option>
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
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="btn btn-primary flex items-center"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin ml-2" size={20} />
                    {t.common.saving}
                  </>
                ) : (
                  <>
                    {membership ? t.common.update : t.common.create}{" "}
                    {t.memberships.title.slice(0, -2)}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
