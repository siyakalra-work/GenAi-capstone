import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../store/auth";

export function RegisterPage() {
  const navigate = useNavigate();
  const { setTokens, setTenant } = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/register", { company_name: companyName || null, name, email, password });
      const data = res.data as { access_token: string; refresh_token: string };
      setTokens({ accessToken: data.access_token, refreshToken: data.refresh_token });
      setTenant(null);
      navigate("/", { replace: true });
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "Registration failed");
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
      <Input placeholder="Company name (optional: create tenant)" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
      <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Password (min 8 chars)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error ? <div className="text-sm text-red-500">{error}</div> : null}
      <Button type="submit" className="w-full bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900" disabled={loading}>
        {loading ? "Creating..." : "Create account"}
      </Button>
      <div className="text-sm text-slate-500 dark:text-slate-400">
        Have an account? <Link className="underline" to="/login">Login</Link>
      </div>
    </form>
  );
}
