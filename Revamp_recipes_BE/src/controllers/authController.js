/**
 * src/controllers/authController.js
 *
 * Tanggung jawab: menerima HTTP request, mendelegasikan ke service,
 * dan mengirimkan HTTP response.
 *
 * Aturan ketat controller:
 * ✅ Boleh: baca req.body / req.query / req.params / req.user
 * ✅ Boleh: panggil service
 * ✅ Boleh: kirim res.status().json()
 * ✅ Boleh: panggil next(err) untuk error
 * ❌ Tidak boleh: query database langsung
 * ❌ Tidak boleh: logika bisnis (bcrypt, jwt, crypto)
 * ❌ Tidak boleh: validasi input
 *
 * Bandingkan dengan controller lama (303 baris):
 * Controller baru ini hanya ~60 baris — jauh lebih mudah dibaca.
 */

import * as authService from "../services/authService.js";
import { HTTP } from "../constants/index.js";
import env from "../config/env.js";

const register = async (req, res, next) => {
    try {
        await authService.register(req.body);
        return res.status(HTTP.CREATED).json({
            success: true,
            message: "Akun berhasil dibuat!",
        });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const data = await authService.login(req.body);
        return res.status(HTTP.OK).json({
            success: true,
            message: "Login berhasil",
            data,
        });
    } catch (err) {
        next(err);
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        await authService.forgotPassword(req.body);
        return res.status(HTTP.OK).json({
            success: true,
            message: "Email reset password berhasil dikirim",
        });
    } catch (err) {
        next(err);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        // Token dikirim via query string, password via body
        await authService.resetPassword({
            token: req.query.token,
            newPassword: req.body.newPassword,
        });
        return res.status(HTTP.OK).json({
            success: true,
            message: "Password berhasil direset",
        });
    } catch (err) {
        next(err);
    }
};

// Google OAuth callback — setelah passport berhasil autentikasi
const googleCallback = (req, res) => {
    const token = authService.signGoogleToken(req.user);
    res.redirect(`${env.URL_FRONTEND}/oauth-success?token=${token}`);
};

export { register, login, forgotPassword, resetPassword, googleCallback };
