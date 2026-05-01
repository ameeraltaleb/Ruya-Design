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
  image?: string;
  images?: string[];
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
  const [customCategory, setCustomCategory] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract unique categories from projects
  const uniqueCategories = Array.from(new Set(projects.map(p => p.category))).filter(Boolean);

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
    if (e.target.files && e.target.files.length > 0) {
      setImageFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };
  
  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImagesIfSelected = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return [];
    
    const uploadPromises = imageFiles.map(async (file) => {
      const fileRef = ref(storage, `portfolio/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      return await getDownloadURL(fileRef);
    });

    return await Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = category === "other" ? customCategory : category;

    if (!finalCategory) {
      alert("الرجاء اختيار أو كتابة تصنيف!");
      return;
    }

    if (existingImages.length === 0 && imageFiles.length === 0) {
      alert("الرجاء إضافة صورة واحدة على الأقل!");
      return;
    }
    
    try {
      setIsUploading(true);
      const newUploadedUrls = await uploadImagesIfSelected();
      const finalImages = [...existingImages, ...newUploadedUrls];

      const ts = Date.now();
      if (editingId) {
        const oldProj = projects.find((p) => p.id === editingId);
        await updateDoc(doc(db, "projects", editingId), {
          title,
          category: finalCategory,
          images: finalImages,
          createdAt: oldProj?.createdAt || ts,
        });
      } else {
        await addDoc(collection(db, "projects"), {
          title,
          category: finalCategory,
          images: finalImages,
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
    setCategory(uniqueCategories.includes(p.category) ? p.category : "other");
    if (!uniqueCategories.includes(p.category)) setCustomCategory(p.category);
    
    // Convert old `image` string to `images` array if necessary
    const pImages = p.images ? p.images : (p.image ? [p.image] : []);
    setExistingImages(pImages);
    setImageFiles([]);
    setEditingId(p.id);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setTitle("");
    setCategory("");
    setCustomCategory("");
    setExistingImages([]);
    setImageFiles([]);
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
            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group flex flex-col"
          >
            <div className="relative w-full h-48 overflow-hidden bg-black/20">
              <img
                src={p.images && p.images.length > 0 ? p.images[0] : p.image}
                alt={p.title}
                className="w-full h-full object-cover"
              />
              {p.images && p.images.length > 1 && (
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                  +{p.images.length - 1} صور
                </div>
              )}
            </div>
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
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow mb-2 appearance-none"
                >
                  <option value="" disabled className="text-gray-900">اختر تصنيفاً</option>
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat} className="text-gray-900">{cat}</option>
                  ))}
                  <option value="other" className="text-gray-900 bg-gray-200">تصنيف جديد...</option>
                </select>
                
                {category === "other" && (
                  <input
                    type="text"
                    required
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow"
                    placeholder="اكتب التصنيف الجديد هنا..."
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  صور العمل
                </label>
                <div className="space-y-4">
                  {/* Gallery Preview */}
                  {(existingImages.length > 0 || imageFiles.length > 0) && (
                    <div className="grid grid-cols-4 gap-2">
                      {existingImages.map((src, idx) => (
                        <div key={`existing-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group">
                          <img src={src} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(idx)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          >
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </button>
                        </div>
                      ))}
                      {imageFiles.map((file, idx) => (
                        <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 border-dashed group">
                          <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          >
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
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
                      <span>إضافة صور (يمكن اختيار أكثر من صورة)</span>
                    </label>
                  </div>
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
