import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useMembers, useDeleteMember } from "../hooks/useMembers";
import { Plus, Edit, Trash2, Search, Loader2, Info } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { formatDate, getMembershipStatusColor } from "../lib/utils";
import { MemberModal } from "../components/members/MemberModal";
import type { Member } from "../types";
import { t } from "../i18n";

export const MembersPage = () => {
  const [searchParams] = useSearchParams();
  const { data: members, isLoading } = useMembers();
  const deleteMember = useDeleteMember();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    memberId: number | null;
  }>({ open: false, memberId: null });

  const statusFilter = (searchParams.get("status") || "").toUpperCase();
  const validStatuses = new Set(["ACTIVE", "EXPIRING_SOON", "EXPIRED"]);
  const filteredMembers = members?.filter((member) => {
    const matchesSearch =
      member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone?.includes(searchQuery);
    const matchesStatus =
      !validStatuses.has(statusFilter) ||
      member.membership_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteDialog({ open: true, memberId: id });
  };

  const confirmDelete = () => {
    if (deleteDialog.memberId) {
      deleteMember.mutate(deleteDialog.memberId);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const getMembershipStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return t.memberships.active;
      case "EXPIRING_SOON":
        return t.memberships.expiringSoon;
      case "EXPIRED":
        return t.memberships.expired;
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
            {t.members.title}
          </h1>
          <p className="text-gray-600 mt-1">{t.members.subtitle}</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={20} className="ml-2" />
          {t.members.addMember}
        </Button>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            type="text"
            placeholder={t.members.searchMembers}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      {/* Members Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="table-header text-right">
                  {t.members.fullName}
                </th>
                <th className="table-header text-right">{t.members.email}</th>
                <th className="table-header text-right">{t.members.phone}</th>
                <th className="table-header text-right">
                  {t.members.membershipStatus}
                </th>
                <th className="table-header text-right">
                  {t.members.joinDate}
                </th>
                <th className="table-header text-right">
                  {t.members.remainingAmount}
                </th>
                <th className="table-header text-right">{t.common.actions}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers?.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {t.common.noData}
                  </td>
                </tr>
              ) : (
                filteredMembers?.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="table-cell font-medium">
                      {member.full_name}
                    </td>
                    <td className="table-cell text-gray-500">
                      {member.email || "N/A"}
                    </td>
                    <td className="table-cell text-gray-500">
                      {member.phone || "N/A"}
                    </td>
                    <td className="table-cell">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getMembershipStatusColor(
                          member.membership_status
                        )}`}
                      >
                        {getMembershipStatusLabel(member.membership_status)}
                      </span>
                    </td>
                    <td className="table-cell text-gray-500">
                      {formatDate(member.created_at)}
                    </td>
                    <td className="table-cell text-gray-500">
                      {parseFloat(member.remaining_amount).toLocaleString(
                        undefined,
                        { style: "currency", currency: "USD" }
                      )}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/members/${member.id}`}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="تفاصيل العضو"
                        >
                          <Info size={18} />
                        </Link>
                        <Button
                          onClick={() => handleEdit(member)}
                          variant="ghost"
                          size="icon"
                          className="text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={t.common.edit}
                        >
                          <Edit size={18} />
                        </Button>
                        <Button
                          onClick={() => handleDelete(member.id)}
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title={t.common.delete}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Modal */}
      <MemberModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        member={editingMember}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, memberId: deleteDialog.memberId })
        }
        onConfirm={confirmDelete}
        title="حذف العضو"
        description={t.members.deleteConfirm}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="destructive"
      />
    </div>
  );
};
