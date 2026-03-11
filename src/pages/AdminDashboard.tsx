"use client";

import { useState } from "react";

export default function CompleteLuxuryDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  // Complete Data
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "User", status: "active", garage: null, joined: "Jan 15", revenue: "$24,500" },
    { id: 2, name: "Sarah Wilson", email: "sarah@example.com", role: "Garage Owner", status: "active", garage: "SpeedyFix", joined: "Feb 02", revenue: "$18,200" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "User", status: "inactive", garage: null, joined: "Dec 28", revenue: "$12,800" },
    { id: 4, name: "Elena Vasquez", email: "elena@example.com", role: "User", status: "active", garage: "Gold Standard", joined: "Jan 22", revenue: "$42,100" }
  ];

  const garages = [
    { id: 1, name: "SpeedyFix Garage", owner: "Sarah Wilson", location: "Downtown", status: "active", rating: 4.9, revenue: "$89,500", services: 247 },
    { id: 2, name: "Gold Standard Auto", owner: "Elena Vasquez", location: "Uptown", status: "pending", rating: 4.7, revenue: "$124,200", services: 392 },
    { id: 3, name: "Elite Motors", owner: "Mike Chen", location: "Suburbs", status: "active", rating: 4.8, revenue: "$67,800", services: 189 }
  ];

  const requests = [
    { id: 1, user: "John Doe", service: "Oil Change", date: "Feb 10", status: "completed", amount: "$89" },
    { id: 2, user: "Sarah Wilson", service: "Brake Repair", date: "Feb 12", status: "pending", amount: "$245" },
    { id: 3, user: "Mike Johnson", service: "Tire Rotation", date: "Feb 14", status: "in-progress", amount: "$45" }
  ];

  const reports = [
    { id: 1, type: "Monthly Revenue", date: "Feb 2026", amount: "$245,800", status: "generated" },
    { id: 2, type: "User Activity", date: "Feb 2026", users: 4, status: "pending" },
    { id: 3, type: "Service Summary", date: "Jan 2026", services: 892, status: "generated" }
  ];

  const settings = {
    notifications: true,
    emailReports: true,
    autoBackup: true,
    analytics: true,
    maintenanceMode: false
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === "active").length,
    totalGarages: garages.length,
    pendingRequests: requests.filter(r => r.status === "pending").length,
    totalRevenue: (users.reduce((sum, u) => sum + parseFloat(u.revenue.replace(/[$,]/g, '')), 0) + 
                  garages.reduce((sum, g) => sum + parseFloat(g.revenue.replace(/[$,]/g, '')), 0)).toLocaleString()
  };

  const toggleUserSelection = (id) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const toggleUserStatus = (id) => alert(`Status toggled for ${users.find(u => u.id === id)?.name}`);
  const approveGarage = (id) => alert(`Garage approved: ${garages.find(g => g.id === id)?.name}`);
  const deleteSelectedUsers = () => {
    setShowDeleteConfirm(false);
    setSelectedUsers([]);
    alert(`${selectedUsers.length} users deleted!`);
  };
  const saveSettings = () => alert("Settings saved successfully!");

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-amber-50/30 to-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            <div>
              <h1 className="text-5xl font-light text-gray-900 tracking-tight mb-4">Admin Dashboard</h1>
              <p className="text-2xl text-gray-600 font-light">{stats.totalUsers} users • ${stats.totalRevenue}</p>
            </div>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-light rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-200">
                📊 Export
              </button>
              <button className="px-10 py-4 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white font-light rounded-2xl shadow-2xl hover:shadow-3xl transition-all">
                ➕ Add User
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {[
            { value: stats.totalUsers, label: "Users", color: "from-blue-400 to-blue-500" },
            { value: stats.activeUsers, label: "Active", color: "from-emerald-400 to-emerald-500" },
            { value: stats.totalGarages, label: "Garages", color: "from-amber-400 to-amber-500" },
            { value: stats.pendingRequests, label: "Pending", color: "from-orange-400 to-orange-500" },
            { value: `$${stats.totalRevenue}`, label: "Revenue", color: "from-purple-400 to-purple-500" }
          ].map((stat, i) => (
            <div key={i} className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all border border-gray-100 hover:border-amber-200">
              <div className={`w-20 h-20 ${stat.color} bg-gradient-to-br rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-all`}>
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-xl font-light text-gray-700 text-center">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="relative flex-1 max-w-2xl">
              <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search users, garages, requests..."
                className="w-full pl-16 pr-12 py-5 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-100/50 focus:border-amber-300 bg-white shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-5 p-2 bg-gradient-to-r from-gray-50 to-white">
            {[
              { id: "users", label: "Users", count: filteredUsers.length },
              { id: "garages", label: "Garages", count: garages.length },
              { id: "requests", label: "Requests", count: requests.length },
              { id: "reports", label: "Reports", count: reports.length },
              { id: "settings", label: "Settings" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-6 px-6 lg:px-8 rounded-2xl font-light text-lg transition-all flex items-center justify-center gap-3 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xl hover:shadow-2xl'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white shadow-lg hover:shadow-xl'
                }`}
              >
                {tab.count && <span className="text-sm bg-white/30 px-3 py-1 rounded-xl">{tab.count}</span>}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* USERS TAB */}
          {activeTab === "users" && (
            <div className="p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredUsers.map(user => (
                  <div key={user.id} className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border border-gray-100 hover:border-amber-200 p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center shadow-xl">
                        <span className="text-2xl font-bold text-gray-700">{user.name.charAt(0)}</span>
                      </div>
                      <label className="flex items-center gap-2 p-2 bg-gray-100 rounded-xl cursor-pointer">
                        <input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => toggleUserSelection(user.id)} className="w-4 h-4 rounded text-amber-500" />
                      </label>
                    </div>
                    <h3 className="text-2xl font-light text-gray-900 mb-3">{user.name}</h3>
                    <p className="text-lg text-gray-600 mb-6 bg-gray-50 px-4 py-2 rounded-xl">{user.email}</p>
                    <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                      <div><span className="text-gray-500 block">Role</span><span className="font-semibold">{user.role}</span></div>
                      <div><span className="text-gray-500 block">Revenue</span><span className="text-emerald-600 font-bold text-lg">{user.revenue}</span></div>
                    </div>
                    <div className="flex gap-3 pt-6 border-t border-gray-100">
                      <button onClick={() => toggleUserStatus(user.id)} className={`flex-1 py-3 px-4 rounded-xl font-medium ${user.status === 'active' ? 'bg-orange-400 hover:bg-orange-500 text-white' : 'bg-emerald-400 hover:bg-emerald-500 text-white'}`}>
                        {user.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                      <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GARAGES TAB */}
          {activeTab === "garages" && (
            <div className="p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {garages.map(garage => (
                  <div key={garage.id} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl font-bold text-amber-700">🏢</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-light text-gray-900 mb-3">{garage.name}</h3>
                    <p className="text-lg text-gray-600 mb-2">Owner: {garage.owner}</p>
                    <p className="text-lg text-gray-600 mb-6">Location: {garage.location}</p>
                    <div className="flex items-center justify-between mb-8">
                      <div className="text-2xl font-bold text-emerald-600">{garage.rating} ⭐</div>
                      <span className={`px-4 py-2 rounded-xl text-sm font-medium ${garage.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}`}>
                        {garage.status}
                      </span>
                    </div>
                    <div className="flex gap-3 pt-6 border-t border-gray-100">
                      <button className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl font-medium" onClick={() => approveGarage(garage.id)}>
                        {garage.status === 'active' ? 'Active' : 'Approve'}
                      </button>
                      <button className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-medium">View</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REQUESTS TAB */}
          {activeTab === "requests" && (
            <div className="p-12">
              <div className="overflow-x-auto">
                <table className="w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <th className="p-6 text-left text-lg font-medium text-gray-900">User</th>
                      <th className="p-6 text-left text-lg font-medium text-gray-900">Service</th>
                      <th className="p-6 text-left text-lg font-medium text-gray-900">Date</th>
                      <th className="p-6 text-left text-lg font-medium text-gray-900">Status</th>
                      <th className="p-6 text-left text-lg font-medium text-gray-900">Amount</th>
                      <th className="p-6 text-left text-lg font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map(request => (
                      <tr key={request.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="p-6 font-medium">{request.user}</td>
                        <td className="p-6">{request.service}</td>
                        <td className="p-6">{request.date}</td>
                        <td className="p-6">
                          <span className={`px-4 py-2 rounded-xl text-sm font-medium ${request.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : request.status === 'pending' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="p-6 font-bold text-emerald-600">{request.amount}</td>
                        <td className="p-6">
                          <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm mr-2">Complete</button>
                          <button className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl text-sm">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === "reports" && (
            <div className="p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {reports.map(report => (
                  <div key={report.id} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl">
                    <h3 className="text-2xl font-light text-gray-900 mb-4">{report.type}</h3>
                    <p className="text-lg text-gray-600 mb-6">Date: {report.date}</p>
                    {report.amount && <div className="text-3xl font-bold text-emerald-600 mb-6">{report.amount}</div>}
                    {report.users && <div className="text-3xl font-bold text-blue-600 mb-6">{report.users} users</div>}
                    {report.services && <div className="text-3xl font-bold text-purple-600 mb-6">{report.services} services</div>}
                    <span className={`px-4 py-2 rounded-xl text-sm font-medium ${report.status === 'generated' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}`}>
                      {report.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="p-12">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-4xl font-light text-gray-900 mb-12 text-center">Platform Settings</h2>
                <div className="space-y-8">
                  <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100">
                    <h3 className="text-2xl font-light text-gray-900 mb-6">Notifications</h3>
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl mb-4">
                      <span className="font-medium">Email Notifications</span>
                      <input type="checkbox" defaultChecked={settings.notifications} className="w-6 h-6 rounded-lg text-amber-500 focus:ring-amber-500" />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <span className="font-medium">Push Notifications</span>
                      <input type="checkbox" defaultChecked className="w-6 h-6 rounded-lg text-amber-500 focus:ring-amber-500" />
                    </label>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100">
                    <h3 className="text-2xl font-light text-gray-900 mb-6">Reports</h3>
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl mb-4">
                      <span className="font-medium">Auto Email Reports</span>
                      <input type="checkbox" defaultChecked={settings.emailReports} className="w-6 h-6 rounded-lg text-amber-500 focus:ring-amber-500" />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <span className="font-medium">Analytics Tracking</span>
                      <input type="checkbox" defaultChecked={settings.analytics} className="w-6 h-6 rounded-lg text-amber-500 focus:ring-amber-500" />
                    </label>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100">
                    <h3 className="text-2xl font-light text-gray-900 mb-6">System</h3>
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl mb-4">
                      <span className="font-medium">Auto Backup</span>
                      <input type="checkbox" defaultChecked={settings.autoBackup} className="w-6 h-6 rounded-lg text-amber-500 focus:ring-amber-500" />
                    </label>
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <span className="font-medium text-red-600 font-semibold">Maintenance Mode</span>
                      <input type="checkbox" className="w-6 h-6 rounded-lg text-red-500 focus:ring-red-500" />
                    </label>
                  </div>

                  <button onClick={saveSettings} className="w-full py-6 px-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-light text-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all">
                    💾 Save All Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-md w-full border border-gray-100">
            <div className="text-center mb-12">
              <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-500 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-3xl font-light text-gray-900 mb-4">Delete Users</h3>
              <p className="text-xl text-gray-600">Remove {selectedUsers.length} selected users?</p>
            </div>
            <div className="flex gap-4 pt-8 border-t border-gray-100">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-4 px-8 font-light bg-gray-100 hover:bg-gray-200 rounded-2xl border border-gray-200 transition-all shadow-lg hover:shadow-xl">
                Cancel
              </button>
              <button onClick={deleteSelectedUsers} className="flex-1 py-4 px-8 font-light bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all">
                Delete {selectedUsers.length}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
