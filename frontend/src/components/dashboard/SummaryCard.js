export default function SummaryCard({ label, value, icon: Icon, tone = "text-blue-300" }) {
  return (
    <div className="glass rounded-lg p-5 transition hover:-translate-y-1 hover:border-blue-400/40">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-50">{value}</p>
        </div>
        <div className={`rounded-lg bg-white/10 p-3 text-2xl ${tone}`}>
          <Icon />
        </div>
      </div>
    </div>
  );
}
