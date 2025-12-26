import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  MapPin,
  Phone,
  Star,
  Navigation,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Video,
  X,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
} from "lucide-react";

const Home = () => {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedGarage, setSelectedGarage] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const stats = [
    { title: "Nearby Garages", value: "24", icon: MapPin, bgColor: "bg-blue-50" },
    { title: "Emergency Calls", value: "3", icon: AlertTriangle, bgColor: "bg-red-50" },
    { title: "My Bookings", value: "5", icon: Calendar, bgColor: "bg-green-50" },
    { title: "Avg Rating", value: "4.8", icon: Star, bgColor: "bg-orange-50" },
  ];

  const topGarages = [
    { _id: "1", garageName: "QuickFix Auto", rating: 4.9, reviewCount: 234, phone: "9876543210", isActive: true, distance: "1.2 km" },
    { _id: "2", garageName: "Speedy Repairs", rating: 4.7, reviewCount: 189, phone: "9876543211", isActive: true, distance: "2.5 km" },
    { _id: "3", garageName: "AutoCare Pro", rating: 4.8, reviewCount: 312, phone: "9876543212", isActive: false, distance: "3.1 km" }
  ];

  const handleVideoCall = (garage: any) => {
    setSelectedGarage(garage);
    setShowVideoModal(true);
    toast.success(`Initiating video call with ${garage.garageName}`);
  };

  const handleEndCall = () => {
    setShowVideoModal(false);
    setSelectedGarage(null);
    setIsMuted(false);
    setIsVideoOff(false);
    toast.info("Video call ended");
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-6">
                <div className={`p-3 rounded-2xl ${stat.bgColor} w-fit mb-4`}>
                  <Icon className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="/dashboard/emergency"
              className="flex items-center bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl py-4 px-4 transition-all hover:scale-105 no-underline"
            >
              <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold">Emergency Call</div>
                <div className="text-xs opacity-90">24/7 Available</div>
              </div>
            </a>
            <a 
              href="/dashboard/garages"
              className="flex items-center bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl py-4 px-4 transition-all hover:scale-105 no-underline"
            >
              <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold">Find Garage</div>
                <div className="text-xs opacity-90">Search Nearby</div>
              </div>
            </a>
            <a 
              href="/dashboard/garages"
              className="flex items-center bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl py-4 px-4 transition-all hover:scale-105 no-underline"
            >
              <Calendar className="w-5 h-5 mr-2 flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold">Book Service</div>
                <div className="text-xs opacity-90">Schedule Now</div>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Top Rated Garages with Video Call */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Top Rated Garages
            </span>
            <a href="/dashboard/garages" className="text-blue-600 text-sm hover:underline">
              View All
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {topGarages.map((garage) => (
              <div
                key={garage._id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{garage.garageName}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {garage.rating} ({garage.reviewCount})
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <Navigation className="w-4 h-4" />
                        {garage.distance}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-center ${
                    garage.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {garage.isActive ? "Available" : "Busy"}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => window.location.href = `tel:${garage.phone}`}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleVideoCall(garage)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl"
                    >
                      <Video className="w-4 h-4 mr-1" />
                      Video
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Video Call Modal */}
      {showVideoModal && selectedGarage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            {/* Video Header */}
            <div className="bg-gray-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{selectedGarage.garageName}</h3>
                  <p className="text-sm text-gray-400">Video Call in Progress</p>
                </div>
              </div>
              <Button
                onClick={handleEndCall}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Video Display Area */}
            <div className="relative bg-gray-900 aspect-video flex items-center justify-center">
              {/* Remote Video (Garage) */}
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-16 h-16 text-white" />
                  </div>
                  <p className="text-white text-xl font-semibold mb-2">{selectedGarage.garageName}</p>
                  <p className="text-gray-400">Connecting to video...</p>
                </div>
              </div>

              {/* Local Video (User - Picture in Picture) */}
              <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-700 shadow-lg">
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  {isVideoOff ? (
                    <VideoOff className="w-12 h-12 text-gray-500" />
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white text-2xl font-bold">You</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Video Controls */}
            <div className="bg-gray-800 p-6">
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`rounded-full w-14 h-14 ${
                    isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </Button>
                <Button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`rounded-full w-14 h-14 ${
                    isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </Button>
                <Button
                  onClick={handleEndCall}
                  className="rounded-full w-14 h-14 bg-red-600 hover:bg-red-700"
                >
                  <PhoneOff className="w-6 h-6" />
                </Button>
              </div>
              <p className="text-center text-gray-400 text-sm mt-4">
                {isMuted && "Microphone is muted"} {isVideoOff && "Camera is off"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
