import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db/index";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Skema Validasi Zod
const registerSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validasi input
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ error: validation.error.format() });
      return;
    }

    const { name, email, password } = validation.data;

    // Cek apakah email sudah digunakan
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length) {
      res.status(409).json({ error: "Email sudah digunakan" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User berhasil didaftarkan!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan saat registrasi" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Cek apakah email ada di database
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user.length) {
      res.status(400).json({ error: "User tidak ditemukan" });
      return;
    }

    // Cek password
    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      res.status(400).json({ error: "Password salah" });
      return;
    }

    // Buat token JWT
    const token = jwt.sign({ id: user[0].id, email: user[0].email }, "secret", {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan saat login" });
  }
};
