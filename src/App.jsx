import { useState, useEffect } from "react";
import { loadData, saveData } from "./storage";
import { NAV_ITEMS } from "./utils";
import { useAuth } from "./auth";

import Sidebar       from "./components/Sidebar";
import Toast         from "./components/Toast";
import ProductModal  from "./components/ProductModal";
import DeleteConfirm from "./components/DeleteConfirm";

import LoginPage    from "./pages/LoginPage";
import Dashboard    from "./pages/Dashboard";
import Products     from "./pages/Products";
import Analytics    from "./pages/Analytics";
import AIConsultant from "./pages/AIConsultant";
import Alerts       from "./pages/Alerts";
import ExportPage   from "./pages/ExportPage";

export default function App() {
  const { user, loading } = useAuth();
  const [db, setDb]                     = useState(loadData);
  const [page, setPage]                 = useState("dashboard");
  const [showForm, setShowForm]         = useState(false);
  const [editItem, setEditItem]         = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notification, setNotification] = useState(null);
  const [sidebarOpen, setSidebarOpen]   = useState(false);

  useEffect(() => { saveData(db); }, [db]);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center text-slate-500 text-xs">
      ◌ Memuat...
    </div>
  );

  if (!user) return <LoginPage />;

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const openAdd  = () => { setEditItem(null); setShowForm(true); };
  const openEdit = (p) => { setEditItem(p);   setShowForm(true); };

  const handleSubmitProduct = (formData) => {
    setDb((prev) => {
      if (editItem) return { ...prev, products: prev.products.map((p) => p.id === editItem.id ? { ...p, ...formData } : p) };
      return { ...prev, products: [...prev.products, { id: prev.nextId, ...formData }], nextId: prev.nextId + 1 };
    });
    notify(editItem ? "Produk diperbarui!" : "Produk ditambahkan!");
    setShowForm(false); setEditItem(null);
  };

  const handleDeleteProduct = (id) => {
    setDb((prev) => ({ ...prev, products: prev.products.filter((p) => p.id !== id) }));
    notify("Produk dihapus.", "info");
    setDeleteTarget(null);
  };

  const dismissAlert    = (id) => setDb((prev) => ({ ...prev, alerts: prev.alerts.filter((a) => a.id !== id) }));
  const dismissAllAlerts = ()  => { setDb((prev) => ({ ...prev, alerts: [] })); notify("Semua notifikasi dihapus.", "info"); };

  const restoreFromDrive = (data) => { setDb(data); saveData(data); };

  const navigate = (id) => { setPage(id); setSidebarOpen(false); };
  const currentLabel = NAV_ITEMS.find((n) => n.id === page)?.label ?? "";

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace" }} className="min-h-screen bg-[#0a0e1a] text-slate-100 flex">

      <div className="hidden lg:flex">
        <Sidebar page={page} onNavigate={navigate} alertCount={db.alerts.length} />
      </div>

      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)}/>
          <div className="fixed inset-y-0 left-0 z-40 lg:hidden">
            <Sidebar page={page} onNavigate={navigate} alertCount={db.alerts.length} />
          </div>
        </>
      )}

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-[#0d1221]/80 border-b border-slate-800/60 flex items-center px-5 gap-4 sticky top-0 z-20 backdrop-blur">
          <button className="lg:hidden text-slate-400 hover:text-white text-xl" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="flex-1">
            <span style={{ fontFamily: "'Space Grotesk',sans-serif" }} className="text-sm font-semibold text-white">{currentLabel}</span>
          </div>
          <div className="text-[10px] text-slate-500 tracking-widest uppercase hidden sm:block">
            {new Date().toLocaleDateString("id-ID", { weekday:"short", day:"numeric", month:"short", year:"numeric" })}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {page === "dashboard" && <Dashboard    db={db} />}
          {page === "products"  && <Products     db={db} onAdd={openAdd} onEdit={openEdit} onDelete={setDeleteTarget} />}
          {page === "analytics" && <Analytics    db={db} />}
          {page === "ai"        && <AIConsultant db={db} />}
          {page === "alerts"    && <Alerts       db={db} onDismiss={dismissAlert} onDismissAll={dismissAllAlerts} />}
          {page === "export"    && <ExportPage   db={db} onRestore={restoreFromDrive} onNotify={notify} />}
        </div>
      </main>

      <Toast notification={notification} />

      {showForm && (
        <ProductModal editItem={editItem}
          onClose={() => { setShowForm(false); setEditItem(null); }}
          onSubmit={handleSubmitProduct} onNotify={notify} />
      )}

      {deleteTarget !== null && (
        <DeleteConfirm onConfirm={() => handleDeleteProduct(deleteTarget)} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
