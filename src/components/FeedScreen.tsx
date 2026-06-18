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
    
    setNewPostContent("");
    setSelectedPresetImage(null);
    setIsCreateOpen(false);

    toast({
      title: "Thread Posted! 🚀",
      description: "Your post is now active on the campus timeline."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle font-inter relative pb-24">
      {/* Header — frosted glass */}
      <div className="bg-background/60 backdrop-blur-xl px-6 pt-5 pb-3 sticky top-0 z-40 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-black text-foreground tracking-tight">Feed</h1>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/search')}
              className="w-10 h-10 bg-background/50 rounded-full flex items-center justify-center hover:bg-background/80 text-foreground transition-all border border-white/20 shadow-sm"
            >
              <Search className="w-4 h-4" />
            </button>
            <button 
              onClick={() => navigate('/notifications')}
              className="w-10 h-10 bg-background/50 rounded-full flex items-center justify-center hover:bg-background/80 text-foreground transition-all relative border border-white/20 shadow-sm"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-background shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => navigate('/cart')}
              className="w-10 h-10 bg-background/50 rounded-full flex items-center justify-center hover:bg-background/80 text-foreground transition-all relative border border-white/20 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-background shadow-glow">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <Tabs value={feedMode} onValueChange={setFeedMode} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/30 p-1 rounded-xl h-10">
            <TabsTrigger value="threads" className="rounded-lg text-xs font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow transition-all">
              Feed
            </TabsTrigger>
            <TabsTrigger value="stories" className="rounded-lg text-xs font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow transition-all">
              Stories
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stories Carousel */}
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2 px-5 pt-4">
        {statusUsers.map((user, index) => (
          <div key={user.id} className="flex-shrink-0 text-center animate-fade-in" style={{ animationDelay: `${index * 60}ms` }}>
            <div className="relative group cursor-pointer" onClick={() => user.isAddButton && setIsCreateOpen(true)}>
              {user.isAddButton ? (
                <div className="w-[52px] h-[52px] rounded-full border-2 border-dashed border-primary/60 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:border-primary active:scale-95 bg-primary/5">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
              ) : (
                <div className={`w-[52px] h-[52px] rounded-full p-[2px] transition-all duration-300 ${
                  user.hasNew && !user.seen ? 'bg-gradient-to-tr from-primary via-accent to-primary' : 
                  user.hasNew && user.seen ? 'bg-muted/60' : 'bg-border/30'
                }`}>
                  <Avatar className="w-full h-full border-2 border-background">
                    <AvatarImage src={user.avatar || undefined} alt={user.name} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 font-semibold truncate w-[52px]">
              {user.isAddButton ? "Add" : user.name.split(" ")[0]}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="px-4 py-3 space-y-4">
        {feedMode === "stories" && (
          <div className="glass-card rounded-[2rem] p-8 text-center border border-white/20 shadow-elegant animate-scale-in">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-primary ml-1 animate-pulse" />
            </div>
            <h3 className="text-lg font-black text-foreground mb-2">No Active Stories</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Create your first story and share what's happening on campus!
            </p>
            <Button onClick={() => toast({ title: "Stories Mode", description: "Video stories uploading is under standard audit." })} className="rounded-xl bg-primary text-primary-foreground font-bold shadow-glow">Upload Story</Button>
          </div>
        )}

        {feedMode === "threads" && (
          <div className="space-y-4">
            {threads.map((thread, idx) => {
              const isLiked = likedPostIds.includes(thread.id);
              const isSaved = savedPostIds.includes(thread.id);
              const likesCount = thread.metrics.likes;
              
              return (
                <div 
                  key={thread.id} 
                  className="glass-card rounded-[1.75rem] p-5 shadow-sm border border-white/15 hover:shadow-elegant transition-all duration-300 cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${idx * 80}ms` }}
                  onClick={() => navigate(`/post/${thread.id}`)}
                >
                  {/* Thread Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar 
                          className="w-10 h-10 cursor-pointer ring-2 ring-primary/20" 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/user/${thread.user.handle}`);
                          }}
                        >
                          <AvatarImage src={thread.user.avatar} className="object-cover" />
                          <AvatarFallback className="bg-muted text-muted-foreground text-sm font-bold">
                            {thread.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {thread.user.online && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card shadow-[0_0_6px_rgba(34,197,94,0.5)]"></div>
                        )}
                      </div>
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
                            <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-black uppercase tracking-wider">✓</span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium">{thread.timestamp} · {thread.user.course}</p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toast({ title: "Mod Options", description: "Campus safety flagging open." });
                      }}
                      className="text-muted-foreground hover:bg-muted/50 p-2 rounded-full transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Thread Content */}
                  <div className="mb-3 text-foreground leading-relaxed text-sm">
                    {thread.content}
                  </div>

                  {/* Media Preview */}
                  {thread.media && (
                    <div className="relative mb-3 overflow-hidden rounded-2xl bg-muted/20">
                      <img
                        src={thread.media.url}
                        alt={thread.media.alt}
                        className="w-full max-h-[240px] object-cover"
                      />
                      {thread.media.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <button 
                            onClick={(e) => handleMediaPlay(e, thread.id)}
                            className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                          >
                            {isPlaying.has(thread.id) ? (
                              <Pause className="w-5 h-5 text-black" />
                            ) : (
                              <Play className="w-5 h-5 text-black ml-0.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/20">
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLikedPost(thread.id);
                        }}
                        className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg transition-all ${
                          isLiked ? 'text-red-500 bg-red-500/10' : 'text-muted-foreground hover:text-red-500 hover:bg-red-500/5'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        <span className="text-[11px] font-bold">{likesCount}</span>
                      </button>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/post/${thread.id}`);
                        }}
                        className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-[11px] font-bold">{thread.commentsList.length}</span>
                      </button>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const { repostThread } = useAppStore.getState();
                          repostThread(thread.id);
                          toast({ title: "Reposted", description: "This post has been shared to your profile." });
                        }}
                        className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-muted-foreground hover:text-green-500 hover:bg-green-500/5 transition-all"
                      >
                        <Repeat2 className="w-4 h-4" />
                        <span className="text-[11px] font-bold">{thread.metrics.reposts}</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSavedPost(thread.id);
                          toast({
                            title: isSaved ? "Removed Bookmark" : "Bookmarked",
                            description: isSaved ? "Post removed from bookmarks." : "Post saved to your bookmarks library!"
                          });
                        }}
                        className={`p-1.5 rounded-lg transition-all ${
                          isSaved ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(`${window.location.origin}/post/${thread.id}`);
                          toast({ title: "Link Copied", description: "Direct thread link copied to clipboard!" });
                        }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                      >
                        <Share className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FAB */}
      <button 
        onClick={() => setIsCreateOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-glow hover:shadow-[0_0_30px_rgba(var(--primary)/0.5)] transition-all duration-300 flex items-center justify-center z-30 hover:scale-110 active:scale-95"
      >
        <Edit3 className="w-5 h-5" />
      </button>

      {/* Creation Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md rounded-[2rem] border-white/20 bg-card/95 backdrop-blur-xl shadow-elegant">
          <DialogHeader>
            <DialogTitle className="text-lg font-black">Share with Campus</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Write a thread, query, or campus bulletin update.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <Textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What is happening on campus today? 🤖📚"
              className="min-h-28 rounded-2xl border-border/50 bg-background/50 focus:bg-background text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              maxLength={280}
            />
            
            <div className="flex justify-between text-[10px] text-muted-foreground font-semibold px-1">
              <span>Limit: 280 characters</span>
              <span className={newPostContent.length > 250 ? 'text-red-500' : ''}>{newPostContent.length}/280</span>
            </div>

            {/* Photo Preset Attachments */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 ml-1">
                <Image className="w-3.5 h-3.5 text-primary" /> Attach Image
              </label>
              
              <div className="grid grid-cols-4 gap-2">
                {imagePresets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setSelectedPresetImage(
                      selectedPresetImage === preset.url ? null : preset.url
                    )}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedPresetImage === preset.url ? 'border-primary scale-95 shadow-glow' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-1.5">
                      <span className="text-[8px] text-white font-bold tracking-tight truncate w-full">{preset.label}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              {selectedPresetImage && (
                <div className="flex items-center justify-between bg-primary/5 p-2.5 rounded-xl border border-primary/20 mt-2">
                  <span className="text-[10px] text-primary font-bold flex items-center gap-1.5">
                    ✓ Image attached
                  </span>
                  <button onClick={() => setSelectedPresetImage(null)} className="p-1 hover:bg-muted rounded-full">
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="pt-3 border-t border-border/30 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="rounded-xl h-11 px-4 text-xs font-bold border-border/50">
                Cancel
              </Button>
              <Button 
                onClick={handleCreatePostSubmit}
                disabled={!newPostContent.trim()}
                className="bg-primary text-primary-foreground font-bold rounded-xl h-11 px-6 shadow-glow text-xs"
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