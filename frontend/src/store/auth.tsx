import React, { PropsWithChildren, createContext, useContext, useMemo, useState } from "react";
import { AuthState, AuthTokens, clearAuth, getAuth, setRole, setTenant, setTokens } from "../services/auth";

type AuthContextValue = AuthState & {
  setTokens: (t: AuthTokens) => void;
  setTenant: (tenantId: string | null) => void;
  setRole: (role: string | null) => void;
  logout: () => void;
  refreshFromStorage: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>(() => getAuth());

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      setTokens: (t) => {
        setTokens(t);
        setState(getAuth());
      },
      setTenant: (tenantId) => {
        setTenant(tenantId);
        setState(getAuth());
      },
      setRole: (role) => {
        setRole(role);
        setState(getAuth());
      },
      logout: () => {
        clearAuth();
        setState(getAuth());
      },
      refreshFromStorage: () => setState(getAuth()),
    }),
    [state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const v = useContext(AuthContext);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}

