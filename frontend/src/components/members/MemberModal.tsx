import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import { memberSchema, type MemberFormData } from "../../lib/validations";
import { useCreateMember, useUpdateMember } from "../../hooks/useMembers";
import type { Member } from "../../types";
import { t } from "../../i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member?: Member | null;
}

export const MemberModal = ({ isOpen, onClose, member }: MemberModalProps) => {
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      status: "ACTIVE",
      dob: member?.dob || "",
    },
  });

  useEffect(() => {
    if (member) {
      reset({
        full_name: member.full_name,
        email: member.email || "",
        phone: member.phone || "",
        dob: member.dob || "",
        emergency_contact: member.emergency_contact || "",
        medical_notes: member.medical_notes || "",
        photo_url: member.photo_url || "",
        status: member.status,
      });
    } else {
      reset({
        full_name: "",
        email: "",
        phone: "",
        dob: "",
        emergency_contact: "",
        medical_notes: "",
        photo_url: "",
        status: "ACTIVE",
      });
    }
  }, [member, reset]);

  const onSubmit = async (data: MemberFormData) => {
    if (member) {
      await updateMember.mutateAsync({
        id: member.id,
        data,
      });
    } else {
      await createMember.mutateAsync(data);
    }
    onClose();
    reset();
  };

  if (!isOpen) return null;

  const isPending = createMember.isPending || updateMember.isPending;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {member ? t.members.editMember : t.members.newMember}
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <Label htmlFor="full_name">{t.members.fullName} *</Label>
                <Input id="full_name" type="text" {...register("full_name")} />
                {errors.full_name && (
                  <p className="error-message">{errors.full_name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">{t.members.email}</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="error-message">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone">{t.members.phone}</Label>
                <Input id="phone" type="tel" {...register("phone")} />
                {errors.phone && (
                  <p className="error-message">{errors.phone.message}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <Label htmlFor="dob">{t.members.dateOfBirth}</Label>
                <Input id="dob" type="date" {...register("dob")} />
                {errors.dob && (
                  <p className="error-message">{errors.dob.message}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status">{t.common.status} *</Label>
                <select id="status" className="input" {...register("status")}>
                  <option value="ACTIVE">{t.memberships.active}</option>
                  <option value="EXPIRED">{t.memberships.expired}</option>
                  <option value="SUSPENDED">{t.memberships.suspended}</option>
                </select>
                {errors.status && (
                  <p className="error-message">{errors.status.message}</p>
                )}
              </div>

              {/* Emergency Contact */}
              <div className="sm:col-span-2">
                <Label htmlFor="emergency_contact">
                  {t.members.emergencyContact}
                </Label>
                <Input
                  id="emergency_contact"
                  type="text"
                  {...register("emergency_contact")}
                />
                {errors.emergency_contact && (
                  <p className="error-message">
                    {errors.emergency_contact.message}
                  </p>
                )}
              </div>

              {/* Medical Notes */}
              <div className="sm:col-span-2">
                <Label htmlFor="medical_notes">{t.members.medicalNotes}</Label>
                <textarea
                  id="medical_notes"
                  rows={3}
                  className="input"
                  {...register("medical_notes")}
                />
                {errors.medical_notes && (
                  <p className="error-message">
                    {errors.medical_notes.message}
                  </p>
                )}
              </div>

              {/* Photo URL */}
              <div className="sm:col-span-2">
                <Label htmlFor="photo_url">{t.members.photoUrl}</Label>
                <Input
                  id="photo_url"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  {...register("photo_url")}
                />
                {errors.photo_url && (
                  <p className="error-message">{errors.photo_url.message}</p>
                )}
              </div>
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
                    {member ? t.common.update : t.common.create}{" "}
                    {t.members.title.slice(0, -1)}
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
