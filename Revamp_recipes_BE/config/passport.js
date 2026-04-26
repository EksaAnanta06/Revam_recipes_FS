import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import db from "../config/connect.js"

export default passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3100/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const username = profile.displayName;
        const imageUrl = profile.photos[0].value;
        const password = "xxxxxxxxxxxxx";

        const [users] = await db.query(
            "SELECT * FROM users WHERE google_id = ? OR email = ?",
            [googleId, email]
        );

        let user;

        if (users.length === 0) {
            const [result] = await db.query(
                `INSERT INTO users (username, password, email, google_id, auth_provider, user_image)
                 VALUES (?, ?, ?, ?, 'google', ?)`,
                [username, password, email, googleId, imageUrl]
            );

            user = {
                id: result.insertId,
                username: username,
                user_image: imageUrl,
                email: email
            };
        } else {
            user = users[0];
            user.user_image = imageUrl;
        }

        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

