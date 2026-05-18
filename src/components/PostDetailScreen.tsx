import { useState } from "react";
import { Heart, MessageCircle, Repeat2, Bookmark, Share, Flag, Volume2, VolumeX, Play, Pause, Send } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ScreenHeader from "./ScreenHeader";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useAppStore } from "../store/useAppStore";
import { useToast } from "@/hooks/use-toast";

const PostDetailScreen = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { toast } = useToast();
  
  const { 
    threads, 
    addCommentToThread, 
    likedPostIds, 
    savedPostIds, 
    toggleLikedPost, 
    toggleSavedPost 
  } = useAppStore();

  const [newComment, setNewComment] = useState("");
  const [showFullThread, setShowFullThread] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Find post dynamically from store
  const post = threads.find(t => t.id === Number(postId)) || threads[0];

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-inter p-6 text-center">
        <h3 className="text-xl font-bold mb-2">Thread Not Found</h3>
        <p className="text-sm text-muted-foreground mb-4">This post may have been deleted.</p>
        <Button onClick={() => navigate("/feed")} className="rounded-xl">Go Back to Feed</Button>
      </div>
    );
  }

  const isLiked = likedPostIds.includes(post.id);
  const isBookmarked = savedPostIds.includes(post.id);
  const comments = post.commentsList || [];

  const handleSendComment = () => {
    if (!newComment.trim()) return;
    
    addCommentToThread(post.id, newComment.trim());
    setNewComment("");
    
    toast({
      title: "Comment Posted",
      description: "Your reply has been added to this thread.",
    });
  };

  const threadPosts = [
    {
      id: "1a",
      content: "Started this project 3 weeks ago with basic linear regression. The learning curve has been intense but so rewarding! 📈",
      timestamp: "3w"
    },
    {
      id: "1b", 
      content: "Week 2 update: Switched to deep learning after hitting accuracy plateau. TensorFlow documentation is my new best friend 😅",
      timestamp: "2w"
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-background font-inter">
      <ScreenHeader title="Thread" subtitle={`by ${post.user.name}`} showMore />

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Thread Posts (if exists) */}
        {post.isThread && showFullThread && (
          <div className="border-b border-border/30">
            {threadPosts.map((threadPost, index) => (
              <div key={threadPost.id} className="p-4 relative">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                      <AvatarImage src={post.user.avatar} className="object-cover" />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm font-medium">
                        {post.user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {index < threadPosts.length - 1 && (
                      <div className="w-0.5 bg-border/50 h-8 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{post.user.name}</span>
                      <span className="text-muted-foreground text-sm">{post.user.handle}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground text-sm">{threadPost.timestamp}</span>
                    </div>
                    <p className="text-foreground leading-relaxed text-sm">{threadPost.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main Post */}
        <article className="p-6 space-y-4">
          {/* User Info */}
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <Avatar className="w-12 h-12 ring-2 ring-primary/20 cursor-pointer" onClick={() => navigate(`/user/${post.user.handle}`)}>
                <AvatarImage src={post.user.avatar} className="object-cover" />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                  {post.user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground cursor-pointer" onClick={() => navigate(`/user/${post.user.handle}`)}>{post.user.name}</h3>
                  {post.user.verified && (
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-primary/10 text-primary border-primary/20">
                      ✓
                    </Badge>
                  )}
                  {post.user.online && (
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{post.user.handle}</span>
                  <span>·</span>
                  <span>{post.user.course}</span>
                </div>
              </div>
            </div>
            {post.isThread && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-2xl border-primary/20 text-primary hover:bg-primary/5"
                onClick={() => setShowFullThread(!showFullThread)}
              >
                {showFullThread ? 'Hide' : 'Show'} thread ({post.threadCount})
              </Button>
            )}
          </div>

          {/* Content */}
          <div className="space-y-4">
            <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">{post.content}</p>
            
            {/* Media */}
            {post.media && (
              <div className="rounded-3xl overflow-hidden bg-muted/30 relative">
                {post.media.type === 'image' ? (
                  <img
                    src={post.media.url}
                    alt={post.media.alt}
                    className="w-full h-auto max-h-96 object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                    onClick={() => navigate(`/media/${post.id}`)}
                  />
                ) : (
                  <div className="relative">
                    <video
                      src={post.media.url}
                      className="w-full h-auto max-h-96 object-cover"
                      muted={isMuted}
                      loop
                      onClick={() => setIsPlaying(!isPlaying)}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        size="icon"
                        className="w-16 h-16 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-200"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </Button>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm"
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Timestamp */}
          <div className="text-sm text-muted-foreground">
            {post.timestamp} ago
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground py-2">
            <span><strong className="text-foreground">{post.metrics.likes}</strong> likes</span>
            <span><strong className="text-foreground">{comments.length}</strong> replies</span>
            <span><strong className="text-foreground">{post.metrics.reposts}</strong> reposts</span>
            <span><strong className="text-foreground">{post.metrics.bookmarks}</strong> bookmarks</span>
          </div>

          <Separator className="bg-border/50" />

          {/* Action Bar */}
          <div className="flex items-center justify-around py-2">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-2 rounded-2xl transition-all duration-200 hover:scale-105 ${
                isLiked ? 'text-destructive hover:text-destructive' : 'hover:text-destructive'
              }`}
              onClick={() => toggleLikedPost(post.id)}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{post.metrics.likes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 rounded-2xl hover:text-primary hover:scale-105 transition-all duration-200"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{comments.length}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 rounded-2xl hover:text-success hover:scale-105 transition-all duration-200"
              onClick={() => {
                const { repostThread } = useAppStore.getState();
                repostThread(post.id);
                toast({ title: "Reposted", description: "This post has been shared to your profile." });
              }}
            >
              <Repeat2 className="h-5 w-5" />
              <span className="text-sm font-medium">{post.metrics.reposts}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-2 rounded-2xl transition-all duration-200 hover:scale-105 ${
                isBookmarked ? 'text-accent hover:text-accent' : 'hover:text-accent'
              }`}
              onClick={() => toggleSavedPost(post.id)}
            >
              <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="rounded-2xl hover:text-primary hover:scale-105 transition-all duration-200"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast({
                  title: "Link Copied",
                  description: "Shareable thread link copied to clipboard!"
                });
              }}
            >
              <Share className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="rounded-2xl hover:text-warning hover:scale-105 transition-all duration-200"
              onClick={() => toast({ title: "Post Reported", description: "This thread has been flagged for campus moderation." })}
            >
              <Flag className="h-5 w-5" />
            </Button>
          </div>
        </article>

        <Separator className="bg-border/50" />

        {/* Comments Section */}
        <div className="space-y-4 p-6">
          <h3 className="text-lg font-semibold text-foreground">Replies</h3>
          
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              <div className="flex gap-3">
                <Avatar className="w-10 h-10 ring-2 ring-primary/10 cursor-pointer" onClick={() => navigate(`/user/${comment.user.handle}`)}>
                  <AvatarImage src={comment.user.avatar} className="object-cover" />
                  <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                    {comment.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="bg-muted/30 rounded-3xl p-4 hover:bg-muted/50 transition-colors duration-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-foreground cursor-pointer" onClick={() => navigate(`/user/${comment.user.handle}`)}>{comment.user.name}</span>
                      <span className="text-muted-foreground text-sm">{comment.user.handle}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground text-sm">{comment.timestamp}</span>
                    </div>
                    <p className="text-foreground leading-relaxed text-sm">{comment.content}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm px-2">
                    <Button variant="ghost" size="sm" className="h-auto p-1 text-muted-foreground hover:text-destructive text-xs">
                      <Heart className="h-3.5 w-3.5 mr-1" />
                      {comment.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-auto p-1 text-muted-foreground hover:text-primary text-xs">
                      <MessageCircle className="h-3.5 w-3.5 mr-1" />
                      Reply
                    </Button>
                  </div>

                  {/* Nested Replies */}
                  {comment.replies && comment.replies.map((reply) => (
                    <div key={reply.id} className="ml-8 flex gap-3 mt-3">
                      <Avatar className="w-8 h-8 ring-2 ring-primary/10 cursor-pointer" onClick={() => navigate(`/user/${reply.user.handle}`)}>
                        <AvatarImage src={reply.user.avatar} className="object-cover" />
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                          {reply.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted/20 rounded-3xl p-3 hover:bg-muted/40 transition-colors duration-200">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-foreground cursor-pointer" onClick={() => navigate(`/user/${reply.user.handle}`)}>{reply.user.name}</span>
                            <span className="text-muted-foreground text-xs">{reply.user.handle}</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground text-xs">{reply.timestamp}</span>
                          </div>
                          <p className="text-xs text-foreground leading-relaxed">{reply.content}</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs mt-2 px-1">
                          <Button variant="ghost" size="sm" className="h-auto p-1 text-muted-foreground hover:text-destructive text-xs">
                            <Heart className="h-3 w-3 mr-1" />
                            {reply.likes}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="text-center py-6 text-muted-foreground text-sm">
              No replies yet. Be the first to answer!
            </div>
          )}
        </div>
      </div>

      {/* Floating Comment Reply Bar at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border/50 px-6 py-4 z-30">
        <div className="flex items-center space-x-3">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a public reply..."
            className="rounded-3xl border-border/50 pr-12 h-12 text-sm bg-background/50 backdrop-blur-sm focus:bg-background transition-all"
            onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
          />
          <Button
            onClick={handleSendComment}
            disabled={!newComment.trim()}
            className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all shrink-0 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostDetailScreen;