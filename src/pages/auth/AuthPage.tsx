import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";
import { isClerkEnabled } from "@/lib/clerk";
import { useAuth, useSignIn, useSignUp } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import { useSEO } from "@/lib/seo";

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

function getClerkError(err: unknown): string {
  const e = err as {
    errors?: { longMessage?: string; message?: string }[];
    message?: string;
  };
  return (
    e?.errors?.[0]?.longMessage ??
    e?.errors?.[0]?.message ??
    e?.message ??
    "Terjadi kesalahan. Silakan coba lagi."
  );
}

function AuthCardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="card p-6 sm:p-8">{children}</div>
  );
}

function Tabs({
  mode,
  onChange,
}: {
  mode: "signin" | "signup";
  onChange: (m: "signin" | "signup") => void;
}) {
  return (
    <div className="flex mb-6 border-b border-white/5">
      {(["signin", "signup"] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
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
  );
}

// ── Demo mode (no Clerk key configured) ──

function DemoAuthCard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const returnTo = searchParams.get("returnTo") || "/dashboard";

  const handleDemoLogin = (user: (typeof demoUsers)[0]) => {
    login(user);
    navigate(returnTo);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleDemoLogin(demoUsers[0]);
  };

  return (
    <>
      <Tabs mode={mode} onChange={setMode} />
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-xs text-text-secondary mb-1.5 font-medium">
            Email
          </label>
          <input type="email" required className="input w-full" placeholder="email@anda.com" />
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1.5 font-medium">
            Password
          </label>
          <input
            type="password"
            required
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

      <div className="space-y-2">
        {demoUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => handleDemoLogin(user)}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:border-primary/40 hover:bg-white/5 transition-all text-left"
          >
            <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full bg-white/10" />
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
    </>
  );
}

// ── Clerk mode (real authentication) ──

function ClerkAuthCard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const returnTo = searchParams.get("returnTo") || "/dashboard";

  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { signIn, isLoaded: signInLoaded, setActive: setActiveSignIn } = useSignIn();
  const { signUp, isLoaded: signUpLoaded, setActive: setActiveSignUp } = useSignUp();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");

  // Already signed in? Go straight to the destination.
  useEffect(() => {
    if (authLoaded && isSignedIn) {
      navigate(returnTo, { replace: true });
    }
  }, [authLoaded, isSignedIn, navigate, returnTo]);

  if (!authLoaded || !signInLoaded || !signUpLoaded) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-sm text-text-secondary">Memuat...</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "signin") {
        const res = await signIn.create({ identifier: email, password });
        if (res.status === "complete") {
          await setActiveSignIn({ session: res.createdSessionId });
          navigate(returnTo);
        } else {
          setError(
            "Verifikasi tambahan diperlukan. Periksa email Anda atau hubungi dukungan."
          );
        }
      } else {
        const res = await signUp.create({ emailAddress: email, password });
        if (res.status === "complete") {
          await setActiveSignUp({ session: res.createdSessionId });
          navigate(returnTo);
        } else {
          // Email verification required — show the OTP step.
          setVerifying(true);
        }
      }
    } catch (err) {
      setError(getClerkError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await signUp.attemptEmailAddressVerification({ code });
      if (res.status === "complete") {
        await setActiveSignUp({ session: res.createdSessionId });
        navigate(returnTo);
      } else {
        setError("Kode verifikasi salah atau sudah kedaluwarsa.");
      }
    } catch (err) {
      setError(getClerkError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (verifying) {
    return (
      <>
        <div className="mb-6">
          <h2 className="text-lg font-heading font-bold text-text mb-1">
            Verifikasi Email
          </h2>
          <p className="text-sm text-text-secondary">
            Kami telah mengirim kode verifikasi ke{" "}
            <span className="text-text">{email}</span>. Masukkan kode di bawah
            untuk menyelesaikan pendaftaran.
          </p>
        </div>
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs text-text-secondary mb-1.5 font-medium">
              Kode Verifikasi
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="input w-full font-mono tracking-widest"
              placeholder="••••••"
            />
          </div>
          {error && <p className="text-xs text-danger">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Verifikasi & Selesai
          </button>
          <button
            type="button"
            onClick={() => {
              setVerifying(false);
              setError("");
            }}
            className="w-full text-center text-xs text-text-secondary hover:text-text transition-colors"
          >
            Ganti email / kembali
          </button>
        </form>
      </>
    );
  }

  return (
    <>
      <Tabs mode={mode} onChange={setMode} />
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
        {error && <p className="text-xs text-danger">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {mode === "signin" ? "Masuk" : "Daftar"}
        </button>
      </form>
      <p className="text-xs text-text-secondary text-center">
        {mode === "signin"
          ? "Belum punya akun? Gunakan tab \"Daftar\" untuk membuat akun baru."
          : "Akun Anda akan aktif setelah email diverifikasi."}
      </p>
    </>
  );
}

export default function AuthPage() {
  useSEO({
    title: "Masuk / Daftar",
    description:
      "Masuk atau daftar akun Karyzen Store untuk mengakses library produk digital, riwayat transaksi, dan kode lisensi Anda.",
    path: "/sign-in",
  });

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

        <AuthCardShell>
          {isClerkEnabled ? <ClerkAuthCard /> : <DemoAuthCard />}
        </AuthCardShell>
      </div>
    </div>
  );
}