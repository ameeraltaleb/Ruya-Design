import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { Image as ImageIcon, Trash2 } from "lucide-react";

export interface ClientItem {
  id: number;
  url: string;
}

const DEFAULT_CLIENTS: string[] = [
  "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
  "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/0/08/Spotify_logo_without_text.svg",
];

enum OperationType {
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

export default function ClientsAdmin() {
  const [data, setData] = useState<ClientItem[]>(
    DEFAULT_CLIENTS.map((url, i) => ({ id: i, url })),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const docRef = doc(db, "settings", "clients");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const val = docSnap.data().value;
          if (val) {
            const parsed = JSON.parse(val);
            if (Array.isArray(parsed)) {
              if (typeof parsed[0] === "string") {
                setData(parsed.map((url, i) => ({ id: Date.now() + i, url })));
              } else {
                setData(parsed);
              }
            }
          }
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, "settings/clients");
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "clients"), {
        value: JSON.stringify(data),
        updatedAt: Date.now(),
      });
      alert("تم حفظ شعارات العملاء بنجاح");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "settings/clients");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (index: number, val: string) => {
    const newData = [...data];
    newData[index] = { ...newData[index], url: val };
    setData(newData);
  };

  const addItem = () => {
    setData((prev) => [...prev, { id: Date.now(), url: "" }]);
  };

  const removeItem = (index: number) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div dir="rtl" className="max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <ImageIcon className="w-8 h-8 text-ruya-yellow" />
        <h1 className="text-3xl font-bold">إعدادات العملاء (الشركاء)</h1>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            {data.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 border border-white/10 rounded-xl bg-white/5 flex gap-4 items-center"
              >
                <div className="flex-1">
                  <label className="text-xs text-gray-400 block mb-1">
                    رابط الشعار (URL)
                  </label>
                  <input
                    type="url"
                    value={item.url}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ruya-yellow text-left"
                    dir="ltr"
                    placeholder="https://..."
                  />
                  {item.url && (
                    <div className="mt-2 h-12 bg-white/10 rounded inline-flex p-2">
                      <img
                        src={item.url}
                        alt="معاينة"
                        className="h-full object-contain mix-blend-multiply"
                      />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="p-3 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-lg transition-colors mt-5 ml-2"
                  title="حذف"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm"
          >
            + إضافة شعار
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
