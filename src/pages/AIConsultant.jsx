import { useState } from "react";
import { callClaude } from "../api";

const QUICK_QUESTIONS = [
  "Produk mana yang paling berisiko kekurangan stok?",
  "Bagaimana strategi promosi untuk produk musiman?",
  "Prediksi tren produk bulan depan?",
  "Apa rekomendasi harga untuk meningkatkan penjualan?",
];

export default function AIConsultant({ db }) {
  const [query, setQuery]     = useState("");
  const [result, setResult]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const ask = async (q) => {
    const question = q || query;
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setResult("");

    const ctx = JSON.stringify(
      db.products.map((p) => ({
        name:     p.name,
        category: p.category,
        trend:    p.trend,
        stock:    p.stock,
        price:    p.price,
        status:   p.status,
      }))
    );

    const prompt = `Kamu adalah analis bisnis UMKM Indonesia yang berpengalaman. 
Berikut data produk saat ini: ${ctx}

Data penjualan 6 bulan terakhir: ${JSON.stringify(db.salesHistory)}

Pertanyaan: ${question}

Berikan analisis singkat, tajam, dan praktis dalam Bahasa Indonesia. 
Sertakan angka/data spesifik bila memungkinkan. Maksimal 250 kata.`;

    try {
      const answer = await callClaude(prompt);
      setResult(answer);
    } catch (e) {
      setError(`Gagal: ${e.message}. Pastikan VITE_ANTHROPIC_API_KEY sudah diset di file .env`);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4 slide-in max-w-2xl">
      <div className="bg-[#0d1221] border border-slate-800/60 rounded-xl p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sky-400 text-lg">◎</span>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-sm font-semibold text-white">
            AI Konsultan Bisnis
          </div>
          <span className="ml-auto text-[10px] bg-sky-500/15 border border-sky-500/25 text-sky-400 px-2 py-0.5 rounded-full">
            Powered by Claude
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          Tanyakan analisis pasar, strategi stok, prediksi permintaan, atau rekomendasi bisnis
          berdasarkan data produk Anda.
        </p>

        {/* Quick questions */}
        <div className="space-y-2 mb-4">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => { setQuery(q); ask(q); }}
              className="block w-full text-left text-xs px-3 py-2 rounded-lg border border-slate-800 hover:border-sky-500/30 hover:bg-sky-500/5 text-slate-400 hover:text-sky-300 transition-all"
            >
              ↗ {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask()}
            placeholder="Tanyakan sesuatu tentang bisnis Anda..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/50"
          />
          <button
            onClick={() => ask()}
            disabled={loading}
            className="px-4 py-2.5 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 text-sky-300 rounded-lg text-xs transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? "◌ ..." : "Tanya →"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-900/20 border border-red-800/40 rounded-lg p-3 text-xs text-red-300 slide-in">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-4 bg-slate-900/60 border border-slate-800 rounded-lg p-4 slide-in">
            <div className="text-[10px] text-sky-400 uppercase tracking-widest mb-3">◎ Analisis AI</div>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </div>

      {/* Setup note */}
      <div className="bg-amber-900/10 border border-amber-800/30 rounded-xl p-4 text-xs text-amber-300/70">
        <span className="text-amber-400 font-semibold">Setup:</span> Untuk deploy ke GitHub Pages/Vercel,
        buat file <code className="bg-slate-900 px-1 rounded">.env</code> dan tambahkan{" "}
        <code className="bg-slate-900 px-1 rounded">VITE_ANTHROPIC_API_KEY=sk-ant-...</code>
      </div>
    </div>
  );
}
