# Homepage Copy Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** לחדד את הטקסטים בדף הבית כך שיהיו מקצועיים ומכירתיים יותר, תוך שמירת העובדות, המבנה והאמינות הקיימים והסרת מקפים ארוכים.

**Architecture:** טקסטי דף הבית מגיעים משני מקורות קיימים: `client/public/content.json` עבור תוכן דינמי ו־`client/src/pages/Home.tsx` עבור טקסטים קבועים. תחילה יוכן נוסח מלא לאישור במסמך תוכן נפרד; רק לאחר אישורו יועתק למקורות הקיימים ללא שינוי במבנה הרכיבים.

**Tech Stack:** React, TypeScript, Vite, JSON, Markdown

---

### Task 1: הכנת נוסח מלא לאישור

**Files:**
- Create: `content/site-copy/15-homepage-balanced-sales-copy.md`
- Reference: `client/public/content.json`
- Reference: `client/src/pages/Home.tsx`
- Reference: `docs/superpowers/specs/2026-08-10-homepage-copy-refinement-design.md`

- [ ] **Step 1: למפות את כל אזורי התוכן בדף הבית**

לרכז במסמך החדש, לפי סדר ההופעה בעמוד, את אזור הפתיחה, ההיכרות, הערך, הצוות, השירותים, הארגונים, הגלריה, השאלות הנפוצות, הקריאה לפעולה והכותרת התחתונה.

- [ ] **Step 2: לכתוב נוסח מלא לכל אזור**

לשמור על הטון המקצועי הקיים, לחזק את התועלת והבידול, לקצר חזרות ולהימנע מהוספת טענות או נתונים חדשים. כל CTA במסמך יציין במפורש את הנוסח המוצע ואת היעד הקיים שלו.

- [ ] **Step 3: לבדוק שאין מקפים ארוכים בנוסח**

Run:

```bash
rg -n '—' content/site-copy/15-homepage-balanced-sales-copy.md
```

Expected: no matches.

- [ ] **Step 4: להציג את הנוסח למשתמש ולא להטמיע לפני אישורו**

האישור נדרש על המסמך המלא. אם מתקבלות הערות, יש לעדכן את המסמך ולבצע שוב את בדיקת המקפים.

- [ ] **Step 5: לתעד את הנוסח המאושר**

```bash
git add content/site-copy/15-homepage-balanced-sales-copy.md
git commit -m "content: draft balanced homepage sales copy"
```

### Task 2: הטמעת הטקסטים הדינמיים

**Files:**
- Modify: `client/public/content.json`
- Reference: `content/site-copy/15-homepage-balanced-sales-copy.md`

- [ ] **Step 1: לעדכן את אזורי התוכן הדינמיים**

להעתיק מהמסמך המאושר את הטקסטים המתאימים לשדות `hero`, `about`, `team`, `services`, `clients`, `faq` ו־`cta`. אין לשנות כתובות, תמונות, שמות שדות או מבנה JSON.

- [ ] **Step 2: לאמת את קובץ ה־JSON**

Run:

```bash
node -e "JSON.parse(require('fs').readFileSync('client/public/content.json', 'utf8')); console.log('content.json valid')"
```

Expected: `content.json valid`.

- [ ] **Step 3: לבדוק שאין מקפים ארוכים בשדות שנערכו**

Run:

```bash
rg -n '—' client/public/content.json
```

Expected: no matches בתוך תוכן דף הבית שנערך.

### Task 3: הטמעת הטקסטים הקבועים

**Files:**
- Modify: `client/src/pages/Home.tsx`
- Reference: `content/site-copy/15-homepage-balanced-sales-copy.md`

- [ ] **Step 1: לעדכן את הטקסטים הקבועים בדף**

להעתיק מהמסמך המאושר את הכותרות, כותרות המשנה, עקרונות הערך, תוויות הכפתורים, טקסטי הגלריה והכותרת התחתונה. אין לשנות JSX, מחלקות CSS, קישורים או התנהגות רכיבים.

- [ ] **Step 2: לבדוק שאין מקפים ארוכים בטקסט המוצג**

Run:

```bash
rg -n '—' client/src/pages/Home.tsx client/public/content.json
```

Expected: no matches בטקסטים המוצגים בדף הבית. מקפים שמופיעים בהערות קוד בלבד אינם חלק מהתוכן.

### Task 4: אימות ובקרת איכות

**Files:**
- Verify: `client/src/pages/Home.tsx`
- Verify: `client/public/content.json`

- [ ] **Step 1: להריץ בדיקת טיפוסים או בנייה לפי סקריפטי הפרויקט**

Run:

```bash
pnpm run check
```

Expected: exit code 0 וללא שגיאות TypeScript.

- [ ] **Step 2: לבדוק את השינויים מול המפרט**

לוודא שהמסר המרכזי ברור באזור הפתיחה, שהטון נשאר מקצועי, שכל CTA מתאר פעולה ברורה ושלא נוספו הבטחות או נתונים חדשים.

- [ ] **Step 3: לבדוק את ה־diff**

Run:

```bash
git diff --check
git diff -- client/src/pages/Home.tsx client/public/content.json
```

Expected: no whitespace errors; diff limited to approved copy changes.

- [ ] **Step 4: לתעד את ההטמעה**

```bash
git add client/src/pages/Home.tsx client/public/content.json
git commit -m "content: refine homepage sales messaging"
```
