export const trendColor = (t) =>
  t >= 70 ? "#22c55e" : t >= 50 ? "#f59e0b" : "#ef4444";

export const statusBadge = (s) =>
  s === "Aktif"
    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
    : s === "Musiman"
    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
    : "bg-slate-500/20 text-slate-300 border-slate-500/30";

export const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export const NAV_ITEMS = [
  { id: "dashboard", icon: "⬡", label: "Dashboard" },
  { id: "products",  icon: "◈", label: "Produk" },
  { id: "analytics", icon: "◉", label: "Analitik" },
  { id: "ai",        icon: "◎", label: "AI Konsultan" },
  { id: "alerts",    icon: "◌", label: "Notifikasi" },
  { id: "export",    icon: "↓", label: "Export & Drive" },
];
