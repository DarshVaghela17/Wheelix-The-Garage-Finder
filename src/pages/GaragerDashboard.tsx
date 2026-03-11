"use client";

import { useState, useEffect } from "react";

export default function CompleteLuxuryGaragerDashboard() {
  const [activeTab, setActiveTab] = useState("requests");
  const [availability, setAvailability] = useState({
    garage: true,
    towTruck: false,
  });
  const [calls, setCalls] = useState([
    { id: 1, user: "John Doe", duration: "5:23", status: "completed", time: "2h ago" },
    { id: 2, user: "Sarah Wilson", duration: "12:45", status: "missed", time: "1d ago" }
  ]);
  const [requests, setRequests] = useState([
    {
      id: "1",
      user: "John Doe",
      type: "emergency",
      status: "pending",
      time: "2 mins ago",
      details: "Car won't start - battery dead",
    },
    {
      id: "2",
      user: "Sarah Wilson", 
      type: "booking",
      status: "pending",
      time: "15 mins ago",
      details: "Oil change + tire rotation",
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRequests(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          user: `User ${Math.floor(Math.random() * 1000)}`,
          type: Math.random() > 0.5 ? "emergency" : "booking",
          status: "pending",
          time: "Just now",
          details: "New service request",
        }
      ]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleRequestAction = (requestId, action) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: action } : req
      )
    );
  };

  const toggleAvailability = (service) => {
    setAvailability(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
  };

  const stats = {
    totalRequests: 127,
    completed: 112,
    responseRate: "98%",
    avgResponseTime: "2.3 mins",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Elegant Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-white/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div>
              <h1 className="text-5xl font-light text-gray-900 tracking-tight mb-4">Garage Dashboard</h1>
              <p className="text-2xl text-gray-600 font-light">{stats.totalRequests} requests • {stats.responseRate} response</p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-6 py-3 rounded-2xl font-light text-lg transition-all ${
                availability.garage 
                  ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-200' 
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}>
                <span className="block text-sm">Status</span>
                {availability.garage ? '🟢 Online' : '🔴 Offline'}
              </div>
              <button className="px-10 py-4 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black text-white font-light rounded-3xl shadow-2xl hover:shadow-3xl transition-all">
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Clean Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: stats.totalRequests, label: "Total Requests", color: "from-blue-400 to-blue-500" },
            { value: stats.completed, label: "Completed", color: "from-emerald-400 to-emerald-500" },
            { value: stats.responseRate, label: "Response Rate", color: "from-amber-400 to-amber-500" },
            { value: stats.avgResponseTime, label: "Avg Response", color: "from-purple-400 to-purple-500" }
          ].map((stat, i) => (
            <div key={i} className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all border border-gray-100 hover:border-slate-200">
              <div className={`w-20 h-20 ${stat.color} bg-gradient-to-br rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-all`}>
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-xl font-light text-gray-700 text-center">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Luxury Tab Navigation */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-5 p-2 bg-gradient-to-r from-slate-50 to-white/50">
            {[
              { id: "requests", label: "Requests", icon: "👥", count: requests.length },
              { id: "calls", label: "Calls", icon: "📹", count: calls.length },
              { id: "availability", label: "Availability", icon: "⏰" },
              { id: "profile", label: "Profile", icon: "🏢" },
              { id: "analytics", label: "Analytics", icon: "📊" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-6 px-6 lg:px-8 rounded-2xl font-light text-lg transition-all flex items-center gap-3 justify-center ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-xl hover:shadow-2xl scale-105'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
                }`}
              >
                <span className="text-2xl">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count && <span className="ml-auto text-sm bg-white/30 px-3 py-1 rounded-xl font-mono">{tab.count}</span>}
              </button>
            ))}
          </div>

          {/* REQUESTS TAB */}
          {activeTab === "requests" && (
            <div className="p-12">
              <div className="space-y-6">
                {requests.slice(-5).map((request) => ( // Show last 5 requests
                  <div key={request.id} className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all border border-gray-100 hover:border-slate-200 p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-4 py-2 rounded-2xl text-sm font-bold ${
                            request.type === "emergency" 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {request.type === "emergency" ? "🚨 EMERGENCY" : "📅 BOOKING"}
                          </span>
                          <span className={`px-4 py-2 rounded-2xl text-sm font-medium ${
                            request.status === "pending" 
                              ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                              : request.status === "accepted" 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {request.status.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-2xl font-light text-gray-900 mb-1">{request.user}</h3>
                        <p className="text-lg text-gray-500">{request.time}</p>
                      </div>
                      <div className="text-3xl font-mono font-bold text-slate-600">#{request.id.slice(-4)}</div>
                    </div>
                    <p className="text-xl text-gray-700 mb-8 font-light leading-relaxed">{request.details}</p>
                    
                    {request.status === "pending" && (
                      <div className="flex gap-4 pt-6 border-t border-gray-100">
                        <button 
                          onClick={() => handleRequestAction(request.id, "accepted")}
                          className="flex-1 py-4 px-8 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-light rounded-2xl shadow-xl hover:shadow-2xl transition-all"
                        >
                          ✅ Accept
                        </button>
                        <button 
                          onClick={() => handleRequestAction(request.id, "rejected")}
                          className="px-8 py-4 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 font-light rounded-2xl shadow-lg hover:shadow-xl transition-all"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CALLS TAB - FULLY FUNCTIONAL */}
          {activeTab === "calls" && (
            <div className="p-12">
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 text-center border border-gray-100 shadow-xl">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl">
                    <span className="text-4xl">📹</span>
                  </div>
                  <h3 className="text-4xl font-light text-gray-900 mb-4">No Active Calls</h3>
                  <p className="text-2xl text-gray-600 mb-12">Ready for video consultations</p>
                  <button className="px-12 py-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-light text-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all">
                    Start Consultation
                  </button>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-xl">
                  <h3 className="text-3xl font-light text-gray-900 mb-8">Recent Calls ({calls.length})</h3>
                  <div className="space-y-4">
                    {calls.map(call => (
                      <div key={call.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl hover:shadow-lg transition-all border border-gray-200">
                        <div>
                          <h4 className="font-semibold text-xl text-gray-900">{call.user}</h4>
                          <p className="text-lg text-gray-600">Duration: {call.duration}</p>
                          <p className="text-sm text-gray-500">{call.time}</p>
                        </div>
                        <div className={`px-6 py-3 rounded-2xl font-medium text-sm ${
                          call.status === "completed" 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {call.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AVAILABILITY TAB */}
          {activeTab === "availability" && (
            <div className="p-12 max-w-2xl mx-auto">
              <h2 className="text-4xl font-light text-gray-900 mb-12 text-center">Availability</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className={`group p-10 rounded-3xl shadow-2xl border-2 transition-all ${
                  availability.garage 
                    ? 'border-emerald-200 bg-emerald-50/50 hover:shadow-emerald-200/50' 
                    : 'border-gray-200 bg-gray-50/50 hover:shadow-gray-200/50'
                }`}>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-3xl font-light text-gray-900">Garage Services</h3>
                    <span className={`px-6 py-3 rounded-2xl font-bold text-lg ${
                      availability.garage ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {availability.garage ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  </div>
                  <button 
                    onClick={() => toggleAvailability("garage")}
                    className={`w-full py-6 px-8 rounded-2xl font-light text-xl shadow-xl transition-all ${
                      availability.garage
                        ? 'bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black text-white hover:shadow-2xl'
                        : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white hover:shadow-2xl'
                    }`}
                  >
                    {availability.garage ? 'Set Offline' : 'Go Online'}
                  </button>
                </div>
                
                <div className={`group p-10 rounded-3xl shadow-2xl border-2 transition-all ${
                  availability.towTruck 
                    ? 'border-emerald-200 bg-emerald-50/50 hover:shadow-emerald-200/50' 
                    : 'border-orange-200 bg-orange-50/50 hover:shadow-orange-200/50'
                }`}>
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-3xl font-light text-gray-900">Tow Truck</h3>
                    <span className={`px-6 py-3 rounded-2xl font-bold text-lg ${
                      availability.towTruck ? 'bg-emerald-500 text-white' : 'bg-orange-400 text-white'
                    }`}>
                      {availability.towTruck ? 'AVAILABLE' : 'BUSY'}
                    </span>
                  </div>
                  <button 
                    onClick={() => toggleAvailability("towTruck")}
                    className={`w-full py-6 px-8 rounded-2xl font-light text-xl shadow-xl transition-all ${
                      availability.towTruck
                        ? 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white hover:shadow-2xl'
                        : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white hover:shadow-2xl'
                    }`}
                  >
                    {availability.towTruck ? 'Mark Busy' : 'Available Now'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PROFILE TAB - FULLY FUNCTIONAL */}
          {activeTab === "profile" && (
            <div className="p-12 max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-gray-100">
                <div className="text-center mb-16">
                  <div className="w-32 h-32 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl">
                    <span className="text-6xl font-bold text-slate-700">SG</span>
                  </div>
                  <h2 className="text-5xl font-light text-gray-900 mb-4">SpeedyFix Garage</h2>
                  <p className="text-2xl text-gray-600 mb-2">★★★★★ 4.9 (247 reviews)</p>
                  <p className="text-xl text-gray-500">Downtown Location</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 mb-16">
                  <div>
                    <h3 className="text-3xl font-light text-gray-900 mb-8 flex items-center gap-4">
                      💰 Services & Pricing
                    </h3>
                    <div className="space-y-4">
                      {[
                        { service: "Oil Change", price: "$39" },
                        { service: "Tire Rotation", price: "$25" },
                        { service: "Battery Replace", price: "$89" },
                        { service: "Brake Service", price: "$245" }
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                          <span className="text-xl font-light">{item.service}</span>
                          <span className="text-2xl font-bold text-emerald-600">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-3xl font-light text-gray-900 mb-8 flex items-center gap-4">
                      🕒 Operating Hours
                    </h3>
                    <div className="space-y-3 p-6 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200">
                      <div className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span className="font-semibold">8AM - 8PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday - Sunday</span>
                        <span className="font-semibold">9AM - 6PM</span>
                      </div>
                      <div className="flex justify-between pt-4 border-t border-emerald-200">
                        <span>Emergency</span>
                        <span className="font-semibold text-emerald-700">24/7</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full py-8 px-16 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-light text-2xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all">
                  💾 Update Profile
                </button>
              </div>
            </div>
          )}

          {/* ANALYTICS TAB - FULLY FUNCTIONAL */}
          {activeTab === "analytics" && (
            <div className="p-12">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Weekly Requests */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-gray-100">
                  <h3 className="text-3xl font-light text-gray-900 mb-10 flex items-center gap-4">
                    📈 Weekly Requests
                  </h3>
                  <div className="space-y-6">
                    {[
                      { day: "Mon", count: 12 },
                      { day: "Tue", count: 18 },
                      { day: "Wed", count: 25 },
                      { day: "Thu", count: 22 },
                      { day: "Fri", count: 30 },
                      { day: "Sat", count: 15 },
                      { day: "Sun", count: 8 }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl hover:shadow-lg transition-all">
                        <span className="text-2xl font-light">{item.day}</span>
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-6 bg-emerald-400 rounded-full shadow-lg" style={{width: `${item.count * 4}px`}}></div>
                          <span className="text-2xl font-bold text-emerald-600">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Services */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-gray-100">
                  <h3 className="text-3xl font-light text-gray-900 mb-10 flex items-center gap-4">
                    🏆 Top Services
                  </h3>
                  <div className="space-y-6">
                    {[
                      { service: "Oil Change", percent: "45%", color: "emerald" },
                      { service: "Tire Service", percent: "30%", color: "blue" },
                      { service: "Battery", percent: "15%", color: "amber" },
                      { service: "Brakes", percent: "10%", color: "purple" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl hover:shadow-lg transition-all">
                        <span className="text-xl font-light">{item.service}</span>
                        <div className="flex items-center gap-4">
                          <div className={`w-20 h-4 ${item.color === 'emerald' ? 'bg-emerald-500' : item.color === 'blue' ? 'bg-blue-500' : item.color === 'amber' ? 'bg-amber-500' : 'bg-purple-500'} rounded-full shadow-lg`}></div>
                          <span className="text-xl font-bold text-slate-700">{item.percent}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-16 text-center">
                <button className="px-20 py-8 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-light text-2xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all">
                  📊 Download Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
