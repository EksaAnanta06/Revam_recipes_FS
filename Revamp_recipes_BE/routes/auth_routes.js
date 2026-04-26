import express from "express";
import { register, login, forgotPassword, resetPassword } from "../controllers/auth.js"
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router()

router.post("/register", register) //done
router.post("/login", login) //done
router.post("/forgot-password", forgotPassword) //done
router.post("/reset-password", resetPassword) //done

// google verifikasi
router.get("/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);

router.get("/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
       
        const token = jwt.sign(
            {
                id: req.user.id,
                username: req.user.username,
                avatar: req.user.user_image,
                email: req.user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.redirect(
            `http://localhost:5173/oauth-success?token=${token}`
        );
    }
);



export default router

