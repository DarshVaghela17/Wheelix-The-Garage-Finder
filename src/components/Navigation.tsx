import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import { useEffect, useState } from "react";

const Navigation = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);

  // Read role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) setRole(savedRole);
  }, []);

  const handleDashboard = () => {
    if (role === "user") navigate("/dashboard");
    else if (role === "garager") navigate("/garager-dashboard");
    else if (role === "admin") navigate("/admin-dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole"); // clear role
    setRole(null);
    navigate("/"); // redirect home
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Wrench className="h-8 w-8 text-garage-orange" />
            <span className="text-2xl font-bold text-white">Wheelix</span>
          </Link>

          <div className="flex items-center gap-4">
            {role ? (
              <>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                  onClick={handleDashboard}
                >
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  className="text-white border-white hover:bg-white/10"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="hero" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
