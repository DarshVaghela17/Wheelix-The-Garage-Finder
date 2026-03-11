import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

// Garager Dashboard
import GaragerDashboard from "./pages/GaragerDashboard";

// Admin Dashboard
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Dashboard - FIXED NESTED ROUTING */}
          <Route path="/dashboard" element={<DashboardUser />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="garages" element={<GarageList />} />
            <Route path="emergency" element={<EmergencyStatus />} />
            <Route path="history" element={<History />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="home" replace />} />
          </Route>

          {/* Garager Dashboard */}
          <Route path="/garager-dashboard" element={<GaragerDashboard />} />

          {/* Admin Dashboard */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
