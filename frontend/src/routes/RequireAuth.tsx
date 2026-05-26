import { PropsWithChildren, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../store/auth";

export function RequireAuth({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) navigate("/login", { replace: true, state: { from: location.pathname } });
  }, [accessToken, location.pathname, navigate]);

  return <>{children}</>;
}
