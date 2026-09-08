import { create } from "zustand";
import { isClerkEnabled } from "@/lib/clerk";

export type UserRole = "customer" | "staff" | "superadmin";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

// Default user for demo — "Budi Santoso" as customer
const defaultUser: User = {
  id: "user-1",
  name: "Budi Santoso",
  email: "budi.santoso@email.com",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=budi",
  role: "customer",
};

export const useAuthStore = create<AuthStore>()((set, get) => ({
  // In Clerk mode the user starts signed out until AuthSync completes.
  // In demo mode (no Clerk key) we keep the demo customer signed in.
  user: isClerkEnabled ? null : defaultUser,
  isAuthenticated: isClerkEnabled ? false : true,

  login: (user) => set({ user, isAuthenticated: true }),

  logout: () => set({ user: null, isAuthenticated: false }),

  hasRole: (role) => {
    const user = get().user;
    if (!user) return false;
    if (role === "superadmin") return user.role === "superadmin";
    if (role === "staff")
      return user.role === "staff" || user.role === "superadmin";
    return true; // customer can access public
  },
}));
