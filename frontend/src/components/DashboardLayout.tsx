import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Calendar,
  DollarSign,
  LogOut,
  Menu,
  X,
  Dumbbell,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { t } from "../i18n";

export const DashboardLayout = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigation = [
    { name: t.nav.dashboard, href: "/dashboard", icon: LayoutDashboard },
    { name: t.nav.members, href: "/members", icon: Users },
    { name: t.nav.plans, href: "/plans", icon: CreditCard },
    { name: t.nav.memberships, href: "/memberships", icon: Calendar },
    { name: t.nav.payments, href: "/payments", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{ right: 0, left: "auto" }}
        className={`fixed inset-y-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full border-l border-gray-200">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Dumbbell
                className="w-8 h-8 text-primary-600"
                strokeWidth={2.5}
              />
              <span className="text-2xl font-bold text-primary-600">GYM</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute left-4"
            >
              <X size={24} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={20} className="mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-semibold">
                  {user?.full_name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="mr-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.full_name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="flex items-center w-full px-4 py-2 text-sm"
            >
              <LogOut size={18} className="ml-2" />
              {t.nav.logout}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pr-64">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu size={24} />
          </Button>
          <div className="flex-1" />
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
