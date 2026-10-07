import { useQuery } from "@tanstack/react-query";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { getPipelineCounts } from "../services/dashboard.service.js";
import { PIPELINE_STAGES, STAGE_LABELS } from "../utils/pipeline.js";

export default function DashboardPage() {
  const query = useQuery({ queryKey: ["dashboard", "pipeline"], queryFn: getPipelineCounts });
  if (query.isLoading) return <LoadingState label="Loading pipeline…" />;
  if (query.isError) return <ErrorState message={query.error?.response?.data?.message || "Unable to load pipeline counts."} onRetry={() => query.refetch()} />;
  const counts = query.data || {}; const active = PIPELINE_STAGES.slice(0, 4).reduce((total, stage) => total + (counts[stage] || 0), 0); const total = PIPELINE_STAGES.reduce((sum, stage) => sum + (counts[stage] || 0), 0); const max = Math.max(...PIPELINE_STAGES.map((stage) => counts[stage] || 0), 1);
  return <section><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-teal-dark">Overview</p><h1 className="font-display text-4xl tracking-tight">Good morning, let’s move leads forward.</h1><p className="mt-3 text-ink-soft">A live view of your brokerage pipeline.</p></div><div className="rounded-xl border border-line bg-surface px-5 py-4"><p className="text-xs uppercase tracking-wide text-ink-soft">Active pipeline</p><p className="mt-1 text-3xl font-semibold">{active}</p><p className="mt-1 text-xs text-ink-soft">{total} total leads</p></div></div><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{PIPELINE_STAGES.map((stage) => <article key={stage} className="rounded-xl border border-line bg-surface p-5 shadow-sm"><div className="flex items-center justify-between"><StatusBadge status={stage} /><span className="text-3xl font-semibold">{counts[stage] || 0}</span></div><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-teal transition-all" style={{ width: `${((counts[stage] || 0) / max) * 100}%` }} /></div><p className="mt-3 text-xs text-ink-soft">{stage === "WON" || stage === "LOST" ? "Terminal stage" : `${STAGE_LABELS[stage]} in progress`}</p></article>)}</div></section>;
}
