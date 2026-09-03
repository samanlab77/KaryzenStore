import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  BarChart3,
  Package,
  FolderTree,
  ShoppingBag,
  Ticket,
  LineChart,
  Users,
  ArrowLeft,
  Menu,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";

const adminLinks = [
  { label: "Dashboard", href: "/admin", icon: BarChart3 },
  { label: "Produk", href: "/admin/products", icon: Package },
  { label: "Kategori", href: "/admin/categories", icon: FolderTree },
  { label: "Pesanan", href: "/admin/orders", icon: ShoppingBag },
  { label: "Kupon", href: "/admin/coupons", icon: Ticket },
  { label: "Laporan", href: "/admin/reports", icon: LineChart },
  { label: "Pengguna", href: "/admin/users", icon: Users, superadminOnly: true },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();

  const visibleLinks = adminLinks.filter(
    (l) => !l.superadminOnly || user?.role === "superadmin"
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* ── Sidebar ── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 sidebar-glass flex flex-col transition-transform duration-200 xl:translate-x-0",
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
            <div>
              <span className="font-heading font-semibold text-sm text-text block leading-tight">
                Karyzen Store
              </span>
              <span className="text-[10px] text-primary font-medium">
                Admin Panel
              </span>
            </div>
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
              <p className="text-xs text-primary font-medium capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {visibleLinks.map((link) => {
            const isActive =
              link.href === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(link.href);
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
            Karyzen Store Admin &copy; 2025
          </p>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 xl:ml-64">
        {/* Topbar (mobile + desktop) */}
        <div className="sticky top-0 z-30 glass h-14 flex items-center px-4 lg:px-6 gap-3 border-b border-white/5">
          <button
            onClick={() => setSidebarOpen(true)}
            className="xl:hidden p-2 rounded-lg hover:bg-white/5"
          >
            <Menu className="w-5 h-5 text-text" />
          </button>
          <span className="font-heading font-semibold text-sm text-text">
            Admin Panel
          </span>
          <div className="ml-auto text-xs text-text-secondary">
            {user?.role === "superadmin" ? "Superadmin" : "Staff"}
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 xl:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
