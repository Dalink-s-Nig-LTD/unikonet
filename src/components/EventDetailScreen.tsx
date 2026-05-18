import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Share, MessageCircle, QrCode, Bell, BellOff, Users, Heart, Ticket } from 'lucide-react';
import { useNavigate, useParams } from "react-router-dom";
import ScreenHeader from './ScreenHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAppStore } from '../store/useAppStore';
import { useToast } from '@/hooks/use-toast';

const EventDetailScreen = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { toast } = useToast();
  
  const { 
    events, 
    rsvpEvent,
    createNewChat 
  } = useAppStore();

  const [reminders, setReminders] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState("1");
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Retrieve event dynamically from Zustand store
  const event = events.find(e => e.id === Number(eventId)) || events[0];

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-inter p-6 text-center">
        <h3 className="text-xl font-bold mb-2">Event Not Found</h3>
        <p className="text-sm text-muted-foreground mb-4">This campus event may have ended or been canceled.</p>
        <Button onClick={() => navigate("/discover")} className="rounded-xl">Back to Discover</Button>
      </div>
    );
  }

  const hasTicket = !!event.hasTicket;

  const handleGetTicket = () => {
    rsvpEvent(event.id, parseInt(ticketQuantity));
    setShowTicketModal(false);
    
    toast({
      title: "RSVP Successful! 🎉",
      description: `You secured ${ticketQuantity} ticket(s) to "${event.title}". QR code added to your wallet.`,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Event link copied to clipboard!"
    });
  };

  const handleJoinChatroom = () => {
    const chatroomName = `${event.title} Chatroom`;
    const chatId = createNewChat(chatroomName, event.poster, true);
    toast({
      title: "Event Chatroom Opened",
      description: `Entering coordinate chat for attendees...`,
    });
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle font-inter pb-12">
      <ScreenHeader 
        title="Event Details" 
        action={
          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="h-10 w-10 inline-flex items-center justify-center rounded-2xl transition-colors hover:bg-muted/60 text-foreground"
            >
              <Share className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                setIsLiked(!isLiked);
                toast({
                  title: isLiked ? "Removed from Likes" : "Liked Event",
                  description: isLiked ? "Event removed from saved list" : "Event saved to your calendar likes!"
                });
              }}
              className={`h-10 w-10 inline-flex items-center justify-center rounded-2xl transition-colors hover:bg-muted/60 ${isLiked ? 'text-red-500' : 'text-foreground'}`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>
        }
      />

      {/* Banner */}
      <div className="relative">
        <img
          src={event.poster}
          alt={event.title}
          className="w-full h-[250px] object-cover"
        />
        <div className="absolute top-4 right-4">
          {!hasTicket && (
            <Dialog open={showTicketModal} onOpenChange={setShowTicketModal}>
              <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent/90 text-white font-semibold rounded-2xl shadow-lg border-none">
                  Get Ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-3xl border-border bg-card">
                <DialogHeader>
                  <DialogTitle>Get Your Ticket</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <h3 className="font-bold text-foreground text-base mb-1">{event.title}</h3>
                    <p className="text-xs text-muted-foreground">{event.date} at {event.time}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quantity</label>
                    <Select value={ticketQuantity} onValueChange={setTicketQuantity}>
                      <SelectTrigger className="rounded-xl border-border bg-muted/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: event.maxTickets }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            {i + 1} ticket{i > 0 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50 text-sm font-semibold">
                    <span>Total: {event.ticketType === 'free' ? 'Free' : `₦${event.price * parseInt(ticketQuantity)}`}</span>
                    <Button onClick={handleGetTicket} className="bg-primary text-primary-foreground font-bold rounded-xl px-5">
                      {event.ticketType === 'free' ? 'Confirm RSVP' : 'Pay Now'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {hasTicket && (
            <Badge className="bg-green-600 text-white font-semibold rounded-full px-3 py-1 shadow-md border-none">
              RSVP Registered
            </Badge>
          )}
        </div>
      </div>

      <div className="px-4 pb-20">
        {/* Event Info Card */}
        <Card className="p-6 mt-6 rounded-[2rem] shadow-elegant border-2 border-border/50 bg-gradient-to-br from-card to-card/85 animate-fade-in">
          <div className="space-y-4">
            <div>
              <h1 className="text-xl font-extrabold text-foreground mb-2 leading-snug">{event.title}</h1>
              <p className="text-xs text-muted-foreground font-medium">Hosted by <span className="text-primary font-semibold">{event.host}</span></p>
              <p className="text-xs text-muted-foreground mt-0.5">{event.department}</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span className="text-foreground font-medium">{event.location}</span>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <Calendar className="h-5 w-5 text-primary shrink-0" />
                <span className="text-foreground font-medium">{event.date}</span>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <Clock className="h-5 w-5 text-primary shrink-0" />
                <span className="text-foreground font-medium">{event.time}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <div className="flex items-center space-x-2">
                {reminders ? <Bell className="h-4 w-4 text-primary animate-bounce" /> : <BellOff className="h-4 w-4 text-muted-foreground" />}
                <span className="text-xs font-semibold text-foreground">Remind me before event</span>
              </div>
              <Switch
                checked={reminders}
                onCheckedChange={(checked) => {
                  setReminders(checked);
                  toast({
                    title: checked ? "Reminders Enabled" : "Reminders Disabled",
                    description: checked 
                      ? "We will notify you 1 hour before event kickoff."
                      : "Reminders muted."
                  });
                }}
              />
            </div>
          </div>
        </Card>

        {/* Description Card */}
        <Card className="p-6 mt-4 border border-border/40 rounded-2xl bg-card">
          <h2 className="text-sm font-extrabold text-foreground uppercase tracking-wider mb-3">About this Event</h2>
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {event.description}
          </div>
        </Card>

        {/* Tickets Card */}
        <Card className="p-6 mt-4 border border-border/40 rounded-2xl bg-card">
          <h2 className="text-sm font-extrabold text-foreground uppercase tracking-wider mb-4">Tickets</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge 
                  variant="secondary" 
                  className={`${event.ticketType === 'free' ? 'bg-green-500/10 text-green-600' : 'bg-primary/10 text-primary'} border-none`}
                >
                  {event.ticketType === 'free' ? 'Free Event' : 'Paid Event'}
                </Badge>
                <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
                  <Users className="h-4 w-4 shrink-0" />
                  <span className="font-medium">{event.attendees} attending</span>
                </div>
              </div>
              {event.ticketType === 'paid' && (
                <span className="text-lg font-bold text-primary">₦{event.price}</span>
              )}
            </div>

            {hasTicket && (
              <div className="bg-muted/40 rounded-2xl p-5 border border-dashed border-green-500/30 flex flex-col items-center justify-center text-center space-y-3">
                <div className="p-3 bg-green-500/10 rounded-2xl">
                  <QrCode className="h-16 w-16 text-green-600 animate-pulse" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">Your Ticket is Active</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                    Present this secure QR code at the entrance of {event.location} to gain entry.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Social Integration */}
        <Card className="p-6 mt-4 border border-border/40 rounded-2xl bg-card">
          <h2 className="text-sm font-extrabold text-foreground uppercase tracking-wider mb-4">Campus Connect</h2>
          
          <div className="space-y-3">
            <Button 
              onClick={handleJoinChatroom}
              variant="outline" 
              className="w-full h-11 rounded-xl border-primary/20 text-primary hover:bg-primary/5 transition-all text-xs font-bold"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Join Coordinates Chatroom
            </Button>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      {!hasTicket && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border/50 p-4 z-20 flex gap-3">
          <Dialog open={showTicketModal} onOpenChange={setShowTicketModal}>
            <DialogTrigger asChild>
              <Button className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-12 rounded-xl flex items-center justify-center shadow-lg">
                <Ticket className="w-5 h-5 mr-2" />
                Get Ticket {event.ticketType === 'paid' && `- ₦${event.price * parseInt(ticketQuantity)}`}
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default EventDetailScreen;