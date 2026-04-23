import { useState } from "react";
import { useAuth } from "../auth";

export default function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode]     = useState("login");
  const [form, setForm]     = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError]   = useState("");
  const [busy, setBusy]     = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = () => {
    setError("");
    if (!form.email || !form.password) { setError("Email & password wajib diisi."); return; }
    setBusy(true);
    if (mode === "register") {
      if (!form.name)                        { setError("Nama wajib diisi.");          setBusy(false); return; }
      if (form.password !== form.confirm)    { setError("Password tidak cocok.");      setBusy(false); return; }
      if (form.password.length < 6)          { setError("Password minimal 6 karakter."); setBusy(false); return; }
      const r = register(form.name, form.email, form.password);
      if (!r.ok) setError(r.error);
    } else {
      const r = login(form.email, form.password);
      if (!r.ok) setError(r.error);
    }
    setBusy(false);
  };

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(#38bdf8 1px,transparent 1px),linear-gradient(90deg,#38bdf8 1px,transparent 1px)",
        backgroundSize: "40px 40px"
      }}/>

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-400 text-2xl mb-4">◈</div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif" }} className="text-xl font-bold text-white">DemandPredict</div>
          <div className="text-[10px] text-slate-500 tracking-widest uppercase mt-1">Platform Analisis Market UMKM</div>
        </div>

        <div className="bg-[#0d1221] border border-slate-800/60 rounded-2xl p-6">
          <div className="flex bg-slate-900 rounded-lg p-1 mb-6">
            {["login","register"].map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 py-2 rounded-md text-xs transition-all ${mode===m ? "bg-sky-500/20 text-sky-300 border border-sky-500/30" : "text-slate-500 hover:text-slate-300"}`}>
                {m === "login" ? "Masuk" : "Daftar"}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {mode === "register" && (
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Nama Lengkap</label>
                <input value={form.name} onChange={set("name")} placeholder="Budi Santoso"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50"/>
              </div>
            )}
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Email</label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="budi@umkm.id"
                onKeyDown={(e) => e.key==="Enter" && submit()}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50"/>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Password</label>
              <input type="password" value={form.password} onChange={set("password")} placeholder="••••••••"
                onKeyDown={(e) => e.key==="Enter" && submit()}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50"/>
            </div>
            {mode === "register" && (
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Konfirmasi Password</label>
                <input type="password" value={form.confirm} onChange={set("confirm")} placeholder="••••••••"
                  onKeyDown={(e) => e.key==="Enter" && submit()}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50"/>
              </div>
            )}
            {error && (
              <div className="bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2 text-xs text-red-300">{error}</div>
            )}
            <button onClick={submit} disabled={busy}
              className="w-full mt-1 py-3 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 text-sky-300 text-xs transition-all disabled:opacity-50">
              {busy ? "◌ Loading..." : mode === "login" ? "Masuk →" : "Buat Akun →"}
            </button>
          </div>
        </div>
        <p className="text-center text-[10px] text-slate-600 mt-4">Akun tersimpan di browser lokal Anda.</p>
      </div>
    </div>
  );
}
