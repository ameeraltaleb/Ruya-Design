import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Monitor } from "lucide-react";

interface HeroData {
  subtitle: string;
  title_prefix: string;
  title_highlight: string;
  slogan: string;
  description: string;
  button1_text: string;
  button2_text: string;
  image_url: string;
}

const DEFAULT_HERO: HeroData = {
  subtitle: "وكالة إبداعية متكاملة",
  title_prefix: "رؤية",
  title_highlight: "للتصميم",
  slogan: "New World, New Thinking ...",
  description:
    "نحن نصمم المستقبل بهوية بصرية قوية وحلول طباعية مبتكرة. فريقنا يجمع بين الفن والتكنولوجيا لتقديم تجربة لا تُنسى لعلامتك التجارية.",
  button1_text: "استعرض أعمالنا",
  button2_text: "احصل على استشارة",
  image_url:
    "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1000",
};

export default function HeroAdmin() {
  const [data, setData] = useState<HeroData>(DEFAULT_HERO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const { data: docSnap, error } = await supabase.from("settings").select("value").eq("id", "hero").single();
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
    fetchHero();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from("settings").upsert({
        id: "hero",
        value: data,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert("تم حفظ إعدادات الواجهة بنجاح");
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div dir="rtl" className="max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Monitor className="w-8 h-8 text-ruya-yellow" />
        <h1 className="text-3xl font-bold">إعدادات الواجهة الرئيسية</h1>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                العنوان الصغير (أعلى)
              </label>
              <input
                type="text"
                name="subtitle"
                value={data.subtitle}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                الشعار اللفظي (Slogan)
              </label>
              <input
                type="text"
                name="slogan"
                value={data.slogan}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow text-left"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                الكلمة الأولى من العنوان (اللون البنفسجي)
              </label>
              <input
                type="text"
                name="title_prefix"
                value={data.title_prefix}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                الكلمة البارزة (اللون الأصفر)
              </label>
              <input
                type="text"
                name="title_highlight"
                value={data.title_highlight}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              الوصف النصي
            </label>
            <textarea
              name="description"
              rows={3}
              value={data.description}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 border-t border-white/10 pt-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                نص الزر الأساسي (أعمالنا)
              </label>
              <input
                type="text"
                name="button1_text"
                value={data.button1_text}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                نص الزر الثانوي (استشارة)
              </label>
              <input
                type="text"
                name="button2_text"
                value={data.button2_text}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow"
              />
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              رابط صورة الواجهة (URL)
            </label>
            <input
              type="url"
              name="image_url"
              value={data.image_url}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow text-left"
              dir="ltr"
              placeholder="https://..."
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
