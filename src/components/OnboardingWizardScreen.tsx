import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, MapPin, Building, ChevronRight, GraduationCap, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppStore } from "../store/useAppStore";
import { universities, University } from "../data/universities";
import { getUniversityLogoUrl } from "../data/universityLogos";
import { useToast } from "@/hooks/use-toast";
import unikonetLogo from "@/assets/unikonet-logo.png";

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
  return <Building className="w-5 h-5" />;
};

const OnboardingWizardScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { setCurrentUser, currentUser } = useAppStore();
  
  const [step, setStep] = useState(1);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [gradYear, setGradYear] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAutoDetected, setIsAutoDetected] = useState(false);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 7 }, (_, i) => (currentYear + i).toString());

  useEffect(() => {
    const email = location.state?.email || "";
    if (email.endsWith('.edu.ng')) {
      const domain = email.split('@')[1];
      const match = universities.find(u => u.emailDomains?.includes(domain));
      if (match) {
        setSelectedUni(match);
        setIsAutoDetected(true);
        setStep(2);
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
    <div className="min-h-screen bg-gradient-subtle flex flex-col items-center justify-center px-6 py-8 font-inter relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Logo outside card */}
        <div className="mb-6 animate-fade-in-up">
          <img src={unikonetLogo} alt="Unikonet Logo" className="w-16 h-16 object-contain drop-shadow-md" />
        </div>

        {/* Card Container */}
        <div className="glass-card w-full rounded-[2rem] p-6 shadow-elegant animate-fade-in relative overflow-hidden border border-white/40">
          {/* Subtle top accent border */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary"></div>

          {/* Header */}
          <div className="text-center mb-6 mt-2">
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              Academic Setup
            </h1>
            <p className="text-muted-foreground text-sm font-medium mt-1">
              {step === 1 ? "Select your institution" : "When do you graduate?"}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="flex items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${step >= 1 ? 'bg-primary text-primary-foreground shadow-glow' : 'bg-muted text-muted-foreground'}`}>
                {step > 1 ? <CheckCircle2 className="w-4 h-4" /> : "1"}
              </div>
            </div>
            <div className={`w-12 h-1 rounded-full transition-colors ${step >= 2 ? 'bg-primary/50' : 'bg-border'}`}></div>
            <div className="flex items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${step >= 2 ? 'bg-primary text-primary-foreground shadow-glow' : 'bg-muted text-muted-foreground'}`}>
                2
              </div>
            </div>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  type="text"
                  placeholder="Search university..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-background/50 border-border/50 text-foreground rounded-xl focus-visible:ring-primary/20 text-sm font-medium"
                />
              </div>

              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredUniversities.map((uni) => (
                  <div
                    key={uni.id}
                    onClick={() => handleSelectUniversity(uni)}
                    className="bg-background/40 p-3 rounded-xl border border-border/40 flex items-center justify-between cursor-pointer hover:bg-background/80 hover:border-primary/40 hover:shadow-sm transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                        <UniLogo name={uni.name} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                          {uni.name}
                        </h3>
                        <p className="text-[11px] text-muted-foreground truncate">{uni.state}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                  </div>
                ))}
                
                {filteredUniversities.length === 0 && (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No matches found.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="animate-fade-in flex flex-col">
              <div className="bg-background/40 p-4 rounded-2xl border border-border/50 flex flex-col items-center text-center mb-6 relative">
                {isAutoDetected && (
                  <div className="absolute top-0 right-0 bg-success/10 text-success text-[9px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-xl uppercase tracking-wider border-b border-l border-success/20">
                    Auto-Detected
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                  {selectedUni ? <UniLogo name={selectedUni.name} /> : <Building className="w-6 h-6" />}
                </div>
                <h3 className="font-bold text-foreground text-sm mb-0.5">{selectedUni?.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <MapPin className="w-3 h-3" /> {selectedUni?.state}
                </p>
                
                {!isAutoDetected && (
                  <button 
                    onClick={() => setStep(1)}
                    className="text-primary text-xs font-semibold mt-3 hover:underline opacity-80 hover:opacity-100"
                  >
                    Change Institution
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-6">
                {yearOptions.map(year => (
                  <button
                    key={year}
                    onClick={() => setGradYear(year)}
                    className={`h-11 rounded-xl font-bold text-sm border-2 transition-all ${
                      gradYear === year 
                        ? 'bg-primary border-primary text-primary-foreground shadow-md' 
                        : 'bg-background/50 border-border/50 text-foreground hover:border-primary/30 hover:bg-background'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>

              <Button
                onClick={handleComplete}
                disabled={!gradYear}
                className="w-full h-12 text-sm font-bold bg-primary text-primary-foreground rounded-xl shadow-glow transition-all duration-300 hover:scale-[1.02]"
              >
                Complete Setup
              </Button>
            </div>
          )}
        </div>
        
        {/* Helper text at bottom */}
        <p className="mt-6 text-xs text-muted-foreground font-medium text-center max-w-xs">
          Your institution and graduation year are permanently locked to help build a trusted student community.
        </p>
      </div>
    </div>
  );
};

export default OnboardingWizardScreen;
