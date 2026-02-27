import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { SiteContent } from "@/hooks/useContent";
import { Eye, EyeOff, Save, LogOut, Lock, ArrowRight, CheckCircle2, AlertCircle, Plus, Trash2, Upload, Image } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PASSWORD_STORAGE_KEY = "aif_admin_pw";

// ─── Small helper components ────────────────────────────────────────────────

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-slate-200 font-medium text-sm">{label}</Label>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      {children}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="bg-blue-950/60 border-blue-800/70 mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-blue-300 font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">{children}</CardContent>
    </Card>
  );
}

const inputClass =
  "bg-blue-900/40 border-blue-700/60 text-white placeholder:text-slate-600 focus:border-blue-400 focus:ring-blue-400/30 text-sm";

// ─── Image Uploader Component ────────────────────────────────────────────────
function ImageUploader({
  currentImage,
  onUpload,
  password,
  label = "תמונה",
}: {
  currentImage: string;
  onUpload: (url: string) => void;
  password: string;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("הקובץ גדול מדי (מקסימום 5MB)");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("password", password);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("שגיאה בהעלאה");
      const data = await res.json();
      if (data.url) {
        onUpload(data.url);
        toast.success("התמונה הועלתה בהצלחה!");
      }
    } catch {
      toast.error("שגיאה בהעלאת התמונה");
    }
    setUploading(false);
  };

  return (
    <div className="space-y-3">
      <Label className="text-slate-200 font-medium text-sm">{label}</Label>
      {currentImage && (
        <div className="relative w-24 h-24 bg-slate-900 rounded-lg overflow-hidden border border-blue-700/60">
          <img src={currentImage} alt="preview" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className={inputClass + " text-xs file:bg-blue-700 file:text-white file:border-0 file:rounded file:px-2 file:py-1 file:mr-2"}
        />
        {uploading && (
          <span className="flex items-center gap-1 text-xs text-blue-300">
            <span className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            מעלה...
          </span>
        )}
      </div>
      {currentImage && (
        <Input
          value={currentImage}
          onChange={(e) => onUpload(e.target.value)}
          className={inputClass + " text-xs"}
          dir="ltr"
          placeholder="/images/..."
        />
      )}
    </div>
  );
}

// ─── Deep clone helper ───────────────────────────────────────────────────────
function clone<T>(val: T): T {
  return JSON.parse(JSON.stringify(val));
}

// ─── Main Admin component ────────────────────────────────────────────────────
export default function Admin() {
  const [password, setPassword] = useState<string>(() => {
    try {
      return localStorage.getItem(PASSWORD_STORAGE_KEY) ?? "";
    } catch {
      return "";
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Load content from API
  const loadContent = useCallback(async () => {
    try {
      const res = await fetch("/api/content");
      if (!res.ok) throw new Error("API לא זמין");
      const data: SiteContent = await res.json();
      setContent(data);
      setLoadError(null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "שגיאה לא ידועה";
      setLoadError(msg);
    }
  }, []);

  // Try to log in
  const handleLogin = async () => {
    if (!password.trim()) {
      toast.error("יש להזין סיסמה");
      return;
    }
    setLoginLoading(true);
    try {
      // Verify the password works by trying a dry-run save of current content
      const getRes = await fetch("/api/content");
      if (!getRes.ok) throw new Error("השרת אינו זמין. ודא שהשרת פועל.");
      const data: SiteContent = await getRes.json();

      const testRes = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim(), content: data }),
      });

      if (testRes.status === 401) {
        toast.error("סיסמה שגויה. נסה שוב.");
        return;
      }
      if (!testRes.ok) throw new Error("שגיאה בחיבור לשרת");

      // Success
      try {
        localStorage.setItem(PASSWORD_STORAGE_KEY, password.trim());
      } catch {}
      setContent(data);
      setIsAuth(true);
      toast.success("ברוכים הבאים ללוח הבקרה!");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "שגיאה";
      toast.error(msg);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(PASSWORD_STORAGE_KEY);
    } catch {}
    setIsAuth(false);
    setContent(null);
    setPassword("");
  };

  // Save content to API
  const saveContent = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim(), content }),
      });
      if (res.status === 401) {
        toast.error("הסיסמה פגה. אנא התחבר מחדש.");
        handleLogout();
        return;
      }
      if (!res.ok) throw new Error("שגיאה בשמירה");
      toast.success("השינויים נשמרו בהצלחה!", { icon: <CheckCircle2 className="w-4 h-4 text-green-400" /> });
    } catch {
      toast.error("שגיאה בשמירת השינויים");
    } finally {
      setSaving(false);
    }
  };

  // Generic field updater using dot-path notation (e.g. "hero.headline")
  const set = (path: string, value: string) => {
    setContent((prev) => {
      if (!prev) return prev;
      const next = clone(prev);
      const keys = path.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let obj: any = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  // Array item updater for top-level arrays
  const setArr = (arrayKey: keyof SiteContent, index: number, field: string, value: string) => {
    setContent((prev) => {
      if (!prev) return prev;
      const next = clone(prev);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (next[arrayKey] as any)[index][field] = value;
      return next;
    });
  };

  // Expertise items (nested array inside team)
  const setExpertise = (memberIdx: number, expIdx: number, value: string) => {
    setContent((prev) => {
      if (!prev) return prev;
      const next = clone(prev);
      next.team[memberIdx].expertise[expIdx] = value;
      return next;
    });
  };

  // Add new expertise item
  const addExpertise = (memberIdx: number) => {
    setContent((prev) => {
      if (!prev) return prev;
      const next = clone(prev);
      next.team[memberIdx].expertise.push("");
      return next;
    });
  };

  // Remove expertise item
  const removeExpertise = (memberIdx: number, expIdx: number) => {
    setContent((prev) => {
      if (!prev) return prev;
      const next = clone(prev);
      next.team[memberIdx].expertise.splice(expIdx, 1);
      return next;
    });
  };

  // Add new item to array
  const addItem = (arrayKey: "team" | "services" | "clients" | "faq" | "gallery") => {
    setContent((prev) => {
      if (!prev) return prev;
      const next = clone(prev);
      const templates = {
        team: { name: "", title: "", bio: "", image: "", expertise: [""] },
        services: { iconKey: "trending", title: "", description: "" },
        clients: { name: "", description: "", logoUrl: "" },
        faq: { question: "", answer: "" },
        gallery: { src: "", alt: "" },
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (next[arrayKey] as any[]).push(templates[arrayKey]);
      return next;
    });
  };

  // Remove item from array
  const removeItem = (arrayKey: "team" | "services" | "clients" | "faq" | "gallery", index: number) => {
    setContent((prev) => {
      if (!prev) return prev;
      const next = clone(prev);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (next[arrayKey] as any[]).splice(index, 1);
      return next;
    });
  };

  // Refresh content when auth changes
  useEffect(() => {
    if (isAuth) loadContent();
  }, [isAuth, loadContent]);

  // ─── Login Screen ────────────────────────────────────────────────────────
  if (!isAuth) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center p-4"
        style={{ fontFamily: "'Rubik', sans-serif", direction: "rtl" }}
      >
        <div className="w-full max-w-sm">
          <Card className="bg-blue-950/80 border-blue-800/70 shadow-2xl shadow-blue-900/40">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-5">
                <div className="p-4 bg-blue-900/70 border border-blue-700/60 rounded-2xl">
                  <Lock className="w-8 h-8 text-blue-300" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">לוח בקרה</CardTitle>
              <p className="text-slate-400 text-sm mt-1">עריכת תוכן האתר</p>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <Field label="סיסמת מנהל">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !loginLoading && handleLogin()}
                    placeholder="הכנס סיסמה..."
                    className={inputClass + " pr-3 pl-10"}
                    dir="ltr"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>

              <Button
                onClick={handleLogin}
                disabled={loginLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-5 rounded-xl transition-all"
              >
                {loginLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    מתחבר...
                  </span>
                ) : (
                  "כניסה"
                )}
              </Button>

              <div className="bg-blue-900/30 border border-blue-800/50 rounded-xl p-4 text-xs text-slate-400 leading-relaxed space-y-1">
                <p className="flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-blue-400" />
                  <span>לוח הבקרה דורש שהשרת יפעל. בפיתוח: הפעל גם <code className="text-blue-300">pnpm dev:server</code></span>
                </p>
                <p className="flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-blue-400" />
                  <span>לשינוי הסיסמה: הגדר משתנה סביבה <code className="text-blue-300">ADMIN_PASSWORD</code></span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ─── Loading / Error state ───────────────────────────────────────────────
  if (!content) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center gap-4"
        style={{ fontFamily: "'Rubik', sans-serif" }}
      >
        {loadError ? (
          <div className="text-center">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 mb-4">{loadError}</p>
            <Button onClick={loadContent} variant="outline" className="border-blue-700 text-blue-300">
              נסה שוב
            </Button>
          </div>
        ) : (
          <>
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-blue-300">טוען תוכן...</p>
          </>
        )}
      </div>
    );
  }

  // ─── Admin Dashboard ─────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Rubik', sans-serif", direction: "rtl" }}
    >
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-blue-950/90 backdrop-blur-md border-b border-blue-800/70 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-blue-900 rounded-lg">
              <Lock className="w-4 h-4 text-blue-300" />
            </div>
            <span className="font-bold text-white text-sm">לוח בקרה · AI Finance</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={saveContent}
              disabled={saving}
              size="sm"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg px-4"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  שומר...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-3.5 h-3.5" />
                  שמור שינויים
                </span>
              )}
            </Button>
            <a
              href="/"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-300 transition-colors px-2 py-1.5 rounded-lg hover:bg-blue-900/40"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              חזרה לאתר
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-900/20"
              title="יציאה"
            >
              <LogOut className="w-3.5 h-3.5" />
              יציאה
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">עריכת תוכן האתר</h1>
          <p className="text-slate-400 text-sm">ערוך את הטקסטים, הכותרות והפרטים השונים. לחץ "שמור שינויים" כשתסיים.</p>
        </div>

        <Tabs defaultValue="hero" dir="rtl">
          <TabsList className="bg-blue-950/60 border border-blue-800/60 rounded-xl p-1 mb-8 flex-wrap h-auto gap-1">
            <TabsTrigger value="hero" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white text-slate-400 rounded-lg text-xs font-medium px-3 py-2">
              כותרת ראשית
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white text-slate-400 rounded-lg text-xs font-medium px-3 py-2">
              על הקהילה
            </TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white text-slate-400 rounded-lg text-xs font-medium px-3 py-2">
              הצוות
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white text-slate-400 rounded-lg text-xs font-medium px-3 py-2">
              שירותים
            </TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white text-slate-400 rounded-lg text-xs font-medium px-3 py-2">
              לקוחות
            </TabsTrigger>
            <TabsTrigger value="faq" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white text-slate-400 rounded-lg text-xs font-medium px-3 py-2">
              שאלות נפוצות
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white text-slate-400 rounded-lg text-xs font-medium px-3 py-2">
              גלריה
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white text-slate-400 rounded-lg text-xs font-medium px-3 py-2">
              יצירת קשר
            </TabsTrigger>
            <TabsTrigger value="cta" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white text-slate-400 rounded-lg text-xs font-medium px-3 py-2">
              קריאה לפעולה
            </TabsTrigger>
          </TabsList>

          {/* ── Hero Tab ──────────────────────────────────────────────── */}
          <TabsContent value="hero" className="focus-visible:outline-none">
            <SectionCard title="כותרת ראשית (Hero)">
              <Field label="כותרת ראשית" hint="הכותרת הגדולה שמופיעה ראשונה בדף">
                <Textarea
                  value={content.hero.headline}
                  onChange={(e) => set("hero.headline", e.target.value)}
                  className={inputClass}
                  rows={2}
                />
              </Field>
              <Field label="תת-כותרת" hint="הטקסט הקטן מתחת לכותרת">
                <Input
                  value={content.hero.subtext}
                  onChange={(e) => set("hero.subtext", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="תג-לשון (Tagline)" hint="הטקסט הקצר עם הנקודות (הרצאות • כלים • קהילה)">
                <Input
                  value={content.hero.subtagline}
                  onChange={(e) => set("hero.subtagline", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="קישור WhatsApp לקהילה" hint="הקישור לצירוף קבוצת הוואטסאפ">
                <Input
                  value={content.hero.whatsappUrl}
                  onChange={(e) => set("hero.whatsappUrl", e.target.value)}
                  className={inputClass}
                  dir="ltr"
                  placeholder="https://chat.whatsapp.com/..."
                />
              </Field>
              <Field label="קישור LinkedIn" hint="קישור לפרופיל הלינקדאין">
                <Input
                  value={content.hero.linkedinUrl}
                  onChange={(e) => set("hero.linkedinUrl", e.target.value)}
                  className={inputClass}
                  dir="ltr"
                  placeholder="https://www.linkedin.com/in/..."
                />
              </Field>
            </SectionCard>
          </TabsContent>

          {/* ── About Tab ─────────────────────────────────────────────── */}
          <TabsContent value="about" className="focus-visible:outline-none">
            <SectionCard title="על הקהילה">
              <Field label="תיאור הקהילה" hint="הפסקה הגדולה שמתארת את הקהילה">
                <Textarea
                  value={content.about.text}
                  onChange={(e) => set("about.text", e.target.value)}
                  className={inputClass}
                  rows={6}
                />
              </Field>
            </SectionCard>
          </TabsContent>

          {/* ── Team Tab ──────────────────────────────────────────────── */}
          <TabsContent value="team" className="focus-visible:outline-none">
            {content.team.map((member, idx) => (
              <SectionCard key={idx} title={`חבר צוות ${idx + 1}: ${member.name || "(חדש)"}`}>
                <Field label="שם מלא">
                  <Input
                    value={member.name}
                    onChange={(e) => setArr("team", idx, "name", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="תפקיד">
                  <Input
                    value={member.title}
                    onChange={(e) => setArr("team", idx, "title", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="ביוגרפיה">
                  <Textarea
                    value={member.bio}
                    onChange={(e) => setArr("team", idx, "bio", e.target.value)}
                    className={inputClass}
                    rows={3}
                  />
                </Field>
                <ImageUploader
                  currentImage={member.image}
                  onUpload={(url) => setArr("team", idx, "image", url)}
                  password={password}
                  label="תמונת פרופיל"
                />
                <div className="space-y-3">
                  <Label className="text-slate-200 font-medium text-sm">תחומי התמחות</Label>
                  {member.expertise.map((exp, expIdx) => (
                    <div key={expIdx} className="flex gap-2">
                      <Input
                        value={exp}
                        onChange={(e) => setExpertise(idx, expIdx, e.target.value)}
                        className={inputClass + " flex-1"}
                        placeholder={`התמחות ${expIdx + 1}`}
                      />
                      {member.expertise.length > 1 && (
                        <Button
                          onClick={() => removeExpertise(idx, expIdx)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 px-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    onClick={() => addExpertise(idx)}
                    variant="outline"
                    size="sm"
                    className="border-blue-700 text-blue-300 hover:bg-blue-900/40"
                  >
                    <Plus className="w-4 h-4 ml-1" /> הוסף התמחות
                  </Button>
                </div>
                <div className="pt-4 border-t border-blue-800/50">
                  <Button
                    onClick={() => removeItem("team", idx)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4 ml-1" /> מחק חבר צוות
                  </Button>
                </div>
              </SectionCard>
            ))}
            <Button
              onClick={() => addItem("team")}
              className="w-full bg-blue-800/50 hover:bg-blue-700/50 text-blue-200 border border-blue-700/60 rounded-xl py-6"
            >
              <Plus className="w-5 h-5 ml-2" /> הוסף חבר צוות חדש
            </Button>
          </TabsContent>

          {/* ── Services Tab ──────────────────────────────────────────── */}
          <TabsContent value="services" className="focus-visible:outline-none">
            {content.services.map((service, idx) => (
              <SectionCard key={idx} title={`שירות ${idx + 1}: ${service.title || "(חדש)"}`}>
                <Field label="כותרת השירות">
                  <Input
                    value={service.title}
                    onChange={(e) => setArr("services", idx, "title", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="תיאור השירות">
                  <Textarea
                    value={service.description}
                    onChange={(e) => setArr("services", idx, "description", e.target.value)}
                    className={inputClass}
                    rows={3}
                  />
                </Field>
                <Field label="אייקון" hint="בחר אייקון שמתאים לשירות">
                  <Select
                    value={service.iconKey}
                    onValueChange={(value) => setArr("services", idx, "iconKey", value)}
                  >
                    <SelectTrigger className={inputClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trending">מגמות (Trending)</SelectItem>
                      <SelectItem value="users">משתמשים (Users)</SelectItem>
                      <SelectItem value="message">הודעות (Message)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <div className="pt-4 border-t border-blue-800/50">
                  <Button
                    onClick={() => removeItem("services", idx)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4 ml-1" /> מחק שירות
                  </Button>
                </div>
              </SectionCard>
            ))}
            <Button
              onClick={() => addItem("services")}
              className="w-full bg-blue-800/50 hover:bg-blue-700/50 text-blue-200 border border-blue-700/60 rounded-xl py-6"
            >
              <Plus className="w-5 h-5 ml-2" /> הוסף שירות חדש
            </Button>
          </TabsContent>

          {/* ── Clients Tab ───────────────────────────────────────────── */}
          <TabsContent value="clients" className="focus-visible:outline-none">
            {content.clients.map((client, idx) => (
              <SectionCard key={idx} title={`לקוח ${idx + 1}: ${client.name || "(חדש)"}`}>
                <Field label="שם הלקוח / ארגון">
                  <Input
                    value={client.name}
                    onChange={(e) => setArr("clients", idx, "name", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="תיאור / עדות">
                  <Textarea
                    value={client.description}
                    onChange={(e) => setArr("clients", idx, "description", e.target.value)}
                    className={inputClass}
                    rows={3}
                  />
                </Field>
                <ImageUploader
                  currentImage={client.logoUrl}
                  onUpload={(url) => setArr("clients", idx, "logoUrl", url)}
                  password={password}
                  label="לוגו (אופציונלי)"
                />
                <div className="pt-4 border-t border-blue-800/50">
                  <Button
                    onClick={() => removeItem("clients", idx)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4 ml-1" /> מחק לקוח
                  </Button>
                </div>
              </SectionCard>
            ))}
            <Button
              onClick={() => addItem("clients")}
              className="w-full bg-blue-800/50 hover:bg-blue-700/50 text-blue-200 border border-blue-700/60 rounded-xl py-6"
            >
              <Plus className="w-5 h-5 ml-2" /> הוסף לקוח חדש
            </Button>
          </TabsContent>

          {/* ── FAQ Tab ───────────────────────────────────────────────── */}
          <TabsContent value="faq" className="focus-visible:outline-none">
            {content.faq.map((item, idx) => (
              <SectionCard key={idx} title={`שאלה ${idx + 1}: ${item.question.slice(0, 30) || "(חדשה)"}${item.question.length > 30 ? "..." : ""}`}>
                <Field label="שאלה">
                  <Input
                    value={item.question}
                    onChange={(e) => setArr("faq", idx, "question", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="תשובה">
                  <Textarea
                    value={item.answer}
                    onChange={(e) => setArr("faq", idx, "answer", e.target.value)}
                    className={inputClass}
                    rows={3}
                  />
                </Field>
                <div className="pt-4 border-t border-blue-800/50">
                  <Button
                    onClick={() => removeItem("faq", idx)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4 ml-1" /> מחק שאלה
                  </Button>
                </div>
              </SectionCard>
            ))}
            <Button
              onClick={() => addItem("faq")}
              className="w-full bg-blue-800/50 hover:bg-blue-700/50 text-blue-200 border border-blue-700/60 rounded-xl py-6"
            >
              <Plus className="w-5 h-5 ml-2" /> הוסף שאלה חדשה
            </Button>
          </TabsContent>

          {/* ── Gallery Tab ────────────────────────────────────────────── */}
          <TabsContent value="gallery" className="focus-visible:outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.gallery.map((image, idx) => (
                <Card key={idx} className="bg-blue-950/60 border-blue-800/70">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      {image.src ? (
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-24 h-24 object-cover rounded-lg border border-blue-700/60"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-blue-900/50 rounded-lg border border-blue-700/60 flex items-center justify-center">
                          <Image className="w-8 h-8 text-blue-600" />
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <Field label="תיאור התמונה">
                          <Input
                            value={image.alt}
                            onChange={(e) => setArr("gallery", idx, "alt", e.target.value)}
                            className={inputClass}
                            placeholder="תיאור התמונה לנגישות"
                          />
                        </Field>
                      </div>
                    </div>
                    <ImageUploader
                      currentImage={image.src}
                      onUpload={(url) => setArr("gallery", idx, "src", url)}
                      password={password}
                      label="תמונה"
                    />
                    <Button
                      onClick={() => removeItem("gallery", idx)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4 ml-1" /> מחק תמונה
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button
              onClick={() => addItem("gallery")}
              className="w-full mt-4 bg-blue-800/50 hover:bg-blue-700/50 text-blue-200 border border-blue-700/60 rounded-xl py-6"
            >
              <Plus className="w-5 h-5 ml-2" /> הוסף תמונה לגלריה
            </Button>
          </TabsContent>

          {/* ── Contact Tab ───────────────────────────────────────────── */}
          <TabsContent value="contact" className="focus-visible:outline-none">
            <SectionCard title="פרטי יצירת קשר">
              <Field label="כתובת אימייל">
                <Input
                  value={content.contact.email}
                  onChange={(e) => set("contact.email", e.target.value)}
                  className={inputClass}
                  type="email"
                  dir="ltr"
                  placeholder="name@example.com"
                />
              </Field>
              <Field label="קישור WhatsApp אישי" hint="למשלוח הודעה ישירה (wa.me/...)">
                <Input
                  value={content.contact.whatsappUrl}
                  onChange={(e) => set("contact.whatsappUrl", e.target.value)}
                  className={inputClass}
                  dir="ltr"
                  placeholder="https://wa.me/972..."
                />
              </Field>
              <Field label="קישור LinkedIn">
                <Input
                  value={content.contact.linkedinUrl}
                  onChange={(e) => set("contact.linkedinUrl", e.target.value)}
                  className={inputClass}
                  dir="ltr"
                  placeholder="https://www.linkedin.com/in/..."
                />
              </Field>
              <Field label="קישור Instagram">
                <Input
                  value={content.contact.instagramUrl}
                  onChange={(e) => set("contact.instagramUrl", e.target.value)}
                  className={inputClass}
                  dir="ltr"
                  placeholder="https://www.instagram.com/..."
                />
              </Field>
            </SectionCard>
          </TabsContent>

          {/* ── CTA Tab ───────────────────────────────────────────────── */}
          <TabsContent value="cta" className="focus-visible:outline-none">
            <SectionCard title="קריאה לפעולה (CTA)">
              <Field label="כותרת">
                <Input
                  value={content.cta.headline}
                  onChange={(e) => set("cta.headline", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="תת-כותרת">
                <Textarea
                  value={content.cta.subtext}
                  onChange={(e) => set("cta.subtext", e.target.value)}
                  className={inputClass}
                  rows={2}
                />
              </Field>
              <Field label="טקסט כפתור ראשי">
                <Input
                  value={content.cta.buttonText}
                  onChange={(e) => set("cta.buttonText", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="טקסט כפתור WhatsApp">
                <Input
                  value={content.cta.whatsappButtonText}
                  onChange={(e) => set("cta.whatsappButtonText", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </SectionCard>
          </TabsContent>
        </Tabs>

        {/* Bottom save button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={saveContent}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl px-8 py-5 text-base"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                שומר שינויים...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                שמור את כל השינויים
              </span>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
