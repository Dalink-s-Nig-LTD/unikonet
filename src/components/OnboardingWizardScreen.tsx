import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, MapPin, Building, ChevronRight, GraduationCap, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppStore } from "../store/useAppStore";
import { universities, University } from "../data/universities";
import { getUniversityLogoUrl } from "../data/universityLogos";
import { useToast } from "@/hooks/use-toast";

/** Small logo thumbnail with fallback to Building icon */
const UniLogo = ({ name }: { name: string }) => {
  const [err, setErr] = useState(false);
  const logoUrl = getUniversityLogoUrl(name);
  if (logoUrl && !err) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className="w-8 h-8 object-contain"
        onError={() => setErr(true)}
        loading="lazy"
      />
    );
  }
  return <Building className="w-6 h-6" />;
};

const OnboardingWizardScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { setCurrentUser, currentUser } = useAppStore();
  
  // Steps: 1 = Institution, 2 = Graduation Year
  const [step, setStep] = useState(1);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [gradYear, setGradYear] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAutoDetected, setIsAutoDetected] = useState(false);

  // Generate graduation years (e.g. current year to +6 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 7 }, (_, i) => (currentYear + i).toString());

  // Auto-detect based on email from Signup
  useEffect(() => {
    const email = location.state?.email || "";
    if (email.endsWith('.edu.ng')) {
      const domain = email.split('@')[1];
      // Search universities for matching domain
      const match = universities.find(u => u.emailDomains?.includes(domain));
      if (match) {
        setSelectedUni(match);
        setIsAutoDetected(true);
        setStep(2); // Skip straight to grad year
        toast({
          title: "University Detected!",
          description: `We matched your email to ${match.name}.`,
          duration: 3000,
        });
      }
    }
  }, [location.state, toast]);

  const filteredUniversities = useMemo(() => {
    if (!searchQuery.trim()) return universities.slice(0, 20);
    const lowerQuery = searchQuery.toLowerCase();
    return universities.filter(
      (uni) =>
        uni.name.toLowerCase().includes(lowerQuery) ||
        uni.abbreviation.toLowerCase().includes(lowerQuery) ||
        uni.state.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  const handleSelectUniversity = (uni: University) => {
    setSelectedUni(uni);
    setStep(2);
  };

  const handleComplete = () => {
    if (!gradYear) {
      toast({
        title: "Missing Information",
        description: "Please select your expected graduation year.",
        variant: "destructive"
      });
      return;
    }

    setCurrentUser({ 
      university: selectedUni?.name,
      graduationYear: gradYear
    });

    toast({
      title: "Profile Locked",
      description: "Your academic details have been successfully saved.",
    });

    navigate("/university-welcome");
  };

  return (
    <div className="min-h-screen bg-background font-inter pb-12 flex flex-col">
      {/* Top Banner Area */}
      <div className="bg-gradient-primary px-6 pt-12 pb-8 rounded-b-[2rem] shadow-elegant relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="text-center relative z-10 pt-4">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-2xl backdrop-blur-md mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Academic Profile</h1>
          <p className="text-sm text-white/90 font-medium max-w-xs mx-auto leading-relaxed">
            {step === 1 
              ? "Select your institution to access exclusive campus features." 
              : "When do you expect to graduate?"}
          </p>
        </div>
      </div>

      <div className="px-5 mt-8 flex-1 relative z-20 flex flex-col">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : "1"}
            </div>
            <span className={`ml-2 text-sm font-semibold ${step >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>Institution</span>
          </div>
          <div className={`w-10 h-1 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-border/50'}`}></div>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              2
            </div>
            <span className={`ml-2 text-sm font-semibold ${step >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>Class Of</span>
          </div>
        </div>

        {/* STEP 1: Institution Selection */}
        {step === 1 && (
          <div className="animate-fade-in flex-1">
            <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 mb-6">
              <p className="text-sm text-warning-foreground font-medium flex items-start gap-2">
                <span className="text-warning text-lg leading-none mt-0.5">!</span>
                Choose carefully. Your institution is permanent and cannot be changed after setup.
              </p>
            </div>

            <div className="relative mb-6 shadow-sm rounded-2xl">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                type="text"
                placeholder="Search your university..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-card border-border/50 text-foreground rounded-2xl focus-visible:ring-primary/20 transition-all text-base font-medium shadow-sm"
              />
            </div>

            <div className="space-y-3 pb-8">
              {filteredUniversities.map((uni) => (
                <div
                  key={uni.id}
                  onClick={() => handleSelectUniversity(uni)}
                  className="bg-card p-4 rounded-2xl border border-border/40 flex items-center justify-between cursor-pointer hover:border-primary/40 hover:shadow-md transition-all duration-300 active:scale-[0.98] group"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 overflow-hidden">
                      <UniLogo name={uni.name} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-foreground text-sm truncate pr-2 group-hover:text-primary transition-colors">
                        {uni.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{uni.state}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                </div>
              ))}
              
              {filteredUniversities.length === 0 && (
                <div className="bg-card p-8 rounded-2xl border border-dashed border-border/50 text-center text-muted-foreground">
                  No matches found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Graduation Year */}
        {step === 2 && (
          <div className="animate-fade-in flex-1 flex flex-col">
            {/* Selected Uni Display */}
            <div className="bg-card p-5 rounded-3xl border-2 border-border/50 flex flex-col items-center text-center mb-8 shadow-sm relative overflow-hidden">
              {isAutoDetected && (
                <div className="absolute top-0 right-0 bg-success text-success-foreground text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Auto-Detected
                </div>
              )}
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                {selectedUni ? <UniLogo name={selectedUni.name} /> : <Building className="w-8 h-8" />}
              </div>
              <h3 className="font-bold text-foreground text-lg mb-1">{selectedUni?.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <MapPin className="w-4 h-4" /> {selectedUni?.state}
              </p>
              
              {!isAutoDetected && (
                <button 
                  onClick={() => setStep(1)}
                  className="text-primary text-sm font-semibold mt-4 hover:underline"
                >
                  Change Institution
                </button>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-bold text-foreground mb-3 text-center">
                Select your Expected Graduation Year
              </label>
              <div className="grid grid-cols-2 gap-3">
                {yearOptions.map(year => (
                  <button
                    key={year}
                    onClick={() => setGradYear(year)}
                    className={`h-14 rounded-2xl font-bold text-lg border-2 transition-all ${
                      gradYear === year 
                        ? 'bg-primary border-primary text-primary-foreground shadow-md scale-[1.02]' 
                        : 'bg-card border-border/50 text-foreground hover:border-primary/30 hover:bg-muted'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
              <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 mt-6">
                <p className="text-sm text-warning-foreground font-medium flex items-start gap-2">
                  <span className="text-warning text-lg leading-none mt-0.5">!</span>
                  This year is permanently locked to your profile to build your class community.
                </p>
              </div>
            </div>

            <div className="mt-8 mb-4">
              <Button
                onClick={handleComplete}
                disabled={!gradYear}
                className="w-full h-14 text-base font-bold bg-primary text-primary-foreground rounded-2xl shadow-glow transition-all duration-300 hover:scale-[1.02]"
              >
                Complete Setup
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingWizardScreen;
