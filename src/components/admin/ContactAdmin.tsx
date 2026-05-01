import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { Save } from "lucide-react";
import { ContactInfo } from "../../lib/useContactInfo";

enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const DEFAULT_CONTACT_INFO: ContactInfo = {
  phone: "+966 50 000 0000",
  email: "info@locospace.com",
  address: "الرياض، المملكة العربية السعودية",
  instagram: "#",
  facebook: "#",
  twitter: "#",
  whatsapp: "+966 50 000 0000",
};

export default function ContactAdmin() {
  const [formData, setFormData] = useState<ContactInfo>(DEFAULT_CONTACT_INFO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "settings", "contact_info");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().value) {
          try {
            const fetched = JSON.parse(docSnap.data().value);
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
      await setDoc(doc(db, "settings", "contact_info"), {
        value: JSON.stringify(formData),
        updatedAt: Date.now(),
      });
      alert("تم حفظ معلومات التواصل بنجاح");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "settings/contact_info");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
