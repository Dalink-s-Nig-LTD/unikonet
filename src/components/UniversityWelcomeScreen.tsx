import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, ShoppingBag, Car, GraduationCap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "../store/useAppStore";
import { getUniversityBranding } from "../data/universityBranding";
import { UniversityCrest } from "./UniversityCrest";

const UniversityWelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppStore();

  const universityName = currentUser?.university || "University of Lagos";
  const branding = getUniversityBranding(universityName);

  // Dynamically inject the school's brand color parameters into the global CSS variables upon component mount
  useEffect(() => {
    const root = document.documentElement;
    
    // Save original styles to restore them if needed
    const prevPrimary = root.style.getPropertyValue("--primary");
    const prevPrimaryGlow = root.style.getPropertyValue("--primary-glow");
    const prevGradientPrimary = root.style.getPropertyValue("--gradient-primary");
    
    // Apply school's custom colors
    root.style.setProperty("--primary", branding.primaryHsl);
    root.style.setProperty("--primary-glow", branding.primaryGlowHsl);
    root.style.setProperty(
      "--gradient-primary", 
      `linear-gradient(135deg, hsl(${branding.primaryHsl}), hsl(${branding.primaryGlowHsl}))`
    );

    return () => {
      // Optional: keep colors active for the session, or restore when unmounting
      // We choose to keep them active so the rest of the app retains the university theme!
    };
  }, [branding]);

  const handleEnterPortal = () => {
    // If user hasn't set up profile name/details, send them to setup, else directly to feed
    if (!currentUser?.name || currentUser.name === "Alex Doe" || currentUser.name === "Guest") {
      navigate("/setup");
    } else {
      navigate("/feed");
    }
  };

  return (
    <div className="min-h-screen bg-background font-inter flex flex-col justify-between overflow-x-hidden pb-12">
      {/* 1. Top Cover Area */}
      <div className="relative w-full h-[38vh] overflow-hidden">
        {/* Cover Photo */}
        <img
          src={branding.coverImage}
          alt={`${universityName} Campus`}
          className="w-full h-full object-cover scale-105 animate-pulse-subtle"
          style={{ animationDuration: "12s" }}
        />
        {/* Modern Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/35"></div>

        {/* Top Back/Navigation Indicator */}
        <div className="absolute top-10 left-6 z-10 flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/select-university")}
            className="h-10 px-3 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white border border-white/10 rounded-xl text-xs font-semibold gap-1.5"
          >
            ← Change Campus
          </Button>
        </div>
      </div>

      {/* 2. Floating Crest Emblem */}
      <div className="relative flex justify-center -mt-20 z-20">
        <div className="p-3 bg-card border-3 border-border/40 rounded-[2.5rem] shadow-xl backdrop-blur-md animate-scale-in">
          <UniversityCrest
            abbreviation={branding.abbreviation}
            primaryHsl={branding.primaryHsl}
            secondaryHex={branding.secondaryHex}
            size={110}
          />
        </div>
      </div>

      {/* 3. Welcome Body */}
      <div className="flex-1 flex flex-col justify-between px-6 pt-6 text-center animate-fade-in">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/15 text-[10px] font-bold uppercase tracking-wider mx-auto">
            <GraduationCap className="w-3.5 h-3.5" /> Portal Active
          </div>
          
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight px-1 leading-tight">
            Welcome to the <br />
            <span className="text-primary font-black">{universityName}</span> Hub
          </h1>
          
          <p className="text-sm italic text-muted-foreground font-semibold px-4">
            "{branding.motto}"
          </p>

          <p className="text-xs text-muted-foreground/80 max-w-sm mx-auto leading-relaxed pt-2">
            Your customized campus network is ready. Connect with other {branding.abbreviation} students, buy & sell peer items, list rides, and discover events.
          </p>
        </div>

        {/* Quick University Stats */}
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto w-full my-8 bg-muted/20 p-4 border border-border/40 rounded-2.5xl backdrop-blur-sm">
          <div className="text-center flex flex-col items-center justify-center p-2.5 bg-card/65 rounded-2xl shadow-sm">
            <Users className="w-5 h-5 text-primary mb-1.5" />
            <span className="text-sm font-extrabold text-foreground">1.5k+</span>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Students</span>
          </div>
          
          <div className="text-center flex flex-col items-center justify-center p-2.5 bg-card/65 rounded-2xl shadow-sm">
            <ShoppingBag className="w-5 h-5 text-primary mb-1.5" />
            <span className="text-sm font-extrabold text-foreground">420+</span>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Listings</span>
          </div>
          
          <div className="text-center flex flex-col items-center justify-center p-2.5 bg-card/65 rounded-2xl shadow-sm">
            <Car className="w-5 h-5 text-primary mb-1.5" />
            <span className="text-sm font-extrabold text-foreground">24/7</span>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">Rides</span>
          </div>
        </div>

        {/* Enter Portal Action */}
        <div className="w-full max-w-md mx-auto">
          <Button
            onClick={handleEnterPortal}
            className="w-full h-14 text-sm font-bold bg-primary text-primary-foreground hover:scale-102 transition-all duration-300 rounded-2xl shadow-glow flex items-center justify-center gap-2"
          >
            Enter Campus Portal <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UniversityWelcomeScreen;
