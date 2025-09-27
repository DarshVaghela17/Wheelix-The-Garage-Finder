import { MapPin, Shield, Clock, DollarSign, Users, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: MapPin,
      title: "Find Nearby Garages",
      description: "Locate verified auto repair shops within your area using our advanced location-based search."
    },
    {
      icon: Shield,
      title: "Verified Professionals",
      description: "All mechanics and garages are thoroughly vetted and certified for quality and reliability."
    },
    {
      icon: Clock,
      title: "Instant Booking",
      description: "Schedule appointments instantly with real-time availability and flexible time slots."
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      description: "Get upfront quotes and compare prices from multiple garages before making a decision."
    },
    {
      icon: Users,
      title: "Customer Reviews",
      description: "Read authentic reviews and ratings from real customers to make informed choices."
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Access our platform anywhere, anytime with our responsive mobile-optimized interface."
    }
  ];

  return (
    <section className="py-20 bg-gradient-feature">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-garage-dark mb-4">
            Why Choose Wheelix?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We make finding and connecting with trusted auto repair services simple, 
            fast, and reliable.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-garage-dark mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;