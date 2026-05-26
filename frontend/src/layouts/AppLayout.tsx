import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/nav/Sidebar";
import { Topbar } from "../components/nav/Topbar";

export function AppLayout() {
  return (
    <div className="min-h-full flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Topbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

