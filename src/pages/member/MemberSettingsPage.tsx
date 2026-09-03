import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { User, Mail, Shield, CheckCircle2 } from "lucide-react";

export default function MemberSettingsPage() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-text mb-1">
        Pengaturan Akun
      </h1>
      <p className="text-text-secondary text-sm mb-8">
        Kelola profil dan pengaturan akun Anda.
      </p>

      <div className="max-w-xl space-y-6">
        {/* Profile */}
        <div className="card p-6">
          <h3 className="font-heading font-semibold text-sm text-text mb-4">
            Profil
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={user?.avatarUrl}
                alt={user?.name}
                className="w-16 h-16 rounded-full bg-white/10"
              />
              <div>
                <p className="text-sm font-medium text-text">{user?.name}</p>
                <p className="text-xs text-text-secondary capitalize">
                  {user?.role}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input w-full"
              />
            </div>

            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <button type="submit" className="btn-primary !py-2 !px-4 text-sm">
                Simpan Perubahan
              </button>
              {saved && (
                <span className="text-xs text-success flex items-center gap-1 animate-fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Tersimpan
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Role Info */}
        <div className="card p-6">
          <h3 className="font-heading font-semibold text-sm text-text mb-3">
            Informasi Akun
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Shield className="w-4 h-4 text-text-secondary" />
              <span className="text-text-secondary">Peran:</span>
              <span className="text-text font-medium capitalize">
                {user?.role}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-text-secondary" />
              <span className="text-text-secondary">ID Pengguna:</span>
              <code className="text-xs bg-white/5 px-2 py-0.5 rounded text-text-secondary">
                {user?.id}
              </code>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-text-secondary" />
              <span className="text-text-secondary">Email:</span>
              <span className="text-text">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="card p-6">
          <h3 className="font-heading font-semibold text-sm text-text mb-3">
            Ubah Password
          </h3>
          <p className="text-xs text-text-secondary mb-4">
            Dalam versi produksi, fitur ini akan terintegrasi dengan Clerk
            Authentication.
          </p>
          <button
            disabled
            className="px-4 py-2 rounded-lg border border-white/10 text-sm text-text-secondary cursor-not-allowed opacity-50"
          >
            Kelola Password via Auth Provider
          </button>
        </div>
      </div>
    </div>
  );
}
