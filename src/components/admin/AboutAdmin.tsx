import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { User, UploadCloud } from "lucide-react";

interface AboutData {
  title: string;
  description: string;
  features: string[];
  image_url: string;
}

const DEFAULT_ABOUT: AboutData = {
  title: "من نحن؟",
  description:
    'نحن في "رؤيا" للتصميم والطباعة لسنا مجرد وكالة دعاية وإعلان، بل نحن شركاء نجاحك. نؤمن بأن كل علامة تجارية لها قصة فريدة تستحق أن تُروى بأفضل صورة ممكنة. نجمع بين الإبداع الفني والخبرة التقنية لنقدم لك حلولاً متكاملة تبرز هوية مشروعك.',
  features: [
    "فريق عمل مبدع ومحترف",
    "أحدث تقنيات الطباعة",
    "الالتزام بالمواعيد",
    "أسعار تنافسية",
    "جودة عالية في التنفيذ",
    "خدمة عملاء متميزة",
  ],
  image_url:
    "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=2194&auto=format&fit=crop",
};

export default function AboutAdmin() {
  const [data, setData] = useState<AboutData>(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const { data: docSnap, error } = await supabase.from("settings").select("value").eq("id", "about").single();
        if (docSnap && docSnap.value) {
          const val = typeof docSnap.value === 'string' ? JSON.parse(docSnap.value) : docSnap.value;
          setData(val);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from("settings").upsert({
        id: "about",
        value: data,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert("تم حفظ إعدادات القسم بنجاح");
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleFeatureChange = (index: number, val: string) => {
    const newFeatures = [...data.features];
    newFeatures[index] = val;
    setData((prev) => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const removeFeature = (index: number) => {
    const newFeatures = data.features.filter((_, i) => i !== index);
    setData((prev) => ({ ...prev, features: newFeatures }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("حجم الصورة كبير جداً. الحد الأقصى هو 2 ميجابايت.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setData(prev => ({ ...prev, image_url: base64String }));
    };
    reader.readAsDataURL(file);
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div dir="rtl" className="max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <User className="w-8 h-8 text-ruya-yellow" />
        <h1 className="text-3xl font-bold">إعدادات قسم (من نحن)</h1>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              العنوان
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              الوصف
            </label>
            <textarea
              rows={4}
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow resize-none"
            />
          </div>

          <div className="border-t border-white/10 pt-6">
            <label className="block text-sm font-medium text-gray-300 mb-4">
              المميزات
            </label>
            <div className="space-y-3">
              {data.features.map((feature, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(idx, e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-ruya-yellow"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="px-4 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-xl transition-colors"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addFeature}
              className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm"
            >
              + إضافة ميزة
            </button>
          </div>

          <div className="border-t border-white/10 pt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              صورة القسم
            </label>
            
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />

            <div className="flex items-center gap-4 mb-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl transition-colors shrink-0"
              >
                <UploadCloud className="w-5 h-5" />
                <span>اختر صورة</span>
              </button>

              <div className="flex-1 text-sm text-gray-400">
                الحد الأقصى للحجم: 2MB
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-2">أو أدخل رابط الصورة (URL):</p>
            <input
              type="url"
              value={data.image_url}
              onChange={(e) => setData({ ...data, image_url: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow text-left"
              dir="ltr"
            />
            {data.image_url && (
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">معاينة الصورة:</p>
                <img
                  src={data.image_url}
                  alt="Preview"
                  className="h-48 rounded-xl object-cover"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-ruya-yellow text-ruya-bg hover:bg-yellow-400 font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 mt-4"
          >
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </form>
      </div>
    </div>
  );
}
