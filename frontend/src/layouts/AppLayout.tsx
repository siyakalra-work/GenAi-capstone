import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/nav/Sidebar";
import { Topbar } from "../components/nav/Topbar";

export function AppLayout() {
  return (
    <div className="min-h-full bg-slate-50 dark:bg-[#070A12]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-80 w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/18 via-fuchsia-500/12 to-cyan-500/12 blur-3xl" />
        <div className="absolute -bottom-24 right-[-200px] h-80 w-[700px] rounded-full bg-gradient-to-r from-emerald-500/12 via-sky-500/12 to-indigo-500/12 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.55),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),rgba(255,255,255,0))]" />
      </div>

      <div className="relative w-full">
        <div className="glass w-full min-h-screen shadow-[0_40px_120px_-70px_rgba(0,0,0,0.7)] overflow-hidden">
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 min-w-0">
              <Topbar />
              <main className="p-6">
                <Outlet />
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
