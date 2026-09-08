import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuthStore } from "@/stores/authStore";
import { isClerkEnabled } from "@/lib/clerk";

/**
 * Bridges Clerk auth into the app's auth store.
 * Whenever a Clerk session exists, verifies the session token server-side
 * (Convex action + CLERK_SECRET_KEY), upserts the user, and stores it.
 * Rendered only when Clerk is enabled — in demo mode this is never mounted.
 */
export default function AuthSync() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const syncClerkUser = useAction(api.auth.syncClerkUser);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!isClerkEnabled) return;
    if (!isLoaded) return;

    let cancelled = false;

    if (!isSignedIn) {
      logout();
      return;
    }

    (async () => {
      try {
        const token = await getToken();
        if (!token || cancelled) return;
        const doc = await syncClerkUser({ token });
        if (!doc || cancelled) return;
        login({
          id: doc._id,
          name: doc.name,
          email: doc.email,
          avatarUrl: doc.avatarUrl,
          role: doc.role,
        });
      } catch (err) {
        console.error("Failed to sync Clerk user:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, getToken, syncClerkUser, login, logout]);

  return null;
}