/**
 * src/errors/index.js
 *
 * Factory shortcuts untuk jenis error yang paling sering digunakan.
 *
 * Daripada selalu menulis:
 *   throw new AppError("tidak ditemukan", 404)
 *
 * Cukup:
 *   throw new NotFoundError("recipe tidak ditemukan")
 *
 * Setiap class di sini adalah "named error" yang langsung menyertakan
 * status code yang tepat — tidak perlu mengingat angkanya.
 */

import AppError from "./AppError.js";
import HTTP from "../constants/http.js";

// ─── 400 Bad Request ─────────────────────────────────────────────────────────
// Untuk: input tidak valid, field kosong, format salah
export class BadRequestError extends AppError {
    constructor(message = "Request tidak valid") {
        super(message, HTTP.BAD_REQUEST);
    }
}

// ─── 401 Unauthorized ────────────────────────────────────────────────────────
// Untuk: belum login, token tidak valid / expired
export class UnauthorizedError extends AppError {
    constructor(message = "Akses ditolak, silakan login") {
        super(message, HTTP.UNAUTHORIZED);
    }
}

// ─── 403 Forbidden ───────────────────────────────────────────────────────────
// Untuk: sudah login tapi tidak punya hak akses ke resource ini
export class ForbiddenError extends AppError {
    constructor(message = "Anda tidak memiliki hak akses") {
        super(message, HTTP.FORBIDDEN);
    }
}

// ─── 404 Not Found ───────────────────────────────────────────────────────────
// Untuk: resource tidak ditemukan di database
export class NotFoundError extends AppError {
    constructor(message = "Data tidak ditemukan") {
        super(message, HTTP.NOT_FOUND);
    }
}

// ─── 409 Conflict ────────────────────────────────────────────────────────────
// Untuk: data duplikat (username sudah dipakai, email sudah terdaftar)
export class ConflictError extends AppError {
    constructor(message = "Data sudah ada") {
        super(message, HTTP.CONFLICT);
    }
}

// Re-export base class agar bisa diimport dari satu tempat
export { default as AppError } from "./AppError.js";
