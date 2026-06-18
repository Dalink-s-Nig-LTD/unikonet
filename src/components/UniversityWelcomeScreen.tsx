import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, ShoppingBag, Car, GraduationCap, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "../store/useAppStore";
import { getUniversityBranding } from "../data/universityBranding";
import { getUniversityDomain } from "../data/universityLogos";
import { UniversityCrest } from "./UniversityCrest";

const UniversityWelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppStore();
  const [logoError, setLogoError] = useState(false);

  const universityName = currentUser?.university || "University of Lagos";
  const branding = getUniversityBranding(universityName);
  const officialDomain = getUniversityDomain(universityName);

  useEffect(() => {
    setLogoError(false);
  }, [universityName]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", branding.primaryHsl);
    root.style.setProperty("--primary-glow", branding.primaryGlowHsl);
    root.style.setProperty(
      "--gradient-primary",
      `linear-gradient(135deg, hsl(${branding.primaryHsl}), hsl(${branding.primaryGlowHsl}))`
    );
  }, [branding]);

  const handleEnterPortal = () => {
    if (!currentUser?.name || currentUser.name === "Alex Doe" || currentUser.name === "Guest") {
      navigate("/setup");
    } else {
      navigate("/feed");
    }
  };

  const showRealLogo = branding.logoUrl && !logoError;

  return (
    <div className="min-h-screen bg-gradient-subtle font-inter flex flex-col items-center justify-center overflow-x-hidden relative">
      {/* Decorative Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md w-full relative z-10 px-5 py-8 flex flex-col items-center min-h-screen">
        
        {/* Cover Card */}
        <div className="w-full glass-card rounded-[2.5rem] shadow-elegant overflow-hidden relative flex flex-col mb-8 border border-white/20">
          
          {/* Top Image Section */}
          <div className="relative h-48 w-full overflow-hidden shrink-0">
            <img
              src={branding.coverImage}
              alt={`${universityName} Campus`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute top-4 left-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/select-university")}
                className="h-8 px-3 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white border border-white/20 rounded-full text-[10px] font-bold tracking-wide"
              >
                ← Change Campus
              </Button>
            </div>

            <div className="absolute bottom-4 left-0 right-0 px-6 flex justify-between items-end">
              <div>
                <p className="text-white/70 text-[9px] font-bold uppercase tracking-widest mb-0.5">Campus Portal</p>
                <h2 className="text-white font-extrabold text-lg leading-tight drop-shadow-md">{branding.abbreviation}</h2>
              </div>
            </div>
          </div>

          {/* Overlapping Logo */}
          <div className="absolute top-36 right-6 z-20 animate-scale-in">
            <div className="p-1.5 bg-card/80 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl">
              {showRealLogo ? (
                <img
                  src={branding.logoUrl}
                  alt={`${universityName} Official Logo`}
                  className="w-16 h-16 object-contain rounded-xl bg-white"
                  onError={() => setLogoError(true)}
                  loading="eager"
                />
              ) : (
                <UniversityCrest
                  abbreviation={branding.abbreviation}
                  primaryHsl={branding.primaryHsl}
                  secondaryHex={branding.secondaryHex}
                  size={64}
                />
              )}
            </div>
          </div>

          {/* Content Section inside the glass card */}
          <div className="p-6 pt-8 flex flex-col items-center text-center">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-wider mb-4">
              <GraduationCap className="w-3.5 h-3.5" /> Portal Active
            </div>

            <h1 className="text-2xl font-black text-foreground tracking-tight leading-tight mb-2">
              Welcome to the <br/> {universityName} Hub
            </h1>

            <p className="text-xs font-semibold text-primary italic mb-3">
              "{branding.motto}"
            </p>

            <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-6">
              Connect with students, buy & sell peer items, list rides, and discover campus events in one secure network.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 w-full mb-6">
              <div className="flex flex-col items-center justify-center py-3 bg-muted/30 rounded-2xl border border-border/50">
                <Users className="w-4 h-4 text-primary mb-1" />
                <span className="text-xs font-extrabold text-foreground">1.5k+</span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Students</span>
              </div>
              <div className="flex flex-col items-center justify-center py-3 bg-muted/30 rounded-2xl border border-border/50">
                <ShoppingBag className="w-4 h-4 text-primary mb-1" />
                <span className="text-xs font-extrabold text-foreground">420+</span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Listings</span>
              </div>
              <div className="flex flex-col items-center justify-center py-3 bg-muted/30 rounded-2xl border border-border/50">
                <Car className="w-4 h-4 text-primary mb-1" />
                <span className="text-xs font-extrabold text-foreground">24/7</span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Rides</span>
              </div>
            </div>

            {officialDomain && (
              <a
                href={`https://www.${officialDomain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors mb-2"
              >
                <ExternalLink className="w-3 h-3" />
                {officialDomain}
              </a>
            )}
          </div>
        </div>

        {/* Enter Button anchored at bottom */}
        <div className="w-full mt-auto mb-4">
          <Button
            onClick={handleEnterPortal}
            className="w-full h-14 text-sm font-bold bg-primary text-primary-foreground rounded-[1.25rem] shadow-glow hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
          >
            Enter Campus Portal <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

      </div>
    </div>
  );
};

export default UniversityWelcomeScreen;
