import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/recipes");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const uploadRecipeImage = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = /jpg|jpeg|png/;
        const isValid = allowed.test(file.mimetype);
        cb(null, isValid);
    }
})

export { uploadRecipeImage }