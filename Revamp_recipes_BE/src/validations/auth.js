/**
 * src/validations/auth.js
 *
 * Tanggung jawab: validasi input untuk semua operasi autentikasi.
 *
 * Sebelum refactor, validasi tersebar di dalam setiap fungsi controller:
 *   if (!username || !password) return res.status(400).json(...)
 *   if (username.length < 4)    return res.status(400).json(...)
 *
 * Masalahnya:
 * 1. Controller menjadi panjang dan sulit dibaca
 * 2. Aturan validasi tidak terdokumentasi di satu tempat
 * 3. Magic number (4, 8, 7) tersebar — sekarang pakai AUTH constants
 *
 * Setiap fungsi di sini melempar BadRequestError jika validasi gagal.
 * Controller tidak perlu tahu detail validasinya — cukup panggil fungsi ini.
 */

import { BadRequestError } from "../errors/index.js";
import { AUTH } from "../constants/index.js";

/**
 * Validasi input registrasi.
 * @param {{ username: string, password: string, email: string }} data
 */
const validateRegister = ({ username, password, email }) => {
    if (!username || !password || !email) {
        throw new BadRequestError(
            "Semua kolom (username, password, email) wajib diisi!"
        );
    }

    if (username.length < AUTH.USERNAME_MIN_LENGTH) {
        throw new BadRequestError(
            `Username minimal ${AUTH.USERNAME_MIN_LENGTH} karakter`
        );
    }

    if (password.length < AUTH.PASSWORD_MIN_LENGTH) {
        throw new BadRequestError(
            `Password minimal ${AUTH.PASSWORD_MIN_LENGTH} karakter`
        );
    }
};

/**
 * Validasi input login.
 * @param {{ username: string, password: string }} data
 */
const validateLogin = ({ username, password }) => {
    if (!username || !password) {
        throw new BadRequestError("Username dan password wajib diisi");
    }

    if (username.length < AUTH.USERNAME_MIN_LENGTH) {
        throw new BadRequestError(
            `Username minimal ${AUTH.USERNAME_MIN_LENGTH} karakter`
        );
    }

    if (password.length < AUTH.PASSWORD_MIN_LENGTH) {
        throw new BadRequestError(
            `Password minimal ${AUTH.PASSWORD_MIN_LENGTH} karakter`
        );
    }
};

/**
 * Validasi input forgot password.
 * @param {{ email: string }} data
 */
const validateForgotPassword = ({ email }) => {
    if (!email) {
        throw new BadRequestError("Email wajib diisi");
    }
};

/**
 * Validasi input reset password.
 * @param {{ token: string, newPassword: string }} data
 */
const validateResetPassword = ({ token, newPassword }) => {
    if (!token || !newPassword) {
        throw new BadRequestError("Data tidak lengkap");
    }

    if (newPassword.length < AUTH.PASSWORD_MIN_LENGTH) {
        throw new BadRequestError(
            `Password minimal ${AUTH.PASSWORD_MIN_LENGTH} karakter`
        );
    }
};

export { validateRegister, validateLogin, validateForgotPassword, validateResetPassword };
