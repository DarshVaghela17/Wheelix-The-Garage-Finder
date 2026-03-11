import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { Device } from '@twilio/voice-sdk';
import {
  MapPin,
  Phone,
  Star,
  Clock,
  Navigation,
  Search,
  Calendar,
  DollarSign,
  Filter,
  Loader2,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface Garage {
  _id: string;
  name: string;
  rating: number;
  reviews: number;
  distance: string;
  price: string;
  hours: string;
  services: string[];
  available: boolean;
  phone: string;
  location?: {
    address: string;
    city: string;
  };
}

const GarageList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [garages, setGarages] = useState<Garage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [selectedGarage, setSelectedGarage] = useState<Garage | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [bookingData, setBookingData] = useState({
    service: '',
    scheduledTime: '',
    description: ''
  });
  
  // Twilio Voice Call states
  const [twilioDevice, setTwilioDevice] = useState<Device | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentCallRef = useRef<any>(null);

  useEffect(() => {
    fetchGarages();
    initializeTwilioDevice();
    
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
      if (twilioDevice) {
        twilioDevice.destroy();
      }
    };
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Initialize Twilio Device for browser calls
  const initializeTwilioDevice = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/user/call/token`,
        {},
        getAuthHeaders()
      );

      if (response.data.success) {
        const device = new Device(response.data.token, {
          logLevel: 1,
          codecPreferences: ['opus', 'pcmu'],
        });

        device.on('registered', () => {
          console.log('✅ Twilio Device Ready');
        });

        device.on('error', (error: any) => {
          console.error('❌ Twilio Device Error:', error);
        });

        await device.register();
        setTwilioDevice(device);
      }
    } catch (error) {
      console.error('Initialize Twilio error:', error);
      // Silent fail - will use mobile dialer as fallback
    }
  };

  const fetchGarages = async (search = '') => {
    try {
      setLoading(true);
      const url = search 
        ? `${API_URL}/user/garages/search?query=${search}`
        : `${API_URL}/user/garages`;
      
      const response = await axios.get(url, getAuthHeaders());
      
      if (response.data.success) {
        setGarages(response.data.garages);
      }
    } catch (error: any) {
      console.error('Fetch garages error:', error);
      
      // Fallback to mock data
      setGarages([
        {
          _id: '1',
          name: "QuickFix Auto",
          rating: 4.9,
          reviews: 234,
          distance: "1.2 km",
          price: "₹500/hr",
          hours: "9 AM - 7 PM",
          services: ["Towing", "Repair", "Inspection"],
          available: true,
          phone: "+919876543210"
        },
        {
          _id: '2',
          name: "Speedy Repairs",
          rating: 4.7,
          reviews: 189,
          distance: "2.5 km",
          price: "₹450/hr",
          hours: "8 AM - 6 PM",
          services: ["Engine", "Brakes", "Oil Change"],
          available: true,
          phone: "+919876543211"
        },
        {
          _id: '3',
          name: "AutoCare Pro",
          rating: 4.8,
          reviews: 312,
          distance: "3.1 km",
          price: "₹550/hr",
          hours: "10 AM - 8 PM",
          services: ["Full Service", "Diagnostics"],
          available: false,
          phone: "+919876543212"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchGarages(searchQuery);
    } else {
      fetchGarages();
    }
  };

  // Check if mobile device
  const isMobileDevice = () => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  };

  // Handle call initiation
  const handleCall = async (garage: Garage) => {
    setSelectedGarage(garage);
    
    if (isMobileDevice()) {
      // Mobile: Use native phone dialer
      window.location.href = `tel:${garage.phone}`;
    } else {
      // Desktop: Use Twilio voice call
      if (!twilioDevice) {
        toast.error('Call service not available. Please refresh the page.');
        return;
      }
      
      setShowCallDialog(true);
      await makeRealCall(garage);
    }
  };

  // Make real phone call using Twilio
  const makeRealCall = async (garage: Garage) => {
    try {
      setIsConnecting(true);
      toast.info(`Calling ${garage.name}...`);

      // Make call using Twilio Device
      const call = await twilioDevice!.connect({
        params: {
          To: garage.phone
        }
      });

      currentCallRef.current = call;

      // Call accepted - Connected
      call.on('accept', () => {
        setIsConnecting(false);
        setIsCallActive(true);
        startCallTimer();
        toast.success(`Connected to ${garage.name}`);
      });

      // Call rejected or failed
      call.on('reject', () => {
        toast.error('Call was rejected');
        handleCallEnd();
      });

      // Call disconnected
      call.on('disconnect', () => {
        handleCallEnd();
      });

      // Call error
      call.on('error', (error: any) => {
        console.error('Call error:', error);
        toast.error('Call failed. Please try again.');
        handleCallEnd();
      });

    } catch (error: any) {
      console.error('Make call error:', error);
      toast.error(error.message || 'Failed to initiate call');
      setShowCallDialog(false);
      setIsConnecting(false);
    }
  };

  const startCallTimer = () => {
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    if (currentCallRef.current) {
      currentCallRef.current.mute(!isMuted);
      setIsMuted(!isMuted);
      toast.info(isMuted ? 'Microphone unmuted' : 'Microphone muted');
    }
  };

  const endCall = () => {
    if (twilioDevice) {
      twilioDevice.disconnectAll();
    }
    handleCallEnd();
  };

  const handleCallEnd = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    
    currentCallRef.current = null;
    setIsCallActive(false);
    setIsConnecting(false);
    setCallDuration(0);
    setIsMuted(false);
    setShowCallDialog(false);
    toast.info('Call ended');
  };

  const handleBook = (garage: Garage) => {
    setSelectedGarage(garage);
    setShowBookingDialog(true);
  };

  const handleSubmitBooking = async () => {
    if (!selectedGarage) return;

    if (!bookingData.service || !bookingData.scheduledTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/user/garages/${selectedGarage._id}/book`,
        bookingData,
        getAuthHeaders()
      );

      if (response.data.success) {
        toast.success('Booking created successfully!');
        setShowBookingDialog(false);
        setBookingData({ service: '', scheduledTime: '', description: '' });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    }
  };

  const handleNavigate = (garage: Garage) => {
    const address = garage.location?.address || garage.name;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading garages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search garages by name or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 pr-4 py-6 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 rounded-2xl"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="rounded-2xl border-2"
              onClick={() => toast.info("Filter options coming soon")}
            >
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Garage Cards */}
      {garages.length === 0 ? (
        <Card className="border-0 shadow-lg bg-white/80">
          <CardContent className="p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No garages found
            </h3>
            <p className="text-gray-600">Try searching with different keywords</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {garages.map((garage) => (
            <Card
              key={garage._id}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden group"
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Garage Image */}
                  <div className="w-full md:w-48 h-48 md:h-auto bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center relative overflow-hidden">
                    <MapPin className="w-16 h-16 text-white/20 absolute" />
                    <span className="text-white font-bold text-2xl relative z-10">
                      {garage.name.charAt(0)}
                    </span>
                  </div>

                  {/* Garage Info */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {garage.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {garage.rating} ({garage.reviews} reviews)
                          </span>
                          <span className="flex items-center gap-1">
                            <Navigation className="w-4 h-4" />
                            {garage.distance}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          garage.available
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {garage.available ? "Available" : "Busy"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {garage.services.map((service, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                        >
                          {service}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {garage.hours}
                      </span>
                      <span className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        {garage.price}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleCall(garage)}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        {isMobileDevice() ? 'Call Now' : 'Voice Call'}
                      </Button>
                      <Button
                        onClick={() => handleBook(garage)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Service
                      </Button>
                      <Button
                        onClick={() => handleNavigate(garage)}
                        variant="outline"
                        className="rounded-xl border-2"
                      >
                        <Navigation className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Voice Call Dialog (Desktop) */}
      {showCallDialog && selectedGarage && (
        <Dialog open={showCallDialog} onOpenChange={(open) => !isCallActive && !isConnecting && setShowCallDialog(open)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">
                {isConnecting ? 'Calling...' : isCallActive ? 'Voice Call' : 'Call'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-6">
              {/* Garage Avatar */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center mb-4 relative">
                  {isConnecting && (
                    <div className="absolute inset-0 rounded-full border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                  )}
                  <span className="text-white text-4xl font-bold">
                    {selectedGarage.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold">{selectedGarage.name}</h3>
                <p className="text-gray-500 text-sm mt-1">
                  {selectedGarage.phone}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {isConnecting ? 'Connecting...' : isCallActive ? formatCallDuration(callDuration) : 'Ready'}
                </p>
              </div>

              {/* Call Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={toggleMute}
                  variant="outline"
                  size="lg"
                  className={`rounded-full w-14 h-14 ${isMuted ? 'bg-red-50 border-red-200' : ''}`}
                  disabled={!isCallActive}
                >
                  {isMuted ? <MicOff className="w-5 h-5 text-red-600" /> : <Mic className="w-5 h-5" />}
                </Button>
                
                <Button
                  onClick={endCall}
                  size="lg"
                  className="rounded-full w-14 h-14 bg-red-600 hover:bg-red-700"
                  disabled={!isCallActive && !isConnecting}
                >
                  <PhoneOff className="w-5 h-5" />
                </Button>
              </div>

              <p className="text-center text-xs text-gray-500">
                {isConnecting && "Connecting to garage..."}
                {isCallActive && "Voice call active • Tap to end"}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Booking Dialog */}
      {showBookingDialog && selectedGarage && (
        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Book Service at {selectedGarage.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="service">Service Type *</Label>
                <Input
                  id="service"
                  placeholder="e.g., Oil Change, Tire Rotation"
                  value={bookingData.service}
                  onChange={(e) => setBookingData({ ...bookingData, service: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="scheduledTime">Scheduled Date & Time *</Label>
                <Input
                  id="scheduledTime"
                  type="datetime-local"
                  value={bookingData.scheduledTime}
                  onChange={(e) => setBookingData({ ...bookingData, scheduledTime: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Additional Details</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your vehicle issue..."
                  value={bookingData.description}
                  onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <Button
                onClick={handleSubmitBooking}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Confirm Booking
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default GarageList;
