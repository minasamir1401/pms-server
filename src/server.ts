import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { login, logout, updateCredentials } from "./controllers/authController";
import { getAllCertificates, getCertificate, createCertificate, updateCertificate, deleteCertificate } from "./controllers/certificateController";
import { authMiddleware } from "./middleware/authMiddleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with Credentials for cookies support
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));

app.use(express.json());

// API Routes
// 1. Authentication
app.post("/api/auth/login", login);
app.post("/api/auth/logout", logout);
app.put("/api/auth/credentials", authMiddleware as any, updateCredentials);

// 2. Medical Certificates
app.get("/api/certificates", authMiddleware as any, getAllCertificates);
app.post("/api/certificates", authMiddleware as any, createCertificate);
app.get("/api/certificates/:id", getCertificate); // Public route for scanning QR codes
app.put("/api/certificates/:id", authMiddleware as any, updateCertificate);
app.delete("/api/certificates/:id", authMiddleware as any, deleteCertificate);

// Root Health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`[API Server] running on http://localhost:${PORT}`);
});
