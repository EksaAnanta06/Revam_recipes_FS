import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
       return res.status(401).json({
           success: false,
           message: "Format token salah atau belum login",
           data: null
       })
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Format token salah",
            data: null
        })
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "token tidak valid",
            data: null
        });
    }
}

export { authMiddleware }