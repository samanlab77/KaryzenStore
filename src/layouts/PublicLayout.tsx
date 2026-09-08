import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
  Shield,
  Loader2,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import type { User as StoreUser } from "@/stores/authStore";
import { cn } from "@/lib/utils";
import { isClerkEnabled } from "@/lib/clerk";
import { useAuth, useClerk } from "@clerk/clerk-react";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Katalog", href: "/products" },
  { label: "Tentang", href: "/tentang" },
  { label: "Kontak", href: "/kontak" },
];

export default function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-glow font-heading font-bold text-black text-lg transition-transform group-hover:scale-105">
                K
              </div>
              <span className="font-heading font-bold text-lg text-text hidden sm:block">
                Karyzen Store
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-fast",
                    location.pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-text-secondary hover:text-text hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Cart */}
              <Link
                to="/keranjang"
                className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-text-secondary" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-glow">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Auth */}
              <HeaderAuth />

              {/* Mobile Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/5"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5 text-text" />
                ) : (
                  <Menu className="w-5 h-5 text-text" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 animate-fade-in">
            <nav className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                    location.pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-text-secondary hover:text-text hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* ── Content ── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-heading font-bold text-black">
                  K
                </div>
                <span className="font-heading font-bold text-text">
                  Karyzen Store
                </span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Toko produk digital premium. Software, lisensi, template,
                e-book, dan kursus online berkualitas tinggi.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-heading font-semibold text-text mb-4 text-sm">
                Navigasi
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Katalog Produk", href: "/products" },
                  { label: "Tentang Kami", href: "/tentang" },
                  { label: "FAQ", href: "/faq" },
                  { label: "Kontak", href: "/kontak" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-text-secondary hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-text mb-4 text-sm">
                Akun
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Masuk", href: "/sign-in" },
                  { label: "Daftar", href: "/sign-up" },
                  { label: "Dasbor Saya", href: "/dashboard" },
                  { label: "Keranjang", href: "/keranjang" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-text-secondary hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-heading font-semibold text-text mb-4 text-sm">
                Hubungi Kami
              </h4>
              <ul className="space-y-2.5 text-sm text-text-secondary">
                <li>halo@karyzenstore.com</li>
                <li>Jl. Digital No. 123, Jakarta</li>
                <li>Senin - Jumat, 09.00 - 17.00 WIB</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-text-secondary">
              &copy; 2025 Karyzen Store. Hak cipta dilindungi.
            </p>
            <div className="flex items-center gap-4 text-xs text-text-secondary">
              <Link to="/faq" className="hover:text-primary transition-colors">
                Syarat & Ketentuan
              </Link>
              <Link to="/faq" className="hover:text-primary transition-colors">
                Kebijakan Privasi
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Header auth (demo mode vs Clerk mode) ── */

function UserMenu({ user, onLogout }: { user: StoreUser; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
      >
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="w-7 h-7 rounded-full bg-white/10"
        />
        <ChevronDown className="w-3.5 h-3.5 text-text-secondary" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-surface border border-white/10 rounded-xl shadow-glass z-50 py-2 animate-fade-in">
            <div className="px-4 py-2 border-b border-white/5">
              <p className="text-sm font-medium text-text">{user.name}</p>
              <p className="text-xs text-text-secondary">{user.email}</p>
            </div>
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text hover:bg-white/5 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dasbor Saya
            </Link>
            {(user.role === "staff" || user.role === "superadmin") && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text hover:bg-white/5 transition-colors"
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
            <hr className="border-white/5 my-1" />
            <button
              onClick={() => {
                onLogout();
                setOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger/5 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function HeaderAuth() {
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isClerkEnabled) {
    if (!isAuthenticated) {
      return (
        <Link to="/sign-in" className="btn-primary text-sm !px-4 !py-2">
          <User className="w-4 h-4 mr-1.5 inline" />
          Masuk
        </Link>
      );
    }
    return user ? <UserMenu user={user} onLogout={logout} /> : null;
  }

  return <ClerkHeaderAuth />;
}

function ClerkHeaderAuth() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { user, logout } = useAuthStore();

  if (!isLoaded) {
    return <Loader2 className="w-5 h-5 text-text-secondary animate-spin" />;
  }
  if (!isSignedIn) {
    return (
      <Link to="/sign-in" className="btn-primary text-sm !px-4 !py-2">
        <User className="w-4 h-4 mr-1.5 inline" />
        Masuk
      </Link>
    );
  }
  if (!user) {
    // Session active but AuthSync hasn't finished syncing yet.
    return <Loader2 className="w-5 h-5 text-text-secondary animate-spin" />;
  }
  return (
    <UserMenu
      user={user}
      onLogout={() => {
        void signOut();
        logout();
      }}
    />
  );
}
