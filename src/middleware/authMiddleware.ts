import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "premarital_examination_secure_jwt_secret_token_2026";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * Middleware to protect admin routes. Supports token extraction from
 * Authorization headers or HTTP cookies.
 */
export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    let token = "";

    // 1. Try extracting from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. Try extracting from cookies manually to avoid dependency overhead
    if (!token && req.headers.cookie) {
      const cookies = req.headers.cookie.split(";").reduce((acc: any, cookie) => {
        const parts = cookie.trim().split("=");
        const key = parts[0];
        const value = parts.slice(1).join("="); // Handle values with '='
        acc[key] = value;
        return acc;
      }, {});
      token = cookies["admin_session"];
    }

    if (!token) {
      return res.status(401).json({ error: "غير مصرح بالدخول، يرجى تسجيل الدخول أولاً" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "جلسة العمل منتهية أو غير صالحة" });
  }
}
