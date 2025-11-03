import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Espera formato: Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token inválido o expirado" });
        }
        req.user = user; // user.id estará disponible en los controladores
        next();
    });
};
