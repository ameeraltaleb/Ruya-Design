import { useState, useEffect, useRef } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "../../lib/firebase";
import { Plus, Trash2, Edit2, X, Upload } from "lucide-react";

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
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

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = collection(db, "projects");
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const projs: Project[] = [];
        snapshot.forEach((doc) => {
          projs.push({ id: doc.id, ...doc.data() } as Project);
        });
        // Sort by createdAt desc locally
        projs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setProjects(projs);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "projects");
      },
    );

    return () => unsubscribe();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      // Clear URL input if file is selected
      setImage("");
    }
  };

  const uploadImageIfSelected = async (): Promise<string> => {
    if (!imageFile) return image; // return existing URL if no file

    const fileRef = ref(storage, `portfolio/${Date.now()}_${imageFile.name}`);
    await uploadBytes(fileRef, imageFile);
    return await getDownloadURL(fileRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image && !imageFile && !editingId) {
      alert("الرجاء إضافة صورة أو رابط الصورة!");
      return;
    }
    
    try {
      setIsUploading(true);
      const finalImageUrl = await uploadImageIfSelected();

      const ts = Date.now();
      if (editingId) {
        const oldProj = projects.find((p) => p.id === editingId);
        await updateDoc(doc(db, "projects", editingId), {
          title,
          category,
          image: finalImageUrl || oldProj?.image,
          createdAt: oldProj?.createdAt || ts,
        });
      } else {
        await addDoc(collection(db, "projects"), {
          title,
          category,
          image: finalImageUrl,
          createdAt: ts,
        });
      }
      closeModal();
    } catch (error) {
      alert("حدث خطأ أثناء حفظ البيانات: " + (error instanceof Error ? error.message : ""));
      handleFirestoreError(error, OperationType.WRITE, "projects");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا العمل؟")) {
      try {
        await deleteDoc(doc(db, "projects", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
      }
    }
  };

  const openEdit = (p: Project) => {
    setTitle(p.title);
    setCategory(p.category);
    setImage(p.image);
    setImageFile(null);
    setEditingId(p.id);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setTitle("");
    setCategory("");
    setImage("");
    setImageFile(null);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsModalOpen(false);
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">إدارة الأعمال</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-ruya-yellow text-ruya-bg px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-yellow-400 transition-colors w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5 shrink-0" />
          إضافة عمل جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group"
          >
            <img
              src={p.image}
              alt={p.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <span className="text-ruya-yellow text-sm font-medium block mb-2">
                {p.category}
              </span>
              <h3 className="text-lg font-bold text-white mb-4">{p.title}</h3>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => openEdit(p)}
                  className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-2 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-ruya-purple border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">
                {editingId ? "تعديل العمل" : "إضافة عمل جديد"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  عنوان العمل
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
                  التصنيف
                </label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow"
                  placeholder="مثال: تصميم، طباعة، هوية بصرية"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  صورة العمل
                </label>
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center justify-center gap-2 w-full bg-white/5 border border-dashed border-white/20 rounded-xl px-4 py-6 text-gray-300 hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer"
                    >
                      <Upload className="w-5 h-5 text-ruya-yellow" />
                      <span>{imageFile ? imageFile.name : "رفع صورة من الجهاز"}</span>
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-gray-500 text-xs">أو</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                  </div>

                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow text-left"
                    dir="ltr"
                    placeholder="رابط مباشر للصورة (https://...)"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isUploading}
                  className="px-6 py-2 rounded-xl text-gray-300 hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2 bg-ruya-yellow text-ruya-bg font-bold rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isUploading ? (
                     <>
                        <div className="w-4 h-4 border-2 border-ruya-bg border-t-transparent rounded-full animate-spin"></div>
                        جاري الرفع...
                     </>
                  ) : editingId ? (
                    "حفظ التعديلات"
                  ) : (
                    "إضافة"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
