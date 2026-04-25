export default function Alerts({ db, onDismiss, onDismissAll }) {
  return (
    <div className="space-y-3 slide-in max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-slate-500 tracking-widest uppercase">
          {db.alerts.length} notifikasi aktif
        </div>
        {db.alerts.length > 0 && (
          <button
            onClick={onDismissAll}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Hapus Semua
          </button>
        )}
      </div>

      {db.alerts.length === 0 && (
        <div className="text-center py-20 text-slate-600 text-sm">
          Tidak ada notifikasi saat ini.
        </div>
      )}

      {db.alerts.map((a) => (
        <div
          key={a.id}
          className={`slide-in flex items-start gap-3 p-4 rounded-xl border text-xs
            ${a.type === "warning" ? "bg-amber-900/15 border-amber-800/40 text-amber-200"
            : a.type === "success" ? "bg-emerald-900/15 border-emerald-800/40 text-emerald-200"
            : "bg-sky-900/15 border-sky-800/40 text-sky-200"}`}
        >
          <span className="text-base mt-0.5">
            {a.type === "warning" ? "⚠" : a.type === "success" ? "✓" : "ℹ"}
          </span>
          <div className="flex-1">
            <p>{a.message}</p>
            <p className="text-[10px] opacity-50 mt-1">{a.time}</p>
          </div>
          <button
            onClick={() => onDismiss(a.id)}
            className="opacity-40 hover:opacity-80 transition-opacity text-base leading-none"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
