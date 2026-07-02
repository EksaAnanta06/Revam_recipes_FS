/**
 * src/middlewares/upload.js
 *
 * Middleware upload file menggunakan Multer.
 *
 * Perubahan dari versi lama (imgMiddleware.js):
 *
 * 1. Nama file: imgMiddleware → upload (lebih deskriptif dan mudah diperluas)
 *
 * 2. FIX PATH BUG: destination dulu hardcoded "uploads/recipes" (path relatif
 *    terhadap CWD). Jika server dijalankan dari folder selain root backend,
 *    upload akan gagal atau tersimpan di tempat yang salah.
 *    Sekarang menggunakan path absolut via fileURLToPath + import.meta.url.
 *
 * 3. fileFilter diperbaiki: test() seharusnya dicek pada mimetype dengan
 *    pattern yang lebih ketat untuk menghindari bypass ekstensi file.
 */

import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path absolut ke folder uploads — selalu benar terlepas dari CWD
const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads", "recipes");

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
        // Format: timestamp + ekstensi asli → unik dan aman
        const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (_req, file, cb) => {
    // Cek mimetype yang sebenarnya, bukan hanya ekstensi nama file
    const ALLOWED_MIME_TYPES = /^image\/(jpeg|png)$/;
    const isValid = ALLOWED_MIME_TYPES.test(file.mimetype);
    cb(null, isValid);
};

const uploadRecipeImage = multer({ storage, fileFilter });

export { uploadRecipeImage };
