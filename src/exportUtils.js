/**
 * Export helpers — CSV, JSON, XLSX (via SheetJS CDN)
 * SheetJS dimuat dinamis saat dibutuhkan.
 */

function loadSheetJS() {
  return new Promise((resolve, reject) => {
    if (window.XLSX) { resolve(window.XLSX); return; }
    const s  = document.createElement("script");
    s.src    = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    s.onload = () => resolve(window.XLSX);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href    = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Export CSV ─────────────────────────────────────────────────────
export function exportCSV(products) {
  const headers = ["ID","Nama","Kategori","Harga","Stok","Tren","Status"];
  const rows    = products.map((p) =>
    [p.id, p.name, p.category, p.price, p.stock, p.trend, p.status].join(",")
  );
  const csv  = [headers.join(","), ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, "demandpredict-produk.csv");
}

// ── Export JSON ────────────────────────────────────────────────────
export function exportJSON(db) {
  const json = JSON.stringify(db, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  downloadBlob(blob, "demandpredict-backup.json");
}

// ── Export Excel (.xlsx) ───────────────────────────────────────────
export async function exportExcel(db) {
  const XLSX = await loadSheetJS();

  const wb = XLSX.utils.book_new();

  // Sheet 1: Produk
  const produkData = [
    ["ID","Nama Produk","Kategori","Harga (Rp)","Stok","Indeks Tren","Status"],
    ...db.products.map((p) => [p.id, p.name, p.category, p.price, p.stock, p.trend, p.status]),
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(produkData);
  ws1["!cols"] = [6,24,16,14,8,14,12].map((w) => ({ wch: w }));
  XLSX.utils.book_append_sheet(wb, ws1, "Produk");

  // Sheet 2: Riwayat Penjualan
  const salesData = [
    ["Bulan","Penjualan","Stok","Prediksi Permintaan"],
    ...db.salesHistory.map((s) => [s.month, s.penjualan, s.stok, s.permintaan]),
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(salesData);
  ws2["!cols"] = [8,12,10,20].map((w) => ({ wch: w }));
  XLSX.utils.book_append_sheet(wb, ws2, "Riwayat Penjualan");

  // Sheet 3: Notifikasi
  const alertData = [
    ["ID","Tipe","Pesan","Waktu"],
    ...db.alerts.map((a) => [a.id, a.type, a.message, a.time]),
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(alertData);
  ws3["!cols"] = [6,10,50,14].map((w) => ({ wch: w }));
  XLSX.utils.book_append_sheet(wb, ws3, "Notifikasi");

  XLSX.writeFile(wb, "demandpredict-laporan.xlsx");
}
