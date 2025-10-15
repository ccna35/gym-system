import { useState } from "react";
import { useMembers, useDeleteMember } from "../hooks/useMembers";
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { formatDate, getStatusColor } from "../lib/utils";
import { MemberModal } from "../components/members/MemberModal";
import type { Member } from "../types";
import { t } from "../i18n";

export const MembersPage = () => {
  const { data: members, isLoading } = useMembers();
  const deleteMember = useDeleteMember();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const filteredMembers = members?.filter(
    (member) =>
      member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone?.includes(searchQuery)
  );

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t.members.deleteConfirm)) {
      deleteMember.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
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
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus size={20} className="ml-2" />
          {t.members.addMember}
        </button>
      </div>

      {/* Search Bar */}
      <div className="card">
        <div className="relative">
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder={t.members.searchMembers}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pr-10"
          />
        </div>
      </div>

      {/* Members Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="table-header">{t.members.fullName}</th>
                <th className="table-header">{t.members.email}</th>
                <th className="table-header">{t.members.phone}</th>
                <th className="table-header">{t.common.status}</th>
                <th className="table-header">{t.members.joinDate}</th>
                <th className="table-header">{t.members.remainingAmount}</th>
                <th className="table-header">{t.common.actions}</th>
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
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          member.status
                        )}`}
                      >
                        {member.status === "ACTIVE"
                          ? t.memberships.active
                          : member.status}
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
                        <button
                          onClick={() => handleEdit(member)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={t.common.edit}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title={t.common.delete}
                        >
                          <Trash2 size={18} />
                        </button>
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
    </div>
  );
};
