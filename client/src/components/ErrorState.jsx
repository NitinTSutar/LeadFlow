export default function ErrorState({ message = "Something went wrong.", onRetry }) {
  return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-danger" role="alert"><p>{message}</p>{onRetry && <button className="focus-ring mt-3 rounded-lg bg-surface px-3 py-2 font-semibold text-ink shadow-sm" onClick={onRetry}>Try again</button>}</div>;
}
