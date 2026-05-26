import { Moon, Sun, LogOut, Search } from "lucide-react";
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
    <header className="sticky top-0 z-10">
      <div className="mx-auto w-full max-w-6xl px-6 pt-4">
        <div className="glass rounded-2xl h-14 flex items-center justify-between px-4 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.55)]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="text-sm text-muted hidden sm:block">Inventory Intelligence Platform</div>
            <div className="hidden md:flex items-center gap-2 rounded-xl px-3 py-2 bg-slate-100/70 dark:bg-white/5 border border-slate-200/70 dark:border-slate-800/60">
              <Search className="h-4 w-4 text-muted" />
              <input
                placeholder="Search…"
                className="bg-transparent outline-none text-sm w-56 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          </div>
      <div className="flex items-center gap-2">
        <button onClick={toggle} className="rounded-xl border border-slate-200/70 dark:border-slate-800/60 px-3 py-2 text-sm hover:bg-slate-100/80 dark:hover:bg-white/5">
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button
          onClick={logout}
          className="rounded-xl bg-slate-900 text-white dark:bg-white/10 dark:text-white px-3 py-2 text-sm flex items-center gap-2 border border-slate-900/20 dark:border-white/10 hover:opacity-95"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
        </div>
      </div>
    </header>
  );
}
