import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/nav/Sidebar";
import { Topbar } from "../components/nav/Topbar";

export function AppLayout() {
  return (
    <div className="min-h-full flex bg-slate-50 dark:bg-[#070A12]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-80 w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/15 via-fuchsia-500/10 to-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-24 right-[-200px] h-80 w-[700px] rounded-full bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-indigo-500/10 blur-3xl" />
      </div>
      <Sidebar />
      <div className="relative flex-1 min-w-0">
        <Topbar />
        <main className="p-6">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
