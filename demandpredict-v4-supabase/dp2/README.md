# ◈ DemandPredict

**Platform Analisis Market Demand untuk UMKM Indonesia**

Platform berbasis data untuk membantu UMKM memprediksi tren permintaan produk, mengoptimalkan stok, dan menyusun strategi pemasaran yang lebih tepat sasaran.

---

## 🚀 Fitur

- **Dashboard** — Statistik ringkas, chart penjualan vs permintaan, dan notifikasi terbaru
- **Manajemen Produk** — Tambah, edit, dan hapus produk dengan indeks tren
- **Analitik** — Visualisasi data penjualan, kategori produk, dan data BPS UMKM
- **AI Konsultan** — Analisis bisnis berbasis Claude AI (memerlukan API key)
- **Notifikasi** — Manajemen alert stok dan tren
- **Penyimpanan Lokal** — Semua data tersimpan di `localStorage` browser, tidak hilang saat refresh

---

## 🛠️ Setup & Instalasi

### 1. Clone repository

```bash
git clone https://github.com/USERNAME/demandpredict.git
cd demandpredict
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup API key (untuk fitur AI Konsultan)

```bash
cp .env.example .env
```

Buka file `.env` dan isi dengan API key Anthropic Anda:

```
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> Dapatkan API key di: https://console.anthropic.com/

### 4. Jalankan development server

```bash
npm run dev
```

Buka browser di `http://localhost:5173`

---

## 📦 Build untuk Production

```bash
npm run build
```

Output ada di folder `dist/`. Deploy ke Vercel, Netlify, atau GitHub Pages.

---

## 🌐 Deploy ke Vercel (Gratis)

1. Push project ke GitHub
2. Buka [vercel.com](https://vercel.com) dan import repository
3. Tambahkan environment variable `VITE_ANTHROPIC_API_KEY` di dashboard Vercel
4. Klik Deploy ✓

---

## 📁 Struktur Project

```
demandpredict/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx         # Navigasi sidebar
│   │   ├── Toast.jsx           # Notifikasi toast
│   │   ├── ProductModal.jsx    # Modal tambah/edit produk
│   │   └── DeleteConfirm.jsx   # Modal konfirmasi hapus
│   ├── pages/
│   │   ├── Dashboard.jsx       # Halaman utama
│   │   ├── Products.jsx        # Manajemen produk
│   │   ├── Analytics.jsx       # Visualisasi data
│   │   ├── AIConsultant.jsx    # AI berbasis Claude
│   │   └── Alerts.jsx          # Notifikasi
│   ├── api.js                  # Integrasi Anthropic API
│   ├── storage.js              # localStorage helpers
│   ├── utils.js                # Helper functions & konstanta
│   ├── App.jsx                 # Root component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles + Tailwind
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## 📊 Sumber Data

| Sumber | Digunakan Untuk |
|--------|----------------|
| Kaggle E-commerce Dataset | Data penjualan historis |
| Google Trends | Indeks tren pencarian produk |
| BPS (Badan Pusat Statistik) | Statistik UMKM Indonesia |

---

## 👥 Tim

- Luthfi Mauludi
- Ifan Tri
- Nur Zikri
- Afiq Syukri

**Simulasi Bisnis Digital — Data Science**

---

## 📄 Lisensi

MIT License
