Oke! 🎉 Berikut versi **README yang lebih singkat + estetis + punya emoji dan badge GitHub-style** — cocok banget buat dipasang langsung di repo kamu biar terlihat profesional dan enak dibaca 👇

---

````markdown
# 🇮🇩 BelajarIndo — Aplikasi Pembelajaran Bahasa Indonesia  

> 🌸 *Belajar kapan pun dan di mana pun — dengan flashcard, kuis, dan audio pronunciation!*  

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-black?logo=express)
![Prisma](https://img.shields.io/badge/Prisma-ORM-blue?logo=prisma)
![MySQL](https://img.shields.io/badge/MySQL-DB-orange?logo=mysql)
![Frontend](https://img.shields.io/badge/Frontend-HTML%2FCSS%2FJS-yellow?logo=html5)

---

## 🧠 Ringkasan  
**BelajarIndo** adalah aplikasi pembelajaran Bahasa Indonesia berbasis web:  
- 🌐 **Frontend:** HTML, CSS, JS (statis di root)  
- ⚙️ **Backend:** Node.js + Express + Prisma + MySQL  
- 🎯 Target: mahasiswa, pelajar, dan komunitas internasional  

---

## 🧩 Prasyarat  
Pastikan sudah terpasang:
- [Node.js](https://nodejs.org/) ≥ v18  
- [MySQL](https://dev.mysql.com/downloads/) server  
- PowerShell (Windows) atau Bash (Linux/macOS)

---

## ⚙️ Setup Cepat  

### 1️⃣ Buat file `.env` di `belajarindo-backend`
```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="some_secret_here"
NODE_ENV=development
````

### 2️⃣ Install dependency

```bash
cd belajarindo-backend
npm install
```

### 3️⃣ Sinkronisasi Prisma

```bash
# Pilih sesuai akses DB
npx prisma migrate dev --name init     # untuk dev penuh
npx prisma db push                     # untuk akses terbatas

# Generate Prisma Client
npx prisma generate
```

> 💡 **Catatan Windows:**
> Jika `EPERM` error, hentikan proses Node (`taskkill /F /IM node.exe`), hapus file `.tmp` di `.prisma/client`, lalu jalankan ulang `npx prisma generate`.

---

## ▶️ Jalankan Server

### Backend

```bash
cd belajarindo-backend
npm run dev   # atau node src/index.js
```

### Frontend

```bash
python -m http.server 5500
# buka http://localhost:5500/login.html
```

---

## 🧪 Tes Cepat API

| Endpoint                  | Method   | Keterangan         |
| ------------------------- | -------- | ------------------ |
| `/api/auth/login`         | POST     | Login demo user    |
| `/api/auth/me`            | GET      | Ambil info user    |
| `/api/quiz/submit`        | POST     | Kirim hasil kuis   |
| `/api/quiz/history`       | GET      | Lihat riwayat kuis |
| `/api/flashcard/progress` | GET/POST | Progres kosakata   |

**Contoh login (curl):**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@local","password":"123456"}'
```

---

## 🧰 Troubleshooting

| Masalah                         | Solusi Cepat                                  |
| ------------------------------- | --------------------------------------------- |
| ❌ `PrismaClientValidationError` | Cek payload vs schema                         |
| 🍪 Token/cookie tidak terbaca   | Pastikan `credentials: 'include'` di frontend |
| 🪟 EPERM error di Windows       | Lihat catatan di atas                         |

---

## 📂 Skrip Utilitas

📜 `scripts/check-demo-user.js` — cek demo user
📜 `scripts/check-quiz-vocab.js` — tampilkan quiz & vocab progress

---

## 🧭 Catatan Pengembangan

* 🧱 Gunakan `migrate dev` untuk development penuh
* ⚡ Gunakan `db push` untuk update cepat ke DB tanpa migrasi file

---

## 💬 Tentang Proyek

BelajarIndo membantu pembelajar bahasa Indonesia dengan pengalaman interaktif —
flashcard kosakata 🎴, kuis cepat 🧩, dan audio pronunciation 🔊.

---

👩‍💻 **Dibuat oleh [Laras Hati Mahendra](https://github.com/larashtm)**
⭐ *Jika proyek ini membantu, jangan lupa beri star di repo!* 🌟

---

```

---

Apakah kamu mau aku tambahkan juga **section "Deployment (Docker Compose)"** + badge “Build passing / Deployed on Render / Railway” biar README-nya kelihatan seperti proyek production-ready?
```
