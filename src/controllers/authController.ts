import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "premarital_examination_secure_jwt_secret_token_2026";
const DEFAULT_USERNAME = process.env.ADMIN_USERNAME || "admin";
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "password123";

/**
 * Handle admin login and issue JWT session.
 */
export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    // Check database for credentials
    const dbAdmin = await prisma.admin.findUnique({
      where: { id: 1 },
    });

    let isValid = false;
    if (dbAdmin) {
      isValid = (username === dbAdmin.username && password === dbAdmin.password);
    } else {
      // Fallback to Env / Default credentials
      isValid = (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD);
    }

    if (isValid) {
      const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "24h" });

      // Set cookie in Express header
      res.cookie("admin_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 1000, // 24 hours in ms
      });

      return res.json({ success: true, token, message: "تم تسجيل الدخول بنجاح" });
    }

    return res.status(401).json({ error: "اسم المستخدم أو كلمة المرور غير صحيحة" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "حدث خطأ ما أثناء تسجيل الدخول" });
  }
}

/**
 * Handle admin logout and clear session cookie.
 */
export async function logout(req: Request, res: Response) {
  res.cookie("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res.json({ success: true, message: "تم تسجيل الخروج بنجاح" });
}

/**
 * Update admin login credentials (username and password).
 */
export async function updateCredentials(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "يرجى إدخال اسم المستخدم وكلمة المرور الجديدة" });
    }

    // Upsert the single admin record
    await prisma.admin.upsert({
      where: { id: 1 },
      update: { username, password },
      create: { id: 1, username, password },
    });

    return res.json({ success: true, message: "تم تحديث بيانات الدخول بنجاح" });
  } catch (error) {
    console.error("Error updating credentials:", error);
    return res.status(500).json({ error: "حدث خطأ أثناء تحديث بيانات الدخول" });
  }
}
