/**
 * src/middlewares/optionalAuth.js
 *
 * Middleware autentikasi opsional — untuk route yang bisa diakses
 * oleh user yang belum login maupun yang sudah login.
 *
 * Contoh penggunaan: GET /api/recipes
 * - User belum login → req.user = null, resep tetap tampil (tapi isLiked = false)
 * - User sudah login  → req.user = { id, username, ... }, isLiked bisa dicek
 *
 * Perubahan dari versi lama:
 * - process.env.JWT_SECRET diganti import dari env.js
 * - Hapus komentar noise yang tidak menambah informasi
 */

import jwt from "jsonwebtoken";
import env from "../config/env.js";

const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        req.user = null;
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        req.user = jwt.verify(token, env.JWT_SECRET);
    } catch {
        // Token ada tapi tidak valid — perlakukan sebagai belum login
        req.user = null;
    }

    next();
};

export default optionalAuth;
