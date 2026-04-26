import jwt from "jsonwebtoken";

export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Jika tidak ada header atau tidak ada token, lanjut saja tanpa req.user
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        req.user = null;
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode; // Simpan data user (termasuk id)
        next();
    } catch (err) {
        // Jika token salah/expired, kita anggap tidak login saja (opsional)
        // atau lo bisa tetep return error kalau mau strict soal keamanan token
        req.user = null;
        next();
    }
};