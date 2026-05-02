import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Save, Plus, Trash2 } from "lucide-react";
import { ContactInfo, LocationInfo } from "../../lib/useContactInfo";

const DEFAULT_CONTACT_INFO: ContactInfo = {
  phone: "+90 530 899 51 85",
  locations: [
    { name: "الفرع الرئيسي", address: "الريحانية، هاتاي / تركيا" }
  ],
  instagram: "#",
  facebook: "#",
  twitter: "#",
  whatsapp: "+90 530 899 51 85",
  footerText: "نقدم حلولاً إبداعية في عالم التصميم والطباعة، حيث نجمع بين الخبرة والابتكار لنضع علامتك التجارية في الصدارة.",
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

  const handleAddLocation = () => {
    setFormData({
      ...formData,
      locations: [...(formData.locations || []), { name: "", address: "" }],
    });
  };

  const handleLocationChange = (index: number, field: keyof LocationInfo, value: string) => {
    const updatedLocations = [...(formData.locations || [])];
    updatedLocations[index] = { ...updatedLocations[index], [field]: value };
    setFormData({ ...formData, locations: updatedLocations });
  };

  const handleRemoveLocation = (index: number) => {
    const updatedLocations = [...(formData.locations || [])];
    updatedLocations.splice(index, 1);
    setFormData({ ...formData, locations: updatedLocations });
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

            <div className="space-y-4 md:col-span-2">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <h3 className="text-lg font-bold text-ruya-yellow">المواقع والفروع</h3>
                <button
                  type="button"
                  onClick={handleAddLocation}
                  className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  إضافة فرع جديد
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.locations?.map((loc, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-4 bg-white/5 p-4 rounded-xl border border-white/5 relative">
                    <div className="flex-1 space-y-2">
                      <label className="text-sm font-bold text-gray-300">المدينة أو اسم الفرع</label>
                      <input
                        type="text"
                        value={loc.name}
                        onChange={(e) => handleLocationChange(index, 'name', e.target.value)}
                        placeholder="مثل: اسطنبول أو الفرع الرئيسي"
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-ruya-yellow"
                      />
                    </div>
                    <div className="flex-[2] space-y-2">
                      <label className="text-sm font-bold text-gray-300">العنوان التفصيلي</label>
                      <input
                        type="text"
                        value={loc.address}
                        onChange={(e) => handleLocationChange(index, 'address', e.target.value)}
                        placeholder="العنوان الكامل للفرع"
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-ruya-yellow"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLocation(index)}
                      className="absolute top-4 left-4 md:static md:mt-8 p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                      title="حذف الفرع"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                {(!formData.locations || formData.locations.length === 0) && (
                  <p className="text-gray-400 text-sm italic">لم يتم إضافة أي فروق، يرجى إضافة فرع واحد على الأقل.</p>
                )}
              </div>
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
