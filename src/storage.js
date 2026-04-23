export const STORAGE_KEY = "demandpredict_data";

export const defaultData = {
  products: [
    { id: 1, name: "Pakaian Olahraga", category: "Fashion", price: 150000, stock: 120, trend: 78, status: "Aktif" },
    { id: 2, name: "Skincare Set",     category: "Kecantikan", price: 250000, stock: 85,  trend: 88, status: "Aktif" },
    { id: 3, name: "Es Teler Kemasan", category: "Makanan",   price: 15000,  stock: 200, trend: 45, status: "Musiman" },
    { id: 4, name: "Es Krim Artisan",  category: "Makanan",   price: 35000,  stock: 60,  trend: 52, status: "Musiman" },
  ],
  salesHistory: [
    { month: "Jan", penjualan: 4200, stok: 380, permintaan: 4500 },
    { month: "Feb", penjualan: 3800, stok: 410, permintaan: 4000 },
    { month: "Mar", penjualan: 5100, stok: 350, permintaan: 5300 },
    { month: "Apr", penjualan: 4700, stok: 320, permintaan: 4900 },
    { month: "Mei", penjualan: 5600, stok: 290, permintaan: 5800 },
    { month: "Jun", penjualan: 6200, stok: 260, permintaan: 6400 },
  ],
  alerts: [
    { id: 1, type: "warning", message: "Stok Es Krim Artisan mendekati batas minimum (60 unit)", time: "2 jam lalu" },
    { id: 2, type: "success", message: "Permintaan Skincare Set diprediksi naik 18% bulan depan", time: "5 jam lalu" },
    { id: 3, type: "info",    message: "Tren 'Pakaian Olahraga' di Google Trends: 78/100 (Naik Kuat)", time: "1 hari lalu" },
  ],
  nextId: 5,
};

export function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultData;
  } catch {
    return defaultData;
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save data:", e);
  }
}
