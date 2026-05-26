import { NavLink } from "react-router-dom";
import {
  Bot,
  Boxes,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  UserCircle2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/products", label: "Products", icon: Boxes },
  { to: "/inventory/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/ai/assistant", label: "AI Assistant", icon: Bot },
  { to: "/ai/knowledge-base", label: "Knowledge Base", icon: FileText },
  { to: "/users", label: "Users", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem("sp_sidebar_collapsed");
    if (v === "1") setCollapsed(true);
  }, []);

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sp_sidebar_collapsed", next ? "1" : "0");
  }

  const widthClass = useMemo(() => (collapsed ? "md:w-[88px]" : "md:w-72"), [collapsed]);

  return (
    <aside className={`hidden md:flex ${widthClass} md:flex-col border-r border-slate-200/60 dark:border-slate-800/60 bg-white/20 dark:bg-black/10 backdrop-blur-xl`}>
      <div className="h-full overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} gap-3`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-[0_10px_30px_-15px_rgba(99,102,241,0.9)]" />
              {!collapsed ? (
                <div className="min-w-0">
                  <div className="font-semibold tracking-tight truncate">StockPilot</div>
                  <div className="text-xs text-muted truncate">Inventory Intelligence</div>
                </div>
              ) : null}
            </div>
            {!collapsed ? (
              <button
                onClick={toggle}
                className="rounded-xl border border-slate-200/70 dark:border-slate-800/60 px-2.5 py-2 hover:bg-slate-100/80 dark:hover:bg-white/5 transition"
                title="Collapse"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            ) : null}
            {collapsed ? (
              <button
                onClick={toggle}
                className="rounded-xl border border-slate-200/70 dark:border-slate-800/60 px-2.5 py-2 hover:bg-slate-100/80 dark:hover:bg-white/5 transition"
                title="Expand"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>

        <div className={`p-4 ${collapsed ? "px-3" : ""}`}>
          <div className={`rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-white/5 ${collapsed ? "p-2" : "p-4"} backdrop-blur`}>
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
              <div className="h-10 w-10 rounded-2xl bg-slate-900/5 dark:bg-white/10 border border-slate-200/70 dark:border-slate-800/60 flex items-center justify-center">
                <UserCircle2 className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              </div>
              {!collapsed ? (
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">John Deo</div>
                  <div className="text-xs text-muted truncate">Super Admin</div>
                </div>
              ) : null}
            </div>
            {!collapsed ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="rounded-xl border border-slate-200/70 dark:border-slate-800/60 bg-white/60 dark:bg-white/5 px-3 py-2 text-xs hover:bg-slate-100/80 dark:hover:bg-white/10 transition">
                  My Orders
                </button>
                <button className="rounded-xl border border-slate-200/70 dark:border-slate-800/60 bg-white/60 dark:bg-white/5 px-3 py-2 text-xs hover:bg-slate-100/80 dark:hover:bg-white/10 transition">
                  Activity
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <nav className={`px-3 pb-3 space-y-1 flex-1 ${collapsed ? "px-2" : ""}`}>
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `group flex items-center ${collapsed ? "justify-center" : "gap-3"} rounded-2xl px-3 py-2.5 text-sm transition relative ${
                  isActive
                    ? "bg-slate-900 text-white dark:bg-white/10 dark:text-white shadow-[0_14px_40px_-30px_rgba(0,0,0,0.6)]"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-white/5"
                }`
              }
              title={collapsed ? n.label : undefined}
            >
              <n.icon className="h-4 w-4 opacity-90" />
              {!collapsed ? <span className="flex-1">{n.label}</span> : null}
              {!collapsed ? <span className="h-1.5 w-1.5 rounded-full bg-transparent group-[.active]:bg-emerald-400" /> : null}
            </NavLink>
          ))}
        </nav>

        <div className={`p-4 pt-2 ${collapsed ? "px-3" : ""}`}>
          <button
            className={`w-full rounded-2xl border border-indigo-400/40 dark:border-indigo-400/30 bg-indigo-500/5 dark:bg-indigo-500/10 hover:bg-indigo-500/10 dark:hover:bg-indigo-500/15 transition px-4 py-3 text-sm font-medium ${
              collapsed ? "px-0" : ""
            }`}
            title={collapsed ? "Change Plan" : undefined}
          >
            {collapsed ? "⚡" : "Change Plan"}
          </button>
        </div>
      </div>
    </aside>
  );
}
