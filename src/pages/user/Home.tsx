import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🔥 ADDED
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin, Phone } from "lucide-react";

export default function DashboardUser() {
  const navigate = useNavigate(); // 🔥 ADDED NAVIGATION
  
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    garage: "",
    service: "",
    date: new Date(),
    time: "",
    phone: "",
    vehicle: "",
  });
  const [success, setSuccess] = useState(false);

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setBookingData(prev => ({ ...prev, date: date || new Date() }));
  };

  const calculateAmount = (service: string) => {
    const prices: Record<string, string> = {
      "Oil Change": "₹1500",
      "Brake Service": "₹3500",
      "Tire Replacement": "₹4500", 
      "Full Service": "₹7500"
    };
    return prices[service] || "₹2000";
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("🚗 Booking submitted:", bookingData);
    
    // 🔥 SAVE TO HISTORY (works 100%)
    const formattedBooking = {
      ...bookingData,
      date: format(bookingData.date, "yyyy-MM-dd"),
      id: Date.now(),
      type: "booking",
      status: "confirmed",
      amount: calculateAmount(bookingData.service),
      rating: 0,
      location: "Nearby Garage",
    };
    
    // Add to History directly
    const history = JSON.parse(localStorage.getItem("bookingHistory") || "[]");
    history.unshift(formattedBooking);
    localStorage.setItem("bookingHistory", JSON.stringify(history.slice(0, 10)));
    
    // Update History component state globally
    window.postMessage({ type: 'NEW_BOOKING', booking: formattedBooking }, '*');
    
    console.log("✅ Booking saved to history:", formattedBooking);
    
    // Show success
    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsBookingOpen(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 p-12">
      <h1 className="text-6xl font-light text-gray-900 mb-12">🛠️ Luxury Garage Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Stats */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-gray-100">
          <h2 className="text-4xl font-light text-gray-900 mb-8">📊 Quick Stats</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center p-8 rounded-2xl bg-blue-50">
              <div className="text-4xl mb-4">📍</div>
              <div className="text-3xl font-bold text-gray-900">24</div>
              <p className="text-lg text-gray-600">Nearby Garages</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-red-50">
              <div className="text-4xl mb-4">🚨</div>
              <div className="text-3xl font-bold text-gray-900">3</div>
              <p className="text-lg text-gray-600">Emergency Calls</p>
            </div>
          </div>
        </div>

        {/* Quick Actions - 🔥 FIXED BUTTONS */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-gray-100">
          <h2 className="text-4xl font-light text-gray-900 mb-8">⚡ Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full p-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-xl font-light">
              🚨 Emergency Call
            </button>
            
            {/* 🔥 FIND GARAGE - GOES TO GARAGES PAGE */}
            <button 
              onClick={() => navigate("/dashboard/garages")}
              className="w-full p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-xl font-light"
            >
              🔍 Find Garage
            </button>
            
            {/* BOOK SERVICE - OPENS MODAL */}
            <button 
              onClick={() => setIsBookingOpen(true)}
              className="w-full p-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-xl font-light"
            >
              📅 Book Service
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-12 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-light text-gray-900">📅 Book Service</h2>
              <button 
                onClick={() => setIsBookingOpen(false)}
                className="text-3xl hover:scale-110 transition-all duration-200"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-8">
              <div>
                <Label className="text-xl font-light mb-4 block">Garage Name</Label>
                <select 
                  name="garage" 
                  value={bookingData.garage}
                  onChange={handleBookingChange}
                  className="w-full p-6 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm text-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-300"
                  required
                >
                  <option value="">Select Garage</option>
                  <option value="QuickFix Auto">QuickFix Auto ⭐⭐⭐⭐⭐</option>
                  <option value="Speedy Service">Speedy Service ⭐⭐⭐⭐</option>
                  <option value="Elite Mechanics">Elite Mechanics ⭐⭐⭐⭐⭐</option>
                  <option value="Turbo Garage">Turbo Garage ⭐⭐⭐⭐</option>
                </select>
              </div>

              <div>
                <Label className="text-xl font-light mb-4 block">Service Type</Label>
                <select 
                  name="service" 
                  value={bookingData.service}
                  onChange={handleBookingChange}
                  className="w-full p-6 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm text-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-300"
                  required
                >
                  <option value="">Select Service</option>
                  <option value="Oil Change">Oil Change - ₹1500</option>
                  <option value="Brake Service">Brake Service - ₹3500</option>
                  <option value="Tire Replacement">Tire Replacement - ₹4500</option>
                  <option value="Full Service">Full Service - ₹7500</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-xl font-light mb-4 flex items-center gap-2">
                    <CalendarIcon className="w-6 h-6" />
                    Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full p-6 justify-start text-left font-normal text-xl h-auto rounded-2xl border-gray-200 bg-white/50 backdrop-blur-sm hover:bg-white/70"
                      >
                        <CalendarIcon className="mr-2 h-6 w-6" />
                        {format(bookingData.date, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-2xl">
                      <Calendar
                        mode="single"
                        selected={bookingData.date}
                        onSelect={handleDateChange}
                        className="rounded-2xl"
                        fromDate={new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="text-xl font-light mb-4 flex items-center gap-2">
                    <Clock className="w-6 h-6" />
                    Time Slot
                  </Label>
                  <select 
                    name="time"
                    value={bookingData.time}
                    onChange={handleBookingChange}
                    className="w-full p-6 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm text-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-300"
                    required
                  >
                    <option value="">Select Time</option>
                    <option value="09:00 AM">09:00 AM - 10:00 AM</option>
                    <option value="11:00 AM">11:00 AM - 12:00 PM</option>
                    <option value="02:00 PM">02:00 PM - 03:00 PM</option>
                    <option value="04:00 PM">04:00 PM - 05:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-xl font-light mb-4 flex items-center gap-2">
                    <Phone className="w-6 h-6" />
                    Phone Number
                  </Label>
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={bookingData.phone}
                    onChange={handleBookingChange}
                    className="w-full p-6 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm text-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <Label className="text-xl font-light mb-4 flex items-center gap-2">
                    🚗 Vehicle Details
                  </Label>
                  <Input
                    name="vehicle"
                    placeholder="Toyota Innova 2023"
                    value={bookingData.vehicle}
                    onChange={handleBookingChange}
                    className="w-full p-6 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm text-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full p-8 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white text-2xl font-light rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 h-auto py-8"
                disabled={success}
              >
                {success ? (
                  <>
                    ✅ Booking Confirmed!
                    <span className="ml-4 text-lg animate-pulse">✓</span>
                  </>
                ) : (
                  "🚀 Confirm Booking"
                )}
              </Button>
            </form>
          </div>
        </div>
      )}

      <div className="mt-16 bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-gray-100">
        <h2 className="text-4xl font-light text-gray-900 mb-8">🏆 Top Rated Garages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <h3 className="text-2xl font-light text-gray-900 mb-4">QuickFix Auto</h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⭐⭐⭐⭐⭐</span>
              <span className="text-lg text-gray-600">(234)</span>
            </div>
            <p className="text-lg text-gray-500 mb-6">1.2 km away</p>
            <div className="space-y-3">
              <button className="w-full p-4 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-300">📞 Call</button>
              <button className="w-full p-4 bg-slate-500 text-white rounded-xl hover:bg-slate-600 transition-all duration-300">📹 Video</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
