"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { User } from "@/types";
import { useRouter } from "next/navigation";
import { ProfileService } from "@/lib/services/profile";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  completeOnboarding: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const json = await res.json();
        setUser(json.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchUser();
  }, [fetchUser]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error?.message || "Login failed");
    }

    const user = json.data.user;

    if (!user.profileCompleted) {
      const guestProfile = localStorage.getItem("launchpad_guest_profile");
      if (guestProfile) {
        try {
          const claimRes = await fetch("/api/profile/claim", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: guestProfile,
          });
          if (claimRes.ok) {
            const claimJson = await claimRes.json();
            if (claimJson.data.claimed) {
              user.profileCompleted = true;
              localStorage.removeItem("launchpad_guest_profile");
            }
          }
        } catch (err) {
          console.error("Failed to claim guest profile:", err);
        }
      }
    }

    setUser(user);
    return user;
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Registration failed");
      }

      const user = json.data.user;

      if (!user.profileCompleted) {
        const guestProfile = localStorage.getItem("launchpad_guest_profile");
        if (guestProfile) {
          try {
            const claimRes = await fetch("/api/profile/claim", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: guestProfile,
            });
            if (claimRes.ok) {
              const claimJson = await claimRes.json();
              if (claimJson.data.claimed) {
                user.profileCompleted = true;
                localStorage.removeItem("launchpad_guest_profile");
              }
            }
          } catch (err) {
            console.error("Failed to claim guest profile:", err);
          }
        }
      }

      setUser(user);
      return user;
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  const updateProfile = useCallback(
    async (data: Partial<User>) => {
      if (!user) return;
      const updated = await ProfileService.updateProfile(data);
      setUser({ ...user, ...updated });
    },
    [user]
  );

  const completeOnboarding = useCallback(
    async (data: Partial<User>) => {
      if (!user) return;
      const updated = await ProfileService.completeProfile(data);
      setUser({ ...user, ...updated });
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
