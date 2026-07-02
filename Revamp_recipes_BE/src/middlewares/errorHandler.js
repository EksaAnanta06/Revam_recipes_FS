/**
 * src/middlewares/errorHandler.js
 *
 * Centralized Error Handler — middleware paling penting di seluruh aplikasi.
 *
 * ─── MENGAPA INI PENTING? ───────────────────────────────────────────────────
 *
 * Sebelum refactor, SETIAP controller punya error handling sendiri:
 *
 *   catch (err) {
 *     res.status(500).json({ message: "Server error" })     // ← di auth.js
 *     res.status(500).json({ success: false, ... })          // ← di recipes.js
 *     res.status(500).json({ pesan: "Gagal..." })            // ← inconsistent!
 *   }
 *
 * Masalah:
 * 1. Response shape tidak konsisten (message vs pesan, ada/tidak ada success)
 * 2. Error handling tersebar di 3 file controller = sulit di-maintain
 * 3. Tidak ada pembeda antara "client error" vs "server error"
 * 4. Debug info (stack trace) tidak terkontrol — muncul di production
 *
 * ─── SOLUSINYA ──────────────────────────────────────────────────────────────
 *
 * Dengan centralized error handler:
 * - Controller cukup: throw new NotFoundError("recipe tidak ditemukan")
 * - Middleware ini yang bertanggung jawab memformat dan mengirim response
 * - SATU response shape yang konsisten di seluruh aplikasi
 * - Stack trace hanya muncul di development, tidak di production
 *
 * ─── CARA KERJA ─────────────────────────────────────────────────────────────
 *
 * Express mengenali middleware dengan 4 parameter (err, req, res, next)
 * sebagai "error-handling middleware". Ia hanya dipanggil ketika:
 * 1. next(error) dipanggil dari middleware sebelumnya
 * 2. throw error terjadi di dalam async handler (Express 5 auto-catch)
 */

import AppError from "../errors/AppError.js";
import { HTTP } from "../constants/index.js";
import env from "../config/env.js";

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    // ── Jika error adalah AppError (operational) ────────────────────────────
    // Kirim status code dan message yang sudah didefinisikan saat throw
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    // ── Jika error adalah Error biasa (bug / unexpected) ────────────────────
    // Log detail untuk developer, kirim pesan umum ke client
    console.error("[Server Error]", {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
    });

    // Tampilkan detail error hanya di mode development
    const isDev = env.NODE_ENV === "development";

    return res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        ...(isDev && { error: err.message, stack: err.stack }),
    });
};

export default errorHandler;
