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
import { t } from "../../i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      price: membership?.price ?? 250,
    },
  });

  useEffect(() => {
    if (membership) {
      reset({
        price: membership.price,
        start_date: membership.start_date.split("T")[0],
      });
    } else {
      reset({
        start_date: new Date().toISOString().split("T")[0],
        price: 250,
      });
    }
  }, [membership, reset]);

  console.log(errors);

  const onSubmit = async (data: MembershipFormData) => {
    if (membership) {
      await updateMembership.mutateAsync({
        id: membership.id,
        data,
      });
    } else {
      await createMembership.mutateAsync(data);
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
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X size={24} />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Price */}
            <div>
              <Label htmlFor="price">{t.memberships.price} *</Label>
              <Input
                id="price"
                type="number"
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
              <Label htmlFor="member_id">{t.memberships.member} *</Label>
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
              <Label htmlFor="start_date">{t.memberships.startDate} *</Label>
              <Input id="start_date" type="date" {...register("start_date")} />
              {errors.start_date && (
                <p className="error-message">{errors.start_date.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
                disabled={isPending}
              >
                {t.common.cancel}
              </Button>
              <Button
                type="submit"
                className="flex items-center"
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
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
