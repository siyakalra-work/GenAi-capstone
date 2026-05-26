import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  tenantId: string | null;
  role: string | null;
  setTokens: (t: { accessToken: string; refreshToken: string }) => void;
  setTenant: (tenantId: string | null) => void;
  setRole: (role: string | null) => void;
  logout: () => void;
};

const LS_KEY = "stockpilot_auth_v1";

function load(): Pick<AuthState, "accessToken" | "refreshToken" | "tenantId" | "role"> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { accessToken: null, refreshToken: null, tenantId: null, role: null };
    return JSON.parse(raw);
  } catch {
    return { accessToken: null, refreshToken: null, tenantId: null, role: null };
  }
}

function persist(state: Pick<AuthState, "accessToken" | "refreshToken" | "tenantId" | "role">) {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

export const useAuthStore = create<AuthState>((set, get) => ({
  ...load(),
  setTokens: (t) => {
    const next = { ...get(), accessToken: t.accessToken, refreshToken: t.refreshToken };
    persist({ accessToken: next.accessToken, refreshToken: next.refreshToken, tenantId: next.tenantId, role: next.role });
    set({ accessToken: t.accessToken, refreshToken: t.refreshToken });
  },
  setTenant: (tenantId) => {
    const next = { ...get(), tenantId };
    persist({ accessToken: next.accessToken, refreshToken: next.refreshToken, tenantId: next.tenantId, role: next.role });
    set({ tenantId });
  },
  setRole: (role) => {
    const next = { ...get(), role };
    persist({ accessToken: next.accessToken, refreshToken: next.refreshToken, tenantId: next.tenantId, role: next.role });
    set({ role });
  },
  logout: () => {
    localStorage.removeItem(LS_KEY);
    set({ accessToken: null, refreshToken: null, tenantId: null, role: null });
  },
}));

