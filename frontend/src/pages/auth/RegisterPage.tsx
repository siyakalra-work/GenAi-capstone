import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuthStore } from "../../store/authStore";

export function RegisterPage() {
  const navigate = useNavigate();
  const setTokens = useAuthStore((s) => s.setTokens);
  const setTenant = useAuthStore((s) => s.setTenant);
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const m = useMutation({
    mutationFn: async () => {
      const res = await api.post("/auth/register", { company_name: companyName || null, name, email, password });
      return res.data as { access_token: string; refresh_token: string };
    },
    onSuccess: (data) => {
      setTokens({ accessToken: data.access_token, refreshToken: data.refresh_token });
      setTenant(null);
      navigate("/", { replace: true });
    },
    onError: (e: any) => setError(e?.response?.data?.detail ?? "Registration failed"),
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
      <Input placeholder="Company name (optional: create tenant)" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
      <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Password (min 8 chars)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error ? <div className="text-sm text-red-500">{error}</div> : null}
      <Button type="submit" className="w-full bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900" disabled={m.isPending}>
        {m.isPending ? "Creating..." : "Create account"}
      </Button>
      <div className="text-sm text-slate-500 dark:text-slate-400">
        Have an account? <Link className="underline" to="/login">Login</Link>
      </div>
    </form>
  );
}

