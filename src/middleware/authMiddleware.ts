import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = "secret";

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Akses ditolak" });
        return; // Explicitly return void
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            res.status(403).json({ message: "Token tidak valid" });
            return; // Explicitly return void
        }
        (req as any).user = user;
        next();
    });
};