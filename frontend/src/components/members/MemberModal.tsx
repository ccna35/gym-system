import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import { memberSchema, type MemberFormData } from "../../lib/validations";
import { useCreateMember, useUpdateMember } from "../../hooks/useMembers";
import type { Member } from "../../types";
import { useAuthStore } from "../../store/authStore";

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member?: Member | null;
}

export const MemberModal = ({ isOpen, onClose, member }: MemberModalProps) => {
  const tenantId = useAuthStore((state) => state.user?.tenant_id);
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
      await createMember.mutateAsync({
        ...data,
        tenant_id: tenantId!,
      } as any);
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
              {member ? "Edit Member" : "Add New Member"}
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label htmlFor="full_name" className="label">
                  Full Name *
                </label>
                <input
                  id="full_name"
                  type="text"
                  className="input"
                  {...register("full_name")}
                />
                {errors.full_name && (
                  <p className="error-message">{errors.full_name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="error-message">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="label">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="input"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="error-message">{errors.phone.message}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="dob" className="label">
                  Date of Birth
                </label>
                <input
                  id="dob"
                  type="date"
                  className="input"
                  {...register("dob")}
                />
                {errors.dob && (
                  <p className="error-message">{errors.dob.message}</p>
                )}
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

              {/* Emergency Contact */}
              <div className="sm:col-span-2">
                <label htmlFor="emergency_contact" className="label">
                  Emergency Contact
                </label>
                <input
                  id="emergency_contact"
                  type="text"
                  className="input"
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
                <label htmlFor="medical_notes" className="label">
                  Medical Notes
                </label>
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
                <label htmlFor="photo_url" className="label">
                  Photo URL
                </label>
                <input
                  id="photo_url"
                  type="url"
                  className="input"
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
                  <>{member ? "Update" : "Create"} Member</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
