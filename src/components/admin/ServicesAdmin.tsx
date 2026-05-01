import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Palette,
  Printer,
  Briefcase,
  Layout,
  Video,
  Monitor,
  Store,
  PenTool,
  Search,
} from "lucide-react";

const AVAILABLE_ICONS = [
  { id: "Palette", icon: Palette, label: "تصميم جرافيك" },
  { id: "Printer", icon: Printer, label: "طباعة" },
  { id: "Briefcase", icon: Briefcase, label: "هوية تجارية" },
  { id: "Layout", icon: Layout, label: "تصميم ويب" },
  { id: "Video", icon: Video, label: "مونتاج وفيديو" },
  { id: "Monitor", icon: Monitor, label: "تطبيقات" },
  { id: "Store", icon: Store, label: "متاجر إلكترونية" },
  { id: "PenTool", icon: PenTool, label: "رسم رقمي" },
  { id: "Search", icon: Search, label: "تسويق" },
];

interface Service {
  id: string;
  title: string;
  icon: string;
  description: string;
  createdAt?: number;
}

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

export default function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Palette");

  useEffect(() => {
    const q = collection(db, "services");
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const srvs: Service[] = [];
        snapshot.forEach((doc) => {
          srvs.push({ id: doc.id, ...doc.data() } as Service);
        });
        srvs.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        setServices(srvs);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "services");
      },
    );

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const ts = Date.now();
      if (editingId) {
        const oldSrv = services.find((s) => s.id === editingId);
        await updateDoc(doc(db, "services", editingId), {
          title,
          description,
          icon,
          createdAt: oldSrv?.createdAt || ts,
        });
      } else {
        await addDoc(collection(db, "services"), {
          title,
          description,
          icon,
          createdAt: ts,
        });
      }
      closeModal();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "services");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الخدمة؟")) {
      try {
        await deleteDoc(doc(db, "services", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `services/${id}`);
      }
    }
  };

  const openEdit = (s: Service) => {
    setTitle(s.title);
    setDescription(s.description);
    setIcon(s.icon);
    setEditingId(s.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setTitle("");
    setDescription("");
    setIcon("Palette");
    setEditingId(null);
    setIsModalOpen(false);
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">الخدمات</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-ruya-yellow text-ruya-bg px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-yellow-400 transition-colors w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          إضافة خدمة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length === 0 ? (
          <p className="text-gray-400 col-span-3">
            لا يوجد خدمات مضافة حالياً.
          </p>
        ) : (
          services.map((s) => {
            const IconComponent =
              AVAILABLE_ICONS.find((i) => i.id === s.icon)?.icon || Palette;
            return (
              <div
                key={s.id}
                className="bg-white/5 border border-white/10 rounded-xl p-6 group relative"
              >
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-ruya-yellow">
                  <IconComponent size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {s.description}
                </p>
                <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
                  <button
                    onClick={() => openEdit(s)}
                    className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-2 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-ruya-purple border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[95vh]">
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-white/10 shrink-0">
              <h2 className="text-lg md:text-xl font-bold text-white">
                {editingId ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 md:p-6 custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    عنوان الخدمة
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    وصف الخدمة
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    الأيقونة
                  </label>
                  <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-2">
                    {AVAILABLE_ICONS.map((i) => {
                      const IconComp = i.icon;
                      return (
                        <button
                          key={i.id}
                          type="button"
                          onClick={() => setIcon(i.id)}
                          className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${
                            icon === i.id
                              ? "border-ruya-yellow bg-ruya-yellow/10 text-ruya-yellow"
                              : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"
                          }`}
                        >
                          <IconComp size={24} />
                          <span className="text-[10px] font-bold text-center">{i.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 md:px-6 py-2 rounded-xl text-gray-300 hover:bg-white/5 transition-colors text-sm md:text-base"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 md:px-6 py-2 bg-ruya-yellow text-ruya-bg font-bold rounded-xl hover:bg-yellow-400 transition-colors text-sm md:text-base"
                  >
                    {editingId ? "حفظ التعديلات" : "إضافة"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
