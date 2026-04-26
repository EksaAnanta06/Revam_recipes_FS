import db from "../config/connect.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { transporter } from "../Middleware/nodemailerMiddleware.js"

const register = async (req, res) => {
    const { username, password, email } = req.body;

    try {
        if (!username || !password || !email) {
            return res.status(400).json({
                success: false,
                message: "Semua kolom (username, password, email) wajib diisi!",
            })
        }

        if (username.length < 4 || password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Username minimal 4 karakter, Password minimal 8 karakter",
            })
        }

        const [existingUser] = await db.query(
            "SELECT username, email FROM users WHERE username = ? OR email = ?",
            [username, email]
        );

        if (existingUser.length > 0) {
            const isUsernameUsed = existingUser.some(user => user.username === username);
            return res.status(409).json({
                success: false,
                message: isUsernameUsed ? "Username sudah digunakan" : "Email sudah terdaftar",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        await db.query(
            "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
            [username, hashedPass, email]
        );

        return res.status(201).json({
            success: true,
            message: "Akun berhasil dibuat!",
        });

    } catch (err) {
        console.error("=== DETAIL ERROR REGISTRASI ===");
        console.error("Pesan Error:", err.message);
        console.error("Kode Error DB:", err.code);
        console.error("Stack Trace:", err.stack);

        res.status(500).json({
            success: false,
            message: "terjadi kesalahan di server!",
            error_code: err.code // Tampilkan kode error sementara untuk debug
        });
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;
    try {

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "kolom field tidak boleh kosong",
                data: null
            })
        }

        if (username.length < 3 || password.length < 7) {
            return res.status(400).json({
                success: false,
                message: "username harus lebih dari 4 char, password harus lebih dari 7 char",
                data: null
            })
        }

        const [row] = await db.query("SELECT * FROM users WHERE username = ?", [username]);

        if (row.length === 0) {
            return res.status(401).json({
                success: false,
                message: "username tidak ditemukan",
                data: null
            })
        }

        const user = row[0];
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(user)
        

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "password salah!",
                data: null
            })
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, avatar: user.user_image, email: user.email },   
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            success: true,
            message: "login berhasil",
            data: {
                token,
                userId: user.id,
                username: user.username,
                avatar: user.user_image
            }
        })

    } catch (err) {
        console.log("terjadi error: ", err);
        return res.status(500).json({ message: "Server error" });
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: "email wajib diisi" })
        }

        const [users] = await db.query(
            "SELECT id, username FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.json({
                success: false,
                message: "email tidak terdaftar!!"
            })
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hasedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        const expired = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1jam 

        await db.query(
            `UPDATE users
         SET reset_token = ?, reset_token_expired = ?
         WHERE email = ?`,
            [hasedToken, expired, email]
        );

        const resetLink = `${process.env.URL_FRONTEND}/reset-password?token=${resetToken}`;

        await transporter.sendMail({
            from: `"Team Service" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "🚨 Reset Password Akun Anda",
            html: `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f7fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td align="center" style="padding: 40px 0;">
                        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">🔐 Reset Password</h1>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 22px; font-weight: 600;">Halo ${users[0].username}!</h2>
                                    
                                    <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                        Kami menerima permintaan untuk mereset password akun Anda. Klik tombol di bawah ini untuk melanjutkan proses reset password.
                                    </p>
                                    
                                    <!-- Button -->
                                    <table role="presentation" style="margin: 30px 0;">
                                        <tr>
                                            <td align="center">
                                                <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                                                    Reset Password Sekarang
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <p style="margin: 20px 0 0 0; color: #999999; font-size: 14px; line-height: 1.6;">
                                        Atau salin dan tempel link berikut ke browser Anda:
                                    </p>
                                    <p style="margin: 10px 0 20px 0; padding: 12px; background-color: #f8f9fa; border-left: 4px solid #667eea; color: #666666; font-size: 13px; word-break: break-all; border-radius: 4px;">
                                        ${resetLink}
                                    </p>
                                    
                                    <!-- Warning Box -->
                                    <div style="margin-top: 30px; padding: 16px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                                        <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                                            ⚠️ <strong>Penting:</strong> Jika Anda tidak meminta reset password, abaikan email ini atau hubungi support kami jika Anda merasa ada yang mencurigakan.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                                    <p style="margin: 0 0 10px 0; color: #999999; font-size: 13px;">
                                        Link ini akan kedaluwarsa dalam 1 jam untuk keamanan akun Anda.
                                    </p>
                                    <p style="margin: 0; color: #999999; font-size: 13px;">
                                        © ${new Date().getFullYear()} Support System. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `});
        return res.status(200).json({ success: true, message: "Email berhasil dikirim" });
    } catch (err) {
        console.error("Error Detail:", err);
        return res.status(500).json({ pesan: "Gagal mengirim email, coba lagi nanti." });
    }
}

const resetPassword = async (req, res) => {
    const { newPassword } = req.body;
    const token = req.query.token;

    if (!token || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "data tidak lengkap"
        })
    }

    if (newPassword.length < 7) {
        return res.status(400).json({
            success: false,
            message: "password minimal 7 char"
        })
    }

    const hasedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const [users] = await db.query(
        `SELECT id FROM users
         WHERE reset_token = ?
         AND reset_token_expired > NOW()`,
        [hasedToken]
    );

    if (users.length === 0) {
        return res.status(400).json({
            success: false,
            message: "token tidak valid atau sedah kadaluarsa"
        })
    }

    const hasedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
        `UPDATE users
         SET password = ?, reset_token = NULL, reset_token_expired = NULL
         WHERE id = ?`,
        [hasedPassword, users[0].id]
    )

    res.json({
        success: true,
        message: "password berhasil direset"
    })

}

export { register, login, forgotPassword, resetPassword };