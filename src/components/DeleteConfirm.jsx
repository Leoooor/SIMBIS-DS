export default function DeleteConfirm({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0d1221] border border-red-900/50 rounded-2xl p-6 w-full max-w-sm slide-in text-center">
        <div className="text-3xl mb-3">⚠</div>
        <div
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          className="text-sm font-semibold text-white mb-2"
        >
          Hapus Produk?
        </div>
        <p className="text-xs text-slate-500 mb-5">Tindakan ini tidak dapat dibatalkan.</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg border border-slate-700 text-slate-400 text-xs hover:bg-slate-800 transition-all"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg bg-red-900/30 border border-red-800/40 text-red-400 text-xs hover:bg-red-900/50 transition-all"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
