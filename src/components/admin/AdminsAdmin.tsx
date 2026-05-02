import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { Trash2, UserPlus, Shield, X, ShieldAlert } from "lucide-react";

interface Admin {
  id: string;
  email: string;
  role: string;
  createdAt: number;
}

const secondarySupabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

export default function AdminsAdmin() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user || null);
    });

    const fetchAdmins = async () => {
      const { data, error } = await supabase.from('admins').select('*').order('created_at', { ascending: false });
      if (data) {
        setAdmins(data.map((d: any) => ({
          id: d.id,
          email: d.email,
          role: d.role,
          createdAt: new Date(d.created_at).getTime()
        })));
      }
      setLoading(false);
    };
    fetchAdmins();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setErrorMsg("");

    try {
      const { data: signUpData, error: signUpError } = await secondarySupabase.auth.signUp({
        email: newEmail,
        password: newPassword,
      });

      if (signUpError) throw signUpError;
      
      const newUserId = signUpData.user?.id;
      if (!newUserId) throw new Error("Failed to create user ID.");

      await secondarySupabase.auth.signOut();

      const { error: insertError } = await supabase.from('admins').insert({
        id: newUserId,
        email: newEmail,
        role: "admin",
      });

      if (insertError) throw insertError;

      // refresh admins
      const { data } = await supabase.from('admins').select('*').order('created_at', { ascending: false });
      if (data) {
        setAdmins(data.map((d: any) => ({
          id: d.id,
          email: d.email,
          role: d.role,
          createdAt: new Date(d.created_at).getTime()
        })));
      }

      closeModal();
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "حدث خطأ أثناء إضافة المشرف. يرجى التأكد من البيانات.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (adminId: string) => {
    if (adminId === currentUser?.id) {
      alert("لا يمكنك حذف حسابك الحالي!");
      return;
    }

    if (
      confirm(
        "هل أنت متأكد من حذف هذا المشرف؟ لن يتمكن من تسجيل الدخول للوحة. (سيتم حذف الوصول فقط وليس حساب المستخدم)",
      )
    ) {
      try {
        await supabase.from('admins').delete().eq('id', adminId);
        setAdmins(admins.filter(a => a.id !== adminId));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewEmail("");
    setNewPassword("");
    setErrorMsg("");
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield className="w-8 h-8 text-ruya-yellow shrink-0" />
          إدارة المشرفين
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-ruya-yellow text-ruya-bg px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-yellow-400 transition-colors w-full md:w-auto mt-2 md:mt-0 justify-center"
        >
          <UserPlus className="w-5 h-5 shrink-0" />
          إضافة مشرف جديد
        </button>
      </div>

      <div className="bg-ruya-purple/30 border border-ruya-yellow/20 p-4 rounded-xl mb-8 flex items-start gap-4">
        <ShieldAlert className="w-6 h-6 text-ruya-yellow shrink-0 mt-1" />
        <p className="text-sm text-gray-300 leading-relaxed">
          إضافة مشرف جديد ستسمح له بتسجيل الدخول إلى لوحة التحكم بصلاحيات كاملة.
          يُرجى اختيار كلمة مرور قوية وإعطائها للمشرف الجديد مع بريده الإلكتروني
          حتى يتمكن من الدخول.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {admins.map((admin) => {
          const isCurrentUser = admin.id === currentUser?.id;
          return (
            <div
              key={admin.id}
              className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col h-full relative overflow-hidden group"
            >
              {isCurrentUser && (
                <div className="absolute top-0 right-0 bg-ruya-yellow text-ruya-bg text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                  تستخدمه الآن
                </div>
              )}
              <div className="flex-1">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4 text-white">
                  <Shield className="w-6 h-6" />
                </div>
                <h3
                  className="text-lg font-bold text-white mb-1"
                  dir="ltr"
                  style={{ textAlign: "right" }}
                >
                  {admin.email}
                </h3>
                <p className="text-sm text-gray-400 capitalize">
                  Role: {admin.role}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  أُضيف في:{" "}
                  {new Date(admin.createdAt).toLocaleDateString("ar-EG")}
                </div>
                {!isCurrentUser && (
                  <button
                    onClick={() => handleDelete(admin.id)}
                    className="p-2 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="حذف المشرف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-ruya-purple border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">إضافة مشرف جديد</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  البريد الإلكتروني للمشرف
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow text-left"
                  dir="ltr"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  كلمة المرور المؤقتة
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-ruya-yellow text-left"
                  dir="ltr"
                  placeholder="********"
                  minLength={6}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 rounded-xl text-gray-300 hover:bg-white/5 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2 bg-ruya-yellow text-ruya-bg font-bold rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50"
                >
                  {creating ? "جاري الإضافة..." : "إضافة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
