/**
 * AI Finance Community - SEO Agent
 * משתמש ב-Claude API כדי לייצר המלצות SEO מותאמות לאתר עברי
 *
 * הרצה: ANTHROPIC_API_KEY=your-key node generate-seo.mjs
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, "output");
const publicDir = path.join(__dirname, "..", "client", "public");

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("❌ חסר: ANTHROPIC_API_KEY");
  console.error("   הגדר את המשתנה לפני הרצה: ANTHROPIC_API_KEY=your-key node generate-seo.mjs");
  process.exit(1);
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SITE_CONTEXT = `
אתר: קהילת AI Finance
שפה: עברית (RTL, ישראל)
כתובת: https://ai-finance-community.vercel.app/
תיאור: קהילה מקצועית המחברת אנשי כספים ישראלים עם בינה מלאכותית
קהל יעד: CFO, רואי חשבון, אנליסטים, סמנכ"לי כספים בישראל
גודל קהילה: מעל 1,700 חברים
שירותים: הרצאות AI לחברות, קהילת WhatsApp, מדריכים מקצועיים
לקוחות בולטים: monday.com, PSG Equity, לשכת רואי החשבון בישראל, האוניברסיטה העברית
מייסדים: רו"ח טל ולנשטין (מיסוי, Big 4), רועי ולנשטין (ביקורת, מנהל קהילה)
קריאה לפעולה: הצטרפות לקהילת WhatsApp, יצירת קשר להרצאות
`;

console.log("🤖 מריץ סוכן SEO מבוסס Claude...\n");

const response = await client.messages.create({
  model: "claude-opus-4-6",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: `אתה מומחה SEO לאתרים עבריים בישראל.

הנה פרטי האתר:
${SITE_CONTEXT}

צור דוח SEO מקיף בפורמט JSON עם המפתחות הבאים (ענה רק ב-JSON תקין, ללא טקסט נוסף):

{
  "meta_title": "כותרת SEO עד 60 תווים בעברית עם מילת המפתח הראשית",
  "meta_description": "תיאור SEO עד 155 תווים בעברית עם קריאה לפעולה",
  "og_title": "כותרת Open Graph עד 60 תווים",
  "og_description": "תיאור Open Graph עד 155 תווים",
  "keywords": ["מערך", "של", "15-10", "מילות", "מפתח", "בעברית", "ואנגלית"],
  "robots_txt": "תוכן קובץ robots.txt מלא",
  "sitemap_xml": "תוכן sitemap.xml מלא עם כתובת https://ai-finance-community.vercel.app/",
  "hebrew_seo_tips": [
    "7-5 המלצות SEO ספציפיות לאתר הזה בעברית"
  ],
  "content_suggestions": [
    "5 רעיונות לתוכן שיקדם את האתר אורגנית - כתרות מדויקות בעברית"
  ],
  "backlink_opportunities": [
    "4-3 הזדמנויות לקבלת קישורים נכנסים ממקורות ישראלים רלוונטיים"
  ]
}`
    }
  ]
});

let seoData;
try {
  const text = response.content[0].text.trim();
  // Remove markdown code block if present
  const jsonText = text.replace(/^```json\n?/, "").replace(/\n?```$/, "");
  seoData = JSON.parse(jsonText);
} catch (err) {
  console.error("❌ שגיאה בפענוח תגובת Claude:", err.message);
  console.error("תגובה גולמית:", response.content[0].text);
  process.exit(1);
}

// Save full report
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(
  path.join(outputDir, "seo-report.json"),
  JSON.stringify(seoData, null, 2),
  "utf-8"
);

// Update robots.txt
if (seoData.robots_txt) {
  fs.writeFileSync(path.join(publicDir, "robots.txt"), seoData.robots_txt, "utf-8");
  console.log("✅ robots.txt עודכן");
}

// Update sitemap.xml
if (seoData.sitemap_xml) {
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), seoData.sitemap_xml, "utf-8");
  console.log("✅ sitemap.xml עודכן");
}

// Print summary
console.log("\n📊 תוצאות הסוכן:\n");
console.log("📌 כותרת meta:", seoData.meta_title);
console.log("📝 תיאור meta:", seoData.meta_description);
console.log("\n🔑 מילות מפתח:", seoData.keywords?.join(", "));

console.log("\n💡 המלצות SEO:");
seoData.hebrew_seo_tips?.forEach((tip, i) => console.log(`  ${i + 1}. ${tip}`));

console.log("\n✍️  רעיונות תוכן לקידום אורגני:");
seoData.content_suggestions?.forEach((idea, i) => console.log(`  ${i + 1}. ${idea}`));

console.log("\n🔗 הזדמנויות לקישורים:");
seoData.backlink_opportunities?.forEach((opp, i) => console.log(`  ${i + 1}. ${opp}`));

console.log(`\n📁 דוח מלא נשמר ב: seo-agent/output/seo-report.json`);
console.log("\n⚠️  עדכן את ה-canonical URL ב-client/index.html לפי הדומיין הסופי שלך.");
