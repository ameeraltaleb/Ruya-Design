import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Save } from "lucide-react";
import { ContactInfo } from "../../lib/useContactInfo";

const DEFAULT_CONTACT_INFO: ContactInfo = {
  phone: "+90 530 899 51 85",
  email: "info@ruya.com",
  address: "الريحانية، هاتاي / تركيا",
  instagram: "#",
  facebook: "#",
  twitter: "#",
  whatsapp: "+90 530 899 51 85",
  footerText: "نقدم حلولاً إبداعية في عالم التصميم والطباعة، حيث نجمع بين الخبرة والابتكار لنضع علامتك التجارية في الصدارة.",
  workingHours: {
    weekdays: "9:00 ص - 6:00 م",
    saturday: "10:00 ص - 4:00 م",
    friday: "مغلق",
  },
};

export default function ContactAdmin() {
  const [formData, setFormData] = useState<ContactInfo>(DEFAULT_CONTACT_INFO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: docSnap, error } = await supabase.from("settings").select("value").eq("id", "contact_info").single();
        if (docSnap && docSnap.value) {
          try {
            const fetched = typeof docSnap.value === 'string' ? JSON.parse(docSnap.value) : docSnap.value;
            setFormData({ ...DEFAULT_CONTACT_INFO, ...fetched });
          } catch (e) {}
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase.from("settings").upsert({
        id: "contact_info",
        value: formData,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert("تم حفظ معلومات التواصل بنجاح");
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return <div className="text-white">جاري التحميل...</div>;
  }

  return (
    <div dir="rtl" className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">إعدادات التواصل</h1>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300">
                رقم الهاتف
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300">
                رقم الواتساب (بالصيغة الدولية)
              </label>
              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="+966500000000"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300">العنوان</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300">
                حساب إنستغرام
              </label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300">
                حساب تويتر (X)
              </label>
              <input
                type="text"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300">
                حساب فيسبوك
              </label>
              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow"
                dir="ltr"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-300">
                نص التذييل (الفوتر)
              </label>
              <textarea
                name="footerText"
                value={formData.footerText}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow h-24"
              />
            </div>

            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-bold text-ruya-yellow border-b border-white/10 pb-2">
                ساعات العمل
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">
                    الأحد - الخميس
                  </label>
                  <input
                    type="text"
                    value={formData.workingHours?.weekdays || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        workingHours: {
                          ...formData.workingHours,
                          weekdays: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">
                    السبت
                  </label>
                  <input
                    type="text"
                    value={formData.workingHours?.saturday || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        workingHours: {
                          ...formData.workingHours,
                          saturday: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300">
                    الجمعة
                  </label>
                  <input
                    type="text"
                    value={formData.workingHours?.friday || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        workingHours: {
                          ...formData.workingHours,
                          friday: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-ruya-yellow text-ruya-purple px-6 py-3 rounded-xl font-bold hover:bg-white transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
