/**
 * src/config/env.js
 *
 * Satu-satunya tempat environment variable dibaca dan divalidasi.
 * Semua module lain harus import dari sini — bukan dari process.env langsung.
 *
 * Manfaat:
 * - Jika ada env yang hilang, error muncul saat startup (bukan runtime)
 * - Mudah di-mock saat testing
 * - Tidak ada "magic string" process.env tersebar di seluruh codebase
 */

// Variabel yang wajib ADA di .env (tapi boleh bernilai string kosong — misal password DB dev)
const REQUIRED_VARS = [
    "PORT",
    "DB_HOST",
    "DB_USER",
    "DB_NAME",
    "JWT_SECRET",
    "EMAIL_USER",
    "EMAIL_PASS",
    "URL_FRONTEND",
];

// Cek keberadaan key, bukan nilainya (undefined = belum diset sama sekali)
const missing = REQUIRED_VARS.filter((key) => process.env[key] === undefined);

if (missing.length > 0) {
    throw new Error(
        `[Config] Environment variable berikut wajib diisi: ${missing.join(", ")}`
    );
}

const env = {
    // ─── Server ───────────────────────────────────────────────────────────────
    PORT: process.env.PORT || "3100",
    NODE_ENV: process.env.NODE_ENV || "development",

    // ─── Database ─────────────────────────────────────────────────────────────
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,

    // ─── Auth ─────────────────────────────────────────────────────────────────
    JWT_SECRET: process.env.JWT_SECRET,

    // ─── Email ────────────────────────────────────────────────────────────────
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,

    // ─── URLs ─────────────────────────────────────────────────────────────────
    URL_FRONTEND: process.env.URL_FRONTEND?.trim(),
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    // Fallback ke localhost jika tidak didefinisikan di .env
    GOOGLE_CALLBACK_URL:
        process.env.GOOGLE_CALLBACK_URL ||
        `http://localhost:${process.env.PORT || "3100"}/auth/google/callback`,
};

export default env;
