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
app.use(cors());
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