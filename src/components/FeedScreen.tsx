import { useState } from "react";
import { Heart, MessageCircle, Share, MoreHorizontal, Plus, Edit3, Bookmark, Repeat2, Play, Pause, Image, Send, X, Search, Bell, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "../store/useAppStore";
import { statusUsers } from "../data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const FeedScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [feedMode, setFeedMode] = useState("threads");
  const [isPlaying, setIsPlaying] = useState<Set<number>>(new Set());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedPresetImage, setSelectedPresetImage] = useState<string | null>(null);

  const { 
    threads, 
    likedPostIds, 
    savedPostIds, 
    toggleLikedPost, 
    toggleSavedPost,
    addThread,
    cartItems,
    notifications
  } = useAppStore();

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const handleMediaPlay = (e: React.MouseEvent, postId: number) => {
    e.stopPropagation();
    setIsPlaying(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  // Image presets with Unsplash URLs for immediate selection
  const imagePresets = [
    { label: "Study", url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&h=300&fit=crop" },
    { label: "Campus", url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500&h=300&fit=crop" },
    { label: "AI & CS", url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop" },
    { label: "Food", url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=300&fit=crop" }
  ];

  const handleCreatePostSubmit = () => {
    if (!newPostContent.trim()) return;

    let mediaObj = null;
    if (selectedPresetImage) {
      mediaObj = {
        type: "image" as const,
        url: selectedPresetImage,
        alt: "Attached thread image"
      };
    }

    addThread(newPostContent.trim(), mediaObj || undefined);
    
    // Reset form
    setNewPostContent("");
    setSelectedPresetImage(null);
    setIsCreateOpen(false);

    toast({
      title: "Thread Posted! 🚀",
      description: "Your post is now active on the campus timeline."
    });
  };

  return (
    <div className="min-h-screen bg-background font-inter relative pb-24">
      {/* Header */}
      <div className="bg-background/85 backdrop-blur-md px-6 py-4 sticky top-0 z-40 border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Feed</h1>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/search')}
              className="p-2 bg-muted/50 rounded-full hover:bg-muted text-foreground transition-all relative"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/notifications')}
              className="p-2 bg-muted/50 rounded-full hover:bg-muted text-foreground transition-all relative"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-background">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => navigate('/cart')}
              className="p-2 bg-muted/50 rounded-full hover:bg-muted text-foreground transition-all relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-background">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <Tabs value={feedMode} onValueChange={setFeedMode} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/30 p-1 rounded-xl">
              <TabsTrigger value="threads" className="rounded-lg text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Feed
              </TabsTrigger>
              <TabsTrigger value="stories" className="rounded-lg text-xs font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Stories
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

        {/* Stories Carousel */}
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2 px-6 pt-4">
          {statusUsers.map((user, index) => (
            <div key={user.id} className="flex-shrink-0 text-center animate-fade-in" style={{ animationDelay: `${index * 80}ms` }}>
              <div className="relative group cursor-pointer" onClick={() => user.isAddButton && setIsCreateOpen(true)}>
                {user.isAddButton ? (
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-primary flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                ) : (
                  <div className={`w-16 h-16 rounded-full p-[2px] transition-all duration-300 ${
                    user.hasNew && !user.seen ? 'bg-gradient-to-tr from-primary to-accent' : 
                    user.hasNew && user.seen ? 'bg-muted' : 'bg-muted/30'
                  }`}>
                    <Avatar className="w-full h-full border-2 border-background">
                      <AvatarImage src={user.avatar || undefined} alt={user.name} className="object-cover" />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                {user.isAddButton ? "Add" : user.name}
              </p>
            </div>
          ))}
        </div>

      {/* Main Content */}
      <div className="px-4 py-4 space-y-6">
        {feedMode === "stories" && (
          <div className="bg-card rounded-3xl p-8 text-center border border-border/50 animate-scale-in">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-primary ml-1 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold mb-2">No Active Stories</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Create your first story and share what's happening on campus!
            </p>
            <Button onClick={() => toast({ title: "Stories Mode", description: "Video stories uploading is under standard audit." })} className="rounded-xl bg-gradient-primary text-white">Upload Story</Button>
          </div>
        )}

        {feedMode === "threads" && (
          <div className="space-y-4">
            {threads.map((thread) => {
              const isLiked = likedPostIds.includes(thread.id);
              const isSaved = savedPostIds.includes(thread.id);
              const likesCount = thread.metrics.likes;
              
              return (
                <div 
                  key={thread.id} 
                  className="bg-card rounded-3xl p-5 shadow-sm border border-border/40 hover:shadow-md transition-all cursor-pointer animate-fade-in"
                  onClick={() => navigate(`/post/${thread.id}`)}
                >
                  {/* Thread Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar 
                        className="w-11 h-11 cursor-pointer ring-2 ring-primary/10" 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/user/${thread.user.handle}`);
                        }}
                      >
                        <AvatarImage src={thread.user.avatar} className="object-cover" />
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          {thread.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h3 
                            className="font-bold text-sm text-foreground hover:text-primary transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/user/${thread.user.handle}`);
                            }}
                          >
                            {thread.user.name}
                          </h3>
                          {thread.user.verified && (
                            <Badge variant="secondary" className="h-4 px-1 text-[9px] bg-primary/10 text-primary border-none">✓</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{thread.timestamp} • {thread.user.course}</p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toast({ title: "Mod Options", description: "Campus safety flagging open." });
                      }}
                      className="text-muted-foreground hover:bg-muted p-2 rounded-xl"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Thread Content */}
                  <div className="mb-4 text-foreground leading-relaxed text-sm whitespace-pre-wrap">
                    {thread.content}
                  </div>

                  {/* Media Preview */}
                  {thread.media && (
                    <div className="relative mb-4 overflow-hidden rounded-2xl bg-muted/20 border border-border/40">
                      <img
                        src={thread.media.url}
                        alt={thread.media.alt}
                        className="w-full max-h-[260px] object-cover"
                      />
                      {thread.media.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <button 
                            onClick={(e) => handleMediaPlay(e, thread.id)}
                            className="w-12 h-12 bg-white/95 rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                          >
                            {isPlaying.has(thread.id) ? (
                              <Pause className="w-5 h-5 text-black" />
                            ) : (
                              <Play className="w-5 h-5 text-black ml-1" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between pt-2 border-t border-border/20 gap-y-2">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLikedPost(thread.id);
                        }}
                        className={`flex items-center space-x-1.5 transition-colors ${
                          isLiked ? 'text-red-500 hover:text-red-600 animate-pulse' : 'text-muted-foreground hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        <span className="text-xs font-semibold">{likesCount}</span>
                      </button>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/post/${thread.id}`);
                        }}
                        className="flex items-center space-x-1.5 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-xs font-semibold">{thread.commentsList.length}</span>
                      </button>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const { repostThread } = useAppStore.getState();
                          repostThread(thread.id);
                          toast({ title: "Reposted", description: "This post has been shared to your profile." });
                        }}
                        className="flex items-center space-x-1.5 text-muted-foreground hover:text-green-500 transition-colors"
                      >
                        <Repeat2 className="w-5 h-5" />
                        <span className="text-xs font-semibold">{thread.metrics.reposts}</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSavedPost(thread.id);
                          toast({
                            title: isSaved ? "Removed Bookmark" : "Bookmarked",
                            description: isSaved ? "Post removed from bookmarks." : "Post saved to your bookmarks library!"
                          });
                        }}
                        className={`transition-colors ${
                          isSaved ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                        }`}
                      >
                        <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(`${window.location.origin}/post/${thread.id}`);
                          toast({ title: "Link Copied", description: "Direct thread link copied to clipboard!" });
                        }}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Share className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dynamic Thread Creation Dialog FAB */}
      <button 
        onClick={() => setIsCreateOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-primary text-white rounded-full shadow-glow hover:shadow-xl transition-all duration-300 flex items-center justify-center z-30 hover:scale-105 active:scale-95"
      >
        <Edit3 className="w-5 h-5" />
      </button>

      {/* Creation Modal Form */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-border bg-card">
          <DialogHeader>
            <DialogTitle>Share with Campus</DialogTitle>
            <DialogDescription>
              Write a thread, query, or campus bulletin update.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <Textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What is happening at Redeemer's University today? 🤖📚"
              className="min-h-32 rounded-2xl border-border bg-muted/20 focus:bg-background text-sm"
              maxLength={280}
            />
            
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>Limit: 280 characters</span>
              <span>{newPostContent.length}/280</span>
            </div>

            {/* Photo Preset Attachments */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                <Image className="w-4 h-4 text-primary" /> Attach Image Preset
              </label>
              
              <div className="grid grid-cols-4 gap-2">
                {imagePresets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setSelectedPresetImage(
                      selectedPresetImage === preset.url ? null : preset.url
                    )}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedPresetImage === preset.url ? 'border-primary scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-1">
                      <span className="text-[9px] text-white font-bold tracking-tight truncate w-full">{preset.label}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              {selectedPresetImage && (
                <div className="flex items-center justify-between bg-muted/30 p-2.5 rounded-xl border border-border/40 mt-2">
                  <span className="text-[10px] text-green-600 font-semibold flex items-center gap-1.5">
                    ✓ Image preset attached successfully
                  </span>
                  <button onClick={() => setSelectedPresetImage(null)} className="p-1 hover:bg-muted rounded-full">
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-border/50 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="rounded-xl h-11 px-4">
                Cancel
              </Button>
              <Button 
                onClick={handleCreatePostSubmit}
                disabled={!newPostContent.trim()}
                className="bg-primary text-primary-foreground font-bold rounded-xl h-11 px-6 shadow-md"
              >
                <Send className="w-4 h-4 mr-2" /> Share Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedScreen;