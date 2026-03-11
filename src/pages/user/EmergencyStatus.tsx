import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import {
  AlertTriangle,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Navigation,
  Video,
  PhoneCall,
  Siren,
  Loader2,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface EmergencyCall {
  _id: string;
  status: string;
  garage?: {
    garageName: string;
    phone: string;
    location: {
      address: string;
    };
  };
  issueDescription: string;
  location: {
    address: string;
  };
  priority: string;
  createdAt: string;
  respondedAt?: string;
}

const EmergencyStatus = () => {
  const [emergencies, setEmergencies] = useState<EmergencyCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    issueDescription: "",
    location: "",
    priority: "high"
  });

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchEmergencies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/user/emergencies`,
        getAuthHeaders()
      );
      
      if (response.data.success) {
        setEmergencies(response.data.emergencies);
      }
    } catch (error: any) {
      console.error("Fetch emergencies error:", error);
      toast.error(error.response?.data?.message || "Failed to load emergencies");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEmergency = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.issueDescription.trim()) {
      toast.error("Please describe your emergency");
      return;
    }
    
    if (!formData.location.trim()) {
      toast.error("Please provide your location");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.post(
        `${API_URL}/user/emergencies`,
        {
          issueDescription: formData.issueDescription,
          location: { address: formData.location },
          priority: formData.priority
        },
        getAuthHeaders()
      );
      
      if (response.data.success) {
        toast.success("Emergency call created! Help is on the way!");
        setShowEmergencyForm(false);
        setFormData({ issueDescription: "", location: "", priority: "high" });
        await fetchEmergencies();
      }
    } catch (error: any) {
      console.error("Create emergency error:", error);
      toast.error(error.response?.data?.message || "Failed to create emergency call");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCall = (phone: string, garage: string) => {
    toast.success(`Calling ${garage}`);
    window.location.href = `tel:${phone}`;
  };

  const handleVideoCall = (garage: string) => {
    toast.info(`Initiating video call with ${garage}`);
  };

  const handleNavigate = (address: string) => {
    toast.info(`Opening navigation to ${address}`);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      "_blank"
    );
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this emergency?")) return;
    
    try {
      const response = await axios.patch(
        `${API_URL}/user/emergencies/${id}/cancel`,
        {},
        getAuthHeaders()
      );
      
      if (response.data.success) {
        toast.success("Emergency cancelled");
        await fetchEmergencies();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel emergency");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading emergencies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Emergency Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-red-600 to-pink-600 text-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Siren className="w-8 h-8 animate-pulse" />
                Emergency Services
              </h2>
              <p className="text-white/90 text-lg">
                24/7 assistance for your vehicle emergencies
              </p>
            </div>
            <Button
              onClick={() => setShowEmergencyForm(true)}
              className="bg-white text-red-600 hover:bg-gray-100 rounded-2xl px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Phone className="w-6 h-6 mr-2" />
              Call Emergency
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Form Modal */}
      {showEmergencyForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-white shadow-2xl">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  Request Emergency Service
                </span>
                <button
                  onClick={() => setShowEmergencyForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  disabled={submitting}
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmitEmergency} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Issue Description *
                  </label>
                  <Textarea
                    value={formData.issueDescription}
                    onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500"
                    rows={3}
                    placeholder="Describe your emergency (e.g., Car breakdown, flat tire, battery dead)"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Location *
                  </label>
                  <Input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500"
                    placeholder="Enter your current location or address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500"
                  >
                    <option value="high">High - Immediate Help Needed</option>
                    <option value="medium">Medium - Need Help Soon</option>
                    <option value="low">Low - Not Urgent</option>
                  </select>
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 py-6 rounded-2xl text-lg"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Phone className="w-5 h-5 mr-2" />
                      Send Emergency Request
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active Emergencies */}
      <div className="space-y-4">
        {emergencies.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Active Emergencies
              </h3>
              <p className="text-gray-600 mb-6">
                You don't have any active emergency requests
              </p>
              <Button
                onClick={() => setShowEmergencyForm(true)}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-xl"
              >
                <Phone className="w-5 h-5 mr-2" />
                Create Emergency Call
              </Button>
            </CardContent>
          </Card>
        ) : (
          emergencies.map((emergency) => (
            <Card
              key={emergency._id}
              className={`border-0 shadow-lg transition-all duration-300 hover:shadow-xl ${
                emergency.status === "pending" || emergency.status === "active"
                  ? "border-l-4 border-red-500 bg-red-50"
                  : "border-l-4 border-green-500 bg-green-50"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        emergency.status === "pending" || emergency.status === "active"
                          ? "bg-red-100"
                          : "bg-green-100"
                      }`}
                    >
                      {emergency.status === "pending" || emergency.status === "active" ? (
                        <AlertTriangle className="w-7 h-7 text-red-600 animate-pulse" />
                      ) : (
                        <CheckCircle className="w-7 h-7 text-green-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {emergency.garage?.garageName || "Waiting for Response"}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            emergency.priority === "high"
                              ? "bg-red-200 text-red-800"
                              : emergency.priority === "medium"
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-blue-200 text-blue-800"
                          }`}
                        >
                          {emergency.priority} priority
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3 font-medium">
                        {emergency.issueDescription}
                      </p>
                      <div className="flex flex-col gap-2 text-sm text-gray-600">
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {emergency.location?.address || "Location not specified"}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Created: {new Date(emergency.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      emergency.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : emergency.status === "active" || emergency.status === "responded"
                        ? "bg-blue-100 text-blue-800"
                        : emergency.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {emergency.status}
                  </span>
                </div>

                <div className="flex gap-3 flex-wrap">
                  {emergency.garage && (
                    <>
                      <Button
                        onClick={() => handleCall(emergency.garage!.phone, emergency.garage!.garageName)}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl"
                      >
                        <PhoneCall className="w-4 h-4 mr-2" />
                        Call Garage
                      </Button>
                      <Button
                        onClick={() => handleVideoCall(emergency.garage!.garageName)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Video Call
                      </Button>
                      <Button
                        onClick={() => handleNavigate(emergency.garage!.location.address)}
                        variant="outline"
                        className="rounded-xl border-2"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Navigate
                      </Button>
                    </>
                  )}
                  {(emergency.status === "pending" || emergency.status === "active") && (
                    <Button
                      onClick={() => handleCancel(emergency._id)}
                      variant="destructive"
                      className="rounded-xl"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Emergency
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default EmergencyStatus;
