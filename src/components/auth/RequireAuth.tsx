import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useAuthStore } from "@/stores/authStore";
import { isClerkEnabled } from "@/lib/clerk";

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

function ClerkGuard({
  children,
  adminOnly,
}: {
  children: ReactNode;
  adminOnly?: boolean;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!isLoaded) return <Loader />;
  if (!isSignedIn) {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/sign-in?returnTo=${returnTo}`} replace />;
  }
  // AuthSync is still writing the user into the store.
  if (!user) return <Loader />;
  if (adminOnly && user.role !== "staff" && user.role !== "superadmin") {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

/**
 * Route guard. In demo mode (Clerk disabled) it passes everything through.
 * In Clerk mode it requires a real signed-in session and, when adminOnly,
 * restricts access to staff/superadmin roles.
 */
export default function RequireAuth({
  children,
  adminOnly,
}: {
  children: ReactNode;
  adminOnly?: boolean;
}) {
  if (!isClerkEnabled) return <>{children}</>;
  return (
    <ClerkGuard adminOnly={adminOnly}>{children}</ClerkGuard>
  );
}