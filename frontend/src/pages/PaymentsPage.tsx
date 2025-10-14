import { useState } from "react";
import { usePayments, useDeletePayment } from "../hooks/usePayments";
import { useMemberships } from "../hooks/useMemberships";
import { useMembers } from "../hooks/useMembers";
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

export const PaymentsPage = () => {
  const { data: payments, isLoading } = usePayments();
  const { data: memberships } = useMemberships();
  const { data: members } = useMembers();
  const deletePayment = useDeletePayment();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      deletePayment.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Helper to get member name from membership
  const getMemberName = (membershipId: number) => {
    const membership = memberships?.find((m) => m.id === membershipId);
    if (!membership) return "Unknown";
    const member = members?.find((m) => m.id === membership.member_id);
    return member?.full_name || "Unknown";
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

  // Get payment method color
  const getMethodColor = (method: string) => {
    switch (method) {
      case "CASH":
        return "bg-green-100 text-green-800";
      case "CARD":
        return "bg-blue-100 text-blue-800";
      case "BANK_TRANSFER":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        return "Paid";
      case "VOID":
        return "Void";
      default:
        return status;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case "CASH":
        return "Cash";
      case "CARD":
        return "Card";
      case "BANK_TRANSFER":
        return "Bank Transfer";
      default:
        return method;
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
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1">
            Track and manage payment transactions
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Record Payment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(totalRevenue || 0)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cash Payments</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {cashPayments || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Card Payments</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {cardPayments || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <CreditCard className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Bank Transfers
              </p>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                {bankPayments || 0}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="text-purple-600" size={24} />
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
                  <th className="table-header">Member</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header">Payment Method</th>
                  <th className="table-header">Payment Date</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="table-cell font-medium">
                      {getMemberName(payment.membership_id)}
                    </td>
                    <td className="table-cell">
                      <span className="font-bold text-green-600">
                        {formatCurrency(payment.amount)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getMethodColor(
                          payment.method
                        )}`}
                      >
                        {getMethodLabel(payment.method)}
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
                    <td className="table-cell">
                      <button
                        onClick={() => handleDelete(payment.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
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
            No payments recorded yet. Record your first payment!
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};
