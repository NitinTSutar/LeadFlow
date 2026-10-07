import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store.js";

const links = {
  platformAdmin: [{ to: "/platform/dashboard", label: "Dashboard" }, { to: "/platform/brokerages", label: "Brokerages" }],
  brokerageAdmin: [{ to: "/dashboard", label: "Dashboard" }, { to: "/leads", label: "Leads" }, { to: "/tasks", label: "Tasks" }, { to: "/advisors", label: "Advisors" }, { to: "/email-templates", label: "Email templates" }, { to: "/task-triggers", label: "Task triggers" }],
  advisor: [{ to: "/dashboard", label: "Dashboard" }, { to: "/leads", label: "Leads" }, { to: "/tasks", label: "Tasks" }],
  client: [{ to: "/client/case", label: "My case" }, { to: "/client/documents", label: "Documents" }],
};

export default function AppLayout() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const roleLinks = links[user?.role] || [];
  async function handleLogout() { await signOut(); navigate("/login", { replace: true }); }
  return <div className="min-h-screen bg-paper text-ink lg:flex">
    <aside className="border-b border-line bg-ink px-4 py-3 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:px-6 lg:py-5">
      <div className="flex items-start justify-between gap-4 lg:mb-8"><div><p className="font-display text-2xl tracking-tight">LeadFlow</p><p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/55">Brokerage workspace</p></div><div className="max-w-[48%] text-right lg:hidden"><p className="truncate text-sm font-medium text-white">{user?.name || "Signed in"}</p><p className="mt-0.5 text-xs capitalize text-white/50">{user?.role}</p></div></div>
      <nav className="mt-4 flex gap-2 overflow-x-auto lg:mt-0 lg:block lg:space-y-1">{roleLinks.map((link) => <NavLink key={link.to} to={link.to} className={({ isActive }) => `focus-ring block whitespace-nowrap rounded-lg px-3 py-2.5 text-sm transition ${isActive ? "bg-teal text-ink" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>{link.label}</NavLink>)}</nav>
      <div className="hidden border-t border-white/10 pt-5 lg:mt-auto lg:block"><p className="truncate text-sm text-white">{user?.name || "Signed in"}</p><p className="mt-1 text-xs capitalize text-white/50">{user?.role}</p></div>
    </aside>
    <main className="min-w-0 flex-1"><header className="flex items-center justify-between border-b border-line bg-surface px-5 py-4 lg:px-10"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-dark">Workspace</p><p className="mt-1 text-sm text-ink-soft">Keep every client conversation moving.</p></div><button className="focus-ring rounded-lg border border-line px-3 py-2 text-sm text-ink-soft hover:border-ink hover:text-ink" onClick={handleLogout}>Log out</button></header><div className="mx-auto max-w-7xl px-5 py-8 lg:px-10 lg:py-10"><Outlet /></div></main>
  </div>;
}
