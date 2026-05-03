import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Eye, ExternalLink, Calendar, CheckCircle } from "lucide-react";

interface Application {
  id: string;
  job_id: string | null;
  position: string;
  name: string;
  email: string;
  phone: string;
  portfolio_url: string;
  notes: string;
  status: string;
  created_at: string;
  jobs?: {
    title: string;
  };
}

export default function ApplicationsAdmin() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      // Intentionally omit jobs join to avoid errors if foreign keys aren't fully set up yet
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err: any) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
      
      if (selectedApp?.id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
      fetchApplications();
    } catch (err: any) {
      console.error("Error updating status:", err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'new': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">جديد</span>;
      case 'reviewed': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">تمت المراجعة</span>;
      case 'shortlisted': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">القائمة القصيرة</span>;
      case 'rejected': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">مرفوض</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-ruya-purple">طلبات التوظيف</h2>
        <span className="bg-ruya-purple text-white px-4 py-2 rounded-xl text-sm font-bold">
          {applications.length} طلب إجمالي
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[700px]">
          <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-gray-700">
            أحدث الطلبات
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {applications.map(app => (
              <button
                key={app.id}
                onClick={() => {
                  setSelectedApp(app);
                  if (app.status === 'new') updateStatus(app.id, 'reviewed');
                }}
                className={`w-full text-right p-4 rounded-xl border transition-all ${
                  selectedApp?.id === app.id
                    ? "border-ruya-yellow bg-yellow-50"
                    : "border-transparent hover:bg-gray-50 bg-white"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-ruya-purple block truncate">{app.name}</span>
                  {getStatusBadge(app.status)}
                </div>
                <div className="text-sm text-gray-600 mb-1 truncate">{app.position}</div>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                  <Calendar size={12} />
                  <span dir="ltr">{new Date(app.created_at).toLocaleDateString('ar-SA')}</span>
                </div>
              </button>
            ))}
            {applications.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-sm">
                لا توجد طلبات بعد
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedApp ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-8 h-[700px] overflow-y-auto">
              <div className="flex justify-between items-start border-b border-gray-100 pb-6">
                <div>
                  <h3 className="text-3xl font-black text-ruya-purple mb-2">{selectedApp.name}</h3>
                  <p className="text-gray-500 font-medium">متقدم لـ: <span className="text-ruya-purple font-bold">{selectedApp.position}</span></p>
                </div>
                <div>
                  <span className="text-sm text-gray-400 font-mono" dir="ltr">
                    {new Date(selectedApp.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">البريد الإلكتروني</label>
                  <a href={`mailto:${selectedApp.email}`} className="text-blue-600 hover:underline font-mono" dir="ltr">{selectedApp.email}</a>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">رقم الهاتف</label>
                  <a href={`tel:${selectedApp.phone}`} className="text-gray-900 font-mono" dir="ltr">{selectedApp.phone}</a>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-2">رابط الأعمال (البورتفوليو)</label>
                {selectedApp.portfolio_url ? (
                  <a
                    href={selectedApp.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-blue-600 transition-colors"
                  >
                    <ExternalLink size={18} />
                    <span dir="ltr">{selectedApp.portfolio_url}</span>
                  </a>
                ) : (
                  <span className="text-gray-400 italic">لم يتم إرفاق رابط</span>
                )}
              </div>

              {selectedApp.notes && (
                <div>
                  <label className="text-sm text-gray-500 block mb-2">ملاحظات المتقدم</label>
                  <div className="bg-gray-50 p-5 rounded-2xl text-gray-700 leading-relaxed border border-gray-100 whitespace-pre-wrap">
                    {selectedApp.notes}
                  </div>
                </div>
              )}

              <div className="pt-8 border-t border-gray-100">
                <label className="text-sm text-gray-500 block mb-4">تحديث حالة الطلب</label>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => updateStatus(selectedApp.id, 'shortlisted')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors ${
                      selectedApp.status === 'shortlisted' ? "bg-green-600 text-white" : "bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                  >
                    {selectedApp.status === 'shortlisted' && <CheckCircle size={16} />}
                    انتقال للقائمة القصيرة
                  </button>
                  <button
                    onClick={() => updateStatus(selectedApp.id, 'rejected')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors ${
                      selectedApp.status === 'rejected' ? "bg-red-600 text-white" : "bg-red-50 text-red-700 hover:bg-red-100"
                    }`}
                  >
                    {selectedApp.status === 'rejected' && <CheckCircle size={16} />}
                    رفض الطلب
                  </button>
                  <button
                    onClick={() => updateStatus(selectedApp.id, 'reviewed')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors ${
                      selectedApp.status === 'reviewed' ? "bg-yellow-500 text-white" : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                    }`}
                  >
                    {selectedApp.status === 'reviewed' && <CheckCircle size={16} />}
                    قيد المراجعة / معلق
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-[700px] flex flex-col items-center justify-center text-gray-400">
              <Eye size={48} className="mb-4 opacity-20" />
              <p>اختر طلباً من القائمة لعرض التفاصيل</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
