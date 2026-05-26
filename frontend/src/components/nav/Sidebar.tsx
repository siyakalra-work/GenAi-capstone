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
    <aside className="hidden md:flex md:w-64 md:flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="p-5 border-b border-slate-200 dark:border-slate-800">
        <div className="font-semibold">StockPilot</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">Multi-tenant inventory</div>
      </div>
      <nav className="p-3 space-y-1">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                isActive
                  ? "bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900"
                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`
            }
          >
            <n.icon className="h-4 w-4" />
            {n.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

