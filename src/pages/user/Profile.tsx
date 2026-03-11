"use client";

import { useState, useEffect } from "react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "Darsh",
    lastName: "Vaghela",
    email: "vagheladarsh69@gmail.com",
    phone: "+91 98765 43210",
    location: "Ahmedabad, Gujarat",
    carModel: "Honda City 2022",
    carNumber: "GJ-01-AB-1234",
  });

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 p-8 pt-32">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-16 shadow-2xl border border-gray-100 text-center mb-16">
          <div className="w-40 h-40 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full mx-auto mb-12 flex items-center justify-center shadow-2xl border-8 border-white">
            <span className="text-5xl font-bold text-slate-700">JD</span>
          </div>
          <h1 className="text-5xl font-light text-gray-900 mb-4">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-2xl text-gray-600 mb-2">{profile.email}</p>
          <p className="text-xl text-gray-500">{profile.location}</p>
          
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="mt-12 px-12 py-6 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-light text-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Personal Info */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-gray-100">
            <h2 className="text-4xl font-light text-gray-900 mb-12 flex items-center gap-4">
              👤 Personal Info
            </h2>
            <div className="space-y-8">
              <div>
                <label className="block text-xl text-gray-700 mb-4 font-medium">Email</label>
                <input 
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  disabled={!isEditing}
                  className="w-full p-6 text-2xl border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xl text-gray-700 mb-4 font-medium">Phone</label>
                <input 
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  disabled={!isEditing}
                  className="w-full p-6 text-2xl border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-gray-100">
            <h2 className="text-4xl font-light text-gray-900 mb-12 flex items-center gap-4">
              🚗 My Vehicle
            </h2>
            <div className="space-y-8">
              <div>
                <label className="block text-xl text-gray-700 mb-4 font-medium">Car Model</label>
                <input 
                  value={profile.carModel}
                  onChange={(e) => setProfile({...profile, carModel: e.target.value})}
                  disabled={!isEditing}
                  className="w-full p-6 text-2xl border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xl text-gray-700 mb-4 font-medium">Car Number</label>
                <input 
                  value={profile.carNumber}
                  onChange={(e) => setProfile({...profile, carNumber: e.target.value})}
                  disabled={!isEditing}
                  className="w-full p-6 text-2xl border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-16 text-center">
            <button 
              onClick={handleSave}
              className="px-20 py-8 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-light text-2xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all"
            >
              💾 Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
