/**
 * src/routes/auth.js
 *
 * Tanggung jawab: mendefinisikan URL mapping untuk domain autentikasi.
 *
 * Route file hanya boleh berisi:
 * - Definisi path dan HTTP method
 * - Pemasangan middleware
 * - Delegasi ke controller
 *
 * Perubahan dari routes/auth_routes.js lama:
 * - Logic JWT sign di Google callback dipindah ke authController.googleCallback
 *   (tidak boleh ada business logic di routes)
 * - process.env.JWT_SECRET dan magic string URL dihapus
 * - Komentar "done" dihapus — tidak menambah informasi
 */

import express from "express";
import passport from "passport";
import {
    register,
    login,
    forgotPassword,
    resetPassword,
    googleCallback,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ─── Google OAuth ─────────────────────────────────────────────────────────────
// Step 1: Redirect user ke halaman login Google
router.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Google redirect kembali ke sini setelah user login
// passport.authenticate memverifikasi code dari Google, lalu memanggil handler
router.get("/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    googleCallback
);

export default router;
