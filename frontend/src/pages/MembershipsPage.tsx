import { useState } from "react";
import { useMemberships } from "../hooks/useMemberships";
import { Plus, Loader2, User, Calendar } from "lucide-react";
import { formatDate, getStatusColor, formatCurrency } from "../lib/utils";
import { MembershipModal } from "../components/memberships/MembershipModal";
import type { Membership } from "../types";
import { t } from "../i18n";

export const MembershipsPage = () => {
  const { data: memberships, isLoading } = useMemberships();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMembership, setEditingMembership] = useState<Membership | null>(
    null
  );

  const getMembershipStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return t.memberships.active;
      case "EXPIRING_SOON":
        return t.memberships.expiringSoon;
      case "EXPIRED":
        return t.memberships.expired;
      case "SUSPENDED":
        return t.memberships.suspended;
      default:
        return status;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMembership(null);
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
            {t.memberships.title}
          </h1>
          <p className="text-gray-600 mt-1">{t.memberships.subtitle}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus size={20} className="ml-2" />
          {t.memberships.addMembership}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t.memberships.total}
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {memberships?.length || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t.memberships.active}
              </p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {memberships?.filter((m) => m.status === "ACTIVE").length || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <User className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t.memberships.expired}
              </p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {memberships?.filter((m) => m.status === "EXPIRED").length || 0}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Calendar className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Memberships Table */}
      <div className="card overflow-hidden p-0">
        {memberships && memberships.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="table-header text-right">
                    {t.memberships.member}
                  </th>
                  <th className="table-header text-right">
                    {t.memberships.startDate}
                  </th>
                  <th className="table-header text-right">
                    {t.memberships.endDate}
                  </th>
                  <th className="table-header text-right">{t.common.status}</th>
                  <th className="table-header text-right">{t.plans.price}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {memberships.map((membership) => {
                  return (
                    <tr key={membership.id} className="hover:bg-gray-50">
                      <td className="table-cell font-medium">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-gray-400" />
                          {membership.member_name}
                        </div>
                      </td>
                      <td className="table-cell text-gray-600">
                        {formatDate(membership.start_date)}
                      </td>
                      <td className="table-cell text-gray-600">
                        {formatDate(membership.end_date)}
                      </td>
                      <td className="table-cell">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            membership.status
                          )}`}
                        >
                          {getMembershipStatusLabel(membership.status)}
                        </span>
                      </td>
                      <td className="table-cell font-semibold text-primary-600">
                        {formatCurrency(membership.price) || "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            {t.common.noData}
          </div>
        )}
      </div>

      {/* Membership Modal */}
      <MembershipModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        membership={editingMembership}
      />
    </div>
  );
};
