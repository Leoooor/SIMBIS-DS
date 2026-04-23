import { useState } from "react";
import { exportCSV, exportJSON, exportExcel } from "../exportUtils";
import { loadGoogleScript, saveToGoogleDrive, loadFromGoogleDrive } from "../drive";

export default function ExportPage({ db, onRestore, onNotify }) {
  const [driveStatus, setDriveStatus] = useState("idle"); // idle | loading | ok | error
  const [driveMsg, setDriveMsg]       = useState("");
  const [exportBusy, setExportBusy]   = useState("");

  // ── Drive ───────────────────────────────────────────────────
  const driveSave = async () => {
    setDriveStatus("loading"); setDriveMsg("");
    try {
      await loadGoogleScript();
      const result = await saveToGoogleDrive(db);
      setDriveStatus("ok");
      setDriveMsg(`✓ ${result.action === "created" ? "File dibuat" : "File diperbarui"} di Google Drive.`);
      onNotify("Data tersimpan ke Google Drive!", "success");
    } catch (e) {
      setDriveStatus("error");
      setDriveMsg(e.message);
    }
  };

  const driveLoad = async () => {
    setDriveStatus("loading"); setDriveMsg("");
    try {
      await loadGoogleScript();
      const { data, modifiedTime } = await loadFromGoogleDrive();
      onRestore(data);
      const t = new Date(modifiedTime).toLocaleString("id-ID");
      setDriveStatus("ok");
      setDriveMsg(`✓ Data dipulihkan. Terakhir disimpan: ${t}`);
      onNotify("Data dipulihkan dari Google Drive!", "success");
    } catch (e) {
      setDriveStatus("error");
      setDriveMsg(e.message);
    }
  };

  // ── Export ──────────────────────────────────────────────────
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

  const driveColor = driveStatus === "ok" ? "text-emerald-300" : driveStatus === "error" ? "text-red-300" : "text-slate-500";

  return (
    <div className="space-y-5 slide-in max-w-xl">

      {/* ── Google Drive ── */}
      <div className="bg-[#0d1221] border border-slate-800/60 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">☁</span>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif" }} className="text-sm font-semibold text-white">
            Google Drive Sync
          </div>
        </div>
        <p className="text-[11px] text-slate-500 mb-4">
          Simpan/pulihkan data ke Drive. Butuh{" "}
          <code className="bg-slate-900 px-1 rounded text-sky-400">VITE_GOOGLE_CLIENT_ID</code> di <code className="bg-slate-900 px-1 rounded">.env</code>.
        </p>

        <div className="flex gap-2 mb-3">
          <button onClick={driveSave} disabled={driveStatus === "loading"}
            className="flex-1 py-2.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-xs transition-all disabled:opacity-50">
            {driveStatus === "loading" ? "◌ Proses..." : "↑ Simpan ke Drive"}
          </button>
          <button onClick={driveLoad} disabled={driveStatus === "loading"}
            className="flex-1 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs transition-all disabled:opacity-50">
            ↓ Pulihkan dari Drive
          </button>
        </div>

        {driveMsg && (
          <p className={`text-[11px] ${driveColor}`}>{driveMsg}</p>
        )}
      </div>

      {/* ── Export File ── */}
      <div className="bg-[#0d1221] border border-slate-800/60 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">↓</span>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif" }} className="text-sm font-semibold text-white">
            Export File
          </div>
        </div>
        <p className="text-[11px] text-slate-500 mb-4">
          Unduh data dalam format pilihan Anda.
        </p>

        <div className="grid gap-3">
          {[
            { type: "excel", label: "Excel (.xlsx)", desc: "3 sheet: Produk, Penjualan, Notifikasi", icon: "▦", color: "emerald" },
            { type: "csv",   label: "CSV (.csv)",    desc: "Data produk, siap di-import ke Google Sheets", icon: "≡", color: "sky" },
            { type: "json",  label: "JSON Backup",   desc: "Backup lengkap semua data platform",           icon: "{ }", color: "amber" },
          ].map(({ type, label, desc, icon, color }) => (
            <button key={type} onClick={() => doExport(type)} disabled={exportBusy === type}
              className={`flex items-center gap-4 p-4 rounded-lg border text-left transition-all
                bg-${color}-900/10 border-${color}-800/30 hover:bg-${color}-900/20 disabled:opacity-50`}>
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

      {/* ── Summary ── */}
      <div className="bg-[#0d1221] border border-slate-800/60 rounded-xl p-4">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Ringkasan Data</div>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: "Produk",      val: db.products.length },
            { label: "Bulan Data",  val: db.salesHistory.length },
            { label: "Notifikasi",  val: db.alerts.length },
          ].map((s) => (
            <div key={s.label} className="bg-slate-900/50 rounded-lg p-3">
              <div style={{ fontFamily: "'Space Grotesk',sans-serif" }} className="text-xl font-bold text-sky-400">{s.val}</div>
              <div className="text-[10px] text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
