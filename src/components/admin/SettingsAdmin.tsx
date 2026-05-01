import { useState, useEffect, useRef } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { UploadCloud } from "lucide-react";

enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}
function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: { userId: auth.currentUser?.uid },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function SettingsAdmin() {
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "logo");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLogoUrl(docSnap.data().value || "");
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, "settings/logo");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "logo"), {
        value: logoUrl,
        updatedAt: Date.now(),
      });
      alert("تم الحفظ بنجاح");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "settings/logo");
    } finally {
      setSaving(false);
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

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              شعار الموقع (صورة بصيغة PNG أو SVG)
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
              <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-xl inline-block relative group">
                <p className="text-sm text-gray-400 mb-2">معاينة:</p>
                <img
                  src={logoUrl}
                  alt="Logo Preview"
                  className="h-16 w-auto object-contain bg-white/5 p-2 rounded"
                />
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
            {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
          </button>
        </form>
      </div>
    </div>
  );
}
