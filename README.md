# BelajarIndo — Local Development README

Ringkasan singkat
- Ini adalah aplikasi pembelajaran Bahasa Indonesia (frontend statis + backend Node/Express + Prisma + MySQL).
- Backend ada di `belajarindo-backend`; frontend statis di root dan `belajarindo-frontend`.

Prasyarat
- Node.js (v18+ recommended)
- MySQL server lokal (atau remote) dan kredensial akses
- PowerShell (Windows) atau bash (Linux/macOS)

1) Siapkan environment
- Duplikat file `.env.example` (jika ada) atau buat `.env` di `belajarindo-backend` dengan variabel paling penting:
  - DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/DATABASE
  - JWT_SECRET=some_secret_here
  - NODE_ENV=development

2) Install dependencies
cd ke folder backend lalu install:

```powershell
cd "belajarindo-backend"
npm install
```

3) Prisma: sinkronkan schema & generate client
- Jika Anda memiliki hak ALTER pada DB, jalankan:

```powershell
npx prisma migrate dev --name init
```

- Jika tidak (contoh: hak DB terbatas), fallback yang digunakan proyek ini adalah:

```powershell
npx prisma db push
```

Lalu generate Prisma Client (biasanya dibuat oleh install tetapi untuk memastikan):

```powershell
npx prisma generate
```

Catatan Windows EPERM
- Pada beberapa mesin Windows, `npx prisma generate` bisa gagal dengan error rename/EPERM pada native query engine file. Perbaikan langkah singkat yang sudah dilakukan selama pengembangan:
  1. Matikan semua proses node yang mungkin mengunci file: `taskkill /F /IM node.exe` (PowerShell: `Stop-Process -Name node -Force`).
  2. Hapus file temp di `node_modules/.prisma/client` yang berakhiran `.tmp` jika ada.
  3. Jalankan ulang `npx prisma generate`.

4) Seed demo user (opsional)
- Ada skrip cek `scripts/check-demo-user.js` dan `scripts/check-quiz-vocab.js`.
- Untuk membuat demo user (jika belum ada), Anda bisa menggunakan endpoint register atau menjalankan skrip seed (jika tersedia). Contoh menggunakan API register:

```powershell
# jalankan server lalu gunakan curl/Invoke-RestMethod untuk register
Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/register' -Method Post -Body (@{ name='Demo User'; email='demo@local'; password='123456' } | ConvertTo-Json) -ContentType 'application/json'
```

5) Menjalankan server backend

```powershell
cd "belajarindo-backend"
node src/index.js
# atau untuk dev mode jika package.json punya script
npm run dev
```

6) Frontend (statis)
- Buka `index.html`, `login.html`, atau `y.html` di browser. Untuk men-simulasikan origin yang sama seperti selama pengujian, jalankan static server (Python):

```powershell
# dari root proyek
python -m http.server 5500
# buka http://localhost:5500/login.html
```

7) Smoke tests singkat (sudah saya jalankan)
- Login demo: POST `/api/auth/login` (body: email demo@local, password 123456) → harus mengembalikan Set-Cookie `token` (HttpOnly).
- GET `/api/auth/me` → mengembalikan user JSON.
- POST `/api/quiz/submit` → buat quiz result.
- GET `/api/quiz/history` → menampilkan quiz result.
- POST `/api/flashcard/progress` dan GET `/api/flashcard/progress` → menyimpan & menampilkan vocab progress.

8) Troubleshooting umum
- Jika Anda melihat `PrismaClientValidationError` yang menyatakan field X missing, pastikan payload yang dikirim sesuai dengan `prisma/schema.prisma`.
- Jika token tidak dibaca oleh server, periksa konfigurasi cookie-parser dan CORS (server harus mengizinkan credentials dan frontend harus memanggil `fetch` dengan `credentials: 'include'`).

9) File utilitas yang dibuat selama debugging
- `belajarindo-backend/scripts/check-demo-user.js` — mengecek apakah demo user ada.
- `belajarindo-backend/scripts/check-quiz-vocab.js` — menampilkan quiz results & vocab progress untuk user demo (userId=1).

10) Kapan butuh migrate vs db push
- `migrate dev` membuat riwayat migrasi dan cocok untuk development jika Anda punya akses DDL di DB.
- `db push` memaksa schema ke DB tanpa membuat file migrasi; cocok jika DB user tidak punya hak ALTER.

Jika mau, saya bisa:
- Menambahkan contoh curl/PowerShell yang bisa Anda jalankan untuk reproduce tests.
- Membuat PR/commit message ringkas yang merangkum perbaikan yang saya lakukan.

---
Sampaikan mau saya tambahkan apa lagi di README (contoh: curl commands, template .env.example, atau instruksi deploy).

## Verification (step-by-step)

Below are quick, copy-pastable checks you can run to verify the backend, auth, cookie behavior, and network status. There are both curl (cross-platform) and PowerShell examples (Windows). Replace ports/hosts if you use different values.

Important: serve the frontend over HTTP (not file://) when testing cross-origin cookie behavior. Example used in these steps: frontend origin http://localhost:5500, backend http://localhost:3000.

1) Start servers

- Backend (from `belajarindo-backend`):

```powershell
cd "belajarindo-backend"
# dev or prod whichever you use
npm run dev
# or: node src/index.js
```

- Frontend (from project root) — simple static server used in examples:

```powershell
python -m http.server 5500
# open http://localhost:5500/login.html
```

2) Health check

- curl:

```bash
curl -i http://localhost:3000/api/health
```

- PowerShell:

```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/api/health' -Method Get | ConvertTo-Json -Depth 4
```

Expected: a JSON object with status/message (e.g. "BelajarIndo API is running").

3) Login and capture cookie

- curl (writes cookie jar):

```bash
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@local","password":"123456"}' \
  -c cookiejar.txt
```

Look for a `Set-Cookie` header containing `token=` and `HttpOnly` in the response headers.

- PowerShell (session-based, shows Set-Cookie):

```powershell
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$body = @{ email = 'demo@local'; password = '123456' } | ConvertTo-Json
$r = Invoke-WebRequest -Uri 'http://localhost:3000/api/auth/login' -Method Post -Body $body -Headers @{ 'Content-Type'='application/json'; 'Origin'='http://localhost:5500' } -WebSession $session -UseBasicParsing
Write-Output "LOGIN_STATUS: $($r.StatusCode)"
Write-Output "SET_COOKIE: $($r.Headers['Set-Cookie'])"
```

4) Verify /api/auth/me (server reads cookie)

- curl (reuse cookie jar):

```bash
curl -i http://localhost:3000/api/auth/me -b cookiejar.txt
```

- PowerShell (reuse session):

```powershell
$me = Invoke-WebRequest -Uri 'http://localhost:3000/api/auth/me' -Method Get -Headers @{ 'Origin'='http://localhost:5500' } -WebSession $session -UseBasicParsing
Write-Output "ME_STATUS: $($me.StatusCode)"
Write-Output $me.Content
```

Expected: a 200 response and JSON with the authenticated user (id, name, email).

5) Logout

- curl (POST logout, then check /me):

```bash
curl -i -X POST http://localhost:3000/api/auth/logout -b cookiejar.txt -c cookiejar.txt
curl -i http://localhost:3000/api/auth/me -b cookiejar.txt
```

- PowerShell:

```powershell
$l = Invoke-WebRequest -Uri 'http://localhost:3000/api/auth/logout' -Method Post -Headers @{ 'Origin'='http://localhost:5500' } -WebSession $session -UseBasicParsing
Write-Output "LOGOUT_STATUS: $($l.StatusCode)"
# shortly after logout, /me should be unauthorized
try { $me2 = Invoke-WebRequest -Uri 'http://localhost:3000/api/auth/me' -Method Get -Headers @{ 'Origin'='http://localhost:5500' } -WebSession $session -UseBasicParsing; Write-Output $me2.Content } catch { Write-Output "ME_AFTER_LOGOUT_FAILED: $_" }
```

Expected: after logout `/api/auth/me` returns 401 / error indicating not authenticated.

6) Inspect cookie flags

The `Set-Cookie` header returned at login should include `HttpOnly` (so JavaScript cannot read it) and `Path=/`. In production you should also see `Secure` when using HTTPS. Example (truncated header):

```
Set-Cookie: token=eyJ...; Max-Age=604800; Path=/; HttpOnly
```

7) Network & process checks (Windows PowerShell)

```powershell
# Check if Node is running and port is listening
tasklist /FI "IMAGENAME eq node.exe"
netstat -ano | findstr ":3000"

# If you need to kill stuck node processes (Windows):
# Stop-Process -Name node -Force
# or: taskkill /F /IM node.exe
```

8) DB & Prisma quick checks

- Verify demo user exists via script (from project root):

```powershell
cd "belajarindo-backend"
node scripts/check-demo-user.js
```

Expected: prints the demo user row (id, name, email).

- Prisma schema sync / client generation (if you change schema):

```powershell
npx prisma db push
npx prisma generate
```

If `npx prisma generate` fails on Windows with an EPERM error, follow the note in this README about stopping node and removing temporary engine files, then re-run.

9) Additional smoke tests (quiz & flashcard)

- Submit a sample quiz (uses cookiejar/session from login):

```bash
curl -i -X POST http://localhost:3000/api/quiz/submit \
  -H "Content-Type: application/json" \
  -d '{"quizType":"vocab","questions":[{"id":1,"selected":2}],"score":100}' \
  -b cookiejar.txt
```

- Check vocab progress:

```bash
curl -i http://localhost:3000/api/flashcard/progress -b cookiejar.txt
```

10) Troubleshooting tips
- If login does not return `Set-Cookie`, ensure:
  - server is running and CORS allows your frontend origin;
  - fetch requests from the browser include `credentials: 'include'`;
  - request includes an Origin header (browsers set this automatically when served over HTTP).
- If Prisma errors mention missing fields, confirm payload keys match `prisma/schema.prisma`.

If you'd like, I can also add a short PowerShell script file (e.g. `scripts/verify.ps1`) that runs these checks automatically and prints a compact report.