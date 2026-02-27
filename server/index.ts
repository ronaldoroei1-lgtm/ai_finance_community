import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin2024";

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  const isProduction = process.env.NODE_ENV === "production";

  const staticPath = isProduction
    ? path.resolve(__dirname, "public")
    : path.resolve(__dirname, "..", "dist", "public");

  // In dev: write to source content.json so Vite picks up changes
  // In prod: write to dist/public/content.json (served directly)
  const contentPath = isProduction
    ? path.resolve(staticPath, "content.json")
    : path.resolve(__dirname, "..", "client", "public", "content.json");

  // Create uploads directory
  const uploadsPath = path.join(staticPath, "images", "uploads");
  await fs.mkdir(uploadsPath, { recursive: true });

  // Configure multer for image uploads
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadsPath);
    },
    filename: (_req, file, cb) => {
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      cb(null, `${timestamp}${ext}`);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (_req, file, cb) => {
      const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      cb(null, allowed.includes(file.mimetype));
    },
  });

  // POST /api/upload - upload image (requires admin password)
  app.post("/api/upload", upload.single("image"), (req, res) => {
    const { password } = req.body;

    if (!password || password !== ADMIN_PASSWORD) {
      res.status(401).json({ error: "סיסמה שגויה" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "לא נבחר קובץ" });
      return;
    }

    res.json({ url: `/images/uploads/${req.file.filename}` });
  });

  // GET /api/content - read current content
  app.get("/api/content", async (_req, res) => {
    try {
      const data = await fs.readFile(contentPath, "utf-8");
      res.json(JSON.parse(data));
    } catch {
      res.status(500).json({ error: "Could not read content" });
    }
  });

  // POST /api/content - save updated content (requires admin password)
  app.post("/api/content", async (req, res) => {
    const { password, content } = req.body;

    if (!password || password !== ADMIN_PASSWORD) {
      res.status(401).json({ error: "סיסמה שגויה" });
      return;
    }

    if (!content || typeof content !== "object") {
      res.status(400).json({ error: "תוכן לא תקין" });
      return;
    }

    try {
      await fs.writeFile(contentPath, JSON.stringify(content, null, 2), "utf-8");
      res.json({ success: true });
    } catch (err) {
      console.error("Failed to save content:", err);
      res.status(500).json({ error: "שגיאה בשמירת הקובץ" });
    }
  });

  // Serve static files from dist/public in production
  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    if (!isProduction) {
      console.log(`Admin panel: http://localhost:${port}/admin`);
    }
  });
}

startServer().catch(console.error);
