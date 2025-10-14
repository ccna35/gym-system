import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import { planSchema, type PlanFormData } from "../../lib/validations";
import { useCreatePlan, useUpdatePlan } from "../../hooks/usePlans";
import type { Plan } from "../../types";
import { useAuthStore } from "../../store/authStore";

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: Plan | null;
}

export const PlanModal = ({ isOpen, onClose, plan }: PlanModalProps) => {
  const tenantId = useAuthStore((state) => state.user?.tenant_id);
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
  });

  useEffect(() => {
    if (plan) {
      reset({
        name: plan.name,
        description: plan.description || "",
        duration_months: plan.duration_months,
        price: plan.price,
      });
    } else {
      reset({
        name: "",
        description: "",
        duration_months: 1,
        price: 0,
      });
    }
  }, [plan, reset]);

  const onSubmit = async (data: PlanFormData) => {
    if (plan) {
      await updatePlan.mutateAsync({
        id: plan.id,
        data,
      });
    } else {
      await createPlan.mutateAsync({
        ...data,
        tenant_id: tenantId!,
      } as any);
    }
    onClose();
    reset();
  };

  if (!isOpen) return null;

  const isPending = createPlan.isPending || updatePlan.isPending;

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
              {plan ? "Edit Plan" : "Add New Plan"}
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
            {/* Name */}
            <div>
              <label htmlFor="name" className="label">
                Plan Name *
              </label>
              <input
                id="name"
                type="text"
                className="input"
                placeholder="e.g., Basic, Premium, Gold"
                {...register("name")}
              />
              {errors.name && (
                <p className="error-message">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="label">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className="input"
                placeholder="Plan description..."
                {...register("description")}
              />
              {errors.description && (
                <p className="error-message">{errors.description.message}</p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration_months" className="label">
                Duration (months) *
              </label>
              <input
                id="duration_months"
                type="number"
                min="1"
                className="input"
                {...register("duration_months", { valueAsNumber: true })}
              />
              {errors.duration_months && (
                <p className="error-message">
                  {errors.duration_months.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="label">
                Price ($) *
              </label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                className="input"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="error-message">{errors.price.message}</p>
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
                  <>{plan ? "Update" : "Create"} Plan</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
