import { currency, dateTime } from "../../utils/format";
import Modal from "../common/Modal";

export default function OrderDetailsModal({ order, open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title={`Order #${order?.id || ""}`} width="max-w-3xl">
      {order && (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-slate-400">Customer</p>
              <p className="font-semibold">{order.customer?.full_name || order.customer_id}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Date</p>
              <p className="font-semibold">{dateTime(order.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Total</p>
              <p className="font-semibold">{currency(order.total_amount)}</p>
            </div>
          </div>
          <div className="table-scroll">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="text-slate-400">
                <tr className="border-b border-white/10">
                  <th className="py-3">Product</th>
                  <th className="py-3">Qty</th>
                  <th className="py-3">Unit Price</th>
                  <th className="py-3 text-right">Line</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-white/5">
                    <td className="py-3">{item.product?.product_name || item.product_id}</td>
                    <td className="py-3">{item.quantity}</td>
                    <td className="py-3">{currency(item.price)}</td>
                    <td className="py-3 text-right">{currency(Number(item.price) * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Modal>
  );
}
