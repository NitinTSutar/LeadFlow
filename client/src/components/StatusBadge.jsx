import { STAGE_LABELS, STAGE_TONES } from "../utils/pipeline.js";

export default function StatusBadge({ status }) { return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${STAGE_TONES[status] || "border-line bg-surface"}`}>{STAGE_LABELS[status] || status}</span>; }
