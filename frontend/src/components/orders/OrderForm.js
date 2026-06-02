import { useMemo, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { currency } from "../../utils/format";
import Button from "../common/Button";

export default function OrderForm({ customers, products, onSubmit, loading }) {
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([{ product_id: "", quantity: 1 }]);

  const total = useMemo(() => items.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === Number(item.product_id));
    return sum + Number(product?.price || 0) * Number(item.quantity || 0);
  }, 0), [items, products]);

  const updateItem = (index, patch) => {
    setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  };

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      customer_id: Number(customerId),
      items: items.filter((item) => item.product_id).map((item) => ({ product_id: Number(item.product_id), quantity: Number(item.quantity) }))
    });
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <select value={customerId} onChange={(event) => setCustomerId(event.target.value)} required className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-slate-50 outline-none focus:border-blue-400">
        <option value="">Select customer</option>
        {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.full_name}</option>)}
      </select>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="grid gap-3 md:grid-cols-[1fr_120px_44px]">
            <select value={item.product_id} onChange={(event) => updateItem(index, { product_id: event.target.value })} required className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-slate-50 outline-none focus:border-blue-400">
              <option value="">Select product</option>
              {products.map((product) => <option key={product.id} value={product.id}>{product.product_name} ({product.quantity_in_stock} in stock)</option>)}
            </select>
            <input type="number" min="1" value={item.quantity} onChange={(event) => updateItem(index, { quantity: event.target.value })} className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-slate-50 outline-none focus:border-blue-400" />
            <button type="button" className="rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20" onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} disabled={items.length === 1}>
              <FiTrash2 className="mx-auto" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="secondary" onClick={() => setItems((current) => [...current, { product_id: "", quantity: 1 }])}><FiPlus /> Add Product</Button>
        <div className="text-right">
          <p className="text-sm text-slate-400">Estimated total</p>
          <p className="text-2xl font-bold text-slate-50">{currency(total)}</p>
        </div>
      </div>
      <Button type="submit" disabled={loading || !customers.length || !products.length}>{loading ? "Creating..." : "Create Order"}</Button>
    </form>
  );
}
