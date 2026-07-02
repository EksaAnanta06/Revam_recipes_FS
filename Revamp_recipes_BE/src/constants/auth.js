/**
 * src/constants/auth.js
 *
 * Konstanta untuk domain autentikasi — menggantikan semua magic number
 * dan magic string yang berkaitan dengan auth, token, dan keamanan.
 *
 * Sebelum refactor (contoh magic yang tersebar):
 *   bcrypt.genSalt(10)                     → tidak jelas kenapa 10
 *   crypto.randomBytes(32)                 → tidak jelas kenapa 32
 *   Date.now() + 1 * 60 * 60 * 1000       → tidak jelas ini berapa jam
 *   { expiresIn: "1d" }                    → tidak jelas ini untuk apa
 *   { expiresIn: "7d" }                    → tidak jelas bedanya dengan "1d"
 *   password.length < 8 / username.length < 4  → angka validasi tidak bernama
 */

const AUTH = Object.freeze({
    // ─── Bcrypt ───────────────────────────────────────────────────────────────
    // Jumlah salt rounds: 10 adalah standar industri (keseimbangan keamanan/performa)
    // Nilai < 10 = terlalu cepat (mudah di-brute force)
    // Nilai > 12 = terlalu lambat di production
    BCRYPT_SALT_ROUNDS: 10,

    // ─── JWT ──────────────────────────────────────────────────────────────────
    // Token login biasa — expired dalam 1 hari
    JWT_EXPIRES_IN: "1d",
    // Token OAuth Google — expired lebih lama karena flow berbeda
    JWT_GOOGLE_EXPIRES_IN: "7d",

    // ─── Reset Password Token ─────────────────────────────────────────────────
    // Panjang random bytes untuk token reset (32 bytes = 64 hex chars — cukup aman)
    RESET_TOKEN_BYTES: 32,
    // Durasi token reset: 1 jam dalam milliseconds
    RESET_TOKEN_EXPIRES_MS: 1 * 60 * 60 * 1000,

    // ─── Validation Rules ─────────────────────────────────────────────────────
    USERNAME_MIN_LENGTH: 4,
    PASSWORD_MIN_LENGTH: 8,

    // ─── Pagination ───────────────────────────────────────────────────────────
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 8,
});

export default AUTH;
