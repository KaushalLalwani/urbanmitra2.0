import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Role = "user" | "authority";
export type AuthUser = { role: Role; token?: string; name?: string } | null;

const STORAGE_KEY = "civic_auth_v1";

type Ctx = {
  user: AuthUser;
  login: (user: NonNullable<AuthUser>) => void;
  logout: () => void;
};

const AuthContext = createContext<Ctx | null>(null);

function load(): AuthUser {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function save(user: AuthUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  useEffect(() => setUser(load()), []);
  useEffect(() => save(user), [user]);

  const value = useMemo<Ctx>(
    () => ({
      user,
      login: (u) => setUser(u),
      logout: () => setUser(null),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
