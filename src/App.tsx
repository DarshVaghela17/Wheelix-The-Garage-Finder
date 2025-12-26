import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Public pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// User Dashboard pages
import DashboardUser from "./pages/user/DashboardUser";
import Home from "./pages/user/Home";
import GarageList from "./pages/user/GarageList";
import EmergencyStatus from "./pages/user/EmergencyStatus";
import History from "./pages/user/History";
import Profile from "./pages/user/Profile";

// Garage Dashboard
import GaragerDashboard from "./pages/GaragerDashboard";

// Admin Dashboard
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: JSX.Element; 
  requiredRole?: string 
}) => {
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Dashboard routes - Protected */}
          <Route 
            path="/user/dashboard" 
            element={
              <ProtectedRoute requiredRole="user">
                <DashboardUser />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="garages" element={<GarageList />} />
            <Route path="emergency" element={<EmergencyStatus />} />
            <Route path="history" element={<History />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Legacy user route redirect */}
          <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />

          {/* Garage Dashboard - Protected */}
          <Route 
            path="/garage/dashboard" 
            element={
              <ProtectedRoute requiredRole="garage">
                <GaragerDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Legacy garage route redirect */}
          <Route 
            path="/garager-dashboard" 
            element={<Navigate to="/garage/dashboard" replace />} 
          />

          {/* Admin Dashboard - Protected */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Legacy admin route redirect */}
          <Route 
            path="/admin-dashboard" 
            element={<Navigate to="/admin/dashboard" replace />} 
          />

          {/* Catch-all - 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* Toast Notifications */}
        <Toaster />
        <Sonner position="top-right" />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
