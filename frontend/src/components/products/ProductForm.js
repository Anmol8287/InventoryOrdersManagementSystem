import { useEffect, useState } from "react";
import Button from "../common/Button";

const initial = { product_name: "", sku: "", price: "", quantity_in_stock: "" };

export default function ProductForm({ product, onSubmit, loading }) {
  const [form, setForm] = useState(initial);

  useEffect(() => {
    setForm(product ? {
      product_name: product.product_name,
      sku: product.sku,
      price: product.price,
      quantity_in_stock: product.quantity_in_stock
    } : initial);
  }, [product]);

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      product_name: form.product_name.trim(),
      sku: form.sku.trim(),
      price: Number(form.price),
      quantity_in_stock: Number(form.quantity_in_stock)
    });
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <label className="block text-sm text-slate-300">
        Product name
        <input name="product_name" value={form.product_name} onChange={handleChange} required minLength="2" className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-slate-50 outline-none focus:border-blue-400" />
      </label>
      <label className="block text-sm text-slate-300">
        SKU
        <input name="sku" value={form.sku} onChange={handleChange} required minLength="2" className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-slate-50 outline-none focus:border-blue-400" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-slate-300">
          Price
          <input name="price" value={form.price} onChange={handleChange} required type="number" step="0.01" min="0" className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-slate-50 outline-none focus:border-blue-400" />
        </label>
        <label className="block text-sm text-slate-300">
          Stock
          <input name="quantity_in_stock" value={form.quantity_in_stock} onChange={handleChange} required type="number" min="0" className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-slate-50 outline-none focus:border-blue-400" />
        </label>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Product"}</Button>
      </div>
    </form>
  );
}
