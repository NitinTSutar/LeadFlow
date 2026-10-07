import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorState from "../components/ErrorState.jsx";
import LeadCard from "../components/LeadCard.jsx";
import LeadForm from "../components/LeadForm.jsx";
import LoadingState from "../components/LoadingState.jsx";
import Modal from "../components/Modal.jsx";
import { useAuthStore } from "../store/auth.store.js";
import { createLead, listLeads } from "../services/lead.service.js";
import { listAvailableAdvisors } from "../services/advisor.service.js";
import { PIPELINE_STAGES, STAGE_LABELS } from "../utils/pipeline.js";

export default function LeadsPage() {
  const user = useAuthStore((state) => state.user); const queryClient = useQueryClient(); const navigate = useNavigate(); const [search, setSearch] = useState(""); const [showNew, setShowNew] = useState(false); const [createError, setCreateError] = useState("");
  const leadsQuery = useQuery({ queryKey: ["leads"], queryFn: listLeads }); const brokerageId = user?.brokerageId; const canCreate = ["brokerageAdmin", "advisor"].includes(user?.role);
  const advisorsQuery = useQuery({ queryKey: ["advisors", brokerageId], queryFn: () => listAvailableAdvisors(brokerageId), enabled: Boolean(brokerageId && canCreate) });
  const createMutation = useMutation({ mutationFn: createLead, onSuccess: (lead) => { setShowNew(false); setCreateError(""); queryClient.invalidateQueries({ queryKey: ["leads"] }); queryClient.invalidateQueries({ queryKey: ["dashboard", "pipeline"] }); navigate(`/leads/${lead._id}`); }, onError: (error) => { if (error.response?.status === 409) setCreateError("This lead already exists in this brokerage."); } });
  const leads = leadsQuery.data?.leads || []; const filtered = useMemo(() => { const term = search.trim().toLowerCase(); if (!term) return leads; return leads.filter((lead) => [lead.firstName, lead.lastName, lead.email, lead.phone].some((value) => value?.toLowerCase().includes(term))); }, [leads, search]);
  if (leadsQuery.isLoading) return <LoadingState label="Loading leads…" />;
  if (leadsQuery.isError) return <ErrorState message={leadsQuery.error?.response?.data?.message || "Unable to load leads."} onRetry={() => leadsQuery.refetch()} />;
  return <section><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-teal-dark">Pipeline</p><h1 className="font-display text-4xl tracking-tight">Leads</h1><p className="mt-3 text-ink-soft">Track every opportunity from first contact to close.</p></div>{canCreate && <button onClick={() => { setCreateError(""); setShowNew(true); }} className="focus-ring min-h-11 rounded-lg bg-teal px-4 py-2.5 text-sm font-semibold text-ink hover:bg-teal-dark hover:text-white">+ New lead</button>}</div><div className="mt-7 max-w-xl"><label className="sr-only" htmlFor="lead-search">Search leads</label><input id="lead-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, or phone" className="focus-ring w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm" /></div>{createError && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-danger" role="alert">{createError}</p>}<div className="mt-8 flex gap-4 overflow-x-auto pb-4">{PIPELINE_STAGES.map((stage) => { const stageLeads = filtered.filter((lead) => lead.status === stage); return <section key={stage} className="w-72 shrink-0 rounded-xl bg-line/50 p-3"><div className="mb-3 flex items-center justify-between px-1"><h2 className="text-sm font-semibold">{STAGE_LABELS[stage]}</h2><span className="rounded-full bg-surface px-2 py-0.5 text-xs text-ink-soft">{stageLeads.length}</span></div><div className="space-y-3">{stageLeads.length ? stageLeads.map((lead) => <LeadCard key={lead._id} lead={lead} />) : <p className="rounded-lg border border-dashed border-line bg-paper/70 px-3 py-7 text-center text-xs text-ink-soft">No leads here</p>}</div></section>; })}</div>{showNew && <Modal title="Create a new lead" onClose={() => setShowNew(false)}><LeadForm advisors={advisorsQuery.data} onCancel={() => setShowNew(false)} isPending={createMutation.isPending} onSubmit={(data) => createMutation.mutateAsync(data)} /></Modal>}</section>;
}
