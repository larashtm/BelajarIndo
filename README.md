# BelajarIndo — Local Development Guide

Aplikasi pembelajaran Bahasa Indonesia berbasis web
📦 **Stack:** Node.js + Express + Prisma + MySQL + HTML/CSS/JS

---

## Ringkasan

* **Backend:** `belajarindo-backend`
* **Frontend:** statis di root (`index.html`, `login.html`, dst)

---

## 🧩 Prasyarat

* Node.js ≥ v18
* MySQL server (local/remote)
* PowerShell (Windows) / Bash (Linux/macOS)

---

## ⚙️ Setup Cepat

### 1️⃣ Konfigurasi `.env`

Buat file `.env` di folder `belajarindo-backend`:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="some_secret_here"
NODE_ENV=development
```

### 2️⃣ Instalasi

```bash
cd belajarindo-backend
npm install
```

### 3️⃣ Prisma Sync

```bash
# Jika punya akses DDL
npx prisma migrate dev --name init

# Jika tidak
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

> 💡 **Windows Tip:**
> Jika error EPERM saat `prisma generate`:
>
> 1. Tutup semua proses Node (`taskkill /F /IM node.exe`)
> 2. Hapus file `.tmp` di `.prisma/client`
> 3. Jalankan ulang `npx prisma generate`

---

## ▶️ Jalankan Server

```bash
cd belajarindo-backend
npm run dev   # atau node src/index.js
```

Frontend dapat dijalankan via Python server:

```bash
python -m http.server 5500
# buka http://localhost:5500/login.html
```

---

## 🧪 Tes Cepat API

| Endpoint                  | Method   | Deskripsi                       |
| ------------------------- | -------- | ------------------------------- |
| `/api/auth/login`         | POST     | Login demo user                 |
| `/api/auth/me`            | GET      | Ambil info user aktif           |
| `/api/quiz/submit`        | POST     | Kirim hasil kuis                |
| `/api/quiz/history`       | GET      | Lihat riwayat kuis              |
| `/api/flashcard/progress` | GET/POST | Simpan & ambil progres kosakata |

Contoh login dengan curl:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@local","password":"123456"}'
```

---

## 🧰 Troubleshooting

* **PrismaClientValidationError:** pastikan payload sesuai schema.
* **Cookie tidak terbaca:** pastikan CORS dan `credentials: 'include'` di fetch frontend.
* **EPERM error:** lihat catatan Windows di atas.

---

## 📂 Skrip Utilitas

* `scripts/check-demo-user.js` — cek apakah demo user ada
* `scripts/check-quiz-vocab.js` — tampilkan hasil kuis & progress vocab

---

## 🧭 Catatan Pengembangan

* Gunakan `migrate dev` untuk pengembangan (dengan akses DDL)
* Gunakan `db push` untuk sinkronisasi cepat tanpa migrasi file

---

✨ **BelajarIndo** — belajar bahasa Indonesia kapan pun, di mana pun.

---

Apakah kamu mau aku buatkan **versi README yang ada emoji + badge GitHub (misalnya build status, tech stack, dsb)** biar tampil lebih menarik di halaman repo GitHub juga?
