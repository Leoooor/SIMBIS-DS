import { trendColor, statusBadge } from "../utils";

export default function Products({ db, onAdd, onEdit, onDelete }) {
  return (
    <div className="space-y-4 slide-in">
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500 tracking-widest uppercase">
          {db.products.length} produk terdaftar
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 px-4 py-2 rounded-lg text-xs transition-all"
        >
          + Tambah Produk
        </button>
      </div>

      {db.products.length === 0 && (
        <div className="text-center py-20 text-slate-600 text-sm">
          Belum ada produk. Klik "Tambah Produk" untuk memulai.
        </div>
      )}

      <div className="grid gap-3">
        {db.products.map((p) => (
          <div
            key={p.id}
            className="card-hover bg-[#0d1221] border border-slate-800/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  className="font-semibold text-white text-sm"
                >
                  {p.name}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusBadge(p.status)}`}>
                  {p.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                {p.category} · Rp {p.price.toLocaleString("id-ID")}
              </div>
            </div>

            <div className="flex items-center gap-5 text-xs">
              <div className="text-center">
                <div className="text-slate-500 text-[10px] uppercase tracking-wider">Stok</div>
                <div className={`font-bold ${p.stock < 70 ? "text-red-400" : "text-white"}`}>
                  {p.stock}
                </div>
              </div>
              <div className="text-center">
                <div className="text-slate-500 text-[10px] uppercase tracking-wider">Tren</div>
                <div className="font-bold" style={{ color: trendColor(p.trend) }}>
                  {p.trend}/100
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(p)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className="px-3 py-1.5 rounded-lg bg-red-900/30 hover:bg-red-900/50 text-red-400 text-[10px] transition-all border border-red-800/30"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
