import { useMemo, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import { getApiError } from "../api/client";
import Button from "../components/common/Button";
import ConfirmModal from "../components/common/ConfirmModal";
import EmptyState from "../components/common/EmptyState";
import LoadingState from "../components/common/LoadingState";
import Modal from "../components/common/Modal";
import Pagination from "../components/common/Pagination";
import ProductForm from "../components/products/ProductForm";
import ProductTable from "../components/products/ProductTable";
import { useToast } from "../context/ToastContext";
import { useAsync } from "../hooks/useAsync";
import { productService } from "../services/productService";

const pageSize = 8;

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState({ open: false, product: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const { notify } = useToast();
  const { data: products, loading, refresh } = useAsync(() => productService.list({ limit: 500 }), []);

  const filtered = useMemo(() => products.filter((product) => `${product.product_name} ${product.sku}`.toLowerCase().includes(search.toLowerCase())), [products, search]);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const save = async (payload) => {
    setSaving(true);
    try {
      if (modal.product) await productService.update(modal.product.id, payload);
      else await productService.create(payload);
      notify(modal.product ? "Product updated" : "Product created");
      setModal({ open: false, product: null });
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
      await productService.remove(deleteTarget.id);
      notify("Product deleted");
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
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><h2 className="text-2xl font-bold">Products</h2><p className="text-sm text-slate-400">Manage stock, pricing, and SKU catalog data.</p></div>
        <Button onClick={() => setModal({ open: true, product: null })}><FiPlus /> Add Product</Button>
      </div>
      <section className="glass rounded-lg p-5">
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2">
          <FiSearch className="text-slate-400" />
          <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search products" className="w-full bg-transparent text-slate-50 outline-none" />
        </div>
        {loading ? <LoadingState /> : paged.length ? <ProductTable products={paged} onEdit={(product) => setModal({ open: true, product })} onDelete={setDeleteTarget} /> : <EmptyState message="No products found" />}
        {!loading && filtered.length > pageSize && <Pagination page={page} pageSize={pageSize} count={filtered.length} onPageChange={setPage} />}
      </section>
      <Modal open={modal.open} title={modal.product ? "Edit Product" : "Add Product"} onClose={() => setModal({ open: false, product: null })}>
        <ProductForm product={modal.product} onSubmit={save} loading={saving} />
      </Modal>
      <ConfirmModal open={!!deleteTarget} title="Delete product" message={`Delete ${deleteTarget?.product_name || "this product"}?`} onClose={() => setDeleteTarget(null)} onConfirm={remove} loading={saving} />
    </div>
  );
}
