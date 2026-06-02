import { FiX } from "react-icons/fi";

export default function Modal({ title, open, onClose, children, width = "max-w-xl" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 p-4">
      <div className={`glass max-h-[92vh] w-full ${width} overflow-y-auto rounded-lg shadow-glow`}>
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <h2 className="text-lg font-semibold text-slate-50">{title}</h2>
          <button className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
