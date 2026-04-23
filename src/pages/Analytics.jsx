import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { trendColor } from "../utils";

const BPS_STATS = [
  { label: "Jumlah UMKM",         val: "64,2 Juta" },
  { label: "Kontribusi PDB",      val: "61,07%" },
  { label: "Serap Tenaga Kerja",  val: "97%" },
  { label: "Kontribusi Ekspor",   val: "15%" },
];

export default function Analytics({ db }) {
  const tooltipStyle = {
    background: "#0d1221", border: "1px solid #1e293b",
    borderRadius: 8, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace",
  };

  const categoryCount = db.products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-5 slide-in">
      {/* Multi-line chart */}
      <div className="bg-[#0d1221] border border-slate-800/60 rounded-xl p-5">
        <div className="text-xs text-slate-400 tracking-widest uppercase mb-4">
          Perbandingan Penjualan, Stok &amp; Permintaan
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={db.salesHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
            <Line type="monotone" dataKey="penjualan"  stroke="#38bdf8" strokeWidth={2} dot={{ fill: "#38bdf8", r: 3 }} name="Penjualan" />
            <Line type="monotone" dataKey="stok"       stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b", r: 3 }} name="Stok" />
            <Line type="monotone" dataKey="permintaan" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e", r: 3 }} name="Prediksi Permintaan" strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Breakdown panels */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-[#0d1221] border border-slate-800/60 rounded-xl p-5">
          <div className="text-xs text-slate-400 tracking-widest uppercase mb-4">Produk per Kategori</div>
          {Object.entries(categoryCount).map(([cat, count]) => (
            <div key={cat} className="flex items-center gap-3 mb-3">
              <span className="text-[11px] text-slate-400 w-24 truncate">{cat}</span>
              <div className="flex-1 bg-slate-800 rounded-full h-1.5">
                <div
                  className="bg-sky-400 h-1.5 rounded-full transition-all"
                  style={{ width: `${(count / db.products.length) * 100}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400 w-4 text-right">{count}</span>
            </div>
          ))}
          {db.products.length === 0 && (
            <p className="text-xs text-slate-600">Belum ada data produk.</p>
          )}
        </div>

        <div className="bg-[#0d1221] border border-slate-800/60 rounded-xl p-5">
          <div className="text-xs text-slate-400 tracking-widest uppercase mb-4">Status Tren Produk</div>
          {db.products.map((p) => (
            <div key={p.id} className="flex items-center gap-3 mb-3">
              <span className="text-[11px] text-slate-300 flex-1 truncate">{p.name}</span>
              <div className="w-24 bg-slate-800 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: `${p.trend}%`, background: trendColor(p.trend) }}
                />
              </div>
              <span className="text-[11px] w-10 text-right" style={{ color: trendColor(p.trend) }}>
                {p.trend}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* BPS stats */}
      <div className="bg-[#0d1221] border border-slate-800/60 rounded-xl p-5">
        <div className="text-xs text-slate-400 tracking-widest uppercase mb-4">
          Data Pasar UMKM Indonesia (BPS 2021)
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {BPS_STATS.map((d) => (
            <div key={d.label} className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-center">
              <div
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                className="text-xl font-bold text-sky-400"
              >
                {d.val}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 tracking-wide">{d.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
