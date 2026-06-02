import { useState } from "react";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { getApiError } from "../api/client";
import ConfirmModal from "../components/common/ConfirmModal";
import EmptyState from "../components/common/EmptyState";
import LoadingState from "../components/common/LoadingState";
import OrderDetailsModal from "../components/orders/OrderDetailsModal";
import OrderForm from "../components/orders/OrderForm";
import { useToast } from "../context/ToastContext";
import { useAsync } from "../hooks/useAsync";
import { customerService } from "../services/customerService";
import { orderService } from "../services/orderService";
import { productService } from "../services/productService";
import { currency, dateTime } from "../utils/format";

export default function OrdersPage() {
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { notify } = useToast();
  const { data, loading, refresh } = useAsync(async () => {
    const [orders, products, customers] = await Promise.all([
      orderService.list({ limit: 500 }),
      productService.list({ limit: 500 }),
      customerService.list({ limit: 500 })
    ]);
    return { orders, products, customers };
  }, []);

  const create = async (payload) => {
    setSaving(true);
    try {
      await orderService.create(payload);
      notify("Order created and inventory reduced");
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
      await orderService.remove(deleteTarget.id);
      notify("Order deleted");
      setDeleteTarget(null);
      await refresh();
    } catch (err) {
      notify(getApiError(err), "error");
    } finally {
      setSaving(false);
    }
  };

  const orders = data.orders || [];
  const products = data.products || [];
  const customers = data.customers || [];

  return (
    <div className="space-y-5">
      <div><h2 className="text-2xl font-bold">Orders</h2><p className="text-sm text-slate-400">Create orders with stock checks and backend-calculated totals.</p></div>
      <section className="glass rounded-lg p-5">
        {loading ? <LoadingState label="Loading order form..." /> : <OrderForm customers={customers} products={products} onSubmit={create} loading={saving} />}
      </section>
      <section className="glass rounded-lg p-5">
        <h3 className="mb-4 text-lg font-semibold">Order History</h3>
        {loading ? <LoadingState /> : orders.length ? (
          <div className="table-scroll">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-slate-400"><tr className="border-b border-white/10"><th className="py-3">Order</th><th>Customer</th><th>Items</th><th>Date</th><th className="text-right">Total</th><th className="text-right">Actions</th></tr></thead>
              <tbody>{orders.map((order) => <tr key={order.id} className="border-b border-white/5 text-slate-200 hover:bg-white/[0.03]"><td className="py-3 font-semibold">#{order.id}</td><td>{order.customer?.full_name || order.customer_id}</td><td>{order.items?.length || 0}</td><td>{dateTime(order.created_at)}</td><td className="text-right">{currency(order.total_amount)}</td><td className="text-right"><div className="flex justify-end gap-2"><button className="rounded-lg p-2 text-slate-300 hover:bg-white/10" onClick={() => setSelected(order)}><FiEye /></button><button className="rounded-lg p-2 text-red-300 hover:bg-red-500/10" onClick={() => setDeleteTarget(order)}><FiTrash2 /></button></div></td></tr>)}</tbody>
            </table>
          </div>
        ) : <EmptyState message="No orders yet" />}
      </section>
      <OrderDetailsModal open={!!selected} order={selected} onClose={() => setSelected(null)} />
      <ConfirmModal open={!!deleteTarget} title="Delete order" message={`Delete order #${deleteTarget?.id || ""}? Inventory will not be restored automatically.`} onClose={() => setDeleteTarget(null)} onConfirm={remove} loading={saving} />
    </div>
  );
}
