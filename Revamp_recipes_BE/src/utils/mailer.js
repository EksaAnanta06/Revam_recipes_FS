/**
 * src/utils/mailer.js
 *
 * Nodemailer transporter — utility untuk mengirim email.
 *
 * ─── MENGAPA DIPINDAH DARI Middleware/nodemailerMiddleware.js? ───────────────
 *
 * "Middleware" dalam Express secara spesifik berarti fungsi dengan signature:
 *   (req, res, next) => void
 *
 * Nodemailer transporter BUKAN middleware — ia tidak menerima (req, res, next).
 * Ia adalah sebuah *utility object* yang digunakan oleh service layer.
 *
 * Nama yang benar → src/utils/mailer.js
 *
 * Perubahan dari versi lama:
 * - Dipindah dari Middleware/ ke utils/
 * - Nama file: nodemailerMiddleware → mailer (lebih ringkas dan akurat)
 * - Credentials dibaca dari env.js (bukan process.env langsung)
 */

import nodemailer from "nodemailer";
import env from "../config/env.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
    },
});

export { transporter };
