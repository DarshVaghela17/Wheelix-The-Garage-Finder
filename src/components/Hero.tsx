import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-garage.jpg";
import { MapPin, Wrench, Clock } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Professional garage interior" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-6">
              <Wrench className="h-8 w-8 text-garage-orange" />
              <span className="text-xl font-bold">Wheelix</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Find Trusted 
              <span className="text-garage-orange"> Garages</span> 
              <br />Near You
            </h1>
            
            <p className="text-xl mb-8 text-gray-200 leading-relaxed">
              Connect with verified auto repair shops and mechanics in your area. 
              Get instant quotes, book appointments, and keep your vehicle running smoothly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/register">
                <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="cta" size="lg" className="text-lg px-8 py-6">
                  Sign In
                </Button>
              </Link>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="h-6 w-6 text-garage-orange" />
                </div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-gray-300">Verified Garages</div>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-6 w-6 text-garage-orange" />
                </div>
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-gray-300">Support Available</div>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Wrench className="h-6 w-6 text-garage-orange" />
                </div>
                <div className="text-2xl font-bold">10k+</div>
                <div className="text-sm text-gray-300">Happy Customers</div>
              </div>
            </div>
          </div>
          
          <div className="lg:block hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-garage-orange to-primary rounded-2xl transform rotate-6 opacity-20"></div>
              <img 
                src={heroImage} 
                alt="Modern garage workspace"
                className="relative rounded-2xl shadow-hero w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;