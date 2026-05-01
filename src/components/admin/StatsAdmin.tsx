import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { Activity } from "lucide-react";
import * as LucideIcons from "lucide-react";

export interface StatItem {
  id: number;
  name: string;
  value: string;
  iconName: string;
}

const DEFAULT_STATS: StatItem[] = [
  { id: 1, name: "عميل سعيد", value: "+500", iconName: "Users" },
  { id: 2, name: "مشروع مكتمل", value: "+1200", iconName: "Briefcase" },
  { id: 3, name: "سنوات الخبرة", value: "+10", iconName: "Clock" },
  { id: 4, name: "جائزة إبداعية", value: "25", iconName: "Award" },
];

enum OperationType {
  GET = "get",
  WRITE = "write",
}

function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
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

export default function StatsAdmin() {
  const [data, setData] = useState<StatItem[]>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const docRef = doc(db, "settings", "stats");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const val = docSnap.data().value;
          if (val) {
            setData(JSON.parse(val));
          }
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, "settings/stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "stats"), {
        value: JSON.stringify(data),
        updatedAt: Date.now(),
      });
      alert("تم حفظ قسم الإحصائيات بنجاح");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "settings/stats");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (index: number, field: keyof StatItem, val: string) => {
    const newStats = [...data];
    newStats[index] = { ...newStats[index], [field]: val };
    setData(newStats);
  };

  const addStat = () => {
    setData((prev) => [
      ...prev,
      { id: Date.now(), name: "عنوان جديد", value: "0", iconName: "Star" },
    ]);
  };

  const removeStat = (index: number) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div dir="rtl" className="max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Activity className="w-8 h-8 text-ruya-yellow" />
        <h1 className="text-3xl font-bold">إعدادات الإحصائيات</h1>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            {data.map((stat, idx) => {
              const IconComp = (LucideIcons as any)[stat.iconName] || LucideIcons.Star;
              return (
                <div key={stat.id} className="p-4 border border-white/10 rounded-xl bg-white/5 flex gap-4 items-center">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">الرقم (القيمة)</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => handleChange(idx, "value", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ruya-yellow"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">العنوان</label>
                      <input
                        type="text"
                        value={stat.name}
                        onChange={(e) => handleChange(idx, "name", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ruya-yellow"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">اسم الأيقونة (Lucide)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={stat.iconName}
                          onChange={(e) => handleChange(idx, "iconName", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ruya-yellow text-left"
                          dir="ltr"
                        />
                        <IconComp className="w-6 h-6 text-ruya-yellow shrink-0" />
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStat(idx)}
                    className="p-3 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-lg transition-colors mt-5 ml-2"
                    title="حذف"
                  >
                    <LucideIcons.Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={addStat}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm"
          >
            + إضافة إحصائية
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
