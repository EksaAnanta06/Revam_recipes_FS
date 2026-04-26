import express from "express";
import cors from "cors";
import env from "dotenv";
import authRoutes from "./routes/auth_routes.js";
import recipeRoutes from "./routes/recipes_routes.js";
import passport from "passport"; 
import './config/passport.js';
import path from "path"; 
import { fileURLToPath } from "url"; 

env.config();
const PORT = process.env.PORT;
const app = express();
app.use(cors({
    origin: "https://56d0-2402-5680-9319-7c84-2ee4-d77b-5d6-15ce.ngrok-free.app", // Alamat frontend Vercel
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "ngrok-skip-browser-warning"],
    credentials: true
}));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(passport.initialize());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", authRoutes);
app.use("/api", recipeRoutes);

app.listen(PORT, () => {
    console.log(`server berjalan di http://localhost:${PORT}`)
});