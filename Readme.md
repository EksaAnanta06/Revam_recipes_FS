🚀 Recipes Revamp - Fullstack Recipe Platform
Recipes Revamp adalah platform manajemen resep makanan modern yang memungkinkan pengguna untuk mencari, menyimpan, dan mengelola resep favorit mereka. Proyek ini dibangun dengan fokus pada performa tinggi, keamanan autentikasi, dan pengalaman pengguna yang responsif.

🛠️ Tech Stack
Aplikasi ini menggunakan pendekatan Fullstack JavaScript dengan teknologi terbaru:

Frontend:
- Core: React 19 (Functional Components & Hooks)
- Build Tool: Vite (Fast Refresh & Optimized Bundling)
- Routing: React Router v7
- Styling: Tailwind CSS v4 & Material UI (MUI) v7
- Form Management: React Hook Form with Zod (Schema Validation)
- State & Data Fetching: Fetch & JWT Decode

Backend:
- Runtime: - Node.js
- Framework: - Express.js 5 (Latest stable features)
- Database: - MySQL with mysql2 driver
Authentication:
- JSON Web Token (JWT) untuk akses token.
- Passport.js (Google OAuth 2.0) untuk login sosial.
- Bcryptjs untuk enkripsi password.
- File Handling: Multer (untuk upload gambar resep).
- Utility: Nodemailer (Email service), CORS, Dotenv.

✨ Fitur Utama:
- Authentication System: Login tradisional (Email/Password) dan Login menggunakan Google Account.
- CRUD Recipes: Pengguna dapat membuat, melihat, mengupdate, dan menghapus resep mereka sendiri.
- Image Upload: Dukungan upload foto masakan secara lokal menggunakan Multer.
- Validation: Validasi data yang ketat baik di sisi client (Zod) maupun server.
- Responsive Design: Tampilan yang optimal di berbagai perangkat berkat kombinasi Tailwind dan MUI.
- Reset Password: Fitur pemulihan kata sandi melalui integrasi Nodemailer.

🚀 Instalasi & Persiapan:
- Clone Repository:
1. git clone https://github.com/EksaAnanta06/Revam_recipes_FS.git
2. cd Revamp_Recipes_FE (untuk menjalankan front end, tapi sebelumnya harus setup dulu frontendnya dibagian bawah)
3. buat terminal baru untuk menjalankan backend dan masuk ke directory awal lalu...
4. cd Revamp_recipes_BE (untuk menjalankan Backend, tapi sebelumnya harus setup dulu backendnya dibagian bawah)

- Setup Backend:
1. Masuk ke folder backend: cd Revamp_recipes_BE
2. Install dependensi: npm install
3. Buat file .env dan lengkapi konfigurasi (DB_HOST, DB_USER, JWT_SECRET, GOOGLE_CLIENT_ID, dll).
4. Jangan lupa database MYSQL sudah menyala di computer kalian
5. Jalankan server: npm run dev

- Setup Frontend
1. Masuk ke folder frontend: cd Revamp_Recipes_FE
2. Install dependensi: npm install
3. Jalankan aplikasi: npm run dev

🚀 Development Status: 🚧 50% Completed
Proyek ini sedang dalam tahap pengembangan aktif. Saat ini, fungsionalitas inti untuk autentikasi dan manajemen data dasar sudah berjalan, namun masih ada beberapa fitur besar yang sedang dikerjakan dan gak tahu beresnya kapan.


Link Website:
https://revam-recipes-fs-98gi.vercel.app
