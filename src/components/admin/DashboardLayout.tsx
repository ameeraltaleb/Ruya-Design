import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function DashboardLayout() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/admin/login');
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ruya-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-ruya-yellow border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const links = [
    { name: 'الأعمال (Portfolio)', href: '/admin', icon: ImageIcon },
    { name: 'الرسائل', href: '/admin/messages', icon: MessageSquare },
    { name: 'الإعدادات', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-ruya-bg text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-ruya-purple border-l border-white/10 p-6 flex flex-col">
        <div className="text-2xl font-bold text-white mb-12">
          لوحة <span className="text-ruya-yellow">الإدارة</span>
        </div>
        
        <nav className="space-y-2 flex-grow">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-ruya-yellow text-ruya-bg font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 space-x-reverse px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors mt-auto"
        >
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
