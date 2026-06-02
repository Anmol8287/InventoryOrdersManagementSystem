import { createContext, useContext, useMemo, useState } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const notify = (message, type = "success") => {
    const id = Date.now();
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 3500);
  };

  const value = useMemo(() => ({ notify }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => {
          const Icon = toast.type === "error" ? FiXCircle : FiCheckCircle;
          return (
            <div
              key={toast.id}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-900/95 p-4 text-sm text-slate-50 shadow-glow backdrop-blur"
            >
              <Icon className={toast.type === "error" ? "text-red-400" : "text-emerald-400"} />
              <span>{toast.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
