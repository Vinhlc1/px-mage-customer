"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@/lib/auth-utils";
import { clearStoredAuth } from "@/lib/api-client";

// ── User shape used throughout the app ───────────────────────────────────────

export interface User {
  id: string;
  customerId: number;
  username: string; // maps to AuthUser.name
  email: string;
  phoneNumber?: string | null;
}

// ── Context type ─────────────────────────────────────────────────────────────

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  /** Expose setUser so the login page can update state right after cookies are set. */
  setUser: (authUser: AuthUser | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    phoneNumber?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Helpers ───────────────────────────────────────────────────────────────────

export function mapAuthUser(au: AuthUser): User {
  return {
    id: String(au.customerId),
    customerId: au.customerId,
    username: au.name,
    email: au.email,
    phoneNumber: au.phoneNumber,
  };
}

// ── Provider ──────────────────────────────────────────────────────────────────

type AuthProviderProps = {
  /** Passed from the server layout after reading httpOnly session cookies. */
  initialUser: AuthUser | null;
  children: ReactNode;
};

export function AuthProvider({ initialUser, children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUserState] = useState<User | null>(
    initialUser ? mapAuthUser(initialUser) : null
  );

  /** Accept an AuthUser (from login/register) and map to the internal User shape. */
  const setUser = useCallback((authUser: AuthUser | null) => {
    setUserState(authUser ? mapAuthUser(authUser) : null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const payload = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(payload?.error ?? "Login failed.");
    }

    if (payload?.user) {
      setUser(payload.user as AuthUser);
    }
    // Refresh server components so layout re-reads the new session cookie
    router.refresh();
  }, [setUser, router]);

  const register = useCallback(
    async (username: string, email: string, password: string, phoneNumber?: string) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, email, password, phoneNumber }),
      });

      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(payload?.error ?? "Registration failed.");
      }

      // Auto-login after successful registration
      await login(email, password);
    },
    [login]
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    clearStoredAuth(); // clears the non-httpOnly cookie + legacy localStorage
    setUserState(null);
    router.push("/login");
    router.refresh();
  }, [router]);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, setUser, login, register, logout }),
    [user, setUser, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
