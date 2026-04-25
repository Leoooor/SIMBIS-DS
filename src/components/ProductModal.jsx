import { useState, useEffect } from "react";

const FIELDS = [
  { key: "name",     label: "Nama Produk",          placeholder: "Pakaian Olahraga",  type: "text" },
  { key: "category", label: "Kategori",              placeholder: "Fashion",           type: "text" },
  { key: "price",    label: "Harga (Rp)",            placeholder: "150000",            type: "number" },
  { key: "stock",    label: "Stok",                  placeholder: "100",               type: "number" },
  { key: "trend",    label: "Indeks Tren (0–100)",   placeholder: "70",                type: "number" },
];

export default function ProductModal({ editItem, onClose, onSubmit, onNotify }) {
  const [form, setForm] = useState({
    name: "", category: "", price: "", stock: "", trend: "", status: "Aktif",
  });

  useEffect(() => {
    if (editItem) {
      setForm({
        name:     editItem.name,
        category: editItem.category,
        price:    editItem.price,
        stock:    editItem.stock,
        trend:    editItem.trend,
        status:   editItem.status,
      });
    }
  }, [editItem]);

  const handleSubmit = () => {
    if (!form.name || !form.category || !form.price || !form.stock) {
      onNotify("Lengkapi semua field yang wajib!", "error");
      return;
    }
    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      trend: Number(form.trend) || 50,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0d1221] border border-slate-800 rounded-2xl p-6 w-full max-w-md slide-in">
        <div
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          className="text-sm font-semibold text-white mb-5"
        >
          {editItem ? "Edit Produk" : "Tambah Produk Baru"}
        </div>

        <div className="space-y-3">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">
                {f.label}
              </label>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50"
              />
            </div>
          ))}

          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none"
            >
              <option>Aktif</option>
              <option>Musiman</option>
              <option>Nonaktif</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-400 text-xs hover:bg-slate-800 transition-all"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-lg bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs hover:bg-sky-500/30 transition-all"
          >
            {editItem ? "Simpan Perubahan" : "Tambah Produk"}
          </button>
        </div>
      </div>
    </div>
  );
}
