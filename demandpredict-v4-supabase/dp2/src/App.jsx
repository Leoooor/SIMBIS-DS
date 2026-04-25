import { useState } from "react";
import { NAV_ITEMS } from "./utils";
import { useAuth } from "./auth";
import { useProducts, useSalesHistory } from "./hooks";

import Sidebar       from "./components/Sidebar";
import Toast         from "./components/Toast";
import ProductModal  from "./components/ProductModal";
import SalesModal    from "./components/SalesModal";
import DeleteConfirm from "./components/DeleteConfirm";

import LoginPage    from "./pages/LoginPage";
import Dashboard    from "./pages/Dashboard";
import Products     from "./pages/Products";
import Analytics    from "./pages/Analytics";
import AIConsultant from "./pages/AIConsultant";
import ExportPage   from "./pages/ExportPage";

export default function App() {
  const { user, profile, loading } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { salesHistory, addSales, updateSales, deleteSales }   = useSalesHistory();

  const [page, setPage]                 = useState("dashboard");
  const [showProductForm, setShowProductForm] = useState(false);
  const [showSalesForm, setShowSalesForm]     = useState(false);
  const [editProduct, setEditProduct]   = useState(null);
  const [editSales, setEditSales]       = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);  // { type, id }
  const [notification, setNotification] = useState(null);
  const [sidebarOpen, setSidebarOpen]   = useState(false);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center text-slate-500 text-xs"
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
      ◌ Memuat...
    </div>
  );

  if (!user) return <LoginPage />;

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // ── Product handlers ─────────────────────────────────────────
  const handleSubmitProduct = async (formData) => {
    const r = editProduct
      ? await updateProduct(editProduct.id, formData)
      : await addProduct(formData);
    if (r.ok) notify(editProduct ? "Produk diperbarui!" : "Produk ditambahkan!");
    else notify(r.error, "error");
    setShowProductForm(false); setEditProduct(null);
  };

  // ── Sales handlers ───────────────────────────────────────────
  const handleSubmitSales = async (formData) => {
    const r = editSales
      ? await updateSales(editSales.id, formData)
      : await addSales(formData);
    if (r.ok) notify(editSales ? "Data penjualan diperbarui!" : "Data penjualan ditambahkan!");
    else notify(r.error, "error");
    setShowSalesForm(false); setEditSales(null);
  };

  // ── Delete handler ───────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "product") {
      const r = await deleteProduct(deleteTarget.id);
      if (r.ok) notify("Produk dihapus.", "info");
      else notify(r.error, "error");
    } else {
      const r = await deleteSales(deleteTarget.id);
      if (r.ok) notify("Data penjualan dihapus.", "info");
      else notify(r.error, "error");
    }
    setDeleteTarget(null);
  };

  const navigate = (id) => { setPage(id); setSidebarOpen(false); };
  const currentLabel = NAV_ITEMS.find((n) => n.id === page)?.label ?? "";

  const db = { products, salesHistory };

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace" }} className="min-h-screen bg-[#0a0e1a] text-slate-100 flex">

      <div className="hidden lg:flex">
        <Sidebar page={page} onNavigate={navigate} />
      </div>

      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)}/>
          <div className="fixed inset-y-0 left-0 z-40 lg:hidden">
            <Sidebar page={page} onNavigate={navigate} />
          </div>
        </>
      )}

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-[#0d1221]/80 border-b border-slate-800/60 flex items-center px-5 gap-4 sticky top-0 z-20 backdrop-blur">
          <button className="lg:hidden text-slate-400 hover:text-white text-xl" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="flex-1">
            <span style={{ fontFamily: "'Space Grotesk',sans-serif" }} className="text-sm font-semibold text-white">{currentLabel}</span>
            {profile?.business_name && (
              <span className="ml-2 text-[10px] text-slate-500">— {profile.business_name}</span>
            )}
          </div>
          <div className="text-[10px] text-slate-500 tracking-widest uppercase hidden sm:block">
            {new Date().toLocaleDateString("id-ID", { weekday:"short", day:"numeric", month:"short", year:"numeric" })}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {page === "dashboard" && <Dashboard db={db} />}
          {page === "products"  && (
            <Products db={db}
              onAdd={() => { setEditProduct(null); setShowProductForm(true); }}
              onEdit={(p) => { setEditProduct(p); setShowProductForm(true); }}
              onDelete={(id) => setDeleteTarget({ type: "product", id })} />
          )}
          {page === "analytics" && (
            <Analytics db={db}
              onAddSales={() => { setEditSales(null); setShowSalesForm(true); }}
              onEditSales={(s) => { setEditSales(s); setShowSalesForm(true); }}
              onDeleteSales={(id) => setDeleteTarget({ type: "sales", id })} />
          )}
          {page === "ai"     && <AIConsultant db={db} />}
          {page === "export" && <ExportPage   db={db} onNotify={notify} />}
        </div>
      </main>

      <Toast notification={notification} />

      {showProductForm && (
        <ProductModal editItem={editProduct}
          onClose={() => { setShowProductForm(false); setEditProduct(null); }}
          onSubmit={handleSubmitProduct} onNotify={notify} />
      )}

      {showSalesForm && (
        <SalesModal editItem={editSales}
          onClose={() => { setShowSalesForm(false); setEditSales(null); }}
          onSubmit={handleSubmitSales} onNotify={notify} />
      )}

      {deleteTarget && (
        <DeleteConfirm onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
