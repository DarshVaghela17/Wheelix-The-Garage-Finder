import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Home as HomeIcon,
  Search,
  AlertCircle,
  History as HistoryIcon,
  User,
  LogOut,
  Bell,
  Settings,
  MapPin,
} from "lucide-react";

const DashboardUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("User");
  
  // Get current path
  const pathParts = location.pathname.split('/');
  const currentTab = pathParts[pathParts.length - 1] || 'home';

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);

    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    
    if (!token || role !== "user") {
      toast.error("Please login to access dashboard");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate("/dashboard/home")}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Wheelix
                </h1>
                <p className="text-xs text-gray-500">Find Your Garage</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className="relative hover:bg-blue-50 rounded-xl">
                <Bell className="w-5 h-5 text-gray-600" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-blue-50 rounded-xl">
                <Settings className="w-5 h-5 text-gray-600" />
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {userName}! 👋
          </h2>
          <p className="text-gray-600">Find the perfect garage for your vehicle needs</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 p-1.5 rounded-2xl shadow-sm inline-flex mb-6">
          <a
            href="/dashboard/home"
            className={`flex items-center px-6 py-2 rounded-xl transition-all no-underline ${
              currentTab === 'home' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <HomeIcon className="w-4 h-4 mr-2" />
            Home
          </a>
          <a
            href="/dashboard/garages"
            className={`flex items-center px-6 py-2 rounded-xl transition-all no-underline ${
              currentTab === 'garages' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Search className="w-4 h-4 mr-2" />
            Garages
          </a>
          <a
            href="/dashboard/emergency"
            className={`flex items-center px-6 py-2 rounded-xl transition-all no-underline ${
              currentTab === 'emergency' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Emergency
          </a>
          <a
            href="/dashboard/history"
            className={`flex items-center px-6 py-2 rounded-xl transition-all no-underline ${
              currentTab === 'history' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <HistoryIcon className="w-4 h-4 mr-2" />
            History
          </a>
          <a
            href="/dashboard/profile"
            className={`flex items-center px-6 py-2 rounded-xl transition-all no-underline ${
              currentTab === 'profile' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </a>
        </div>

        {/* Render child routes */}
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardUser;
