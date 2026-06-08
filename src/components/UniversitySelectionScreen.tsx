import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Building, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAppStore } from "../store/useAppStore";
import { universities, University } from "../data/universities";
import unikonetLogo from "@/assets/unikonet-logo.png";

const UniversitySelectionScreen = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUniversities = useMemo(() => {
    if (!searchQuery.trim()) return universities.slice(0, 20); // Show top 20 default
    
    const lowerQuery = searchQuery.toLowerCase();
    return universities.filter(
      (uni) =>
        uni.name.toLowerCase().includes(lowerQuery) ||
        uni.abbreviation.toLowerCase().includes(lowerQuery) ||
        uni.state.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  const handleSelectUniversity = (uni: University) => {
    setCurrentUser({ university: uni.name });
    navigate("/setup");
  };

  return (
    <div className="min-h-screen bg-background font-inter pb-12">
      {/* Top Banner Area */}
      <div className="bg-gradient-primary px-6 pt-12 pb-8 rounded-b-[2rem] shadow-elegant animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="flex justify-center mb-6 relative z-10">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
            <img 
              src={unikonetLogo} 
              alt="Unikonet Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>
        
        <div className="text-center relative z-10">
          <h1 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Select Your Campus</h1>
          <p className="text-sm text-white/80 font-medium">Join your specific university ecosystem to access exclusive marketplace listings and student communities.</p>
        </div>
      </div>

      <div className="px-5 mt-6 relative z-20">
        {/* Search Input */}
        <div className="relative mb-6 shadow-elegant rounded-2xl">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search by name, acronym, or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 bg-card border-border/50 text-foreground rounded-2xl focus-visible:ring-primary/20 transition-all text-base font-medium shadow-sm"
          />
        </div>

        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            {searchQuery ? 'Search Results' : 'Institutions'}
          </h2>
          <span className="text-xs font-semibold bg-muted px-2 py-1 rounded-md text-muted-foreground">
            {filteredUniversities.length} {filteredUniversities.length === 1 ? 'found' : 'found'}
          </span>
        </div>

        {/* University List */}
        <div className="space-y-3 pb-8">
          {filteredUniversities.map((uni) => (
            <div
              key={uni.id}
              onClick={() => handleSelectUniversity(uni)}
              className="bg-card p-4 rounded-2xl border border-border/40 flex items-center justify-between cursor-pointer hover:border-primary/40 hover:shadow-md transition-all duration-300 active:scale-[0.98] group"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Building className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-foreground text-sm truncate pr-2 group-hover:text-primary transition-colors">
                    {uni.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="flex items-center text-xs text-muted-foreground font-medium">
                      <MapPin className="w-3 h-3 mr-1" />
                      {uni.location}, {uni.state}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted font-semibold text-muted-foreground border border-border/50 uppercase tracking-wide">
                      {uni.funding}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
            </div>
          ))}

          {filteredUniversities.length === 0 && (
            <div className="bg-card p-8 rounded-2xl border border-dashed border-border/50 text-center animate-fade-in">
              <Building className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <h3 className="text-base font-bold text-foreground mb-1">No matches found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search query.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversitySelectionScreen;
