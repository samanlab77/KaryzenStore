import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";

const demoUsers = [
  {
    id: "user-1",
    name: "Budi Santoso",
    email: "budi.santoso@email.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=budi",
    role: "customer" as const,
    label: "Customer",
  },
  {
    id: "user-3",
    name: "Admin Karyzen",
    email: "admin@karyzenstore.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    role: "staff" as const,
    label: "Staff",
  },
  {
    id: "user-4",
    name: "Super Admin",
    email: "superadmin@karyzenstore.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=superadmin",
    role: "superadmin" as const,
    label: "Superadmin",
  },
];

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const returnTo = searchParams.get("returnTo") || "/dashboard";

  const handleDemoLogin = (user: (typeof demoUsers)[0]) => {
    login(user);
    navigate(returnTo);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: login as customer
    handleDemoLogin(demoUsers[0]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link
          to="/"
          className="flex items-center gap-2 mb-8 text-text-secondary hover:text-text transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-heading font-bold text-black text-sm">
            K
          </div>
          <span className="font-heading font-semibold text-text">
            Karyzen Store
          </span>
        </Link>

        <div className="card p-6 sm:p-8">
          {/* Tabs */}
          <div className="flex mb-6 border-b border-white/5">
            {(["signin", "signup"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setMode(tab)}
                className={cn(
                  "flex-1 pb-3 text-sm font-medium transition-colors border-b-2 -mb-px",
                  mode === tab
                    ? "text-primary border-primary"
                    : "text-text-secondary border-transparent hover:text-text"
                )}
              >
                {tab === "signin" ? "Masuk" : "Daftar"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full"
                placeholder="email@anda.com"
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              {mode === "signin" ? "Masuk" : "Daftar"}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface px-3 text-xs text-text-secondary">
                atau masuk sebagai demo
              </span>
            </div>
          </div>

          {/* Demo Users */}
          <div className="space-y-2">
            {demoUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleDemoLogin(user)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:border-primary/40 hover:bg-white/5 transition-all text-left"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-9 h-9 rounded-full bg-white/10"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text">{user.name}</p>
                  <p className="text-xs text-text-secondary">{user.email}</p>
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded-full",
                    user.role === "superadmin"
                      ? "bg-primary/10 text-primary"
                      : user.role === "staff"
                        ? "bg-info/10 text-info"
                        : "bg-white/5 text-text-secondary"
                  )}
                >
                  {user.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
