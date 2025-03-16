import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = "secret";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Akses ditolak" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Token tidak valid" });
        (req as any).user = user;
        next();
    });
};

export const generateToken = (id: number, email: string) => {
    return jwt.sign({ id, email }, SECRET_KEY, { expiresIn: "1h" });
};
