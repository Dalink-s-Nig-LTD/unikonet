import { useState } from "react";
import { Home, ShoppingBag, Compass, MessageSquare, User, Edit, LogOut, Heart, MessageCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useAppStore } from "../store/useAppStore";
import { useToast } from "@/hooks/use-toast";
import { getUniversityBranding } from "../data/universityBranding";
import { UniversityCrest } from "./UniversityCrest";

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [contentTab, setContentTab] = useState("posts");

  const { 
    currentUser, 
    threads, 
    studentProducts, 
    likedPostIds,
    toggleLikedPost 
  } = useAppStore();

  const branding = getUniversityBranding(currentUser?.university);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-inter p-6 text-center">
        <h3 className="text-xl font-bold mb-2">Access Denied</h3>
        <p className="text-sm text-muted-foreground mb-4">Please log in to manage your student profile.</p>
        <Button onClick={() => navigate("/login")} className="rounded-xl">Login Now</Button>
      </div>
    );
  }

  const userThreads = threads.filter(
    t => t.user.handle === currentUser.handle || t.user.name === currentUser.name
  );

  const userProducts = studentProducts.filter(
    p => p.seller === currentUser.name || p.seller === "Alex Doe" || p.seller === "Ayomide Johnson"
  );

  const handleLogout = () => {
    toast({
      title: "Logged Out Successfully",
      description: "Redirecting back to campus portal entrance..."
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle font-inter pb-28 relative">
      {/* Cover Header */}
      <div className="relative">
        <div className="h-48 w-full relative overflow-hidden rounded-b-[2rem] shadow-elegant">
          <img 
            src={branding.coverImage} 
            alt={`${branding.name} Campus`} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-black/40"></div>
          
          <div className="absolute top-6 right-6 z-10">
            <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/20 shadow-sm flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-[10px] font-bold tracking-wider">{branding.abbreviation} ID: {currentUser.handle || "@alex"}</span>
            </div>
          </div>
        </div>
        
        {/* Overlapping Avatar & Crest */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-14 z-10 flex items-end justify-center">
          <div className="relative">
            {/* Glowing ring */}
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl scale-110"></div>
            
            <div className="w-28 h-28 rounded-full border-[4px] border-background overflow-hidden shadow-elegant relative z-10 bg-muted">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 p-0.5 bg-card rounded-full border-2 border-background shadow-md z-20 flex items-center justify-center overflow-hidden">
              <UniversityCrest 
                abbreviation={branding.abbreviation} 
                primaryHsl={branding.primaryHsl} 
                secondaryHex={branding.secondaryHex}
                size={24}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="pt-20 px-6 max-w-md mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">{currentUser.name}</h2>
          <p className="text-xs text-muted-foreground font-medium mt-1">{currentUser.course}</p>
          
          {/* Interests Chips */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-4">
            {currentUser.interests.map((interest, index) => (
              <span 
                key={index} 
                className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-bold tracking-wide"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Button 
            onClick={() => navigate("/setup")}
            className="h-12 bg-background hover:bg-muted/50 border border-border/50 shadow-sm rounded-2xl font-bold text-xs text-foreground transition-all duration-300 hover:scale-[1.02]"
          >
            <Edit className="w-4 h-4 mr-2 text-primary" />
            Edit Profile
          </Button>
          
          <Button 
            onClick={handleLogout}
            className="h-12 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 shadow-sm text-red-600 rounded-2xl font-bold text-xs transition-all duration-300 hover:scale-[1.02]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Content Tabs */}
        <div className="glass-card rounded-[2rem] p-3 shadow-elegant border border-white/20">
          <Tabs value={contentTab} onValueChange={setContentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/40 p-1 rounded-[1.5rem] h-12 mb-4">
              <TabsTrigger value="posts" className="rounded-xl h-10 text-[11px] font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all">
                Threads ({userThreads.length})
              </TabsTrigger>
              <TabsTrigger value="listings" className="rounded-xl h-10 text-[11px] font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all">
                Listings ({userProducts.length})
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-xl h-10 text-[11px] font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all">
                Preferences
              </TabsTrigger>
            </TabsList>
            
            {/* My Threads Tab */}
            <TabsContent value="posts" className="space-y-3 animate-fade-in mt-0">
              {userThreads.map((thread) => {
                const isLiked = likedPostIds.includes(thread.id);
                return (
                  <div 
                    key={thread.id} 
                    className="p-4 border border-border/40 bg-background/50 rounded-2xl cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => navigate(`/post/${thread.id}`)}
                  >
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-2">{thread.timestamp}</p>
                    <p className="text-sm text-foreground leading-relaxed line-clamp-3 mb-3">{thread.content}</p>
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLikedPost(thread.id);
                        }}
                        className={`flex items-center space-x-1.5 text-xs font-semibold ${
                          isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        <span>{thread.metrics.likes + (isLiked ? 1 : 0)}</span>
                      </button>
                      <span className="text-xs text-muted-foreground font-semibold flex items-center space-x-1.5">
                        <MessageCircle className="w-4 h-4" />
                        <span>{thread.commentsList.length}</span>
                      </span>
                    </div>
                  </div>
                );
              })}

              {userThreads.length === 0 && (
                <div className="rounded-2xl p-8 text-center border border-dashed border-border/40 bg-muted/20">
                  <p className="text-xs text-muted-foreground font-semibold mb-3">No active threads yet.</p>
                  <Button onClick={() => navigate("/feed")} size="sm" className="rounded-xl text-xs font-bold px-4">Compose Thread</Button>
                </div>
              )}
            </TabsContent>
            
            {/* My Listings Tab */}
            <TabsContent value="listings" className="animate-fade-in mt-0">
              <div className="grid grid-cols-2 gap-3">
                {userProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="border border-border/40 bg-background/50 rounded-2xl overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors flex flex-col"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="aspect-square bg-muted relative">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3 flex flex-col flex-1">
                      <h4 className="font-bold text-xs text-foreground line-clamp-1 mb-1">{product.name}</h4>
                      <div className="mt-auto flex justify-between items-center">
                        <span className="font-extrabold text-primary text-xs">{product.price}</span>
                        <div className="flex items-center space-x-0.5 text-[10px] font-bold text-foreground">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{product.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {userProducts.length === 0 && (
                <div className="rounded-2xl p-8 text-center border border-dashed border-border/40 bg-muted/20">
                  <p className="text-xs text-muted-foreground font-semibold mb-3">No peer market listings active.</p>
                  <Button onClick={() => navigate("/store")} size="sm" className="rounded-xl text-xs font-bold px-4">List an Item</Button>
                </div>
              )}
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings" className="animate-fade-in mt-0">
              <div className="bg-background/50 rounded-2xl p-1 border border-border/40">
                <div className="flex items-center justify-between p-4 border-b border-border/40 hover:bg-muted/30 transition-colors rounded-t-xl cursor-pointer">
                  <span className="text-xs font-bold text-foreground">Campus Notification Alerts</span>
                  <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between p-4 border-b border-border/40 hover:bg-muted/30 transition-colors cursor-pointer">
                  <span className="text-xs font-bold text-foreground">Student Verification Badging</span>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-md font-black uppercase tracking-wider">Verified</span>
                </div>
                <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors rounded-b-xl cursor-pointer">
                  <span className="text-xs font-bold text-foreground">Data Privacy Encryptions</span>
                  <span className="text-[10px] bg-foreground/10 text-foreground px-2 py-0.5 rounded-md font-black uppercase tracking-wider">Active</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;