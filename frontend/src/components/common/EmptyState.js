import { FiInbox } from "react-icons/fi";

export default function EmptyState({ message = "No records found" }) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center rounded-lg border border-dashed border-white/10 text-slate-400">
      <FiInbox className="mb-3 text-3xl" />
      <p>{message}</p>
    </div>
  );
}
