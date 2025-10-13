
# BelajarIndo — Indonesian Virtual Lab  

> 🌸 *Learn Bahasa Indonesia interactively — with flashcards, quizzes, and motivation boosts!*  

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)  
[![Express.js](https://img.shields.io/badge/Backend-Express.js-black?logo=express)](https://expressjs.com/)  
[![Prisma](https://img.shields.io/badge/ORM-Prisma-blue?logo=prisma)](https://www.prisma.io/)  
[![MySQL](https://img.shields.io/badge/Database-MySQL-orange?logo=mysql)](https://www.mysql.com/)  
[![Bootstrap](https://img.shields.io/badge/UI-Bootstrap_5-purple?logo=bootstrap)](https://getbootstrap.com/)  
[![Animate.css](https://img.shields.io/badge/Animation-Animate.css-pink)](https://animate.style/)  

---

## 🧠 Tentang  
**BelajarIndo** adalah *virtual lab* pembelajaran Bahasa Indonesia berbasis web, dikembangkan menggunakan **Node.js + Express + Prisma + MySQL** di sisi backend, serta **HTML, CSS, Bootstrap, dan JavaScript** di sisi frontend.  

✨ **Fitur utama:**  
- 🎴 **Vocabulary Flashcards** dengan audio pelafalan (Text-to-Speech)  
- 🧩 **Interactive Quiz** dengan penyimpanan hasil ke backend  
- 💬 **Motivational quotes** dinamis  
- 👤 **User authentication** (login/register, profile)  
- 📱 **Responsif** — dapat dibuka di laptop, tablet, maupun smartphone  

🔗 Demo (frontend): [https://larashtm.github.io/BelajarIndo/](https://larashtm.github.io/BelajarIndo/)  
🔗 Backend (API): [https://belajar-indo.vercel.app](https://belajar-indo.vercel.app)

---

## 📂 Struktur Proyek  

```

BelajarIndo/
├── index.html                 # Halaman utama (hero, features, motivation)
├── login.html, profile.html   # Halaman auth dan profil
├── assets/                    # Gambar, icon, CSS
│   ├── images/
│   ├── icon/
│   └── dist/css/style.css
├── belajarindo-backend/       # Folder backend (Express + Prisma)
│   ├── src/
│   ├── prisma/
│   └── scripts/
└── README.md

````

---

## 🧩 Prasyarat  

- [Node.js](https://nodejs.org/) v18 atau lebih baru  
- [MySQL](https://dev.mysql.com/downloads/) (local atau remote)  
- PowerShell / Bash  

---

## ⚙️ Setup Backend  

```bash
cd belajarindo-backend
cp .env.example .env   # jika belum ada, buat manual
npm install
````

**Isi file `.env`:**

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your_secret_here"
NODE_ENV=development
```

Sinkronisasi Prisma:

```bash
# jika punya akses DDL
npx prisma migrate dev --name init
# jika akses terbatas
npx prisma db push
npx prisma generate
```

> 💡 **Tips Windows:** jika `npx prisma generate` error `EPERM`, hentikan semua proses Node dan hapus `.tmp` di `.prisma/client`.

---

## ▶️ Menjalankan Server

**Backend:**

```bash
cd belajarindo-backend
npm run dev
```

**Frontend (dari root proyek):**

```bash
python -m http.server 5500
# buka http://localhost:5500
```

---

## 🧪 Fitur Utama Frontend

### 🎴 Vocabulary (Flashcard Mode)

* Klik **“Try Now”** → tampilkan flashcard dengan audio pelafalan.
* Kategori: 🍽️ Food & Drinks, 👨‍👩‍👧‍👦 Family, 🏠 Daily Activities.
* Navigasi: Next / Previous / Exit.
* Teks dan audio bilingual: Bahasa Indonesia & Inggris.

### 🧩 Quiz Interaktif

* Klik **“Try Now”** di fitur Quiz untuk mulai tantangan.
* Skor otomatis disimpan ke backend (`/api/quiz/submit`).
* Riwayat bisa dilihat di **“View History”**.

### 💬 Motivational Quotes

Tombol “New Motivation” menampilkan kutipan acak:

> “Learning a language is like opening a door to a new world.”

### 👤 Profile & Authentication

* Autentikasi berbasis **JWT** dan disimpan di `localStorage`.
* Jika belum login, user otomatis diarahkan ke `login.html`.
* Setelah login, tombol “Profile” muncul di navbar.

---

## 🧰 Troubleshooting

| Masalah                         | Solusi                                                           |
| ------------------------------- | ---------------------------------------------------------------- |
| ❌ `PrismaClientValidationError` | Periksa field dan schema Prisma                                  |
| 🍪 Cookie tidak terbaca         | Pastikan `credentials: 'include'` di fetch frontend              |
| 🪟 EPERM di Windows             | Stop proses node, hapus `.tmp`, jalankan ulang `prisma generate` |

---

## ✨ Credits

Dibuat dengan ❤️ oleh **[Laras Hati Mahendra](https://github.com/larashtm)**

> “Belajar bahasa bukan sekadar kata — tapi memahami dunia di baliknya.”

---

⭐ **Bantu proyek ini tumbuh** dengan memberi star di repo GitHub!
