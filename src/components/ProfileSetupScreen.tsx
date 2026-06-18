import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, ChevronLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "../store/useAppStore";
import { useToast } from "@/hooks/use-toast";

const ProfileSetupScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { currentUser, setCurrentUser } = useAppStore();

  const [fullName, setFullName] = useState(currentUser?.name || "");
  const [department, setDepartment] = useState(currentUser?.course.split(",")[0] || "");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(currentUser?.interests || ["Technology", "Music"]);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(currentUser?.avatar || null);

  const interests = [
    "Technology", "Sports", "Music", "Art", "Gaming", "Reading", 
    "Travel", "Photography", "Fitness", "Movies", "Fashion"
  ];

  const departments = [
    "Computer Science", "Engineering", "Business Admin", "Nursing", "Law", 
    "Humanities", "Microbiology", "Economics"
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfilePhoto(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (!fullName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please specify your full name.",
        variant: "destructive"
      });
      return;
    }

    setCurrentUser({
      name: fullName.trim(),
      course: `${department || "Computer Science"}`,
      avatar: profilePhoto || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face",
      interests: selectedInterests.length > 0 ? selectedInterests : ["Technology", "Music"]
    });

    toast({
      title: "Profile Configured! 👤",
      description: "Your student credentials have been synced locally."
    });

    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col items-center justify-center px-6 py-8 font-inter relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 flex flex-col min-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-background/50 flex items-center justify-center rounded-full hover:bg-background/80 transition-colors shadow-sm glass-card border border-white/20"
          >
            <ChevronLeft className="w-5 h-5 text-foreground ml-[-2px]" />
          </button>
          <h1 className="text-xl font-extrabold text-foreground tracking-tight">Edit Credentials</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-[2.5rem] p-8 shadow-elegant flex-1 flex flex-col space-y-6 relative overflow-hidden border border-white/40">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary"></div>

          {/* Upload Photo */}
          <div className="flex flex-col items-center justify-center space-y-3 mt-2">
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex items-center justify-center w-28 h-28 rounded-full border-4 border-background bg-gradient-to-br from-primary/10 to-accent/10 cursor-pointer group-hover:bg-primary/20 transition-all duration-300 shadow-glow relative overflow-hidden"
              >
                {profilePhoto ? (
                  <>
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </>
                ) : (
                  <Camera className="w-8 h-8 text-primary" />
                )}
              </label>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground ml-1">Full Name</label>
            <Input
              type="text"
              placeholder="e.g. Alex Johnson"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-12 text-sm border-border/50 rounded-2xl placeholder:text-muted-foreground bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-300"
            />
          </div>

          {/* Read-Only Academic Details */}
          <div className="grid grid-cols-2 gap-3 pb-4 border-b border-border/50">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground flex items-center gap-1 ml-1">
                Institution <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Locked</span>
              </label>
              <div className="h-12 px-4 text-xs border border-border/30 rounded-2xl bg-muted/30 flex items-center text-foreground font-medium truncate opacity-80">
                {currentUser?.university || "Not set"}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground flex items-center gap-1 ml-1">
                Class Of <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Locked</span>
              </label>
              <div className="h-12 px-4 text-xs border border-border/30 rounded-2xl bg-muted/30 flex items-center text-foreground font-medium opacity-80">
                {currentUser?.graduationYear || "Not set"}
              </div>
            </div>
          </div>

          {/* Department Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground ml-1">Department</label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="h-12 text-sm border-border/50 rounded-2xl bg-background/50 focus:bg-background focus:ring-primary/20 transition-all duration-300">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-md border-border/50 rounded-xl z-50">
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept} className="hover:bg-muted/50 text-sm font-medium rounded-lg m-1 cursor-pointer">
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Interests Multi-select */}
          <div className="space-y-2 pt-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Campus Interests</label>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => {
                const isActive = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.03] active:scale-95 border ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-glow"
                        : "bg-background/50 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {interest}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 mb-4">
          <Button
            onClick={handleSaveProfile}
            className="w-full h-14 text-sm font-bold bg-primary text-primary-foreground rounded-[1.25rem] shadow-glow transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Profile Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupScreen;