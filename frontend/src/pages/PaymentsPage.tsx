import { useState } from "react";
import { usePayments, useDeletePayment } from "../hooks/usePayments";
import {
  Plus,
  Trash2,
  Loader2,
  DollarSign,
  CreditCard,
  Calendar,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "../lib/utils";
import { PaymentModal } from "../components/payments/PaymentModal";
import { t } from "../i18n";

export const PaymentsPage = () => {
  const { data: payments, isLoading } = usePayments();
  const deletePayment = useDeletePayment();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (id: number) => {
    if (window.confirm(t.payments.deleteConfirm)) {
      deletePayment.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Calculate total revenue
  const totalRevenue = payments?.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  );

  // Calculate payments by method
  const cashPayments = payments?.filter((p) => p.method === "CASH").length;
  const cardPayments = payments?.filter((p) => p.method === "CARD").length;
  const bankPayments = payments?.filter(
    (p) => p.method === "BANK_TRANSFER"
  ).length;

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
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus size={20} className="ml-2" />
          {t.payments.recordPayment}
        </button>
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
                      <button
                        onClick={() => handleDelete(payment.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={t.common.delete}
                      >
                        <Trash2 size={18} />
                      </button>
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

      {/* Payment Modal */}
      <PaymentModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};
