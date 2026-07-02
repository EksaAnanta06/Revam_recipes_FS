import express from "express";
import cors from "cors";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";

// Config — passport strategy harus diload sebelum routes
import "./config/passport.js";

// Routes — seluruhnya sudah menggunakan src/routes/
import authRoutes   from "./routes/auth.js";
import recipeRoutes from "./routes/recipe.js";

// Middlewares
import errorHandler from "./middlewares/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// ─── Static Files ─────────────────────────────────────────────────────────────
// Melayani file upload dari folder uploads/ yang berada di root backend
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/auth", authRoutes);
app.use("/api", recipeRoutes);

// ─── Centralized Error Handler ────────────────────────────────────────────────
// HARUS dipasang SETELAH semua routes — Express mengenalinya dari 4 parameter
app.use(errorHandler);

export default app;
