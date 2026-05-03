import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { UploadCloud, Eye, EyeOff } from "lucide-react";
import {
  SectionsVisibility,
  DEFAULT_VISIBILITY,
} from "../../lib/useSectionsVisibility";

export default function SettingsAdmin() {
  const [logoUrl, setLogoUrl] = useState("");
  const [visibility, setVisibility] =
    useState<SectionsVisibility>(DEFAULT_VISIBILITY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingVisibility, setSavingVisibility] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data: logoDoc } = await supabase.from("settings").select("value").eq("id", "logo").single();
        if (logoDoc && logoDoc.value) {
          setLogoUrl(typeof logoDoc.value === 'string' ? logoDoc.value : String(logoDoc.value));
        }

        const { data: visDoc } = await supabase.from("settings").select("value").eq("id", "sections_visibility").single();
        if (visDoc && visDoc.value) {
          const fetched = typeof visDoc.value === 'string' ? JSON.parse(visDoc.value) : visDoc.value;
          setVisibility({ ...DEFAULT_VISIBILITY, ...fetched });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from("settings").upsert({
        id: "logo",
        value: logoUrl,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert("تم حفظ الشعار بنجاح");
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveVisibility = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingVisibility(true);
    try {
      const { error } = await supabase.from("settings").upsert({
        id: "sections_visibility",
        value: visibility,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert("تم حفظ إعدادات الأقسام بنجاح");
    } catch (error) {
      console.error(error);
    } finally {
      setSavingVisibility(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      alert("حجم الصورة كبير جداً. الحد الأقصى هو 500 كيلوبايت.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setLogoUrl(base64String);
    };
    reader.readAsDataURL(file);
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div dir="rtl" className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">الإعدادات العامة</h1>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
        <form onSubmit={handleSaveLogo} className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">شعار الموقع</h2>

            <label className="block text-sm font-medium text-gray-300 mb-2">
              رابط الشعار (URL) أو نص الشعار
            </label>
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="رؤيا للتصميم أو https://example.com/logo.png"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow mb-6 text-left"
              dir="auto"
            />

            <label className="block text-sm font-medium text-gray-300 mb-2 mt-4 text-center">
              أو
            </label>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              رفع صورة بصيغة PNG أو SVG
            </label>

            <input
              type="file"
              accept="image/png, image/svg+xml, image/jpeg, image/webp"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl transition-colors shrink-0"
              >
                <UploadCloud className="w-5 h-5" />
                <span>اختر صورة</span>
              </button>

              <div className="flex-1 text-sm text-gray-400">
                الحد الأقصى للحجم: 500KB
              </div>
            </div>

            {logoUrl && (
              <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-xl inline-block relative group min-w-[200px]">
                <p className="text-sm text-gray-400 mb-2">معاينة:</p>
                {logoUrl.startsWith("http") ||
                logoUrl.startsWith("data:image") ||
                logoUrl.startsWith("/") ? (
                  <img
                    src={logoUrl}
                    alt="Logo Preview"
                    className="h-16 w-auto object-contain bg-white/5 p-2 rounded"
                  />
                ) : (
                  <div className="h-16 flex items-center justify-center p-2 rounded bg-white/5">
                    <span className="text-2xl font-extrabold text-white tracking-wider font-sans">
                      {logoUrl}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setLogoUrl("");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-2 left-2 bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="إزالة الشعار"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-ruya-yellow text-ruya-bg hover:bg-yellow-400 font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
          >
            {saving ? "جاري الحفظ..." : "حفظ الشعار"}
          </button>
        </form>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <form onSubmit={handleSaveVisibility} className="space-y-6">
          <h2 className="text-xl font-bold mb-4">إظهار / إخفاء الأقسام</h2>
          <p className="text-gray-400 text-sm mb-6">
            يمكنك من هنا التحكم في ظهور أقسام الموقع الرئيسية للزوار.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "hero", label: "الواجهة الرئيسية" },
              { key: "about", label: "من نحن" },
              { key: "services", label: "خدماتنا" },
              { key: "stats", label: "الإحصائيات" },
              { key: "portfolio", label: "أعمالنا" },
              { key: "testimonials", label: "آراء العملاء" },
              { key: "contact", label: "تواصل معنا" },
            ].map((section) => (
              <div
                key={section.key}
                className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5"
              >
                <span className="text-white font-medium">{section.label}</span>
                <button
                  type="button"
                  onClick={() =>
                    setVisibility({
                      ...visibility,
                      [section.key]:
                        !visibility[section.key as keyof SectionsVisibility],
                    })
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-bold text-sm ${
                    visibility[section.key as keyof SectionsVisibility]
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  }`}
                >
                  {visibility[section.key as keyof SectionsVisibility] ? (
                    <>
                      <Eye className="w-4 h-4" />
                      <span>ظاهر</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4" />
                      <span>مخفي</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={savingVisibility}
            className="bg-ruya-yellow text-ruya-bg hover:bg-yellow-400 font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 mt-4"
          >
            {savingVisibility ? "جاري الحفظ..." : "حفظ الأقسام"}
          </button>
        </form>
      </div>
    </div>
  );
}
