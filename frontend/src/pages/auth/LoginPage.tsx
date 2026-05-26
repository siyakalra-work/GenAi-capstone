import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../store/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const { setTokens, setTenant } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/login", { email, password, tenant_id: tenantId || null });
      const data = res.data as { access_token: string; refresh_token: string };
      setTokens({ accessToken: data.access_token, refreshToken: data.refresh_token });
      setTenant(tenantId || null);
      navigate("/", { replace: true });
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="text-sm text-slate-500 dark:text-slate-400">Use tenant id for tenant users (blank for super admin).</div>
      <Input placeholder="Tenant ID" value={tenantId} onChange={(e) => setTenantId(e.target.value)} />
      <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error ? <div className="text-sm text-red-500">{error}</div> : null}
      <Button type="submit" className="w-full bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </Button>
      <div className="text-sm text-slate-500 dark:text-slate-400">
        No account? <Link className="underline" to="/register">Register</Link>
      </div>
    </form>
  );
}
