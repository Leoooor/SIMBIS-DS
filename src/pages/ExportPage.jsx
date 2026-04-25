import { useState } from "react";
import { exportCSV, exportJSON, exportExcel } from "../exportUtils";

export default function ExportPage({ db, onNotify }) {
  const [exportBusy, setExportBusy] = useState("");

  const doExport = async (type) => {
    setExportBusy(type);
    try {
      if (type === "csv")   exportCSV(db.products);
      if (type === "json")  exportJSON(db);
      if (type === "excel") await exportExcel(db);
      onNotify(`File ${type.toUpperCase()} berhasil diunduh!`, "success");
    } catch (e) {
      onNotify(`Gagal ekspor: ${e.message}`, "error");
    }
    setExportBusy("");
  };

  return (
    <div className="space-y-5 slide-in max-w-xl">
      <div className="bg-[#0d1221] border border-slate-800/60 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">↓</span>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif" }} className="text-sm font-semibold text-white">Export File</div>
        </div>
        <p className="text-[11px] text-slate-500 mb-4">Unduh data UMKM Anda dalam format pilihan.</p>

        <div className="grid gap-3">
          {[
            { type:"excel", label:"Excel (.xlsx)", desc:"3 sheet: Produk, Penjualan, Info",      icon:"▦", color:"emerald" },
            { type:"csv",   label:"CSV (.csv)",    desc:"Data produk, siap di-import ke Sheets", icon:"≡", color:"sky" },
            { type:"json",  label:"JSON Backup",   desc:"Backup lengkap semua data",             icon:"{}", color:"amber" },
          ].map(({ type, label, desc, icon, color }) => (
            <button key={type} onClick={() => doExport(type)} disabled={exportBusy === type}
              className={`flex items-center gap-4 p-4 rounded-lg border text-left transition-all disabled:opacity-50
                bg-${color}-900/10 border-${color}-800/30 hover:bg-${color}-900/20`}>
              <span className={`text-xl text-${color}-400 w-8 text-center`}>{icon}</span>
              <div className="flex-1">
                <div className={`text-xs font-semibold text-${color}-300`}>{label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{desc}</div>
              </div>
              <span className={`text-[10px] text-${color}-400`}>
                {exportBusy === type ? "◌..." : "Unduh"}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#0d1221] border border-slate-800/60 rounded-xl p-4">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Ringkasan Data</div>
        <div className="grid grid-cols-2 gap-3 text-center">
          {[
            { label:"Produk",           val: db.products.length },
            { label:"Bulan Data",       val: db.salesHistory.length },
          ].map((s) => (
            <div key={s.label} className="bg-slate-900/50 rounded-lg p-3">
              <div style={{ fontFamily:"'Space Grotesk',sans-serif" }} className="text-xl font-bold text-sky-400">{s.val}</div>
              <div className="text-[10px] text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
