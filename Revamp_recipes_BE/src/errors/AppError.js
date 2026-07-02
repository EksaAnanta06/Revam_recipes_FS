/**
 * src/errors/AppError.js
 *
 * Base class untuk semua custom error di aplikasi ini.
 *
 * Mengapa perlu custom error class?
 *
 * Sebelum refactor, setiap controller melakukan ini sendiri:
 *   return res.status(400).json({ success: false, message: "..." })
 *   return res.status(401).json({ success: false, message: "..." })
 *   return res.status(500).json({ success: false, message: "..." })
 *
 * Masalahnya:
 * 1. Response shape tidak konsisten (kadang ada 'pesan', kadang 'message')
 * 2. Error handling tersebar di semua controller — tidak ada satu tempat
 * 3. Tidak bisa dibedakan mana "client error" vs "server error" dari kode
 *
 * Dengan AppError:
 * - Controller cukup `throw new NotFoundError("recipe tidak ditemukan")`
 * - Satu error handler middleware menangani semuanya
 * - Response shape selalu konsisten: { success, message, statusCode }
 *
 * Pola ini disebut "Centralized Error Handling" — standar di Express production apps.
 */

class AppError extends Error {
    /**
     * @param {string} message  - Pesan error yang akan dikirim ke client
     * @param {number} statusCode - HTTP status code (400, 401, 403, 404, 409, 500)
     * @param {boolean} isOperational - true = error yang "diharapkan" (user salah input, dll)
     *                                  false = bug / error tidak terduga (db crash, dll)
     */
    constructor(message, statusCode, isOperational = true) {
        super(message);

        this.statusCode = statusCode;
        this.isOperational = isOperational;

        // Memastikan stack trace menunjuk ke titik error yang sebenarnya,
        // bukan ke konstruktor AppError ini
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
