export default function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-400",
    secondary: "bg-slate-700 text-slate-100 hover:bg-slate-600",
    danger: "bg-red-500 text-white hover:bg-red-400",
    ghost: "bg-transparent text-slate-300 hover:bg-white/10"
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
