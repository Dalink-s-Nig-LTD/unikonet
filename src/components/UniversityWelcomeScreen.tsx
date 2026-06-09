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

  // Reset logo error when university changes
  useEffect(() => {
    setLogoError(false);
  }, [universityName]);

  // Dynamically inject the school's brand color parameters into the global CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", branding.primaryHsl);
    root.style.setProperty("--primary-glow", branding.primaryGlowHsl);
    root.style.setProperty(
      "--gradient-primary",
      `linear-gradient(135deg, hsl(${branding.primaryHsl}), hsl(${branding.primaryGlowHsl}))`
    );
    // Keep colors active for the entire session so the app retains university theme
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
    <div className="min-h-screen bg-background font-inter flex flex-col justify-between overflow-x-hidden pb-12">
      {/* 1. Top Cover Hero Area */}
      <div className="relative w-full h-[38vh] overflow-hidden">
        <img
          src={branding.coverImage}
          alt={`${universityName} Campus`}
          className="w-full h-full object-cover scale-105"
          loading="lazy"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/35" />

        {/* University name badge pinned above fold */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center px-6 z-10">
          <div className="px-4 py-2 bg-black/55 backdrop-blur-md rounded-2xl border border-white/10 text-center max-w-[300px]">
            <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest mb-0.5">Campus Portal</p>
            <p className="text-white font-extrabold text-sm leading-tight truncate">{universityName}</p>
          </div>
        </div>

        {/* Back button */}
        <div className="absolute top-10 left-6 z-10">
          <Button
            variant="ghost"
            onClick={() => navigate("/select-university")}
            className="h-10 px-3 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white border border-white/10 rounded-xl text-xs font-semibold gap-1.5"
          >
            ← Change Campus
          </Button>
        </div>
      </div>

      {/* 2. Floating Logo / Crest — raised above hero fold */}
      <div className="relative flex justify-center -mt-16 z-20">
        <div className="relative animate-scale-in">
          {/* Ambient glow ring */}
          <div
            className="absolute inset-0 rounded-[2.5rem] blur-2xl opacity-20 scale-125"
            style={{ background: `hsl(${branding.primaryHsl})` }}
          />

          <div className="relative p-3 bg-card border-2 border-border/50 rounded-[2.5rem] shadow-2xl backdrop-blur-md">
            {showRealLogo ? (
              <img
                src={branding.logoUrl}
                alt={`${universityName} Official Logo`}
                className="w-28 h-28 object-contain rounded-2xl"
                onError={() => setLogoError(true)}
                loading="eager"
              />
            ) : (
              <UniversityCrest
                abbreviation={branding.abbreviation}
                primaryHsl={branding.primaryHsl}
                secondaryHex={branding.secondaryHex}
                size={112}
              />
            )}
          </div>

          {/* Official website pill badge */}
          {officialDomain && (
            <a
              href={`https://www.${officialDomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 bg-primary text-primary-foreground text-[9px] font-bold rounded-full shadow-md hover:scale-105 transition-transform whitespace-nowrap"
            >
              <ExternalLink className="w-2.5 h-2.5" />
              {officialDomain}
            </a>
          )}
        </div>
      </div>

      {/* 3. Welcome Body */}
      <div className="flex-1 flex flex-col justify-between px-6 pt-8 text-center animate-fade-in">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/15 text-[10px] font-bold uppercase tracking-wider mx-auto">
            <GraduationCap className="w-3.5 h-3.5" /> Portal Active
          </div>

          <h1 className="text-3xl font-extrabold text-foreground tracking-tight px-1 leading-tight">
            Welcome to the <br />
            <span className="text-primary font-black">{branding.abbreviation}</span> Hub
          </h1>

          <p className="text-sm italic text-muted-foreground font-semibold px-4">
            "{branding.motto}"
          </p>

          <p className="text-xs text-muted-foreground/80 max-w-sm mx-auto leading-relaxed pt-1">
            Your customized campus network is ready. Connect with {branding.abbreviation} students,
            buy &amp; sell peer items, list rides, and discover campus events.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto w-full my-8 bg-muted/20 p-4 border border-border/40 rounded-3xl backdrop-blur-sm">
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

        {/* Enter Portal CTA */}
        <div className="w-full max-w-md mx-auto">
          <Button
            onClick={handleEnterPortal}
            className="w-full h-14 text-sm font-bold bg-primary text-primary-foreground hover:scale-[1.02] transition-all duration-300 rounded-2xl shadow-glow flex items-center justify-center gap-2"
          >
            Enter Campus Portal <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UniversityWelcomeScreen;
