import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import unikonetLogo from "@/assets/unikonet-logo.png";
import { ArrowRight, UserPlus } from "lucide-react";

const LandingScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col items-center justify-center px-6 py-8 font-inter overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Logo and Hero Section */}
        <div className="text-center animate-fade-in mb-12">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full"></div>
            <img 
              src={unikonetLogo} 
              alt="Unikonet Logo" 
              className="w-32 h-32 object-contain relative z-10 animate-glow-pulse"
            />
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-primary">Unikonet</span>
          </h1>
          <p className="text-muted-foreground text-lg px-4">
            Connect. Shop. Ride. Thrive. Your entire campus life, simplified in one elegant app.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Button
            onClick={() => navigate("/login")}
            className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
          >
            Log In
            <ArrowRight className="w-5 h-5" />
          </Button>

          <Button
            onClick={() => navigate("/signup")}
            variant="outline"
            className="w-full h-14 text-lg font-semibold border-2 border-primary/20 hover:bg-primary/5 text-foreground rounded-2xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 glass-card"
          >
            Create an Account
            <UserPlus className="w-5 h-5" />
          </Button>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-sm text-muted-foreground/80">
            By continuing, you agree to our <br/>
            <a href="#" className="underline hover:text-primary transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-primary transition-colors">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
