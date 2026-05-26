export type AuthTokens = { accessToken: string; refreshToken: string };
export type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  tenantId: string | null;
  role: string | null;
};

const LS_KEY = "stockpilot_auth_v1";

export function getAuth(): AuthState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { accessToken: null, refreshToken: null, tenantId: null, role: null };
    const parsed = JSON.parse(raw);
    return {
      accessToken: parsed.accessToken ?? null,
      refreshToken: parsed.refreshToken ?? null,
      tenantId: parsed.tenantId ?? null,
      role: parsed.role ?? null,
    };
  } catch {
    return { accessToken: null, refreshToken: null, tenantId: null, role: null };
  }
}

export function setTokens(tokens: AuthTokens) {
  const current = getAuth();
  const next = { ...current, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
  localStorage.setItem(LS_KEY, JSON.stringify(next));
}

export function setTenant(tenantId: string | null) {
  const current = getAuth();
  localStorage.setItem(LS_KEY, JSON.stringify({ ...current, tenantId }));
}

export function setRole(role: string | null) {
  const current = getAuth();
  localStorage.setItem(LS_KEY, JSON.stringify({ ...current, role }));
}

export function clearAuth() {
  localStorage.removeItem(LS_KEY);
}

