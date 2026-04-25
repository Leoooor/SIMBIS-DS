import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { trendColor } from "../utils";
import { useAuth } from "../auth";

export default function Dashboard({ db }) {
  const { profile } = useAuth();
  const { products, salesHistory } = db;

  const totalProducts = products.length;
  const avgTrend      = products.length ? Math.round(products.reduce((a,p)=>a+p.trend,0)/products.length) : 0;
  const lowStock      = products.filter((p) => p.stock < 70).length;
  const hotProducts   = products.filter((p) => p.trend >= 70).length;

  const tooltipStyle = {
    background: "#0d1221", border: "1px solid #1e293b",
    borderRadius: 8, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace",
  };

  return (
    <div className="space-y-5 slide-in">
      {/* Welcome */}
      {profile && (
        <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-4">
          <div style={{ fontFamily: "'Space Grotesk',sans-serif" }} className="text-sm font-semibold text-white">
            Selamat datang, {profile.name} 👋
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">{profile.business_name}</div>
        </div>
      )}

      {/* Empty state */}
      {totalProducts === 0 && salesHistory.length === 0 && (
        <div className="bg-[#0d1221] border border-dashed border-slate-700 rounded-xl p-8 text-center">
          <div className="text-2xl mb-2">◈</div>
          <div className="text-sm text-slate-400 mb-1">Belum ada data.</div>
          <div className="text-xs text-slate-600">Tambahkan produk UMKM Anda di menu "Produk".</div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Produk", val: totalProducts,    icon: "◈", colorClass: "text-sky-400" },
          { label: "Produk Hot",   val: hotProducts,       icon: "▲", colorClass: "text-emerald-400" },
          { label: "Stok Rendah",  val: lowStock,          icon: "▽", colorClass: "text-red-400" },
          { label: "Avg Tren",     val: avgTrend+"/100",   icon: "◉", colorClass: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="card-hover bg-[#0d1221] border border-slate-800/60 rounded-xl p-4">
            <div className={`text-xl ${s.colorClass} mb-2`}>{s.icon}</div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif" }} className="text-2xl font-bold text-white">{s.val}</div>
            <div className="text-[10px] text-slate-500 tracking-widest uppercase mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts — only if data exists */}
      {salesHistory.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="bg-[#0d1221] border border-slate-800/60 rounded-xl p-4">
            <div className="text-xs text-slate-400 tracking-widest uppercase mb-4">Penjualan vs Permintaan</div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={salesHistory}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#38bdf8" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                <XAxis dataKey="month" tick={{ fill:"#64748b", fontSize:10 }}/>
                <YAxis tick={{ fill:"#64748b", fontSize:10 }}/>
                <Tooltip contentStyle={tooltipStyle}/>
                <Area type="monotone" dataKey="penjualan"  stroke="#38bdf8" fill="url(#g1)" name="Penjualan"  strokeWidth={2}/>
                <Area type="monotone" dataKey="permintaan" stroke="#22c55e" fill="url(#g2)" name="Permintaan" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {products.length > 0 && (
            <div className="bg-[#0d1221] border border-slate-800/60 rounded-xl p-4">
              <div className="text-xs text-slate-400 tracking-widest uppercase mb-4">Indeks Tren Produk</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={products.map((p)=>({ name: p.name.split(" ")[0], trend: p.trend }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                  <XAxis dataKey="name" tick={{ fill:"#64748b", fontSize:10 }}/>
                  <YAxis domain={[0,100]} tick={{ fill:"#64748b", fontSize:10 }}/>
                  <Tooltip contentStyle={tooltipStyle}/>
                  <Bar dataKey="trend" name="Indeks Tren" radius={[4,4,0,0]} fill="#38bdf8"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
