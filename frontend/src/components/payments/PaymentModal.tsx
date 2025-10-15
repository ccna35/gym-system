import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2 } from "lucide-react";
import { useCreatePayment } from "../../hooks/usePayments";
import { useMemberships } from "../../hooks/useMemberships";
import { useMembers } from "../../hooks/useMembers";
import { usePlans } from "../../hooks/usePlans";
import { t } from "../../i18n";

const paymentSchema = z.object({
  membership_id: z.number().min(1, "Please select a membership"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  payment_method: z.enum(["CASH", "CARD", "BANK_TRANSFER"]),
  payment_date: z.string().min(1, "Payment date is required"),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal = ({ isOpen, onClose }: PaymentModalProps) => {
  const { data: memberships } = useMemberships();
  const { data: members } = useMembers();
  const { data: plans } = usePlans();
  const createPayment = useCreatePayment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payment_date: new Date().toISOString().split("T")[0],
      payment_method: "CASH",
    },
  });

  const onSubmit = async (data: PaymentFormData) => {
    try {
      await createPayment.mutateAsync(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to create payment:", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Helper to get membership display text
  const getMembershipDisplay = (membershipId: number) => {
    const membership = memberships?.find((m) => m.id === membershipId);
    if (!membership) return "Unknown";

    const member = members?.find((m) => m.id === membership.member_id);
    const plan = plans?.find((p) => p.id === membership.plan_id);
    const memberName = member?.full_name || "Unknown";
    const planName = plan?.name || "Unknown Plan";

    return `${memberName} - ${planName}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-right align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold text-gray-900">
              {t.payments.recordPayment}
            </h3>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              {/* Membership Select */}
              <div>
                <label className="form-label">{t.payments.membership} *</label>
                <select
                  {...register("membership_id", {
                    setValueAs: (v) => (v === "" ? 0 : parseInt(v)),
                  })}
                  className={`input ${
                    errors.membership_id ? "border-red-500" : ""
                  }`}
                >
                  <option value="">{t.payments.selectMembership}</option>
                  {memberships?.map((membership) => (
                    <option key={membership.id} value={membership.id}>
                      {getMembershipDisplay(membership.id)} (
                      {new Date(membership.start_date).toLocaleDateString()} -{" "}
                      {new Date(membership.end_date).toLocaleDateString()})
                    </option>
                  ))}
                </select>
                {errors.membership_id && (
                  <p className="error-text">{errors.membership_id.message}</p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="form-label">{t.payments.amount} *</label>
                <input
                  type="number"
                  step="0.01"
                  {...register("amount", {
                    setValueAs: (v) => (v === "" ? 0 : parseFloat(v)),
                  })}
                  placeholder="0.00"
                  className={`input ${errors.amount ? "border-red-500" : ""}`}
                />
                {errors.amount && (
                  <p className="error-text">{errors.amount.message}</p>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label className="form-label">
                  {t.payments.paymentMethod} *
                </label>
                <select
                  {...register("payment_method")}
                  className={`input ${
                    errors.payment_method ? "border-red-500" : ""
                  }`}
                >
                  <option value="CASH">{t.payments.cash}</option>
                  <option value="CARD">{t.payments.card}</option>
                  <option value="BANK_TRANSFER">
                    {t.payments.bankTransfer}
                  </option>
                </select>
                {errors.payment_method && (
                  <p className="error-text">{errors.payment_method.message}</p>
                )}
              </div>

              {/* Payment Date */}
              <div>
                <label className="form-label">{t.payments.paymentDate} *</label>
                <input
                  type="date"
                  {...register("payment_date")}
                  className={`input ${
                    errors.payment_date ? "border-red-500" : ""
                  }`}
                />
                {errors.payment_date && (
                  <p className="error-text">{errors.payment_date.message}</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="form-label">{t.common.notes}</label>
                <textarea
                  {...register("notes")}
                  rows={3}
                  placeholder={t.common.notes}
                  className="input"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-secondary"
                disabled={createPayment.isPending}
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="btn btn-primary flex items-center"
                disabled={createPayment.isPending}
              >
                {createPayment.isPending ? (
                  <>
                    <Loader2 className="animate-spin ml-2" size={20} />
                    {t.common.recording}
                  </>
                ) : (
                  t.payments.recordPayment
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
