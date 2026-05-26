import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-full grid place-items-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
        <div className="mb-6">
          <div className="text-xl font-semibold">StockPilot</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Inventory Intelligence Platform</div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

