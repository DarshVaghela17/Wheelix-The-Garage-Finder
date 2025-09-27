import { Search, MapPin, Calendar, Wrench } from "lucide-react";
import appMockup from "@/assets/app-mockup.jpg";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Search & Discover",
      description: "Enter your location and find nearby verified garages with detailed profiles and services."
    },
    {
      icon: MapPin,
      title: "Compare & Choose",
      description: "Compare prices, read reviews, and select the best garage that meets your specific needs."
    },
    {
      icon: Calendar,
      title: "Book Appointment",
      description: "Schedule your service appointment instantly with flexible time slots that work for you."
    },
    {
      icon: Wrench,
      title: "Get Service",
      description: "Arrive at your scheduled time and receive professional automotive service from trusted mechanics."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-garage-dark mb-4">
            How Wheelix Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Getting your car serviced has never been easier. Follow these simple steps 
            to connect with trusted mechanics in your area.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <step.icon className="h-6 w-6 text-garage-orange" />
                    <h3 className="text-xl font-semibold text-garage-dark">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-garage-orange/20 rounded-3xl transform rotate-3"></div>
            <img 
              src={appMockup} 
              alt="Wheelix mobile app interface showing garage locations" 
              className="relative rounded-3xl shadow-hero w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;