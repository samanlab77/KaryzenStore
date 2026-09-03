import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Key,
  Settings,
  ChevronLeft,
  Menu,
  ArrowLeft,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { label: "Dasbor", href: "/dashboard", icon: LayoutDashboard },
  { label: "Riwayat Transaksi", href: "/dashboard/orders", icon: ShoppingBag },
  { label: "Lisensi Saya", href: "/dashboard/licenses", icon: Key },
  { label: "Pengaturan Akun", href: "/dashboard/settings", icon: Settings },
];

export default function MemberLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen flex bg-background">
      {/* ── Sidebar ── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 sidebar-glass flex flex-col transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/5">
          <Link
            to="/"
            className="flex items-center gap-2 text-text-secondary hover:text-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-heading font-bold text-black text-sm">
              K
            </div>
            <span className="font-heading font-semibold text-sm text-text">
              Karyzen Store
            </span>
          </Link>
        </div>

        {/* User Info */}
        <div className="px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatarUrl}
              alt={user?.name}
              className="w-10 h-10 rounded-full bg-white/10"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-text truncate">
                {user?.name}
              </p>
              <p className="text-xs text-text-secondary truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-fast",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-text-secondary hover:text-text hover:bg-white/5"
                )}
              >
                <link.icon className="w-4.5 h-4.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/5">
          <p className="text-[10px] text-text-secondary text-center">
            Karyzen Store &copy; 2025
          </p>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 lg:ml-64">
        {/* Topbar (mobile) */}
        <div className="lg:hidden sticky top-0 z-30 glass h-14 flex items-center px-4 gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-white/5"
          >
            <Menu className="w-5 h-5 text-text" />
          </button>
          <span className="font-heading font-semibold text-sm text-text">
            Dasbor
          </span>
        </div>

        {/* Page Content */}
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
