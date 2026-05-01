import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  MessageSquare,
  Image as ImageIcon,
  Shield,
  Menu,
  X
} from "lucide-react";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function DashboardLayout() {
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/admin/login");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-ruya-yellow border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const links = [
    { name: "الواجهة الرئيسية", href: "/admin/hero", icon: ImageIcon },
    { name: "العملاء (الشعارات)", href: "/admin/clients", icon: Users },
    { name: "من نحن", href: "/admin/about", icon: Shield },
    { name: "الخدمات", href: "/admin/services", icon: LayoutDashboard },
    { name: "الإحصائيات", href: "/admin/stats", icon: LayoutDashboard },
    { name: "الأعمال (Portfolio)", href: "/admin", icon: ImageIcon },
    { name: "آراء العملاء", href: "/admin/testimonials", icon: MessageSquare },
    { name: "الرسائل", href: "/admin/messages", icon: MessageSquare },
    { name: "المشرفين", href: "/admin/admins", icon: Shield },
    { name: "الإعدادات", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col md:flex-row" dir="rtl">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-ruya-purple border-b border-white/10 sticky top-0 z-30">
        <div className="text-xl font-bold text-white">
          لوحة <span className="text-ruya-yellow">الإدارة</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-white p-2">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:sticky top-0 right-0 h-screen w-64 bg-ruya-purple border-l border-white/10 p-6 flex flex-col z-50 transform transition-transform duration-300 ease-in-out overflow-hidden shadow-2xl md:shadow-none ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex justify-between items-center mb-12">
          <div className="text-2xl font-bold text-white hidden md:block mt-2">
            لوحة <span className="text-ruya-yellow">الإدارة</span>
          </div>
          <div className="text-xl font-bold text-white md:hidden">
            القائمة
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-white p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="space-y-2 flex-grow overflow-y-auto pb-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-ruya-yellow text-ruya-bg font-bold shadow-sm"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="truncate">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 space-x-reverse px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors mt-2 shrink-0 border-t border-white/10 pt-4"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>تسجيل الخروج</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 w-full overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}
