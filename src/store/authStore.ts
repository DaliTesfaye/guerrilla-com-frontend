import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "client";
  status: "active" | "inactive";
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      login: (token, user) => set({ token, user }),

      logout: () => set({ token: null, user: null }),

      isAuthenticated: () => !!get().token,
    }),
    {
      name: "auth-storage", // key in localStorage
    }
  )
);
