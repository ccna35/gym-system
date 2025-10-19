import { useParams } from "react-router-dom";
import { useMemberDetails } from "../hooks/useMembers";
import { formatDate, getStatusColor } from "../lib/utils";
import { useCreatePayment } from "../hooks/usePayments";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "../i18n";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getMembershipStatusLabel } from "@/lib/membershipUtils";

export default function MemberDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const memberId = Number(id);
  const queryClient = useQueryClient();
  const { data, isLoading } = useMemberDetails(memberId);
  const createPayment = useCreatePayment();
  const [selectedMembership, setSelectedMembership] = useState<number | null>(
    null
  );
  const [amount, setAmount] = useState(0);
  const [paymentDate, setPaymentDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [notes, setNotes] = useState("");

  if (isLoading) return <div>{t.common.loading}</div>;
  if (!data || !data.member) return <div>{t.common.noData}</div>;

  const member = data.member;
  const memberships = data.memberships || [];
  const stats = data.stats || { totalPaid: 0, totalRemaining: 0 };

  // Sort memberships by start_date descending
  const sortedMemberships = [...memberships].sort((a, b) =>
    b.start_date.localeCompare(a.start_date)
  );

  const totalMemberships = sortedMemberships.length;
  const totalPaid = stats.totalPaid;
  const totalRemaining = stats.totalRemaining;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMembership) return;
    createPayment.mutate(
      {
        membership_id: selectedMembership,
        amount,
        payment_date: paymentDate,
        method: "CASH",
        notes,
      },
      {
        onSuccess: () => {
          setSelectedMembership(null);
          queryClient.invalidateQueries({
            queryKey: ["memberDetails", memberId],
          });
        },
      }
    );
  };

  return (
    <div className="container mx-auto py-8">
      {/* Member Card - Improved Design */}
      <div className="card flex flex-col md:flex-row items-center md:items-start gap-6 p-6 mb-8 bg-white rounded-xl border border-gray-200">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-4xl font-bold text-primary-700 border-2 border-primary-300 shadow-sm">
            {member.photo_url ? (
              <img
                src={member.photo_url}
                alt={member.full_name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              member.full_name.charAt(0)
            )}
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2 text-primary-700">
            {member.full_name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div>
              <div className="text-gray-700">
                <b>{t.members.email}:</b> {member.email}
              </div>
              <div className="text-gray-700">
                <b>{t.members.phone}:</b> {member.phone}
              </div>
              <div className="text-gray-700">
                <b>{t.members.dateOfBirth}:</b> {member.dob}
              </div>
              <div className="text-gray-700">
                <b>{t.common.status}:</b> {member.status}
              </div>
            </div>
            <div>
              <div className="text-gray-700">
                <b>{t.memberships.total}:</b> {totalMemberships}
              </div>
              <div className="text-gray-700">
                <b>{t.members.remainingAmount}:</b>{" "}
                <span className="text-red-600 font-bold">{totalRemaining}</span>
              </div>
              <div className="text-gray-700">
                <b>{t.payments.paid}:</b>{" "}
                <span className="text-green-600 font-bold">{totalPaid}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Improved Design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-4 bg-primary-50 rounded-xl border border-primary-200 text-center">
          <div className="text-lg font-semibold text-primary-700 mb-1">
            {t.memberships.total}
          </div>
          <div className="text-3xl font-bold text-primary-700">
            {totalMemberships}
          </div>
        </div>
        <div className="card p-4 bg-red-50 rounded-xl border border-red-200 text-center">
          <div className="text-lg font-semibold text-red-700 mb-1">
            {t.members.remainingAmount}
          </div>
          <div className="text-3xl font-bold text-red-700">
            {totalRemaining}
          </div>
        </div>
        <div className="card p-4 bg-green-50 rounded-xl border border-green-200 text-center">
          <div className="text-lg font-semibold text-green-700 mb-1">
            {t.payments.paid}
          </div>
          <div className="text-3xl font-bold text-green-700">{totalPaid}</div>
        </div>
      </div>

      {/* Memberships Table - Restyled */}
      <div className="card p-6 mb-8 bg-white rounded-xl border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-primary-700">
          {t.memberships.title}
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto rounded-xl border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  {t.memberships.plan}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  {t.memberships.startDate}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  {t.memberships.endDate}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  {t.memberships.status}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  {t.memberships.price}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  {t.memberships.total}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  {t.members.remainingAmount}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  {t.payments.paid}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  {t.payments.recordPayment}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedMemberships.map((m, idx) => (
                <tr
                  key={m.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-3 border-b text-sm">
                    {m.plan_id || "-"}
                  </td>
                  <td className="px-4 py-3 border-b text-sm">
                    {formatDate(m.start_date)}
                  </td>
                  <td className="px-4 py-3 border-b text-sm">
                    {formatDate(m.end_date)}
                  </td>
                  {/* <td className="px-4 py-3 border-b text-sm">{m.status}</td> */}
                  <td className="table-cell">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        m.status
                      )}`}
                    >
                      {getMembershipStatusLabel(m.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b text-sm">
                    {(m.price_cents / 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 border-b text-sm">
                    {m.payments ? m.payments.length : 0}
                  </td>
                  <td className="px-4 py-3 border-b text-sm text-red-600 font-semibold">
                    {m.remaining.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 border-b text-sm text-green-600 font-semibold">
                    {m.paid.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 border-b text-sm">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setSelectedMembership(m.id)}
                    >
                      {t.payments.recordPayment}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal Popup */}
      <Dialog
        open={!!selectedMembership}
        onOpenChange={(open) => !open && setSelectedMembership(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary-700">
              {t.payments.recordPayment}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">{t.payments.amount}</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentDate">{t.payments.paymentDate}</Label>
              <Input
                id="paymentDate"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">{t.payments.notes}</Label>
              <Input
                id="notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div className="flex gap-4 mt-6">
              <Button type="submit" className="flex-1">
                {t.payments.recordPayment}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => setSelectedMembership(null)}
              >
                {t.common.cancel}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
