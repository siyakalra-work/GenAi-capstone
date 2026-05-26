import { Moon, Sun, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuth } from "../../store/auth";

export function Topbar() {
  const { logout } = useAuth();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme") === "dark";
    setDark(stored);
    document.documentElement.classList.toggle("dark", stored);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6">
      <div className="text-sm text-slate-500 dark:text-slate-400">Inventory Intelligence Platform</div>
      <div className="flex items-center gap-2">
        <button onClick={toggle} className="rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm">
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button
          onClick={logout}
          className="rounded-lg bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900 px-3 py-2 text-sm flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
}
