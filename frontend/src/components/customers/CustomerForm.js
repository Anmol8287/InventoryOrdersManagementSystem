import { useState } from "react";
import Button from "../common/Button";

export default function CustomerForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "" });
  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    onSubmit({ full_name: form.full_name.trim(), email: form.email.trim(), phone: form.phone.trim() || null });
    setForm({ full_name: "", email: "", phone: "" });
  };

  return (
    <form className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]" onSubmit={submit}>
      <input name="full_name" value={form.full_name} onChange={handleChange} required minLength="2" placeholder="Full name" className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-slate-50 outline-none focus:border-blue-400" />
      <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="Email" className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-slate-50 outline-none focus:border-blue-400" />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-slate-50 outline-none focus:border-blue-400" />
      <Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Customer"}</Button>
    </form>
  );
}
