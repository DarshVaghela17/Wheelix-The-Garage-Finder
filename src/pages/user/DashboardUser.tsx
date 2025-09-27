import { Outlet, Link } from "react-router-dom";

const DashboardUser = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-6">
        <h2 className="text-xl font-bold">User Dashboard</h2>
        <nav className="flex flex-col space-y-3">
          <Link to="/dashboard/home">🏠 Home</Link>
          <Link to="/dashboard/garages">🛠 Garages</Link>
          <Link to="/dashboard/emergency">🚨 Emergency</Link>
          <Link to="/dashboard/history">📜 History</Link>
          <Link to="/dashboard/profile">👤 Profile</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardUser;
