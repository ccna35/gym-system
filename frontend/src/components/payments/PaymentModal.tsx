import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2 } from "lucide-react";
import { useCreatePayment } from "../../hooks/usePayments";
import { useMemberships } from "../../hooks/useMemberships";
import { useMembers } from "../../hooks/useMembers";
import { usePlans } from "../../hooks/usePlans";

const paymentSchema = z.object({
  membership_id: z.number().min(1, "Please select a membership"),
  amount_cents: z.number().min(0.01, "Amount must be greater than 0"),
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
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Record Payment</h2>
          <button onClick={handleClose} className="modal-close">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="modal-body">
          <div className="space-y-4">
            {/* Membership Select */}
            <div>
              <label className="form-label">Membership *</label>
              <select
                {...register("membership_id", {
                  setValueAs: (v) => (v === "" ? 0 : parseInt(v)),
                })}
                className={`input ${
                  errors.membership_id ? "border-red-500" : ""
                }`}
              >
                <option value="">Select membership</option>
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
              <label className="form-label">Amount *</label>
              <input
                type="number"
                step="0.01"
                {...register("amount_cents", {
                  setValueAs: (v) => (v === "" ? 0 : parseFloat(v)),
                })}
                placeholder="0.00"
                className={`input ${
                  errors.amount_cents ? "border-red-500" : ""
                }`}
              />
              {errors.amount_cents && (
                <p className="error-text">{errors.amount_cents.message}</p>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label className="form-label">Payment Method *</label>
              <select
                {...register("payment_method")}
                className={`input ${
                  errors.payment_method ? "border-red-500" : ""
                }`}
              >
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </select>
              {errors.payment_method && (
                <p className="error-text">{errors.payment_method.message}</p>
              )}
            </div>

            {/* Payment Date */}
            <div>
              <label className="form-label">Payment Date *</label>
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
              <label className="form-label">Notes</label>
              <textarea
                {...register("notes")}
                rows={3}
                placeholder="Additional notes (optional)"
                className="input"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
              disabled={createPayment.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={createPayment.isPending}
            >
              {createPayment.isPending ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Recording...
                </>
              ) : (
                "Record Payment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
