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

  // Load existing states dynamically if editing
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
    <div className="min-h-screen bg-gradient-subtle px-6 py-8 font-inter pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 mt-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2.5 bg-card border border-border/50 rounded-2xl hover:bg-muted transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-extrabold text-foreground">Edit Student Credentials</h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Form Card */}
      <div className="bg-gradient-to-br from-card to-card/85 rounded-3xl p-6 shadow-elegant border-2 border-border/50 space-y-6 animate-fade-in">
        {/* Upload Photo */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="flex items-center justify-center w-[110px] h-[110px] rounded-3xl border-3 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 cursor-pointer hover:bg-primary/10 transition-all duration-300 hover:scale-105 shadow-md"
            >
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-full h-full rounded-2xl object-cover border-2 border-background"
                />
              ) : (
                <Camera className="w-8 h-8 text-primary" />
              )}
            </label>
          </div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Upload Avatar</span>
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground">Full Name</label>
          <Input
            type="text"
            placeholder="e.g. Alex Johnson"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-12 text-sm border-2 border-border/50 rounded-2xl placeholder:text-muted-foreground bg-background/80"
          />
        </div>

        {/* Read-Only Academic Details */}
        <div className="grid grid-cols-2 gap-3 pb-2 border-b border-border/50">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              Institution <span className="text-[10px] bg-muted px-1.5 rounded-full text-foreground/50">Locked</span>
            </label>
            <div className="h-12 px-3 text-xs border-2 border-border/30 rounded-2xl bg-muted/50 flex items-center text-foreground font-medium truncate">
              {currentUser?.university || "Not set"}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
              Class Of <span className="text-[10px] bg-muted px-1.5 rounded-full text-foreground/50">Locked</span>
            </label>
            <div className="h-12 px-3 text-xs border-2 border-border/30 rounded-2xl bg-muted/50 flex items-center text-foreground font-medium">
              {currentUser?.graduationYear || "Not set"}
            </div>
          </div>
        </div>

        {/* Department Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground">Department</label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="h-12 text-xs border-2 border-border/50 rounded-2xl bg-background/80">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border z-50">
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept} className="hover:bg-muted text-xs">
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Interests Multi-select */}
        <div className="space-y-2 pt-2 border-t border-border/50">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Campus Interests</label>
          <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto pr-1">
            {interests.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all hover:scale-105 ${
                  selectedInterests.includes(interest)
                    ? "bg-gradient-primary text-white shadow-sm"
                    : "bg-background text-muted-foreground border border-border/60 hover:bg-primary/5"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8">
        <Button
          onClick={handleSaveProfile}
          className="w-full h-12 text-sm font-bold bg-primary text-primary-foreground rounded-2xl shadow-glow transition-all duration-300 hover:scale-102 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Profile Details
        </Button>
      </div>
    </div>
  );
};

export default ProfileSetupScreen;