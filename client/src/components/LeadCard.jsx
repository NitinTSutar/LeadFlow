import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge.jsx";

export default function LeadCard({ lead }) {
  const name = `${lead.firstName} ${lead.lastName}`.trim();
  return <Link to={`/leads/${lead._id}`} className="focus-ring block rounded-xl border border-line bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-teal hover:shadow-raised">
    <div className="flex items-start justify-between gap-3"><p className="min-w-0 truncate font-semibold text-ink">{name}</p><StatusBadge status={lead.status} /></div>
    <div className="mt-3 space-y-1 text-xs text-ink-soft">{lead.email && <p className="truncate">{lead.email}</p>}{lead.phone && <p>{lead.phone}</p>}</div>
    <div className="mt-4 flex items-center justify-between gap-2 text-[11px] uppercase tracking-wide text-ink-soft"><span>{lead.source || "manual"}</span><span className="truncate">{lead.assignedAdvisorId?.name || lead.assignedAdvisor?.name || "Unassigned"}</span></div>
  </Link>;
}
