import { useState } from "react";
import { Search, Plus, Home, ShoppingBag, Car, MessageSquare, User, ShoppingCart, Zap } from "lucide-react";
import BottomTabNav from "./BottomTabNav";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const ChatScreen = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("chat");

  const chats = [
    {
      id: 1,
      name: "Study Group - CS301",
      lastMessage: "Meeting tomorrow at 3 PM",
      time: "2h",
      unread: 3,
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=60&h=60&fit=crop",
      isGroup: true
    },
    {
      id: 2,
      name: "Sarah Johnson",
      lastMessage: "Thanks for the ML notes!",
      time: "4h",
      unread: 1,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c8c0?w=60&h=60&fit=crop&crop=face",
      isGroup: false
    },
    {
      id: 3,
      name: "Campus Ride Share",
      lastMessage: "New ride available to downtown",
      time: "6h",
      unread: 0,
      avatar: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=60&h=60&fit=crop",
      isGroup: true
    },
    {
      id: 4,
      name: "Mike Chen",
      lastMessage: "See you at the library",
      time: "1d",
      unread: 0,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
      isGroup: false
    },
    {
      id: 5,
      name: "Business Club",
      lastMessage: "Workshop registration is open",
      time: "2d",
      unread: 5,
      avatar: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=60&h=60&fit=crop",
      isGroup: true
    }
  ];


  return (
    <div className="min-h-screen bg-background font-inter pb-24">

      {/* Enhanced Header */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm shadow-lg px-6 py-8 sticky top-0 z-40 border-b border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-h2 font-bold bg-gradient-primary bg-clip-text text-transparent">💬 Messages</h1>
          <button className="w-12 h-12 rounded-2xl bg-gradient-primary shadow-glow flex items-center justify-center hover:scale-110 transition-all duration-300 group">
            <Plus className="w-6 h-6 text-primary-foreground group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
        
        {/* Enhanced Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search conversations..."
            className="pl-12 h-14 rounded-2xl border-2 border-border/50 bg-background/80 backdrop-blur-sm text-body focus:border-primary/50 focus:shadow-glow transition-all duration-300"
          />
        </div>
      </div>

      {/* Enhanced Chat List */}
      <div className="px-6 py-4 pb-24 space-y-3">
        {chats.map((chat, index) => (
          <div 
            key={chat.id} 
            onClick={() => navigate(`/chat/${chat.id}`)}
            className="flex items-center space-x-4 p-5 rounded-3xl bg-card border border-border/50 hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer group animate-fade-in hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Enhanced Avatar */}
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/20 group-hover:border-primary/40 transition-all duration-300">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              {chat.isGroup && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center border-2 border-background shadow-md">
                  <User className="w-3 h-3 text-accent-foreground" />
                </div>
              )}
              <div className="absolute top-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-background"></div>
            </div>

            {/* Enhanced Chat Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-body font-bold text-foreground truncate group-hover:text-primary transition-colors duration-300">
                  {chat.name}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                    {chat.time}
                  </span>
                  {chat.unread > 0 && (
                    <div className="relative">
                      <div className="min-w-[24px] h-6 bg-gradient-primary rounded-full flex items-center justify-center px-2 shadow-glow">
                        <span className="text-xs font-bold text-primary-foreground">
                          {chat.unread > 9 ? "9+" : chat.unread}
                        </span>
                      </div>
                      <Zap className="absolute -top-1 -right-1 w-3 h-3 text-accent animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
              <p className="text-small text-muted-foreground truncate leading-relaxed">
                {chat.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ChatScreen;