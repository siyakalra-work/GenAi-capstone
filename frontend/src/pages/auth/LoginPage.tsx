import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuthStore } from "../../store/authStore";

export function LoginPage() {
  const navigate = useNavigate();
  const setTokens = useAuthStore((s) => s.setTokens);
  const setTenant = useAuthStore((s) => s.setTenant);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const m = useMutation({
    mutationFn: async () => {
      const res = await api.post("/auth/login", { email, password, tenant_id: tenantId || null });
      return res.data as { access_token: string; refresh_token: string };
    },
    onSuccess: (data) => {
      setTokens({ accessToken: data.access_token, refreshToken: data.refresh_token });
      setTenant(tenantId || null);
      navigate("/", { replace: true });
    },
    onError: (e: any) => setError(e?.response?.data?.detail ?? "Login failed"),
  });

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        m.mutate();
      }}
    >
      <div className="text-sm text-slate-500 dark:text-slate-400">Use tenant id for tenant users (blank for super admin).</div>
      <Input placeholder="Tenant ID" value={tenantId} onChange={(e) => setTenantId(e.target.value)} />
      <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error ? <div className="text-sm text-red-500">{error}</div> : null}
      <Button type="submit" className="w-full bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900" disabled={m.isPending}>
        {m.isPending ? "Signing in..." : "Sign in"}
      </Button>
      <div className="text-sm text-slate-500 dark:text-slate-400">
        No account? <Link className="underline" to="/register">Register</Link>
      </div>
    </form>
  );
}

