import { useState } from "react";
import { Calendar, MapPin, Car, Users, Compass, Check, MessageSquare, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const DiscoverScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSegment, setActiveSegment] = useState("events");

  const { 
    events, 
    clubs, 
    joinClub,
    createNewChat 
  } = useAppStore();

  const handleJoinClubToggle = (clubId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    joinClub(clubId);
    
    const club = clubs.find(c => c.id === clubId);
    if (club) {
      toast({
        title: club.joined ? "Left Community" : "Joined Community! 🎉",
        description: club.joined 
          ? `You have unsubscribed from ${club.name}.`
          : `You are now a verified member of ${club.name}. Chatroom unlocked!`
      });
    }
  };

  const handleOpenClubChat = (clubName: string, clubImage: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const chatId = createNewChat(`${clubName} Lounge`, clubImage, true);
    toast({
      title: "Group Chatroom Unlocked",
      description: `Entering coordinate chat lounge...`
    });
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="min-h-screen bg-background font-inter pb-24">
      {/* Dynamic Header */}
      <div className="bg-card/85 backdrop-blur-md px-6 pt-6 pb-4 border-b border-border/50 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Discover</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Explore campus events & organizations</p>
          </div>
          <Compass className="w-6 h-6 text-primary animate-spin-slow" />
        </div>

        {/* Tab Selection */}
        <Tabs value={activeSegment} onValueChange={setActiveSegment} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-2xl">
            <TabsTrigger value="events" className="rounded-xl text-sm font-semibold">
              Events
            </TabsTrigger>
            <TabsTrigger value="clubs" className="rounded-xl text-sm font-semibold">
              Clubs & Groups
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Discover Container */}
      <div className="px-4 py-4 space-y-6">
        
        {/* Quick Runs Link */}
        <div className="grid grid-cols-2 gap-3">
          <Card 
            className="p-4 bg-primary/10 border-transparent hover:bg-primary/20 cursor-pointer transition-all duration-300 rounded-2xl flex flex-col justify-between" 
            onClick={() => navigate('/ride')}
          >
            <div>
              <Car className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-bold text-foreground text-sm">Campus Rides</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Pool/Book student drivers</p>
            </div>
          </Card>
          <Card 
            className="p-4 bg-orange-500/10 border-transparent hover:bg-orange-500/20 cursor-pointer transition-all duration-300 rounded-2xl flex flex-col justify-between"
            onClick={() => setActiveSegment("clubs")}
          >
            <div>
              <Users className="w-8 h-8 text-orange-500 mb-2" />
              <h3 className="font-bold text-foreground text-sm">Clubs & Hubs</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Student societies & chats</p>
            </div>
          </Card>
        </div>

        {activeSegment === "events" ? (
          <div className="space-y-4">
            <h2 className="text-sm font-extrabold text-foreground uppercase tracking-wider pl-1 mb-2">Upcoming Events</h2>
            
            {events.map((event) => (
              <Card 
                key={event.id} 
                className="p-0 bg-card/85 backdrop-blur-sm shadow-elegant hover:shadow-glow transition-all duration-300 border border-border/40 rounded-3xl overflow-hidden cursor-pointer animate-fade-in"
                onClick={() => navigate(`/event/${event.id}`)}
              >
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={event.poster}
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <Badge 
                    variant="secondary" 
                    className={`absolute top-3 right-3 ${event.ticketType === 'free' ? 'bg-green-600 text-white' : 'bg-primary text-white'} backdrop-blur-md border-none`}
                  >
                    {event.ticketType === 'free' ? 'Free' : `₦${event.price}`}
                  </Badge>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-foreground text-base mb-2 leading-tight">{event.title}</h3>
                  <div className="space-y-2.5">
                    <div className="flex items-center space-x-2 text-xs">
                      <Calendar className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-muted-foreground font-medium">{event.date} at {event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-muted-foreground font-medium truncate max-w-[240px]">{event.location}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <span className="text-[10px] text-muted-foreground font-semibold">{event.host}</span>
                      <span className="text-xs text-primary font-bold">{event.attendees} attending</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-sm font-extrabold text-foreground uppercase tracking-wider pl-1 mb-2">Campus Communities</h2>
            
            {clubs.map((club) => (
              <Card 
                key={club.id} 
                className="p-0 bg-card border border-border/40 hover:shadow-md transition-shadow rounded-3xl overflow-hidden animate-fade-in"
              >
                <div className="h-28 overflow-hidden relative">
                  <img src={club.avatar} alt={club.name} className="w-full h-full object-cover" />
                  <Badge className="absolute top-3 right-3 bg-card/90 text-foreground border-none text-[10px]">
                    {club.category}
                  </Badge>
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-foreground text-sm leading-tight">{club.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{club.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    <span className="text-xs font-semibold text-muted-foreground">{club.members.toLocaleString()} members</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={club.joined ? "secondary" : "default"}
                        onClick={(e) => handleJoinClubToggle(club.id, e)}
                        className="h-8 rounded-xl text-xs font-bold px-3 transition-all"
                      >
                        {club.joined ? (
                          <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Joined</span>
                        ) : (
                          <span className="flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Join</span>
                        )}
                      </Button>
                      {club.joined && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleOpenClubChat(club.name, club.avatar, e)}
                          className="h-8 w-8 p-0 rounded-xl border-border"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-primary" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default DiscoverScreen;
