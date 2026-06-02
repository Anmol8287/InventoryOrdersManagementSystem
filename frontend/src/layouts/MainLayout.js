import { NavLink, Outlet } from "react-router-dom";
import { FiBox, FiHome, FiMenu, FiShoppingCart, FiUsers } from "react-icons/fi";
import { useState } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: FiHome },
  { to: "/products", label: "Products", icon: FiBox },
  { to: "/customers", label: "Customers", icon: FiUsers },
  { to: "/orders", label: "Orders", icon: FiShoppingCart }
];

export default function MainLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-app-bg text-app-text">
      <aside className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-white/10 bg-slate-950/90 p-5 backdrop-blur transition lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-8">
          <p className="text-xl font-bold">InventoryOS</p>
          <p className="mt-1 text-sm text-slate-400">Operations dashboard</p>
        </div>
        <nav className="space-y-2">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    isActive ? "bg-blue-500 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      {open && <button aria-label="Close navigation" className="fixed inset-0 z-20 bg-slate-950/60 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/75 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button className="rounded-lg p-2 text-slate-200 hover:bg-white/10 lg:hidden" onClick={() => setOpen(true)}>
              <FiMenu />
            </button>
            <div>
              <p className="text-sm text-slate-400">Business inventory and order control</p>
              <h1 className="text-xl font-semibold text-slate-50">Management Console</h1>
            </div>
            <div className="hidden rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 sm:block">Production-ready</div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
