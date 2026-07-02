/**
 * src/utils/emailTemplates.js
 *
 * Tanggung jawab: menghasilkan konten HTML untuk email yang dikirim aplikasi.
 *
 * Sebelum refactor: template HTML 80+ baris berada LANGSUNG di dalam
 * fungsi forgotPassword() di controller — melanggar SRP karena controller
 * seharusnya tidak tahu tentang tampilan email.
 *
 * Sekarang: controller cukup panggil generateResetPasswordEmail(username, link)
 * dan mendapatkan objek { subject, html } yang siap dikirim.
 */

/**
 * Menghasilkan konten email reset password.
 * @param {string} username  - Nama user untuk sapaan personal
 * @param {string} resetLink - URL reset password dengan token
 * @returns {{ subject: string, html: string }}
 */
const generateResetPasswordEmail = (username, resetLink) => {
    const subject = "🚨 Reset Password Akun Anda";

    const html = `
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
                        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden;">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">🔐 Reset Password</h1>
                                </td>
                            </tr>

                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 22px; font-weight: 600;">
                                        Halo ${username}!
                                    </h2>
                                    <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                        Kami menerima permintaan untuk mereset password akun Anda.
                                        Klik tombol di bawah ini untuk melanjutkan.
                                    </p>

                                    <!-- Button -->
                                    <table role="presentation" style="margin: 30px 0;">
                                        <tr>
                                            <td align="center">
                                                <a href="${resetLink}"
                                                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;">
                                                    Reset Password Sekarang
                                                </a>
                                            </td>
                                        </tr>
                                    </table>

                                    <p style="margin: 20px 0 0 0; color: #999999; font-size: 14px;">
                                        Atau salin link berikut ke browser Anda:
                                    </p>
                                    <p style="margin: 10px 0 20px 0; padding: 12px; background-color: #f8f9fa; border-left: 4px solid #667eea; color: #666666; font-size: 13px; word-break: break-all; border-radius: 4px;">
                                        ${resetLink}
                                    </p>

                                    <!-- Warning -->
                                    <div style="margin-top: 30px; padding: 16px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                                        <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                                            ⚠️ <strong>Penting:</strong> Jika Anda tidak meminta reset password,
                                            abaikan email ini atau hubungi support kami.
                                        </p>
                                    </div>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                                    <p style="margin: 0 0 10px 0; color: #999999; font-size: 13px;">
                                        Link ini akan kedaluwarsa dalam 1 jam.
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
    `;

    return { subject, html };
};

export { generateResetPasswordEmail };
