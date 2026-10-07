import { useQuery } from "@tanstack/react-query";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { getClientCase } from "../services/client.service.js";

export default function ClientCasePage() {
  const query = useQuery({ queryKey: ["client", "case"], queryFn: getClientCase });
  if (query.isLoading) return <LoadingState label="Loading your case…" />;
  if (query.isError) { if (query.error?.response?.status === 404) return <EmptyCase />; return <ErrorState message={query.error?.response?.data?.message || "Unable to load your case."} onRetry={() => query.refetch()} />; }
  const item = query.data; const brokerage = typeof item.brokerageId === "object" ? item.brokerageId?.name : null;
  return <section className="max-w-4xl"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-teal-dark">Client portal</p><h1 className="font-display text-4xl tracking-tight">Your case</h1><p className="mt-3 text-ink-soft">A clear view of where your mortgage application stands.</p><div className="mt-8 rounded-2xl bg-ink p-6 text-white shadow-raised sm:p-8"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start"><div><p className="text-xs uppercase tracking-[0.18em] text-white/55">Applicant</p><h2 className="mt-2 font-display text-3xl">{item.firstName} {item.lastName}</h2>{brokerage && <p className="mt-2 text-sm text-white/65">{brokerage}</p>}</div><StatusBadge status={item.status} /></div></div><div className="mt-5 grid gap-5 sm:grid-cols-2"><div className="rounded-xl border border-line bg-surface p-6"><p className="text-xs uppercase tracking-wide text-ink-soft">Contact email</p><p className="mt-2 break-words font-medium">{item.email || "Not provided"}</p></div><div className="rounded-xl border border-line bg-surface p-6"><p className="text-xs uppercase tracking-wide text-ink-soft">Phone</p><p className="mt-2 font-medium">{item.phone || "Not provided"}</p></div></div></section>;
}

function EmptyCase() { return <section className="max-w-2xl"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-teal-dark">Client portal</p><h1 className="font-display text-4xl tracking-tight">Your case</h1><div className="mt-8 rounded-2xl border border-dashed border-line bg-surface p-10 text-center"><p className="font-display text-2xl">No active case is linked to this account.</p><p className="mt-3 text-sm leading-6 text-ink-soft">Your brokerage will need to link a case before it appears here.</p></div></section>; }
