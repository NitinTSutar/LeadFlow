export default function LoadingState({ label = "Loading" }) {
  return <div className="flex min-h-40 items-center justify-center text-sm text-ink-soft" role="status"><span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-teal" />{label}</div>;
}
