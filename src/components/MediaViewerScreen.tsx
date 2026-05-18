import { useState, useRef, useEffect } from "react";
import { X, Share, Download, Flag, Heart, Laugh, ThumbsUp, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  alt: string;
  user: {
    name: string;
    handle: string;
    avatar: string;
  };
  caption?: string;
  timestamp: string;
}

interface MediaViewerScreenProps {
  mediaItems?: MediaItem[];
  currentIndex?: number;
  onClose?: () => void;
}

const MediaViewerScreen = ({ 
  mediaItems = [], 
  currentIndex = 0, 
  onClose 
}: MediaViewerScreenProps) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reactions, setReactions] = useState<string[]>([]);
  const [showReactions, setShowReactions] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pinchRef = useRef({ scale: 1, startDistance: 0 });

  // Mock media data if not provided
  const defaultMediaItems: MediaItem[] = [
    {
      id: "1",
      type: "image",
      url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=800&fit=crop",
      alt: "Machine learning project dashboard",
      user: {
        name: "Sarah Johnson",
        handle: "@sarah_cs23",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c8c0?w=40&h=40&fit=crop&crop=face"
      },
      caption: "Finally got my neural network working! 🤖 #MachineLearning",
      timestamp: "2h ago"
    },
    {
      id: "2",
      type: "video",
      url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
      alt: "Project demo video",
      user: {
        name: "Sarah Johnson",
        handle: "@sarah_cs23",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c8c0?w=40&h=40&fit=crop&crop=face"
      },
      caption: "Demo of the project in action",
      timestamp: "2h ago"
    }
  ];

  const items = mediaItems.length > 0 ? mediaItems : defaultMediaItems;
  const currentItem = items[activeIndex];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowLeft':
          if (activeIndex > 0) setActiveIndex(activeIndex - 1);
          break;
        case 'ArrowRight':
          if (activeIndex < items.length - 1) setActiveIndex(activeIndex + 1);
          break;
        case ' ':
          e.preventDefault();
          if (currentItem.type === 'video') {
            setIsPlaying(!isPlaying);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, items.length, isPlaying, currentItem.type]);

  // Hide controls after inactivity
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    const resetTimer = () => {
      setShowControls(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShowControls(false), 3000);
    };

    resetTimer();
    
    const handleMouseMove = () => resetTimer();
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Video control
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const handlePinchZoom = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );

      if (pinchRef.current.startDistance === 0) {
        pinchRef.current.startDistance = distance;
      } else {
        const scaleChange = distance / pinchRef.current.startDistance;
        const newScale = Math.min(Math.max(0.5, pinchRef.current.scale * scaleChange), 3);
        setScale(newScale);
      }
    }
  };

  const handleTouchEnd = () => {
    pinchRef.current.startDistance = 0;
    pinchRef.current.scale = scale;
  };

  const handleDoubleClick = () => {
    if (scale === 1) {
      setScale(2);
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const addReaction = (reaction: string) => {
    setReactions(prev => [...prev, reaction]);
    // Remove reaction after animation
    setTimeout(() => {
      setReactions(prev => prev.slice(1));
    }, 2000);
  };

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex flex-col"
      onTouchMove={handlePinchZoom}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <header className={`absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-background/80 to-transparent transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-2xl bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-all duration-200"
          onClick={handleClose}
        >
          <X className="h-6 w-6" />
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground bg-background/60 backdrop-blur-sm rounded-full px-3 py-1">
            {activeIndex + 1} of {items.length}
          </span>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-2xl bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-all duration-200"
            onClick={() => {/* Handle share */}}
          >
            <Share className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-2xl bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-all duration-200"
            onClick={() => {/* Handle download */}}
          >
            <Download className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-2xl bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-all duration-200"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Media Content */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {currentItem.type === 'image' ? (
          <img
            src={currentItem.url}
            alt={currentItem.alt}
            className="max-w-full max-h-full object-contain cursor-zoom-in transition-transform duration-200"
            style={{
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`
            }}
            onDoubleClick={handleDoubleClick}
            draggable={false}
          />
        ) : (
          <div className="relative max-w-full max-h-full">
            <video
              ref={videoRef}
              src={currentItem.url}
              poster={currentItem.thumbnail}
              className="max-w-full max-h-full object-contain"
              muted={isMuted}
              loop
              onClick={() => setIsPlaying(!isPlaying)}
            />
            
            {/* Video Controls */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}>
              <Button
                size="icon"
                className="w-16 h-16 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-200"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
              </Button>
            </div>

            {/* Video Controls Bottom */}
            <div className={`absolute bottom-4 left-4 right-4 flex items-center justify-between transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
              
              <Button
                size="icon"
                variant="ghost"
                className="w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm"
                onClick={toggleFullscreen}
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Navigation Arrows */}
        {items.length > 1 && (
          <>
            {activeIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-all duration-200 ${
                  showControls ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={() => setActiveIndex(activeIndex - 1)}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}
            
            {activeIndex < items.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-all duration-200 ${
                  showControls ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={() => setActiveIndex(activeIndex + 1)}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}
          </>
        )}

        {/* Reaction Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {reactions.map((reaction, index) => (
            <div
              key={index}
              className="absolute text-4xl animate-fade-in"
              style={{
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
                animation: 'fade-in 0.3s ease-out, slide-up 2s ease-out forwards'
              }}
            >
              {reaction}
            </div>
          ))}
        </div>

        {/* Long Press for Reactions */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
          {showReactions && (
            <div className="flex gap-2 bg-background/80 backdrop-blur-sm rounded-full p-2 animate-scale-in">
              {['❤️', '😂', '👍', '😮', '😢', '😡'].map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-full hover:scale-110 transition-transform"
                  onClick={() => addReaction(emoji)}
                >
                  <span className="text-xl">{emoji}</span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Info */}
      <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/80 to-transparent transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10 ring-2 ring-primary/20">
            <AvatarImage src={currentItem.user.avatar} />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm">
              {currentItem.user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{currentItem.user.name}</span>
              <span className="text-muted-foreground text-sm">{currentItem.user.handle}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground text-sm">{currentItem.timestamp}</span>
            </div>
            {currentItem.caption && (
              <p className="text-foreground leading-relaxed">{currentItem.caption}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-2xl hover:text-destructive hover:scale-105 transition-all duration-200"
              onDoubleClick={() => addReaction('❤️')}
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-2xl hover:text-warning hover:scale-105 transition-all duration-200"
            >
              <Flag className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Thumbnails Strip (if multiple items) */}
      {items.length > 1 && (
        <div className={`absolute bottom-20 left-0 right-0 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide">
            {items.map((item, index) => (
              <button
                key={item.id}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === activeIndex ? 'border-primary' : 'border-transparent'
                }`}
                onClick={() => setActiveIndex(index)}
              >
                <img
                  src={item.type === 'video' ? item.thumbnail : item.url}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaViewerScreen;