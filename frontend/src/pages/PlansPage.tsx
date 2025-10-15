import { useState } from "react";
import { usePlans, useDeletePlan } from "../hooks/usePlans";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { formatCurrency } from "../lib/utils";
import { PlanModal } from "../components/plans/PlanModal";
import type { Plan } from "../types";
import { t } from "../i18n";

export const PlansPage = () => {
  const { data: plans, isLoading } = usePlans();
  const deletePlan = useDeletePlan();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t.plans.deleteConfirm)) {
      deletePlan.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
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
          <h1 className="text-3xl font-bold text-gray-900">{t.plans.title}</h1>
          <p className="text-gray-600 mt-1">{t.plans.subtitle}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus size={20} className="ml-2" />
          {t.plans.addPlan}
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans?.length === 0 ? (
          <div className="col-span-full card">
            <p className="text-center text-gray-500 py-12">{t.common.noData}</p>
          </div>
        ) : (
          plans?.map((plan) => (
            <div
              key={plan.id}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title={t.common.edit}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title={t.common.delete}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {plan.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {plan.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t.plans.duration}:</span>
                  <span className="font-medium text-gray-900">
                    {plan.duration_days}{" "}
                    {plan.duration_days === 1 ? "day" : "days"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t.plans.price}:</span>
                  <span className="font-bold text-primary-600 text-lg">
                    {formatCurrency(plan.price_cents / 100)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500">
                  {t.common.created}{" "}
                  {new Date(plan.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Plan Modal */}
      <PlanModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        plan={editingPlan}
      />
    </div>
  );
};
