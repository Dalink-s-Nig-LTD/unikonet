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

  // Filter threads authored by this student
  const userThreads = threads.filter(
    t => t.user.handle === currentUser.handle || t.user.name === currentUser.name
  );

  // Filter listings listed by this student (or Alex Doe mock placeholder seller name)
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
    <div className="min-h-screen bg-gradient-subtle font-inter pb-28">
      {/* Cover Header */}
      <div className="relative">
        <div className="h-44 shadow-elegant relative overflow-hidden">
          <img 
            src={branding.coverImage} 
            alt={`${branding.name} Campus`} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-primary/30 to-black/25"></div>
          <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
            <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-none font-semibold text-xs">
              {branding.abbreviation} ID: {currentUser.handle || "@alex"}
            </Badge>
          </div>
        </div>
        
        {/* Overlapping Avatar & Crest */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12 z-10 flex items-end justify-center">
          <div className="w-24 h-24 rounded-3xl border-4 border-card/90 overflow-hidden shadow-glow backdrop-blur-sm bg-muted">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-10 h-10 -ml-5 -mb-1 p-1 bg-card rounded-xl border border-border/40 shadow-md z-20">
            <UniversityCrest 
              abbreviation={branding.abbreviation} 
              primaryHsl={branding.primaryHsl} 
              secondaryHex={branding.secondaryHex}
              size={32}
            />
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="pt-16 px-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-foreground mb-1 leading-snug">{currentUser.name}</h2>
          <p className="text-xs text-muted-foreground mb-4 font-medium">{currentUser.course}</p>
          
          {/* Interests Chips */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-6">
            {currentUser.interests.map((interest, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-primary/5 text-primary border border-primary/10 px-3 py-1 rounded-xl text-[10px] font-bold"
              >
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button 
            onClick={() => navigate("/setup")}
            variant="outline" 
            className="h-11 border-border rounded-xl font-bold text-xs hover:bg-muted/40 text-foreground"
          >
            <Edit className="w-4 h-4 mr-2 text-primary" />
            Edit Credentials
          </Button>
          
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="h-11 border-red-200 text-red-600 hover:text-red-700 hover:bg-red-500/5 rounded-xl font-bold text-xs"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout Portal
          </Button>
        </div>

        {/* Content Tabs */}
        <Tabs value={contentTab} onValueChange={setContentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/40 backdrop-blur-sm rounded-xl p-1 h-11">
            <TabsTrigger value="posts" className="rounded-lg h-9 text-xs font-semibold">
              My Threads ({userThreads.length})
            </TabsTrigger>
            <TabsTrigger value="listings" className="rounded-lg h-9 text-xs font-semibold">
              My listings ({userProducts.length})
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg h-9 text-xs font-semibold">
              Preferences
            </TabsTrigger>
          </TabsList>
          
          {/* My Threads Tab */}
          <TabsContent value="posts" className="mt-4 space-y-4 animate-fade-in">
            {userThreads.map((thread) => {
              const isLiked = likedPostIds.includes(thread.id);
              return (
                <Card 
                  key={thread.id} 
                  className="p-4 border border-border/40 bg-card rounded-2xl cursor-pointer hover:shadow-sm"
                  onClick={() => navigate(`/post/${thread.id}`)}
                >
                  <p className="text-xs text-muted-foreground font-medium mb-2">{thread.timestamp}</p>
                  <p className="text-sm text-foreground leading-relaxed line-clamp-3 mb-3">{thread.content}</p>
                  <div className="flex items-center space-x-4 pt-2.5 border-t border-border/30">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLikedPost(thread.id);
                      }}
                      className={`flex items-center space-x-1 text-xs font-semibold ${
                        isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{thread.metrics.likes + (isLiked ? 1 : 0)}</span>
                    </button>
                    <span className="text-xs text-muted-foreground font-medium flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{thread.commentsList.length} comments</span>
                    </span>
                  </div>
                </Card>
              );
            })}

            {userThreads.length === 0 && (
              <div className="bg-card rounded-2xl p-8 text-center border border-dashed border-border/40 py-12">
                <p className="text-xs text-muted-foreground font-semibold">No active threads yet.</p>
                <Button onClick={() => navigate("/feed")} size="sm" className="mt-3 rounded-lg text-xs font-bold px-3">Compose Thread</Button>
              </div>
            )}
          </TabsContent>
          
          {/* My Listings Tab */}
          <TabsContent value="listings" className="mt-4 space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-3">
              {userProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="p-0 border border-border/40 bg-card rounded-2xl overflow-hidden cursor-pointer hover:shadow-sm"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="aspect-video bg-muted relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-xs text-foreground line-clamp-1">{product.name}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-extrabold text-primary text-xs">{product.price}</span>
                      <div className="flex items-center space-x-0.5 text-xs font-semibold text-foreground">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {userProducts.length === 0 && (
              <div className="bg-card rounded-2xl p-8 text-center border border-dashed border-border/40 py-12">
                <p className="text-xs text-muted-foreground font-semibold">No peer market listings active.</p>
                <Button onClick={() => navigate("/store")} size="sm" className="mt-3 rounded-lg text-xs font-bold px-3">List an Item</Button>
              </div>
            )}
          </TabsContent>
          
          {/* Settings / Preferences Tab */}
          <TabsContent value="settings" className="mt-4 animate-fade-in">
            <div className="bg-card rounded-2xl p-5 border border-border/40 space-y-4 text-sm font-semibold">
              <div className="flex items-center justify-between py-2.5 border-b border-border/40">
                <span className="text-foreground">Campus Notification Alerts</span>
                <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm animate-pulse"></div>
              </div>
              <div className="flex items-center justify-between py-2.5 border-b border-border/40">
                <span className="text-foreground">Student Verification Badging</span>
                <span className="text-xs text-primary font-extrabold uppercase">Verified</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-foreground">Data Privacy Encryptions</span>
                <Badge className="bg-primary/10 text-primary border-none">Active</Badge>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileScreen;