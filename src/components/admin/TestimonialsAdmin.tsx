import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { MessageCircle, Trash2 } from "lucide-react";

export interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 1,
    name: "أحمد محمد",
    role: "المدير التنفيذي لشركة التقنية",
    content:
      "تعاملنا مع رؤيا للتصميم كان من أفضل القرارات التي اتخذناها. احترافية في العمل وسرعة في التسليم وتصاميم فاقت توقعاتنا.",
    rating: 5,
  },
  {
    id: 2,
    name: "سارة خالد",
    role: "صاحبة متجر إلكتروني",
    content:
      "فريق مبدع جداً، فهموا فكرتي بسرعة وقدموا لي هوية بصرية مذهلة ساعدت في زيادة مبيعاتي بشكل ملحوظ.",
    rating: 5,
  },
  {
    id: 3,
    name: "عمر عبدالله",
    role: "مدير تسويق",
    content:
      "جودة المطبوعات لديهم لا يُعلى عليها. دقة في الألوان واهتمام بأدق التفاصيل. أنصح بالتعامل معهم بشدة.",
    rating: 5,
  },
];

export default function TestimonialsAdmin() {
  const [data, setData] = useState<TestimonialItem[]>(DEFAULT_TESTIMONIALS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data: docSnap, error } = await supabase.from("settings").select("value").eq("id", "testimonials").single();
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
    fetchTestimonials();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from("settings").upsert({
        id: "testimonials",
        value: data,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert("تم حفظ آراء العملاء بنجاح");
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    index: number,
    field: keyof TestimonialItem,
    val: string | number,
  ) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: val };
    setData(newData);
  };

  const addItem = () => {
    setData((prev) => [
      ...prev,
      { id: Date.now(), name: "", role: "", content: "", rating: 5 },
    ]);
  };

  const removeItem = (index: number) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div dir="rtl" className="max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle className="w-8 h-8 text-ruya-yellow" />
        <h1 className="text-3xl font-bold">إعدادات آراء العملاء</h1>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            {data.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 border border-white/10 rounded-xl bg-white/5 relative"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">
                      اسم العميل
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleChange(idx, "name", e.target.value)
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ruya-yellow"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">
                      الصفة أو العمل
                    </label>
                    <input
                      type="text"
                      value={item.role}
                      onChange={(e) =>
                        handleChange(idx, "role", e.target.value)
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ruya-yellow"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    النص
                  </label>
                  <textarea
                    rows={2}
                    value={item.content}
                    onChange={(e) =>
                      handleChange(idx, "content", e.target.value)
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ruya-yellow resize-none"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-400 block">
                      التقييم (1-5)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={item.rating}
                      onChange={(e) =>
                        handleChange(idx, "rating", parseInt(e.target.value))
                      }
                      className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-ruya-yellow"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-lg transition-colors text-sm"
                  >
                    <Trash2 size={16} />
                    حذف الرأي
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm"
          >
            + إضافة رأي
          </button>

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
