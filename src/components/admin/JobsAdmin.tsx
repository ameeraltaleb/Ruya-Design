import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from "lucide-react";

interface Job {
  id: string;
  title: string;
  type: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

export default function JobsAdmin() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentJob, setCurrentJob] = useState<Partial<Job> | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (err: any) {
      console.error("Error fetching jobs:", err);
      setError("حدث خطأ أثناء جلب الوظائف");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentJob?.title || !currentJob?.type || !currentJob?.description) return;

    try {
      if (currentJob.id) {
        // Update existing
        const { error } = await supabase
          .from("jobs")
          .update({
            title: currentJob.title,
            type: currentJob.type,
            description: currentJob.description,
            is_active: currentJob.is_active,
          })
          .eq("id", currentJob.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from("jobs")
          .insert([
            {
              title: currentJob.title,
              type: currentJob.type,
              description: currentJob.description,
              is_active: currentJob.is_active ?? true,
            },
          ]);

        if (error) throw error;
      }

      setIsEditing(false);
      setCurrentJob(null);
      fetchJobs();
    } catch (err: any) {
      console.error("Error saving job:", err);
      alert("حدث خطأ أثناء حفظ الوظيفة");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الوظيفة؟")) return;

    try {
      const { error } = await supabase.from("jobs").delete().eq("id", id);
      if (error) throw error;
      fetchJobs();
    } catch (err: any) {
      console.error("Error deleting job:", err);
      alert("حدث خطأ أثناء حذف الوظيفة");
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("jobs")
        .update({ is_active: !currentStatus })
        .eq("id", id);
      if (error) throw error;
      fetchJobs();
    } catch (err: any) {
      console.error("Error toggling status:", err);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-ruya-purple">إدارة الوظائف</h2>
        <button
          onClick={() => {
            setCurrentJob({ title: "", type: "", description: "", is_active: true });
            setIsEditing(true);
          }}
          className="flex items-center gap-2 bg-ruya-purple text-white px-4 py-2 rounded-xl hover:bg-ruya-yellow hover:text-slate-900 transition-colors"
        >
          <Plus size={20} />
          <span>إضافة وظيفة</span>
        </button>
      </div>

      {error && <div className="p-4 bg-red-100 text-red-600 rounded-xl">{error}</div>}

      {isEditing && currentJob && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-xl font-bold mb-4">{currentJob.id ? "تعديل وظيفة" : "إضافة وظيفة جديدة"}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">المسمى الوظيفي</label>
              <input
                type="text"
                required
                value={currentJob.title || ""}
                onChange={(e) => setCurrentJob({ ...currentJob, title: e.target.value })}
                className="w-full border-gray-300 rounded-xl p-3 focus:ring-ruya-yellow focus:border-ruya-yellow bg-gray-50 border outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">نوع الدوام (مثل: دوام كامل / عن بعد)</label>
              <input
                type="text"
                required
                value={currentJob.type || ""}
                onChange={(e) => setCurrentJob({ ...currentJob, type: e.target.value })}
                className="w-full border-gray-300 rounded-xl p-3 focus:ring-ruya-yellow focus:border-ruya-yellow bg-gray-50 border outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">الوصف</label>
            <textarea
              required
              rows={3}
              value={currentJob.description || ""}
              onChange={(e) => setCurrentJob({ ...currentJob, description: e.target.value })}
              className="w-full border-gray-300 rounded-xl p-3 focus:ring-ruya-yellow focus:border-ruya-yellow bg-gray-50 border outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={currentJob.is_active !== false}
              onChange={(e) => setCurrentJob({ ...currentJob, is_active: e.target.checked })}
              className="w-4 h-4 text-ruya-purple focus:ring-ruya-yellow rounded"
            />
            <label htmlFor="isActive" className="text-sm">نشط (تظهر في الموقع)</label>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setCurrentJob(null);
              }}
              className="px-6 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-ruya-yellow text-ruya-purple font-bold px-6 py-2 rounded-xl hover:bg-yellow-500 transition-colors"
            >
              حفظ
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-700">المسمى الوظيفي</th>
                <th className="px-6 py-4 font-bold text-gray-700">النوع</th>
                <th className="px-6 py-4 font-bold text-gray-700">الحالة</th>
                <th className="px-6 py-4 font-bold text-gray-700">تاريخ الإضافة</th>
                <th className="px-6 py-4 font-bold text-gray-700 text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-ruya-purple">{job.title}</td>
                  <td className="px-6 py-4 text-gray-600">{job.type}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(job.id, job.is_active)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        job.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {job.is_active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {job.is_active ? "نشط" : "مخفي"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(job.created_at).toLocaleDateString("ar-SA")}
                  </td>
                  <td className="px-6 py-4 text-left space-x-2 space-x-reverse">
                    <button
                      onClick={() => {
                        setCurrentJob(job);
                        setIsEditing(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      title="تعديل"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="حذف"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    لا توجد وظائف مضافة حالياً.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
