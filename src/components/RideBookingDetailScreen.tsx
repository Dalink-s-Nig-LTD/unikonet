import React, { useState } from 'react';
import { Car, Bike, Bus, Star, Shield, Phone, MessageCircle, AlertTriangle, CalendarIcon, Clock, MapPin, Check } from 'lucide-react';
import { useNavigate, useParams } from "react-router-dom";
import ScreenHeader from './ScreenHeader';
import { format } from "date-fns";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useAppStore } from '../store/useAppStore';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const RideBookingDetailScreen = () => {
  const navigate = useNavigate();
  const { rideId } = useParams();
  const { toast } = useToast();

  const { 
    rides, 
    bookRideSeat, 
    createNewChat 
  } = useAppStore();

  const [rideTime, setRideTime] = useState<'asap' | 'scheduled'>('asap');
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Retrieve matching ride run dynamically
  const ride = rides.find(r => r.id === Number(rideId)) || rides[0];

  if (!ride) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-inter p-6 text-center">
        <h3 className="text-xl font-bold mb-2">Ride Run Expired</h3>
        <p className="text-sm text-muted-foreground mb-4">This ride sharing coordinate is no longer active.</p>
        <Button onClick={() => navigate("/discover")} className="rounded-xl">Go Back</Button>
      </div>
    );
  }

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'bike': return <Bike className="h-6 w-6" />;
      case 'shuttle': return <Bus className="h-6 w-6" />;
      default: return <Car className="h-6 w-6" />;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
      />
    ));
  };

  const handleBookRide = () => {
    if (ride.seats <= 0) {
      toast({
        title: "No Seats Left",
        description: "This ride pooling is fully occupied.",
        variant: "destructive"
      });
      return;
    }

    bookRideSeat(ride.id);
    setBookingSuccess(true);
    
    setTimeout(() => {
      setBookingSuccess(false);
      toast({
        title: "Booking Confirmed! 🎫",
        description: `Your seat has been reserved with ${ride.driver.name}. Coordinates sent to messages.`,
      });
      navigate('/discover');
    }, 2200);
  };

  const handleChatWithDriver = () => {
    const chatId = createNewChat(
      ride.driver.name, 
      ride.driver.avatar
    );
    toast({
      title: "Chat Opened",
      description: `Opening direct logistics thread with driver ${ride.driver.name}...`,
    });
    navigate(`/chat/${chatId}`);
  };

  const handleCallDriver = () => {
    toast({
      title: "Simulated Call Connection 📞",
      description: `Dialing driver phone: ${ride.driver.phone || "0812-345-6789"}`
    });
  };

  return (
    <div className="min-h-screen bg-background font-inter pb-28">
      <ScreenHeader title="Ride Details" />

      <div className="px-4 pb-20">
        {/* Enhanced Vehicle & Route Header */}
        <Card className="p-6 mt-4 bg-gradient-to-br from-card to-card/85 border-2 hover:border-primary/20 transition-all duration-300 shadow-elegant rounded-[2rem] animate-fade-in">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl text-primary shadow-lg">
              {getVehicleIcon(ride.vehicleType)}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground mb-3 capitalize">{ride.vehicleType} Ride</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-success border-2 border-background shadow-lg"></div>
                  <span className="font-semibold text-sm text-foreground">{ride.from}</span>
                </div>
                <div className="flex items-center space-x-3 ml-1.5">
                  <div className="w-0.5 h-6 bg-gradient-to-b from-success to-destructive"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-destructive border-2 border-background shadow-lg"></div>
                  <span className="font-semibold text-sm text-foreground">{ride.to}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Info Header */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 cursor-pointer" onClick={() => navigate(`/user/${ride.driver.name}`)}>
                <AvatarImage src={ride.driver.avatar} alt={ride.driver.name} className="object-cover" />
                <AvatarFallback>{ride.driver.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-foreground text-sm cursor-pointer hover:text-primary transition-colors" onClick={() => navigate(`/user/${ride.driver.name}`)}>{ride.driver.name}</h3>
                  {ride.driver.verified && (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-none font-semibold text-[9px] px-2 py-0">
                      <Shield className="h-2.5 w-2.5 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-1 mt-0.5">
                  {renderStars(ride.driver.rating)}
                  <span className="text-xs text-muted-foreground ml-1">({ride.driver.rating})</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Details Section */}
        <Card className="p-5 mt-4 rounded-2xl border border-border/40">
          <h2 className="text-sm font-extrabold text-foreground uppercase tracking-wider mb-4">Trip Details</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-2.5 bg-muted/20 rounded-xl">
              <p className="text-[10px] text-muted-foreground uppercase font-semibold">Seat Cost</p>
              <p className="text-base font-extrabold text-primary mt-1">{ride.price}</p>
            </div>
            <div className="text-center p-2.5 bg-muted/20 rounded-xl">
              <p className="text-[10px] text-muted-foreground uppercase font-semibold">Duration</p>
              <p className="text-base font-extrabold text-foreground mt-1">{ride.duration || "15 min"}</p>
            </div>
            <div className="text-center p-2.5 bg-muted/20 rounded-xl">
              <p className="text-[10px] text-muted-foreground uppercase font-semibold">Distance</p>
              <p className="text-base font-extrabold text-foreground mt-1">{ride.distance || "8.5 km"}</p>
            </div>
          </div>

          {/* Ride Schedule */}
          <div className="space-y-4 pt-2">
            <h3 className="font-semibold text-foreground text-sm">Ride Schedule</h3>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="schedule"
                  value="asap"
                  checked={rideTime === 'asap'}
                  onChange={(e) => setRideTime(e.target.value as 'asap')}
                  className="text-primary"
                />
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">ASAP ({ride.time})</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="schedule"
                  value="scheduled"
                  checked={rideTime === 'scheduled'}
                  onChange={(e) => setRideTime(e.target.value as 'scheduled')}
                  className="text-primary"
                />
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Select Custom Time</span>
                </div>
              </label>

              {rideTime === 'scheduled' && (
                <div className="ml-6 animate-scale-in">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal rounded-xl border-border bg-muted/20 text-xs",
                          !scheduledDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduledDate ? format(scheduledDate, "PPP 'at' p") : "Pick a date and time"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-border bg-card" align="start">
                      <Calendar
                        mode="single"
                        selected={scheduledDate}
                        onSelect={setScheduledDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Driver Information Card */}
        <Card className="p-5 mt-4 rounded-2xl border border-border/40">
          <h3 className="font-extrabold text-foreground text-sm uppercase tracking-wider mb-4">Vehicle Details</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Driver Matric No:</span>
              <span className="font-semibold text-foreground">{ride.driver.matricNo || "ENG/2020/004"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vehicle Model:</span>
              <span className="font-semibold text-foreground">{ride.driver.carModel || "Honda Civic 2020"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">License Plate:</span>
              <span className="font-semibold text-foreground">{ride.driver.plateNumber || "ABC-123-XY"}</span>
            </div>
          </div>

          <div className="flex space-x-3 mt-5">
            <Button onClick={handleCallDriver} variant="outline" className="flex-1 rounded-xl h-11 border-border/60 hover:bg-muted/40 font-bold text-xs text-foreground">
              <Phone className="h-4 w-4 mr-2 text-primary" />
              Call Driver
            </Button>
            <Button onClick={handleChatWithDriver} variant="outline" className="flex-1 rounded-xl h-11 border-border/60 hover:bg-muted/40 font-bold text-xs text-foreground">
              <MessageCircle className="h-4 w-4 mr-2 text-primary" />
              Chat Driver
            </Button>
          </div>
        </Card>

        {/* SOS Panel */}
        <Card className="p-5 mt-4 border-2 border-red-200/50 bg-red-500/5 rounded-2xl">
          <h3 className="font-bold text-red-700 text-sm mb-1.5 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" /> Campus Safety SOS
          </h3>
          <p className="text-xs text-red-600 leading-relaxed mb-4">
            Feel unsafe or lost? Signal emergency security dispatch straight to your exact coordinates.
          </p>
          <Button
            onClick={() => setShowEmergencyModal(true)}
            variant="destructive"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-11 rounded-xl transition-all shadow-md shadow-red-500/10"
          >
            Emergency Dispatch SOS
          </Button>
        </Card>
      </div>

      {/* Booking Drawer Confirmation Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-border/50 p-4 z-20">
        <div className="flex items-center justify-between mb-3 text-xs font-semibold px-1">
          <span className="text-muted-foreground">Available Seats left:</span>
          <span className={`${ride.seats > 0 ? 'text-green-600' : 'text-red-500'}`}>{ride.seats} seats available</span>
        </div>
        <Button 
          disabled={ride.seats <= 0 || bookingSuccess}
          onClick={handleBookRide}
          className="w-full h-12 rounded-xl bg-gradient-primary hover:scale-[1.02] active:scale-95 transition-all text-white font-bold shadow-glow"
        >
          {bookingSuccess ? (
            <span className="flex items-center justify-center gap-2">
              <Check className="w-5 h-5 animate-pulse" /> Booking Complete...
            </span>
          ) : (
            <span>Confirm Ride Seat ({ride.price})</span>
          )}
        </Button>
      </div>

      {/* Emergency SOS Dialog Modal */}
      <Dialog open={showEmergencyModal} onOpenChange={setShowEmergencyModal}>
        <DialogContent className="sm:max-w-md rounded-3xl border-red-500/30 bg-card">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 animate-bounce" /> Emergency SOS Dispatched
            </DialogTitle>
            <DialogDescription>
              Campus security control center is dialing your mobile line...
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="p-4 bg-red-500/10 rounded-2xl text-center space-y-2 border border-red-200">
              <p className="text-sm font-bold text-red-800">Security Hotline Active</p>
              <p className="text-xs text-red-600">
                Your matric number and approximate location coordinates have been sent to Redeemer's University Security Patrol.
              </p>
            </div>

            <div className="space-y-2.5 text-xs font-semibold">
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Emergency Patrol:</span>
                <span className="text-foreground">0803-SECURITY-RUN</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Clinic Response:</span>
                <span className="text-foreground">0805-CLINIC-RUN</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Matric No Dispatched:</span>
                <span className="text-foreground">CSC/2021/309</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={() => setShowEmergencyModal(false)}
              className="w-full h-11 rounded-xl border-border font-bold text-xs"
            >
              Cancel SOS Alert Signal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RideBookingDetailScreen;