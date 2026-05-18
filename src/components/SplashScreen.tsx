import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import uniconnectLogo from "@/assets/uniconnect-logo.png";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [dots, setDots] = useState("");

  useEffect(() => {
    // Animate loading dots
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);

    // Navigate to login after 3 seconds
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-primary flex flex-col items-center justify-center px-8 font-inter">
      {/* Logo */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative">
            <img 
              src={uniconnectLogo} 
              alt="UniConnect" 
              className="w-[140px] h-[140px] mx-auto mb-8 animate-pulse shadow-glow rounded-3xl"
            />
          </div>
          
          {/* Tagline */}
          <h1 className="text-3xl font-bold text-white mb-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Connect. Shop. Ride. Thrive.
          </h1>
          <p className="text-white/80 text-lg animate-fade-in" style={{ animationDelay: '0.7s' }}>
            Your campus life, simplified
          </p>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="pb-16 animate-fade-in" style={{ animationDelay: '1s' }}>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-white/80 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <p className="text-white/80 text-center mt-4 text-lg">
          Loading{dots}
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;