import { useState, useEffect } from "react";
import { UserPlus, Users, Share, Flag, Ban, VolumeX, MessageSquare } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ScreenHeader from "./ScreenHeader";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "../store/useAppStore";
import { useToast } from "@/hooks/use-toast";

const UserProfileScreen = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { toast } = useToast();
  
  const { 
    threads, 
    currentUser, 
    likedPostIds, 
    savedPostIds, 
    toggleLikedPost,
    createNewChat,
    following,
    toggleFollow
  } = useAppStore();

  const [scrollY, setScrollY] = useState(0);
  const [avatarScale, setAvatarScale] = useState(1);

  // Parse user dynamically from handle or current logged-in user
  let user = {
    id: "2",
    name: "Sarah Johnson",
    handle: "@sarah_cs23",
    bio: "Computer Science student passionate about AI/ML 🤖 Building the future one algorithm at a time. Always down for a good tech discussion!",
    course: "Computer Science",
    department: "Computer Sciences",
    hall: "Trinity Hall",
    year: "Year 3",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c8c0?w=120&h=120&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=300&fit=crop",
    verified: true,
    online: true,
    followers: 1247,
    following: 389,
    mutuals: 23,
    joinedDate: "September 2022",
    tags: ["AI/ML", "React", "Python", "Photography"],
    status: {
      active: true,
      content: "Working on my thesis project 📚",
      timestamp: "2h ago"
    }
  };

  const isMe = currentUser && (userId === currentUser.handle || userId === currentUser.id || !userId);

  if (isMe && currentUser) {
    user = {
      id: currentUser.id,
      name: currentUser.name,
      handle: currentUser.handle,
      bio: currentUser.bio || "Computer Science junior. Passionate about software engineering, beautiful user experiences, and solving university life problems with code!",
      course: currentUser.course,
      department: currentUser.department || "Computer Sciences",
      hall: "University Hall",
      year: currentUser.year || "Year 3",
      avatar: currentUser.avatar,
      coverImage: currentUser.coverImage || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=300&fit=crop",
      verified: true,
      online: true,
      followers: 156,
      following: 198,
      mutuals: 0,
      joinedDate: "September 2023",
      tags: currentUser.interests || ["React", "Zustand", "Tailwind"],
      status: {
        active: false,
        content: "",
        timestamp: ""
      }
    };
  } else if (userId) {
    // Find active user from threads
    const matchedThread = threads.find(t => t.user.handle.toLowerCase() === userId.toLowerCase() || t.user.name.toLowerCase() === userId.toLowerCase());
    if (matchedThread) {
      const match = matchedThread.user;
      user = {
        id: match.handle,
        name: match.name,
        handle: match.handle,
        bio: match.handle === "@sarah_cs23" 
          ? "Computer Science student passionate about AI/ML 🤖 Building the future one algorithm at a time. Always down for a good tech discussion!"
          : match.handle === "@mike_biz"
          ? "Business Administration major. Enthusiastic about marketing, entrepreneurship, and campus startups!"
          : "Engineering student, green energy advocate, and tech enthusiast. Let's make the campus sustainable! 🌱",
        course: match.course.split(",")[0],
        department: match.handle === "@sarah_cs23" ? "Computer Sciences" : match.handle === "@mike_biz" ? "Business Administration" : "Mechanical Engineering",
        hall: match.handle === "@sarah_cs23" ? "Trinity Hall" : match.handle === "@mike_biz" ? "Redeemer Hall" : "Nelson Mandela Hall",
        year: match.course.includes("Year") ? match.course.split(",")[1]?.trim() || "Year 3" : "Year 3",
        avatar: match.avatar,
        coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=300&fit=crop",
        verified: match.verified,
        online: match.online,
        followers: match.handle === "@sarah_cs23" ? 1247 : match.handle === "@mike_biz" ? 842 : 512,
        following: match.handle === "@sarah_cs23" ? 389 : match.handle === "@mike_biz" ? 421 : 198,
        mutuals: match.handle === "@sarah_cs23" ? 23 : match.handle === "@mike_biz" ? 12 : 5,
        joinedDate: "September 2022",
        tags: match.handle === "@sarah_cs23" ? ["AI/ML", "React", "Python", "Photography"] : match.handle === "@mike_biz" ? ["Marketing", "Startups", "Finance", "Strategy"] : ["CAD", "Matlab", "GreenEnergy", "Automotive"],
        status: {
          active: match.handle === "@sarah_cs23",
          content: match.handle === "@sarah_cs23" ? "Working on my thesis project 📚" : "",
          timestamp: match.handle === "@sarah_cs23" ? "2h ago" : ""
        }
      };
    }
  }

  const isFollowing = following.includes(user.handle);

  // Filter posts from store dynamically
  const posts = threads.filter(t => t.user.handle === user.handle);
  
  // Extract images for media tab
  const mediaItems = posts
    .filter(p => p.media && p.media.type === 'image')
    .map(p => p.media!.url);

  const replies = [
    {
      id: 1,
      originalPost: "What's your favorite programming language?",
      originalUser: "@mike_biz",
      reply: "Definitely Python for ML work, but I'm loving TypeScript for web development lately!",
      timestamp: "5h"
    }
  ];

  // Handle scroll for avatar animation
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setScrollY(scrolled);
      const scale = Math.max(0.7, 1 - scrolled / 300);
      setAvatarScale(scale);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMessageUser = () => {
    const chatId = createNewChat(user.name, user.avatar);
    toast({
      title: "Chat Initiated",
      description: `Opening secure campus chat with ${user.name}...`,
    });
    navigate(`/chat/${chatId}`);
  };

  const handleFollowToggle = () => {
    toggleFollow(user.handle);
    toast({
      title: isFollowing ? "Unfollowed User" : "Following User",
      description: isFollowing 
        ? `You unfollowed ${user.name}` 
        : `You are now following ${user.name} for campus updates.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-inter pb-12">
      <ScreenHeader
        title={scrollY > 100 ? user.name : undefined}
        subtitle={scrollY > 100 ? `${user.followers + (isFollowing ? 1 : 0)} followers` : undefined}
        showMore
      />

      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={user.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
      </div>

      {/* Profile Section */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="relative -mt-16 mb-4">
          <Avatar 
            className={`w-32 h-32 border-4 border-background shadow-xl transition-transform duration-300`}
            style={{ transform: `scale(${avatarScale})` }}
          >
            <AvatarImage src={user.avatar} className="object-cover" />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl font-bold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          {user.online && (
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-success border-4 border-background rounded-full animate-pulse" />
          )}
        </div>

        {/* User Info */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                {user.verified && (
                  <Badge variant="secondary" className="h-6 px-2 text-sm bg-primary/10 text-primary border-primary/20">
                    ✓
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{user.handle}</p>
            </div>

            {!isMe && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-2xl border-border/50 hover:bg-muted/50 w-11 h-11 flex items-center justify-center text-primary"
                  onClick={handleMessageUser}
                >
                  <MessageSquare className="w-5 h-5" />
                </Button>
                
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  className={`rounded-2xl px-6 h-11 font-medium transition-all duration-200 hover:scale-105 ${
                    isFollowing 
                      ? 'border-primary/20 text-primary hover:bg-primary/5' 
                      : 'bg-gradient-primary hover:shadow-glow'
                  }`}
                  onClick={handleFollowToggle}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              </div>
            )}

            {isMe && (
              <Button 
                variant="outline"
                className="rounded-2xl border-border/50 hover:bg-muted/50 px-6 h-11"
                onClick={() => navigate('/profile')}
              >
                Manage Profile
              </Button>
            )}
          </div>

          {/* Bio */}
          <p className="text-foreground leading-relaxed text-sm">{user.bio}</p>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs">Course:</span>
              <p className="font-medium text-foreground">{user.course}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs">Department:</span>
              <p className="font-medium text-foreground">{user.department}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs">Hall:</span>
              <p className="font-medium text-foreground">{user.hall}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground text-xs">Year:</span>
              <p className="font-medium text-foreground">{user.year}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {user.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="rounded-full bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-1 hover:text-primary transition-colors">
              <span className="font-bold text-foreground">{user.following}</span>
              <span className="text-muted-foreground text-sm">Following</span>
            </button>
            <button className="flex items-center gap-1 hover:text-primary transition-colors">
              <span className="font-bold text-foreground">{user.followers + (isFollowing ? 1 : 0)}</span>
              <span className="text-muted-foreground text-sm">Followers</span>
            </button>
            {!isMe && user.mutuals > 0 && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground text-xs">{user.mutuals} mutual connections</span>
              </div>
            )}
          </div>

          {/* Status */}
          {user.status.active && (
            <div className="bg-muted/30 rounded-2xl p-4 border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-sm font-medium text-success">Active Status</span>
                <span className="text-xs text-muted-foreground">{user.status.timestamp}</span>
              </div>
              <p className="text-foreground text-sm">{user.status.content}</p>
            </div>
          )}

          {/* Actions Menu */}
          {!isMe && (
            <div className="flex gap-2 pt-2 flex-wrap">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-2xl border-border/50 hover:bg-muted/50"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast({ title: "Link Copied", description: "Copied profile page link!" });
                }}
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-2xl border-border/50 hover:bg-muted/50 text-warning hover:text-warning"
                onClick={() => toast({ title: "Profile Reported", description: "Flagged for standard honor-code vetting." })}
              >
                <Flag className="w-4 h-4 mr-2" />
                Report
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-2xl border-border/50 hover:bg-muted/50 text-muted-foreground"
                onClick={() => toast({ title: "User Muted", description: `You will not see posts from ${user.name} in your feed.` })}
              >
                <VolumeX className="w-4 h-4 mr-2" />
                Mute
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-2xl border-destructive/20 text-destructive hover:bg-destructive/5"
                onClick={() => toast({ title: "User Blocked", description: `Blocked all direct interactions with ${user.name}` })}
              >
                <Ban className="w-4 h-4 mr-2" />
                Block
              </Button>
            </div>
          )}
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Content Tabs */}
      <div className="flex-1">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b border-border/30 rounded-none h-auto p-0">
            <TabsTrigger 
              value="threads" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
            >
              Threads ({posts.length})
            </TabsTrigger>
            <TabsTrigger 
              value="media" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
            >
              Media ({mediaItems.length})
            </TabsTrigger>
            <TabsTrigger 
              value="replies" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
            >
              Replies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="threads" className="p-0 mt-0">
            <div className="space-y-1">
              {posts.map((post) => (
                <article 
                  key={post.id} 
                  className="p-6 border-b border-border/30 hover:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  <div className="space-y-3">
                    <p className="text-foreground leading-relaxed text-sm">{post.content}</p>
                    {post.media && (
                      <div className="rounded-2xl overflow-hidden max-h-60 bg-muted/20">
                        <img
                          src={post.media.url}
                          alt="Post media"
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.timestamp} ago</span>
                      <div className="flex gap-4">
                        <span>{post.metrics.likes} likes</span>
                        <span>{post.commentsList.length} replies</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              {posts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  No threads created yet.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="media" className="p-0 mt-0">
            {mediaItems.length > 0 ? (
              <div className="grid grid-cols-3 gap-1 p-4">
                {mediaItems.map((media, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={media}
                      alt={`Media ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                      onClick={() => navigate(`/media/${posts[index]?.id || 1}`)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No photo or video uploads found.
              </div>
            )}
          </TabsContent>

          <TabsContent value="replies" className="p-0 mt-0">
            <div className="space-y-1">
              {replies.map((reply) => (
                <article key={reply.id} className="p-6 border-b border-border/30 hover:bg-muted/20 transition-colors">
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      Replying to <span className="text-primary">{reply.originalUser}</span>
                    </div>
                    <div className="text-xs text-muted-foreground bg-muted/30 rounded-xl p-3">
                      {reply.originalPost}
                    </div>
                    <p className="text-foreground leading-relaxed text-sm">{reply.reply}</p>
                    <span className="text-xs text-muted-foreground">{reply.timestamp} ago</span>
                  </div>
                </article>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfileScreen;