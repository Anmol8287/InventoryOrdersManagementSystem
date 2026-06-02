export default function LoadingState({ label = "Loading..." }) {
  return (
    <div className="flex min-h-44 items-center justify-center text-slate-300">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
      <span className="ml-3 text-sm">{label}</span>
    </div>
  );
}
