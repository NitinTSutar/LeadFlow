export default function PlaceholderPage({ eyebrow = "Coming next", title, description }) {
  return <section className="max-w-3xl"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-teal-dark">{eyebrow}</p><h1 className="font-display text-4xl leading-tight tracking-tight text-ink">{title}</h1><p className="mt-4 max-w-xl text-base leading-7 text-ink-soft">{description}</p><div className="mt-10 rounded-2xl border border-dashed border-line bg-surface/70 p-8 text-sm text-ink-soft">This workspace is ready for the next LeadFlow feature.</div></section>;
}
