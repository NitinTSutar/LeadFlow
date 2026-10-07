const labels = { UPLOADED: "Uploaded", PROCESSING: "Checking…", APPROVED: "Approved", FAILED: "Failed" };
const tones = { UPLOADED: "border-sky-200 bg-sky-50 text-sky-900", PROCESSING: "border-amber-200 bg-amber-50 text-amber-900", APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-900", FAILED: "border-red-200 bg-red-50 text-danger" };
export default function DocumentStatusBadge({ status }) { return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[status] || "border-line bg-surface text-ink"}`}>{labels[status] || status}</span>; }
