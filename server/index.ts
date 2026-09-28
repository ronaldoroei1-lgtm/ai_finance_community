import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";
import multer from "multer";
import sharp from "sharp";
import { randomBytes, randomUUID, createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";

const text = z.string().max(20000);
const link = z.string().max(2048).refine(value => !value || /^https?:\/\//i.test(value), "Invalid URL");
const image = z.string().max(2048).refine(value => !value || /^https?:\/\//i.test(value) || /^\/(?![\/\\])[^\\]*$/.test(value), "Invalid image path");
const contentSchema = z.object({
  hero: z.object({ headline: text, subtext: text, subtagline: text, whatsappUrl: link, businessWhatsappUrl: link, linkedinUrl: link }).passthrough(),
  about: z.object({ text }).passthrough(),
  team: z.array(z.object({ name: text, title: text, bio: text, image, linkedinUrl: link.optional(), expertise: z.array(text).max(30) }).passthrough()).max(100),
  services: z.array(z.object({ iconKey: text, title: text, description: text }).passthrough()).max(100),
  clients: z.array(z.object({ name: text, description: text, logoUrl: image }).passthrough()).max(200),
  gallery: z.array(z.object({ src: image, alt: text }).passthrough()).max(500),
  faq: z.array(z.object({ question: text, answer: text }).passthrough()).max(100),
  contact: z.object({ email: z.string().email(), whatsappUrl: link, linkedinUrl: link, instagramUrl: link.optional().default("") }).passthrough(),
  cta: z.object({ headline: text, subtext: text, buttonText: text, whatsappButtonText: text }).passthrough(),
}).passthrough();
const revisionOf = (value: string) => createHash("sha256").update(value).digest("hex");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  console.error("ADMIN_PASSWORD is not set. Admin access is disabled.");
  console.error("Set ADMIN_PASSWORD and a persistent DATA_DIR before enabling production administration.");
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "1mb" }));

  const isProduction = process.env.NODE_ENV === "production";

  const staticPath = isProduction
    ? path.resolve(__dirname, "public")
    : path.resolve(__dirname, "..", "dist", "public");

  const seedPath = isProduction ? path.join(staticPath, "content.json") : path.resolve(__dirname, "../client/public/content.json");
  // Mount DATA_DIR on persistent storage in production; never place it in the public tree.
  const dataDir = path.resolve(process.env.DATA_DIR || path.resolve(__dirname, "../data"));
  const contentPath = path.join(dataDir, "content.json");
  const uploadsPath = path.join(dataDir, "uploads");
  await fs.mkdir(uploadsPath, { recursive: true });
  try { await fs.copyFile(seedPath, contentPath, 1); } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
  }
  const sessions = new Map<string, number>();
  const attempts = new Map<string, { count: number; until: number }>();
  const cleanExpired = setInterval(() => {
    for (const [key, expiry] of Array.from(sessions)) if (expiry <= Date.now()) sessions.delete(key);
    for (const [key, value] of Array.from(attempts)) if (value.until <= Date.now()) attempts.delete(key);
  }, 60000);
  cleanExpired.unref();
  const authenticate: express.RequestHandler = (req, res, next) => {
    const token = req.headers.authorization?.replace(/^Bearer /, "") || "";
    if (!ADMIN_PASSWORD || (sessions.get(token) || 0) <= Date.now()) {
      res.status(401).json({ error: "נדרשת התחברות מחדש" }); return;
    }
    next();
  };
  app.use("/api", (_req, res, next) => { res.setHeader("Cache-Control", "no-store"); next(); });
  app.post("/api/login", (req, res) => {
    if (!ADMIN_PASSWORD) { res.status(503).json({ error: "ניהול האתר אינו מוגדר בסביבה זו" }); return; }
    const key = req.ip || "unknown";
    const previous = attempts.get(key);
    const attempt = previous && previous.until > Date.now() ? previous : { count: 0, until: Date.now() + 15 * 60000 };
    if (attempt.count >= 10) { res.status(429).json({ error: "יותר מדי ניסיונות. נסו שוב בעוד 15 דקות" }); return; }
    attempt.count++; attempts.set(key, attempt);
    const supplied = typeof req.body?.password === "string" ? req.body.password : "";
    const hash = (value: string) => createHash("sha256").update(value).digest();
    if (!timingSafeEqual(hash(supplied), hash(ADMIN_PASSWORD))) { res.status(401).json({ error: "סיסמה שגויה" }); return; }
    attempts.delete(key);
    const token = randomBytes(32).toString("hex");
    sessions.set(token, Date.now() + 8 * 60 * 60000);
    res.json({ token });
  });
  app.post("/api/logout", authenticate, (req, res) => {
    sessions.delete(req.headers.authorization!.replace(/^Bearer /, ""));
    res.json({ success: true });
  });
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 0 } });
  app.post("/api/upload", authenticate, upload.single("image"), async (req, res) => {
    if (!req.file) { res.status(400).json({ error: "לא נבחר קובץ" }); return; }
    try {
      const decoded = sharp(req.file.buffer, { limitInputPixels: 40000000 });
      const metadata = await decoded.metadata();
      if (!["jpeg", "png", "webp", "gif"].includes(metadata.format || "")) throw new Error("Unsupported image");
      const filename = `${randomUUID()}.webp`;
      await decoded.rotate().resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true }).webp({ quality: 85 }).toFile(path.join(uploadsPath, filename));
      res.json({ url: `/images/uploads/${filename}` });
    } catch { res.status(400).json({ error: "הקובץ אינו תמונה תקינה או גדול מדי" }); }
  });
  const readContent: express.RequestHandler = async (_req, res) => {
    try {
      const data = await fs.readFile(contentPath, "utf-8");
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("X-Content-Revision", revisionOf(data));
      res.json(JSON.parse(data));
    } catch { res.status(500).json({ error: "Could not read content" }); }
  };
  app.get("/api/content", readContent);
  app.get("/content.json", readContent);
  // Serialize read/compare/write so two editors cannot silently overwrite each other.
  let writes: Promise<void> = Promise.resolve();
  app.post("/api/content", authenticate, (req, res) => {
    const parsed = contentSchema.safeParse(req.body?.content);
    if (!parsed.success) { res.status(400).json({ error: "מבנה התוכן או אחד הקישורים אינו תקין" }); return; }
    const expected = req.headers["if-match"];
    writes = writes.then(async () => {
      const temporary = `${contentPath}.${randomUUID()}.tmp`;
      try {
        const current = await fs.readFile(contentPath, "utf-8");
        if (expected !== revisionOf(current)) { res.status(409).json({ error: "התוכן עודכן בחלון אחר. העתיקו את השינויים וטענו מחדש לפני שמירה" }); return; }
        const next = JSON.stringify(parsed.data, null, 2);
        await fs.writeFile(temporary, next, "utf-8");
        await fs.copyFile(contentPath, `${contentPath}.backup`);
        await fs.rename(temporary, contentPath);
        res.setHeader("X-Content-Revision", revisionOf(next));
        res.json({ success: true });
      } catch (error) {
        await fs.unlink(temporary).catch(() => {});
        console.error("Content save failed", error);
        res.status(500).json({ error: "שגיאה בשמירת התוכן" });
      }
    }).catch(error => console.error("Content write queue failed", error));
  });
  app.use("/images/uploads", express.static(uploadsPath, { index: false, setHeaders: res => res.setHeader("X-Content-Type-Options", "nosniff") }));
  const apiErrors: express.ErrorRequestHandler = (error, _req, res, _next) => {
    res.status(error instanceof multer.MulterError ? 400 : 500).json({ error: "הבקשה לא הושלמה. בדקו את הקובץ ונסו שוב" });
  };
  app.use("/api", apiErrors);

  // Serve static files from dist/public in production. /blog/ and
  // /blog/{slug}/ are prerendered directories with their own index.html
  // (see scripts/blog/prerender.mjs) - express.static serves those
  // automatically for exact matches, including the directory-index +
  // trailing-slash redirect behaviour, before ever reaching the catch-all
  // below.
  app.use(express.static(staticPath));

  // Anything that reaches here didn't match a static file or a
  // prerendered blog route. Known client-rendered app routes still get
  // the SPA shell with a 200; everything else (including bad /blog/:slug
  // URLs) gets the SPA shell too - so the client-side NotFound component
  // renders - but with a real HTTP 404 status, not a silent 200.
  const KNOWN_APP_ROUTES = new Set([
    "/",
    "/admin",
    "/404",
    "/services/ai-workshops-for-finance",
    "/services/ai-workshops-for-finance/",
    "/services/ai-workshops-finance-teams",
    "/services/ai-workshops-finance-teams/",
    "/services/ai-lectures-executives",
    "/services/ai-lectures-executives/",
    "/services/ai-process-mapping-finance",
    "/services/ai-process-mapping-finance/",
    "/community",
    "/community/",
  ]);
  for (const route of ["/services", "/knowledge", "/about", "/contact", "/accessibility"]) {
    KNOWN_APP_ROUTES.add(route);
    KNOWN_APP_ROUTES.add(`${route}/`);
  }
  for (const route of Array.from(KNOWN_APP_ROUTES)) {
    if (route === "/admin" || route === "/404") continue;
    const translated = route === "/" ? "/en" : `/en${route}`;
    KNOWN_APP_ROUTES.add(translated);
    KNOWN_APP_ROUTES.add(`${translated.replace(/\/$/, "")}/`);
  }
  app.get("*", (req, res) => {
    const status = KNOWN_APP_ROUTES.has(req.path) ? 200 : 404;
    res.status(status).sendFile(path.join(staticPath, status === 404 ? (req.path.startsWith("/en/") ? "en/404/index.html" : "404/index.html") : "index.html"));
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
