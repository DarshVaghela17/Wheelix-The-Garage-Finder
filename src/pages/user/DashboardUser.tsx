import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

export default function DashboardUser() {
  const location = useLocation();
  const [userName, setUserName] = useState("darsh vaghela");

  useEffect(() => {
    const storedName = localStorage.getItem("userName") || "";
    setUserName(storedName);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const pathParts = location.pathname.split('/');
  const activeTab = pathParts[pathParts.length - 1] || 'home';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white/90 backdrop-blur-xl shadow-2xl border-r border-gray-100 z-50">
        <div className="p-12 h-full flex flex-col">
          <div className="text-center mb-16">
            <div className="w-28 h-28 bg-gradient-to-br from-slate-400 to-slate-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl border-4 border-white">
              <span className="text-3xl font-bold text-white">JD</span>
            </div>
            <h2 className="text-3xl font-light text-gray-900">{userName}</h2>
          </div>

          <nav className="flex-1 space-y-3 mb-16">
            <a href="/dashboard/home" className={`flex items-center gap-4 p-6 rounded-3xl font-light text-xl transition-all duration-300 group hover:shadow-xl ${activeTab === 'home' ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-2xl scale-[1.02]' : 'text-gray-700 hover:text-gray-900 hover:bg-white/70 hover:shadow-lg hover:scale-[1.01]'}`}>
              <span className="text-3xl">🏠</span>
              <span>Home</span>
            </a>
            <a href="/dashboard/garages" className={`flex items-center gap-4 p-6 rounded-3xl font-light text-xl transition-all duration-300 group hover:shadow-xl ${activeTab === 'garages' ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-2xl scale-[1.02]' : 'text-gray-700 hover:text-gray-900 hover:bg-white/70 hover:shadow-lg hover:scale-[1.01]'}`}>
              <span className="text-3xl">🔧</span>
              <span>Garages</span>
            </a>
            <a href="/dashboard/emergency" className={`flex items-center gap-4 p-6 rounded-3xl font-light text-xl transition-all duration-300 group hover:shadow-xl ${activeTab === 'emergency' ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-2xl scale-[1.02]' : 'text-gray-700 hover:text-gray-900 hover:bg-white/70 hover:shadow-lg hover:scale-[1.01]'}`}>
              <span className="text-3xl">🚨</span>
              <span>Emergency</span>
            </a>
            <a href="/dashboard/history" className={`flex items-center gap-4 p-6 rounded-3xl font-light text-xl transition-all duration-300 group hover:shadow-xl ${activeTab === 'history' ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-2xl scale-[1.02]' : 'text-gray-700 hover:text-gray-900 hover:bg-white/70 hover:shadow-lg hover:scale-[1.01]'}`}>
              <span className="text-3xl">📋</span>
              <span>History</span>
            </a>
            <a href="/dashboard/profile" className={`flex items-center gap-4 p-6 rounded-3xl font-light text-xl transition-all duration-300 group hover:shadow-xl ${activeTab === 'profile' ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-2xl scale-[1.02]' : 'text-gray-700 hover:text-gray-900 hover:bg-white/70 hover:shadow-lg hover:scale-[1.01]'}`}>
              <span className="text-3xl">👤</span>
              <span>Profile</span>
            </a>
          </nav>

          <button 
            onClick={handleLogout}
            className="w-full py-6 px-8 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-light text-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT - THIS FIXES BLANK PAGE */}
      <div className="ml-80 flex-1 p-12 pt-24 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
