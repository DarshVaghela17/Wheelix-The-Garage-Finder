import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  Camera,
  Shield,
  Bell,
  CreditCard,
  Car,
} from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "+91 98765 43210",
    location: "Ahmedabad, Gujarat",
    carModel: "Honda City 2022",
    carNumber: "GJ-01-AB-1234",
  });

  useEffect(() => {
    const firstName = localStorage.getItem("userName") || "User";
    const email = localStorage.getItem("userEmail") || "user@example.com";
    setProfile({ ...profile, firstName, email });
  }, []);

  const handleSave = () => {
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    toast.info("Password change feature coming soon!");
  };

  const handlePaymentSettings = () => {
    toast.info("Payment settings coming soon!");
  };

  const handleNotificationSettings = () => {
    toast.info("Notification settings coming soon!");
  };

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <CardContent className="p-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-4 border-white/30">
                {profile.firstName.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Camera className="w-4 h-4 text-blue-600" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-white/90 text-lg">{profile.email}</p>
              <div className="flex gap-2 mt-3">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                  Regular User
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                  Member since 2024
                </span>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/30 rounded-2xl"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  First Name
                </label>
                <Input
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile({ ...profile, firstName: e.target.value })
                  }
                  disabled={!isEditing}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Last Name
                </label>
                <Input
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile({ ...profile, lastName: e.target.value })
                  }
                  disabled={!isEditing}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <Input
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                disabled={!isEditing}
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone
              </label>
              <Input
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                disabled={!isEditing}
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              <Input
                value={profile.location}
                onChange={(e) =>
                  setProfile({ ...profile, location: e.target.value })
                }
                disabled={!isEditing}
                className="rounded-xl"
              />
            </div>
            {isEditing && (
              <Button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl py-6"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Vehicle & Settings */}
        <div className="space-y-6">
          {/* Vehicle Info */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600" />
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Car Model
                </label>
                <Input
                  value={profile.carModel}
                  onChange={(e) =>
                    setProfile({ ...profile, carModel: e.target.value })
                  }
                  disabled={!isEditing}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  License Plate
                </label>
                <Input
                  value={profile.carNumber}
                  onChange={(e) =>
                    setProfile({ ...profile, carNumber: e.target.value })
                  }
                  disabled={!isEditing}
                  className="rounded-xl"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Settings */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b">
              <CardTitle>Quick Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Button
                onClick={handleChangePassword}
                variant="outline"
                className="w-full justify-start rounded-xl border-2 hover:bg-gray-50"
              >
                <Shield className="w-5 h-5 mr-3 text-blue-600" />
                Change Password
              </Button>
              <Button
                onClick={handlePaymentSettings}
                variant="outline"
                className="w-full justify-start rounded-xl border-2 hover:bg-gray-50"
              >
                <CreditCard className="w-5 h-5 mr-3 text-green-600" />
                Payment Methods
              </Button>
              <Button
                onClick={handleNotificationSettings}
                variant="outline"
                className="w-full justify-start rounded-xl border-2 hover:bg-gray-50"
              >
                <Bell className="w-5 h-5 mr-3 text-orange-600" />
                Notifications
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
