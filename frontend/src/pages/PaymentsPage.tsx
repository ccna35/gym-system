import { useState } from "react";
import {
  usePayments,
  useDeletePayment,
  useUpdatePaymentStatus,
  useTotalRevenue,
} from "../hooks/usePayments";
import { Trash2, Loader2, DollarSign, Ban, CheckCircle } from "lucide-react";
import { formatCurrency, formatDateTime } from "../lib/utils";
import { t } from "../i18n";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export const PaymentsPage = () => {
  const { data: payments, isLoading } = usePayments();
  const { data: totalRevenue } = useTotalRevenue();
  const deletePayment = useDeletePayment();
  const updatePaymentStatus = useUpdatePaymentStatus();

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    paymentId: number | null;
  }>({ open: false, paymentId: null });

  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    paymentId: number | null;
    currentStatus: string | null;
  }>({ open: false, paymentId: null, currentStatus: null });

  const handleDelete = (id: number) => {
    setDeleteDialog({ open: true, paymentId: id });
  };

  const confirmDelete = () => {
    if (deleteDialog.paymentId) {
      deletePayment.mutate(deleteDialog.paymentId);
    }
  };

  const handleToggleStatus = (id: number, currentStatus: string) => {
    setStatusDialog({ open: true, paymentId: id, currentStatus });
  };

  const confirmToggleStatus = () => {
    if (statusDialog.paymentId && statusDialog.currentStatus) {
      const newStatus = statusDialog.currentStatus === "PAID" ? "VOID" : "PAID";
      updatePaymentStatus.mutate({
        id: statusDialog.paymentId,
        status: newStatus,
      });
    }
  };

  // Get payment status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "VOID":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get payment method label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PAID":
        return t.payments.paid;
      case "VOID":
        return t.payments.void;
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t.payments.title}
          </h1>
          <p className="text-gray-600 mt-1">{t.payments.subtitle}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t.payments.totalRevenue}
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(totalRevenue || 0)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card overflow-hidden p-0">
        {payments && payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="table-header text-right">
                    {t.memberships.member}
                  </th>
                  <th className="table-header text-right">
                    {t.payments.amount}
                  </th>
                  <th className="table-header text-right">
                    {t.payments.paymentDate}
                  </th>
                  <th className="table-header text-right">{t.common.status}</th>
                  <th className="table-header text-right">
                    {t.payments.payment_recipient}
                  </th>
                  <th className="table-header text-right">
                    {t.common.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="table-cell font-medium">
                      {payment.member_name}
                    </td>
                    <td className="table-cell">
                      <span className="font-bold text-green-600">
                        {formatCurrency(payment.amount)}
                      </span>
                    </td>
                    <td className="table-cell text-gray-600">
                      {formatDateTime(payment.created_at)}
                    </td>
                    <td className="table-cell">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          payment.status
                        )}`}
                      >
                        {getStatusLabel(payment.status)}
                      </span>
                    </td>
                    <td className="table-cell font-medium">
                      {payment.created_by_name}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() =>
                            handleToggleStatus(payment.id, payment.status)
                          }
                          variant="ghost"
                          size="icon"
                          className={
                            payment.status === "PAID"
                              ? "text-red-600 hover:bg-red-50"
                              : "text-green-600 hover:bg-green-50"
                          }
                          title={
                            payment.status === "PAID"
                              ? "إلغاء الدفعة"
                              : "تفعيل الدفعة"
                          }
                        >
                          {payment.status === "PAID" ? (
                            <Ban size={18} />
                          ) : (
                            <CheckCircle size={18} />
                          )}
                        </Button>
                        <Button
                          onClick={() => handleDelete(payment.id)}
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:bg-red-50"
                          title={t.common.delete}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            {t.payments.noPayments}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, paymentId: deleteDialog.paymentId })
        }
        onConfirm={confirmDelete}
        title="حذف الدفعة"
        description={t.payments.deleteConfirm}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="destructive"
      />

      {/* Status Toggle Confirmation Dialog */}
      <ConfirmDialog
        open={statusDialog.open}
        onOpenChange={(open) =>
          setStatusDialog({
            open,
            paymentId: statusDialog.paymentId,
            currentStatus: statusDialog.currentStatus,
          })
        }
        onConfirm={confirmToggleStatus}
        title={
          statusDialog.currentStatus === "PAID"
            ? "إلغاء الدفعة"
            : "تفعيل الدفعة"
        }
        description={
          statusDialog.currentStatus === "PAID"
            ? "هل أنت متأكد من إلغاء هذه الدفعة؟ سيتم تغيير حالة الدفعة إلى ملغية."
            : "هل أنت متأكد من تفعيل هذه الدفعة؟ سيتم تغيير حالة الدفعة إلى مدفوعة."
        }
        confirmText="تأكيد"
        cancelText="إلغاء"
        variant={
          statusDialog.currentStatus === "PAID" ? "destructive" : "default"
        }
      />
    </div>
  );
};
