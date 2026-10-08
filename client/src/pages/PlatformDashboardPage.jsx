import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { getPlatformDashboard } from "../services/platform.service.js";
import { PIPELINE_STAGES, STAGE_LABELS } from "../utils/pipeline.js";

export default function PlatformDashboardPage() {
  const query = useQuery({ queryKey: ["platform", "dashboard"], queryFn: getPlatformDashboard });
  if (query.isLoading) return <LoadingState label="Loading platform overview…" />;
  if (query.isError) return <ErrorState message={query.error?.response?.data?.message || "Unable to load platform overview."} onRetry={() => query.refetch()} />;
  const { summary, pipeline } = query.data;
  return <section><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-teal-dark">Platform administration</p><h1 className="font-display text-4xl tracking-tight">Platform Overview</h1><p className="mt-3 text-ink-soft">High-level view of all brokerages and platform activity.</p></div><Link to="/platform/brokerages" className="focus-ring inline-flex min-h-11 items-center justify-center rounded-lg border border-line px-4 py-2.5 text-sm font-semibold hover:border-ink">Manage brokerages</Link></div><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{[["Brokerages", summary.brokerages], ["Brokerage admins", summary.brokerageAdmins], ["Advisors", summary.advisors], ["Clients", summary.clients], ["Leads", summary.leads]].map(([label, value]) => <article key={label} className="rounded-xl border border-line bg-surface p-5 shadow-sm"><p className="text-xs uppercase tracking-wide text-ink-soft">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></article>)}</div><div className="mt-10"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-dark">All brokerages</p><h2 className="mt-2 font-display text-2xl">Pipeline summary</h2></div><div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{PIPELINE_STAGES.map((stage) => <article key={stage} className="rounded-xl border border-line bg-surface p-5"><div className="flex items-center justify-between gap-3"><StatusBadge status={stage} /><span className="text-2xl font-semibold">{pipeline[stage] || 0}</span></div><p className="mt-3 text-xs text-ink-soft">{stage === "WON" || stage === "LOST" ? "Terminal stage" : `${STAGE_LABELS[stage]} across all brokerages`}</p></article>)}</div></div></section>;
}
