"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  completeOnboarding: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "launchpad_user";

function loadUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function saveUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(loadUser());
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    void _password;
    // Mock: simulate network delay, then create/load user
    await new Promise((r) => setTimeout(r, 600));
    const existing = loadUser();
    if (existing && existing.email === email) {
      setUser(existing);
      return;
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      name: email.split("@")[0],
      email,
      role: "",
      experienceLevel: "beginner",
      location: "",
      skills: [],
      interests: [],
      goals: [],
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    saveUser(newUser);
  }, []);

  const register = useCallback(
    async (name: string, email: string, _password: string) => {
      void _password;
      await new Promise((r) => setTimeout(r, 600));
      const newUser: User = {
        id: crypto.randomUUID(),
        name,
        email,
        role: "",
        experienceLevel: "beginner",
        location: "",
        skills: [],
        interests: [],
        goals: [],
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
      saveUser(newUser);
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    saveUser(null);
  }, []);

  const updateProfile = useCallback(
    (data: Partial<User>) => {
      if (!user) return;
      const updated = { ...user, ...data };
      setUser(updated);
      saveUser(updated);
    },
    [user]
  );

  const completeOnboarding = useCallback(
    (data: Partial<User>) => {
      const base = user ?? {
        id: crypto.randomUUID(),
        email: "",
        createdAt: new Date().toISOString(),
      };
      const updated = { ...base, ...data } as User;
      setUser(updated);
      saveUser(updated);
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
