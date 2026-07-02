/**
 * src/config/passport.js
 *
 * Konfigurasi Passport.js — Google OAuth 2.0 Strategy.
 *
 * Tanggung jawab:
 * - Mendefinisikan strategy Google OAuth
 * - Mencari atau membuat user di DB setelah autentikasi Google berhasil
 *
 * Perubahan dari versi lama:
 * - callbackURL tidak lagi hardcoded — dibaca dari env.GOOGLE_CALLBACK_URL
 * - Import DB dari src/config/database.js (bukan config/connect.js)
 * - Import credentials dari env.js (bukan process.env langsung)
 */

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import db from "./database.js";
import env from "./env.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            callbackURL: env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const googleId = profile.id;
                const email = profile.emails[0].value;
                const username = profile.displayName;
                const imageUrl = profile.photos[0].value;
                // Placeholder password untuk user yang login via Google
                // (tidak pernah digunakan untuk login manual)
                const placeholderPassword = "google-oauth-user";

                const [users] = await db.query(
                    "SELECT * FROM users WHERE google_id = ? OR email = ?",
                    [googleId, email]
                );

                let user;

                if (users.length === 0) {
                    const [result] = await db.query(
                        `INSERT INTO users (username, password, email, google_id, auth_provider, user_image)
                         VALUES (?, ?, ?, ?, 'google', ?)`,
                        [username, placeholderPassword, email, googleId, imageUrl]
                    );

                    user = {
                        id: result.insertId,
                        username,
                        user_image: imageUrl,
                        email,
                    };
                } else {
                    user = users[0];
                    user.user_image = imageUrl;
                }

                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);

export default passport;
