/**
 * src/repositories/authRepository.js
 *
 * Tanggung jawab: SEMUA operasi database yang berkaitan dengan autentikasi.
 *
 * Prinsip Repository Pattern:
 * - File ini hanya boleh berisi query SQL — tidak ada business logic
 * - Tidak tahu tentang HTTP request/response
 * - Tidak tahu tentang bcrypt, JWT, atau email
 * - Hanya bicara dengan database, mengembalikan raw data
 *
 * Manfaat:
 * - Jika query perlu diubah → hanya ubah di sini
 * - Jika ganti dari MySQL ke PostgreSQL → hanya ubah di sini
 * - Mudah di-mock saat unit testing
 */

import db from "../config/database.js";

/**
 * Cari user berdasarkan username atau email (untuk cek duplikat saat register).
 * @returns {Array} Array of { username, email }
 */
const findByUsernameOrEmail = async (username, email) => {
    const [rows] = await db.query(
        "SELECT username, email FROM users WHERE username = ? OR email = ?",
        [username, email]
    );
    return rows;
};

/**
 * Cari user lengkap berdasarkan username (untuk login).
 * @returns {Object|null} User object atau null
 */
const findByUsername = async (username) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
    );
    return rows[0] ?? null;
};

/**
 * Cari user berdasarkan email (untuk forgot password).
 * @returns {Object|null} { id, username } atau null
 */
const findByEmail = async (email) => {
    const [rows] = await db.query(
        "SELECT id, username FROM users WHERE email = ?",
        [email]
    );
    return rows[0] ?? null;
};

/**
 * Buat user baru.
 * @returns {number} insertId dari user yang baru dibuat
 */
const createUser = async ({ username, password, email }) => {
    const [result] = await db.query(
        "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
        [username, password, email]
    );
    return result.insertId;
};

/**
 * Simpan hashed reset token dan waktu kedaluwarsa ke user.
 */
const saveResetToken = async ({ email, hashedToken, expiredAt }) => {
    await db.query(
        "UPDATE users SET reset_token = ?, reset_token_expired = ? WHERE email = ?",
        [hashedToken, expiredAt, email]
    );
};

/**
 * Cari user berdasarkan hashed reset token yang masih berlaku.
 * @returns {Object|null} { id } atau null jika token tidak valid / expired
 */
const findByValidResetToken = async (hashedToken) => {
    const [rows] = await db.query(
        `SELECT id FROM users
         WHERE reset_token = ?
         AND reset_token_expired > NOW()`,
        [hashedToken]
    );
    return rows[0] ?? null;
};

/**
 * Update password user dan hapus reset token setelah berhasil reset.
 */
const updatePasswordAndClearToken = async ({ userId, hashedPassword }) => {
    await db.query(
        `UPDATE users
         SET password = ?, reset_token = NULL, reset_token_expired = NULL
         WHERE id = ?`,
        [hashedPassword, userId]
    );
};

export {
    findByUsernameOrEmail,
    findByUsername,
    findByEmail,
    createUser,
    saveResetToken,
    findByValidResetToken,
    updatePasswordAndClearToken,
};
