import { NAV_ITEMS } from "../utils";
import { useAuth } from "../auth";

export default function Sidebar({ page, onNavigate, alertCount }) {
  const { user, logout } = useAuth();

  return (
    <aside className="flex flex-col w-56 bg-[#0d1221] border-r border-slate-800/60 h-full">
      <div className="p-5 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 text-sm">◈</div>
          <div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif" }} className="text-sm font-bold text-white tracking-tight">DemandPredict</div>
            <div className="text-[9px] text-slate-500 tracking-widest uppercase">UMKM Analytics</div>
          </div>
        </div>
      </div>

      {user && (
        <div className="px-4 py-3 border-b border-slate-800/60">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest">Masuk sebagai</div>
          <div className="text-xs text-slate-300 font-medium mt-0.5 truncate">{user.name}</div>
          <div className="text-[10px] text-slate-600 truncate">{user.email}</div>
        </div>
      )}

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((n) => (
          <button key={n.id} onClick={() => onNavigate(n.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all ${
              page === n.id
                ? "bg-sky-500/15 text-sky-300 border border-sky-500/25"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}>
            <span className="text-base">{n.icon}</span>
            <span className="tracking-wide">{n.label}</span>
            {n.id === "alerts" && alertCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {alertCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800/60 space-y-2">
        <div className="flex items-center gap-1.5">
          <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"/>
          <span className="text-[10px] text-emerald-400">Data tersimpan lokal</span>
        </div>
        <button onClick={logout}
          className="w-full text-left text-[10px] text-slate-600 hover:text-red-400 transition-colors py-1">
          ← Keluar
        </button>
      </div>
    </aside>
  );
}
