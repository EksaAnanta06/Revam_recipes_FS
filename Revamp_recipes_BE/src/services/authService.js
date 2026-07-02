/**
 * src/services/authService.js
 *
 * Tanggung jawab: business logic autentikasi.
 *
 * Layer ini adalah "otak" dari fitur auth — ia mengorkestrasikan:
 * - Validasi input (via validations/auth.js)
 * - Query database (via repositories/authRepository.js)
 * - Operasi keamanan: bcrypt hash, JWT sign, crypto token
 * - Pengiriman email (via utils/mailer.js + emailTemplates.js)
 *
 * Yang TIDAK boleh ada di sini:
 * - req, res, next (itu urusan controller)
 * - Pengetahuan tentang HTTP status code
 * - res.json() atau res.status()
 *
 * Setiap fungsi melempar Error jika ada yang salah — controller yang
 * menangkap dan mengirimkan response yang sesuai.
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import env from "../config/env.js";
import { AUTH } from "../constants/index.js";
import { ConflictError, UnauthorizedError, BadRequestError, NotFoundError } from "../errors/index.js";
import * as authRepo from "../repositories/authRepository.js";
import { transporter } from "../utils/mailer.js";
import { generateResetPasswordEmail } from "../utils/emailTemplates.js";
import {
    validateRegister,
    validateLogin,
    validateForgotPassword,
    validateResetPassword,
} from "../validations/auth.js";

// ─── Register ─────────────────────────────────────────────────────────────────
const register = async ({ username, password, email }) => {
    validateRegister({ username, password, email });

    const existing = await authRepo.findByUsernameOrEmail(username, email);

    if (existing.length > 0) {
        const isUsernameTaken = existing.some((u) => u.username === username);
        throw new ConflictError(
            isUsernameTaken ? "Username sudah digunakan" : "Email sudah terdaftar"
        );
    }

    const hashedPassword = await bcrypt.hash(password, AUTH.BCRYPT_SALT_ROUNDS);
    await authRepo.createUser({ username, password: hashedPassword, email });
};

// ─── Login ────────────────────────────────────────────────────────────────────
const login = async ({ username, password }) => {
    validateLogin({ username, password });

    const user = await authRepo.findByUsername(username);

    if (!user) {
        throw new UnauthorizedError("Username tidak ditemukan");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new UnauthorizedError("Password salah");
    }

    const token = jwt.sign(
        { id: user.id, username: user.username, avatar: user.user_image, email: user.email },
        env.JWT_SECRET,
        { expiresIn: AUTH.JWT_EXPIRES_IN }
    );

    return {
        token,
        userId: user.id,
        username: user.username,
        avatar: user.user_image,
    };
};

// ─── Forgot Password ──────────────────────────────────────────────────────────
const forgotPassword = async ({ email }) => {
    validateForgotPassword({ email });

    const user = await authRepo.findByEmail(email);

    if (!user) {
        throw new NotFoundError("Email tidak terdaftar");
    }

    // Generate token acak → simpan versi hash-nya di DB (keamanan)
    const rawToken = crypto.randomBytes(AUTH.RESET_TOKEN_BYTES).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiredAt = new Date(Date.now() + AUTH.RESET_TOKEN_EXPIRES_MS);

    await authRepo.saveResetToken({ email, hashedToken, expiredAt });

    const resetLink = `${env.URL_FRONTEND}/reset-password?token=${rawToken}`;
    const { subject, html } = generateResetPasswordEmail(user.username, resetLink);

    await transporter.sendMail({
        from: `"Team Service" <${env.EMAIL_USER}>`,
        to: email,
        subject,
        html,
    });
};

// ─── Reset Password ───────────────────────────────────────────────────────────
const resetPassword = async ({ token, newPassword }) => {
    validateResetPassword({ token, newPassword });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await authRepo.findByValidResetToken(hashedToken);

    if (!user) {
        throw new BadRequestError("Token tidak valid atau sudah kadaluarsa");
    }

    const hashedPassword = await bcrypt.hash(newPassword, AUTH.BCRYPT_SALT_ROUNDS);
    await authRepo.updatePasswordAndClearToken({ userId: user.id, hashedPassword });
};

// ─── Google OAuth Token ───────────────────────────────────────────────────────
// Dipindahkan dari inline handler di routes/auth_routes.js
const signGoogleToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, avatar: user.user_image, email: user.email },
        env.JWT_SECRET,
        { expiresIn: AUTH.JWT_GOOGLE_EXPIRES_IN }
    );
};

export { register, login, forgotPassword, resetPassword, signGoogleToken };
