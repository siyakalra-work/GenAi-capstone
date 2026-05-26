import { PropsWithChildren, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/authStore";

export function RequireAuth({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!accessToken) navigate("/login", { replace: true, state: { from: location.pathname } });
  }, [accessToken, location.pathname, navigate]);

  return <>{children}</>;
}

