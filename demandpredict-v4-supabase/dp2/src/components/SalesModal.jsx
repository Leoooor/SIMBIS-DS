import { useState, useEffect } from "react";

const MONTHS = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

export default function SalesModal({ editItem, onClose, onSubmit, onNotify }) {
  const [form, setForm] = useState({ month: "Jan", penjualan: "", stok: "", permintaan: "" });

  useEffect(() => {
    if (editItem) setForm({
      month: editItem.month, penjualan: editItem.penjualan,
      stok: editItem.stok, permintaan: editItem.permintaan,
    });
  }, [editItem]);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = () => {
    if (!form.penjualan || !form.stok) { onNotify("Lengkapi semua field!", "error"); return; }
    onSubmit({ month: form.month, penjualan: +form.penjualan, stok: +form.stok, permintaan: +form.permintaan || 0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0d1221] border border-slate-800 rounded-2xl p-6 w-full max-w-md slide-in">
        <div style={{ fontFamily: "'Space Grotesk',sans-serif" }} className="text-sm font-semibold text-white mb-5">
          {editItem ? "Edit Data Penjualan" : "Tambah Data Penjualan"}
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Bulan</label>
            <select value={form.month} onChange={set("month")}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none">
              {MONTHS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          {[
            { key: "penjualan",  label: "Jumlah Penjualan (unit)" },
            { key: "stok",       label: "Stok Tersedia (unit)" },
            { key: "permintaan", label: "Estimasi Permintaan (unit)" },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">{f.label}</label>
              <input type="number" value={form[f.key]} onChange={set(f.key)} placeholder="0"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50"/>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-400 text-xs hover:bg-slate-800 transition-all">Batal</button>
          <button onClick={submit}  className="flex-1 py-2.5 rounded-lg bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs hover:bg-sky-500/30 transition-all">
            {editItem ? "Simpan" : "Tambah"}
          </button>
        </div>
      </div>
    </div>
  );
}
