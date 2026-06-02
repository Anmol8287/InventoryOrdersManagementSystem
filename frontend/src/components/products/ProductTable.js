import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { currency, dateTime } from "../../utils/format";

export default function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="table-scroll">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="text-slate-400">
          <tr className="border-b border-white/10">
            <th className="py-3 pr-4">Product</th>
            <th className="py-3 pr-4">SKU</th>
            <th className="py-3 pr-4">Price</th>
            <th className="py-3 pr-4">Stock</th>
            <th className="py-3 pr-4">Created</th>
            <th className="py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-white/5 text-slate-200 hover:bg-white/[0.03]">
              <td className="py-3 pr-4 font-semibold">{product.product_name}</td>
              <td className="py-3 pr-4">{product.sku}</td>
              <td className="py-3 pr-4">{currency(product.price)}</td>
              <td className="py-3 pr-4">
                <span className={`rounded-lg px-2 py-1 text-xs ${product.quantity_in_stock < 10 ? "bg-red-500/15 text-red-300" : "bg-emerald-500/15 text-emerald-300"}`}>
                  {product.quantity_in_stock}
                </span>
              </td>
              <td className="py-3 pr-4">{dateTime(product.created_at)}</td>
              <td className="py-3">
                <div className="flex justify-end gap-2">
                  <button className="rounded-lg p-2 text-slate-300 hover:bg-white/10" onClick={() => onEdit(product)}><FiEdit2 /></button>
                  <button className="rounded-lg p-2 text-red-300 hover:bg-red-500/10" onClick={() => onDelete(product)}><FiTrash2 /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
