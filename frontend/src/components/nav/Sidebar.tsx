import { NavLink } from "react-router-dom";
import { Bot, Boxes, FileText, LayoutDashboard, Settings, Users, ArrowLeftRight } from "lucide-react";

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
  return (
    <aside className="hidden md:flex md:w-72 md:flex-col p-4">
      <div className="glass rounded-2xl h-full overflow-hidden shadow-[0_20px_60px_-30px_rgba(0,0,0,0.45)]">
        <div className="p-5 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-[0_10px_30px_-15px_rgba(99,102,241,0.9)]" />
            <div>
              <div className="font-semibold tracking-tight">StockPilot</div>
              <div className="text-xs text-muted">Inventory Intelligence</div>
            </div>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `group flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-slate-900 text-white dark:bg-white/10 dark:text-white shadow-[0_14px_40px_-30px_rgba(0,0,0,0.6)]"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-white/5"
                }`
              }
            >
              <n.icon className="h-4 w-4 opacity-90" />
              <span className="flex-1">{n.label}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-transparent group-[.active]:bg-emerald-400" />
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
