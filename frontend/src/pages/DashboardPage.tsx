import { useMembers } from "../hooks/useMembers";
import { usePlans } from "../hooks/usePlans";
import { Users, CreditCard, TrendingUp, DollarSign } from "lucide-react";
import { t } from "../i18n";

export const DashboardPage = () => {
  const { data: members } = useMembers();
  const { data: plans } = usePlans();

  const activeMembers =
    members?.filter((m) => m.status === "ACTIVE").length || 0;
  const totalMembers = members?.length || 0;
  const totalPlans = plans?.length || 0;

  const stats = [
    {
      title: t.dashboard.totalMembers,
      value: totalMembers,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: t.dashboard.activeMembers,
      value: activeMembers,
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      title: t.dashboard.activePlans,
      value: totalPlans,
      icon: CreditCard,
      color: "bg-purple-500",
    },
    {
      title: t.dashboard.totalRevenue,
      value: "$0",
      icon: DollarSign,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t.dashboard.title}
        </h1>
        <p className="text-gray-600 mt-1">{t.dashboard.subtitle}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.title} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Members */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {t.dashboard.recentMembers}
          </h2>
          <div className="space-y-3">
            {members?.slice(0, 5).map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {member.full_name}
                  </p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    member.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {member.status === "ACTIVE"
                    ? t.memberships.active
                    : member.status}
                </span>
              </div>
            ))}
            {(!members || members.length === 0) && (
              <p className="text-center text-gray-500 py-8">
                {t.common.noData}
              </p>
            )}
          </div>
        </div>

        {/* Available Plans */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {t.plans.title}
          </h2>
          <div className="space-y-3">
            {plans?.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{plan.name}</p>
                  <p className="text-sm text-gray-500">
                    {plan.duration_days}{" "}
                    {plan.duration_days === 1 ? "day" : "days"}
                  </p>
                </div>
                <p className="text-lg font-bold text-primary-600">
                  ${plan.price_cents / 100}
                </p>
              </div>
            ))}
            {(!plans || plans.length === 0) && (
              <p className="text-center text-gray-500 py-8">
                {t.common.noData}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
