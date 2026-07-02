/**
 * src/middlewares/auth.js
 *
 * Middleware autentikasi — memproteksi route yang memerlukan login.
 *
 * Cara kerja:
 * 1. Baca header Authorization: Bearer <token>
 * 2. Verifikasi JWT dengan secret dari env.js
 * 3. Jika valid → simpan payload ke req.user, lanjut ke handler berikutnya
 * 4. Jika tidak valid → lempar UnauthorizedError (ditangkap errorHandler)
 *
 * Perubahan dari versi lama (authMiddleware.js):
 * - process.env.JWT_SECRET diganti import dari env.js
 * - res.status(401).json(...) inline diganti throw UnauthorizedError
 *   → response shape sekarang konsisten via errorHandler
 * - Pengecekan "Bearer " prefix ditambahkan agar konsisten dengan optionalAuth
 */

import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { UnauthorizedError } from "../errors/index.js";

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new UnauthorizedError("Format token salah atau belum login"));
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return next(new UnauthorizedError("Token tidak ditemukan"));
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        next(new UnauthorizedError("Token tidak valid atau sudah kadaluarsa"));
    }
};

export default auth;
