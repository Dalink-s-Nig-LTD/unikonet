import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bell, Heart, MessageSquare, UserPlus, Package, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore, Notification } from "../store/useAppStore";
import { Badge } from "@/components/ui/badge";

const NotificationsScreen = () => {
  const navigate = useNavigate();
  const { notifications, markNotificationRead } = useAppStore();

  // Sort by latest first
  const sortedNotifications = [...notifications].sort((a, b) => b.id - a.id);
  
  // Fake some mock notifications if store is empty for display purposes
  const displayNotifications = sortedNotifications.length > 0 ? sortedNotifications : [
    { id: 1, type: 'Follow', message: 'Sarah Johnson started following you.', timestamp: '2m ago', read: false },
    { id: 2, type: 'Like', message: 'Mike Chen liked your thread about machine learning.', timestamp: '1h ago', read: false },
    { id: 3, type: 'Reply', message: 'Alex replied to your comment: "Exactly! Thanks for sharing."', timestamp: '3h ago', read: true },
    { id: 4, type: 'Order', message: 'Your order for "Engineering Drawing Kit" has been shipped.', timestamp: '1d ago', read: true },
    { id: 5, type: 'System', message: 'Welcome to Unikonet! Complete your profile to get started.', timestamp: '2d ago', read: true },
  ] as Notification[];

  const unreadCount = displayNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'Like': return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
      case 'Reply': return <MessageSquare className="w-5 h-5 text-blue-500 fill-blue-500" />;
      case 'Follow': return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'Order': return <Package className="w-5 h-5 text-amber-500" />;
      default: return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const handleNotificationClick = (n: Notification) => {
    markNotificationRead(n.id);
    // Routing logic based on type could go here
  };

  return (
    <div className="min-h-screen bg-background font-inter pb-safe">
      {/* Header */}
      <div className="bg-card px-4 pt-12 pb-4 shadow-sm border-b border-border/50 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-foreground">Notifications</h1>
            {unreadCount > 0 && (
              <Badge className="bg-primary hover:bg-primary text-white border-none rounded-full px-2 py-0 h-5">
                {unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 animate-fade-in divide-y divide-border/30">
        {displayNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center px-4">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <Bell className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">You're all caught up!</h2>
            <p className="text-muted-foreground text-sm">No new notifications right now. Check back later for updates.</p>
          </div>
        ) : (
          displayNotifications.map((notification) => (
            <div 
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-4 flex gap-4 cursor-pointer hover:bg-muted/30 transition-colors ${!notification.read ? 'bg-primary/5' : 'bg-transparent'}`}
            >
              <div className="mt-1 flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${!notification.read ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1.5 font-medium">{notification.timestamp}</p>
              </div>
              {!notification.read && (
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;
