import { useMemo, useState } from "react";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import { getApiError } from "../api/client";
import ConfirmModal from "../components/common/ConfirmModal";
import EmptyState from "../components/common/EmptyState";
import LoadingState from "../components/common/LoadingState";
import CustomerForm from "../components/customers/CustomerForm";
import { useToast } from "../context/ToastContext";
import { useAsync } from "../hooks/useAsync";
import { customerService } from "../services/customerService";
import { dateTime } from "../utils/format";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const { notify } = useToast();
  const { data: customers, loading, refresh } = useAsync(() => customerService.list({ limit: 500 }), []);
  const filtered = useMemo(() => customers.filter((customer) => `${customer.full_name} ${customer.email}`.toLowerCase().includes(search.toLowerCase())), [customers, search]);

  const create = async (payload) => {
    setSaving(true);
    try {
      await customerService.create(payload);
      notify("Customer created");
      await refresh();
    } catch (err) {
      notify(getApiError(err), "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setSaving(true);
    try {
      await customerService.remove(deleteTarget.id);
      notify("Customer deleted");
      setDeleteTarget(null);
      await refresh();
    } catch (err) {
      notify(getApiError(err), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div><h2 className="text-2xl font-bold">Customers</h2><p className="text-sm text-slate-400">Maintain customer records and unique email identities.</p></div>
      <section className="glass rounded-lg p-5"><CustomerForm onSubmit={create} loading={saving} /></section>
      <section className="glass rounded-lg p-5">
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2">
          <FiSearch className="text-slate-400" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customers" className="w-full bg-transparent text-slate-50 outline-none" />
        </div>
        {loading ? <LoadingState /> : filtered.length ? (
          <div className="table-scroll">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="text-slate-400"><tr className="border-b border-white/10"><th className="py-3">Name</th><th>Email</th><th>Phone</th><th>Created</th><th className="text-right">Action</th></tr></thead>
              <tbody>{filtered.map((customer) => <tr key={customer.id} className="border-b border-white/5 text-slate-200 hover:bg-white/[0.03]"><td className="py-3 font-semibold">{customer.full_name}</td><td>{customer.email}</td><td>{customer.phone || "-"}</td><td>{dateTime(customer.created_at)}</td><td className="text-right"><button className="rounded-lg p-2 text-red-300 hover:bg-red-500/10" onClick={() => setDeleteTarget(customer)}><FiTrash2 className="ml-auto" /></button></td></tr>)}</tbody>
            </table>
          </div>
        ) : <EmptyState message="No customers found" />}
      </section>
      <ConfirmModal open={!!deleteTarget} title="Delete customer" message={`Delete ${deleteTarget?.full_name || "this customer"}?`} onClose={() => setDeleteTarget(null)} onConfirm={remove} loading={saving} />
    </div>
  );
}
