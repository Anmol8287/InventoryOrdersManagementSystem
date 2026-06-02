import { FiBox, FiDollarSign, FiShoppingCart, FiUsers } from "react-icons/fi";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import SummaryCard from "../components/dashboard/SummaryCard";
import EmptyState from "../components/common/EmptyState";
import LoadingState from "../components/common/LoadingState";
import { useAsync } from "../hooks/useAsync";
import { customerService } from "../services/customerService";
import { orderService } from "../services/orderService";
import { productService } from "../services/productService";
import { currency, dateTime } from "../utils/format";

const colors = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#a855f7"];

export default function DashboardPage() {
  const { data, loading } = useAsync(async () => {
    const [products, customers, orders] = await Promise.all([
      productService.list({ limit: 500 }),
      customerService.list({ limit: 500 }),
      orderService.list({ limit: 500 })
    ]);
    return { products, customers, orders };
  }, []);

  if (loading) return <LoadingState label="Loading dashboard..." />;

  const products = data.products || [];
  const customers = data.customers || [];
  const orders = data.orders || [];
  const inventoryValue = products.reduce((sum, product) => sum + Number(product.price) * product.quantity_in_stock, 0);
  const lowStock = products.filter((product) => product.quantity_in_stock < 10).slice(0, 6);
  const chartData = products.slice(0, 5).map((product) => ({ name: product.product_name, value: product.quantity_in_stock }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total Products" value={products.length} icon={FiBox} />
        <SummaryCard label="Total Customers" value={customers.length} icon={FiUsers} tone="text-emerald-300" />
        <SummaryCard label="Total Orders" value={orders.length} icon={FiShoppingCart} tone="text-amber-300" />
        <SummaryCard label="Inventory Value" value={currency(inventoryValue)} icon={FiDollarSign} tone="text-violet-300" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="glass rounded-lg p-5">
          <h2 className="mb-4 text-lg font-semibold">Low Stock Products</h2>
          {lowStock.length ? (
            <div className="table-scroll">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="text-slate-400"><tr className="border-b border-white/10"><th className="py-3">Product</th><th>SKU</th><th className="text-right">Stock</th></tr></thead>
                <tbody>{lowStock.map((product) => <tr key={product.id} className="border-b border-white/5"><td className="py-3">{product.product_name}</td><td>{product.sku}</td><td className="text-right text-red-300">{product.quantity_in_stock}</td></tr>)}</tbody>
              </table>
            </div>
          ) : <EmptyState message="No low-stock products" />}
        </section>

        <section className="glass rounded-lg p-5">
          <h2 className="mb-4 text-lg font-semibold">Inventory Distribution</h2>
          {chartData.length ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={95} paddingAngle={4}>
                    {chartData.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} units`, "Stock"]} contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.12)", color: "#f8fafc" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : <EmptyState message="Add products to see inventory distribution" />}
        </section>
      </div>

      <section className="glass rounded-lg p-5">
        <h2 className="mb-4 text-lg font-semibold">Recent Orders</h2>
        {orders.length ? (
          <div className="table-scroll">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-slate-400"><tr className="border-b border-white/10"><th className="py-3">Order</th><th>Customer</th><th>Date</th><th className="text-right">Total</th></tr></thead>
              <tbody>{orders.slice(0, 6).map((order) => <tr key={order.id} className="border-b border-white/5"><td className="py-3">#{order.id}</td><td>{order.customer?.full_name || order.customer_id}</td><td>{dateTime(order.created_at)}</td><td className="text-right">{currency(order.total_amount)}</td></tr>)}</tbody>
            </table>
          </div>
        ) : <EmptyState message="No orders yet" />}
      </section>
    </div>
  );
}
