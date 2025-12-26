import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Wrench,
  MapPin,
  Clock,
  DollarSign,
  Phone,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Settings,
  LogOut,
  Bell,
  TrendingUp,
  Users,
  Star,
  MessageSquare,
  Navigation,
  Video,
  PhoneCall,
  Mail,
  X,
} from "lucide-react";

const GaragerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userName, setUserName] = useState("Garage Owner");
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);
  const [selectedCall, setSelectedCall] = useState<any>(null);

  // Get user info on mount
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const garageName = localStorage.getItem("garageName");
    if (storedName) {
      setUserName(storedName);
    }
    
    // Check authentication
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    
    if (!token || role !== "garager") {
      toast.error("Please login as garager to access this page");
      navigate("/login");
    }
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("garageName");
    
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  // Settings handler
  const handleSettings = () => {
    toast.info("Settings page coming soon!");
  };

  // Notifications handler
  const handleNotifications = () => {
    toast.info("You have 2 new emergency alerts!");
  };

  // Sample data
  const stats = [
    {
      title: "Today's Bookings",
      value: "12",
      change: "+3 from yesterday",
      icon: Calendar,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Calls",
      value: "3",
      change: "2 emergency",
      icon: Phone,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Today's Revenue",
      value: "$850",
      change: "+12% from avg",
      icon: DollarSign,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "Rating",
      value: "4.8",
      change: "125 reviews",
      icon: Star,
      color: "from-orange-500 to-yellow-500",
      bgColor: "bg-orange-50",
    },
  ];

  const emergencyAlerts = [
    {
      id: 1,
      user: "User123",
      phone: "+91 98765 43210",
      issue: "Car breakdown - Battery dead",
      location: "Highway 101, Mile 25",
      time: "5 mins ago",
      priority: "high",
    },
    {
      id: 2,
      user: "Sarah Wilson",
      phone: "+91 87654 32109",
      issue: "Flat tire assistance",
      location: "Downtown Plaza",
      time: "15 mins ago",
      priority: "medium",
    },
  ];

  const bookingRequests = [
    {
      id: 1,
      customer: "John Doe",
      phone: "+91 98765 12345",
      service: "Tow Truck Service",
      time: "2:00 PM",
      date: "Today",
      status: "pending",
    },
    {
      id: 2,
      customer: "Emma Davis",
      phone: "+91 87654 12345",
      service: "Engine Repair",
      time: "4:30 PM",
      date: "Today",
      status: "pending",
    },
    {
      id: 3,
      customer: "Mike Johnson",
      phone: "+91 76543 12345",
      service: "Oil Change",
      time: "10:00 AM",
      date: "Tomorrow",
      status: "confirmed",
    },
  ];

  const recentCalls = [
    {
      customer: "Alex Brown",
      service: "Tire Replacement",
      duration: "45 mins",
      status: "completed",
      time: "2 hours ago",
    },
    {
      customer: "Lisa Martin",
      service: "Battery Jump Start",
      duration: "20 mins",
      status: "completed",
      time: "4 hours ago",
    },
  ];

  // Handle emergency response
  const handleEmergencyResponse = (alert: any) => {
    toast.success(`Responding to ${alert.user}'s emergency!`);
    // You can add actual emergency response logic here
  };

  // Handle phone call
  const handlePhoneCall = (phoneNumber: string, userName: string) => {
    toast.success(`Calling ${userName} at ${phoneNumber}`);
    // On mobile, this will actually initiate a call
    window.location.href = `tel:${phoneNumber}`;
  };

  // Handle video call
  const handleVideoCall = (customer: any) => {
    setSelectedCall(customer);
    setShowVideoCallModal(true);
    toast.info(`Initiating video call with ${customer.user || customer.customer}...`);
  };

  // Handle navigation
  const handleNavigate = (location: string) => {
    toast.info(`Opening navigation to ${location}`);
    // Open Google Maps
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank');
  };

  // Handle accept booking
  const handleAcceptBooking = (booking: any) => {
    toast.success(`Booking accepted for ${booking.customer}!`);
    // Add API call to accept booking
  };

  // Handle reject booking
  const handleRejectBooking = (booking: any) => {
    toast.error(`Booking rejected for ${booking.customer}`);
    // Add API call to reject booking
  };

  // Handle view details
  const handleViewDetails = (customer: string) => {
    toast.info(`Viewing details for ${customer}`);
  };

  // Close video call modal
  const closeVideoCallModal = () => {
    setShowVideoCallModal(false);
    setSelectedCall(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100">
      {/* Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  My Garage
                </h1>
                <p className="text-xs text-gray-500">AutoFix Services</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={handleNotifications}
                className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={handleSettings}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userName}! 🔧
          </h2>
          <p className="text-gray-600">
            Manage your bookings, emergency calls, and services
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:-translate-y-1 cursor-pointer"
                onClick={() => toast.info(`Viewing ${stat.title} details`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <Icon className="w-6 h-6 text-gray-700" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-xs text-gray-500">{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-gray-200 p-1 rounded-xl shadow-sm">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-lg px-6"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="emergency"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-lg px-6"
            >
              Emergency
            </TabsTrigger>
            <TabsTrigger
              value="bookings"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-lg px-6"
            >
              Bookings
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-lg px-6"
            >
              Services
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Emergency Alerts */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      Emergency Alerts
                    </CardTitle>
                    <span className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
                      {emergencyAlerts.length} Active
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {emergencyAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="p-4 border-l-4 border-red-500 bg-red-50 rounded-r-xl"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {alert.user}
                          </h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              alert.priority === "high"
                                ? "bg-red-200 text-red-800"
                                : "bg-yellow-200 text-yellow-800"
                            }`}
                          >
                            {alert.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          {alert.issue}
                        </p>
                        <p className="text-xs text-gray-600 flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3" />
                          {alert.location}
                        </p>
                        <p className="text-xs text-gray-500 mb-3">
                          {alert.time}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleEmergencyResponse(alert)}
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            Respond
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePhoneCall(alert.phone, alert.user)}
                          >
                            <PhoneCall className="w-4 h-4 mr-1" />
                            Call
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-blue-50 hover:bg-blue-100"
                            onClick={() => handleVideoCall(alert)}
                          >
                            <Video className="w-4 h-4 mr-1" />
                            Video
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleNavigate(alert.location)}
                          >
                            <Navigation className="w-4 h-4 mr-1" />
                            Navigate
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Booking Requests */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      Booking Requests
                    </CardTitle>
                    <button 
                      onClick={() => toast.info("Viewing all bookings")}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View All
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {bookingRequests.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {booking.customer}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {booking.service}
                            </p>
                          </div>
                          <span
                            className={`text-xs px-3 py-1 rounded-full ${
                              booking.status === "confirmed"
                                ? "bg-green-200 text-green-800"
                                : "bg-yellow-200 text-yellow-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {booking.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {booking.date}
                          </span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {booking.status === "pending" ? (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleAcceptBooking(booking)}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejectBooking(booking)}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          ) : null}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePhoneCall(booking.phone, booking.customer)}
                          >
                            <PhoneCall className="w-4 h-4 mr-1" />
                            Call
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-blue-50 hover:bg-blue-100"
                            onClick={() => handleVideoCall(booking)}
                          >
                            <Video className="w-4 h-4 mr-1" />
                            Video
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Call History */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm lg:col-span-2">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Phone className="w-5 h-5 text-green-600" />
                    Recent Call History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {recentCalls.length === 0 ? (
                    <div className="text-center py-12">
                      <Phone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No active calls at the moment</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentCalls.map((call, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center">
                              <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {call.customer}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {call.service}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {call.time} • Duration: {call.duration}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                            {call.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs remain same */}
          <TabsContent value="emergency">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Emergency Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">All emergency alerts and response system</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Manage all your bookings and appointments</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-teal-600" />
                    Services Offered
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {[
                      "Tow Truck Service",
                      "Engine Repair",
                      "Oil Change",
                      "Tire Replacement",
                      "Battery Service",
                      "Brake Repair",
                    ].map((service, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => toast.info(`Service: ${service}`)}
                      >
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700">{service}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      Pricing & Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                        <p className="text-2xl font-bold text-gray-900">
                          9:00 AM - 7:00 PM
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Operating Hours</p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                        <p className="text-2xl font-bold text-gray-900">$50/hour</p>
                        <p className="text-sm text-gray-600 mt-1">Standard Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-red-600" />
                      Garage Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-700 mb-4">123 Main St, City</p>
                    <Button 
                      className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:shadow-lg"
                      onClick={() => handleNavigate("123 Main St, City")}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Video Call Modal */}
      {showVideoCallModal && selectedCall && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-white shadow-2xl">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-blue-600" />
                  Video Call with {selectedCall.user || selectedCall.customer}
                </CardTitle>
                <button
                  onClick={closeVideoCallModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center mb-4">
                <div className="text-center">
                  <Video className="w-16 h-16 text-white mx-auto mb-4" />
                  <p className="text-white text-lg font-semibold">
                    Connecting to {selectedCall.user || selectedCall.customer}...
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Video call will be available soon
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="destructive"
                  onClick={closeVideoCallModal}
                  className="flex-1"
                >
                  <Phone className="w-4 h-4 mr-2 rotate-135" />
                  End Call
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.info("Mute toggled")}
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GaragerDashboard;
