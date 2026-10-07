import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { getApiError } from "../services/api.js";
import { useAuthStore } from "../store/auth.store.js";

export default function LoginPage() {
  const { user, isAuthenticated, signIn } = useAuthStore();
  const navigate = useNavigate(); const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" }); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  if (isAuthenticated) return <Navigate to={user?.role === "platformAdmin" ? "/platform/dashboard" : user?.role === "client" ? "/client/case" : "/dashboard"} replace />;
  async function submit(event) { event.preventDefault(); setError(""); setBusy(true); try { const user = await signIn(form); const landing = user.role === "platformAdmin" ? "/platform/dashboard" : user.role === "client" ? "/client/case" : "/dashboard"; navigate(location.state?.from?.pathname || landing, { replace: true }); } catch (err) { setError(getApiError(err).message); } finally { setBusy(false); } }
  return <main className="flex min-h-screen items-center justify-center bg-ink px-5 py-10"><section className="w-full max-w-md rounded-2xl bg-paper p-7 shadow-raised sm:p-10"><p className="font-display text-3xl tracking-tight">Welcome to LeadFlow</p><p className="mt-2 text-sm leading-6 text-ink-soft">Sign in to your brokerage workspace.</p><form className="mt-8 space-y-5" onSubmit={submit}><label className="block text-sm font-medium">Email<input className="focus-ring mt-2 block w-full rounded-lg border border-line bg-surface px-3 py-2.5" type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label><label className="block text-sm font-medium">Password<input className="focus-ring mt-2 block w-full rounded-lg border border-line bg-surface px-3 py-2.5" type="password" required autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>{error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger" role="alert">{error}</p>}<button className="focus-ring w-full rounded-lg bg-teal px-4 py-3 text-sm font-semibold text-ink hover:bg-teal-dark hover:text-white disabled:opacity-50" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button></form></section></main>;
}
