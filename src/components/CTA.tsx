import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wrench } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center text-white">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Wrench className="h-8 w-8 text-garage-orange" />
            <span className="text-2xl font-bold">Ready to Get Started?</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Join Thousands of Satisfied 
            <span className="text-garage-orange"> Car Owners</span>
          </h2>
          
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Don't let car troubles slow you down. Connect with trusted mechanics 
            and get back on the road faster than ever.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6 group">
                Create Account
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-garage-dark">
                Sign In
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 text-sm text-gray-300">
            <p>Already have an account? <Link to="/login" className="text-garage-orange hover:underline">Sign in here</Link></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;