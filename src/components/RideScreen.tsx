import { useState, useMemo } from "react";
import { MapPin, Clock, Star, Car, Filter, Bike, Bus, Navigation, Shield, Plus, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAppStore } from "../store/useAppStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const RideScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [expandedRide, setExpandedRide] = useState<number | null>(null);
  const [isOfferOpen, setIsOfferOpen] = useState(false);

  // Search Fields
  const [pickupQuery, setPickupQuery] = useState("");
  const [dropoffQuery, setDropoffQuery] = useState("");

  // Offer Form States
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [time, setTime] = useState("");
  const [priceStr, setPriceStr] = useState("");
  const [seats, setSeats] = useState("3");
  const [vehicleType, setVehicleType] = useState("car");

  const { rides, addRide, currentUser } = useAppStore();

  const filterOptions = [
    { id: "all", label: "All Rides", icon: Car },
    { id: "car", label: "Cars", icon: Car },
    { id: "bike", label: "Bikes", icon: Bike },
    { id: "available", label: "Available Now", icon: Clock }
  ];

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'bike': return <Bike className="w-5 h-5" />;
      case 'shuttle': return <Bus className="w-5 h-5" />;
      default: return <Car className="w-5 h-5" />;
    }
  };

  // Filter rides dynamically by search fields & tab category (Memoized)
  const filteredRides = useMemo(() => {
    return rides.filter(ride => {
      // Apply tab category filters
      if (selectedFilter !== "all") {
        if (selectedFilter === "available") {
          if (!ride.availableNow) return false;
        } else if (ride.vehicleType !== selectedFilter) {
          return false;
        }
      }

      // Apply pickup search
      if (pickupQuery.trim() && !ride.from.toLowerCase().includes(pickupQuery.toLowerCase())) {
        return false;
      }

      // Apply destination search
      if (dropoffQuery.trim() && !ride.to.toLowerCase().includes(dropoffQuery.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [rides, selectedFilter, pickupQuery, dropoffQuery]);

  const handleOfferSubmit = () => {
    if (!from.trim() || !to.trim() || !time.trim() || !priceStr.trim()) {
      toast({ title: "Form Error", description: "Please complete all standard routing inputs.", variant: "destructive" });
      return;
    }

    if (!currentUser) return;

    const formattedPrice = priceStr.startsWith("₦") ? priceStr : `₦${Number(priceStr).toLocaleString()}`;

    addRide({
      driver: {
        name: currentUser.name,
        rating: 5.0,
        avatar: currentUser.avatar,
        verified: true,
        matricNo: "CSC/2021/309",
        carModel: vehicleType === 'car' ? "Toyota Corolla 2018" : "Suzuki Powerbike",
        plateNumber: vehicleType === 'car' ? "RUN-842-AB" : "RUN-112-BI",
        phone: "+234 812 345 6789"
      },
      from: from.trim(),
      to: to.trim(),
      time: time.trim(),
      price: formattedPrice,
      seats: parseInt(seats),
      totalSeats: parseInt(seats),
      vehicleType
    });

    // Reset Form
    setFrom("");
    setTo("");
    setTime("");
    setPriceStr("");
    setIsOfferOpen(false);

    toast({
      title: "Ride Listed! 🚗",
      description: `Your ride offer from ${from} to ${to} is now open for bookings.`
    });
  };

  return (
    <div className="min-h-screen bg-background font-inter pb-24 relative">
      {/* Header */}
      <div className="bg-background/85 backdrop-blur-md px-4 sm:px-6 py-5 sticky top-0 z-40 border-b border-border/50">
        <h1 className="text-2xl font-bold text-foreground mb-4">🚗 Campus Rides</h1>
        
        {/* Route Input */}
        <div className="space-y-3">
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            <Input 
              value={pickupQuery}
              onChange={(e) => setPickupQuery(e.target.value)}
              placeholder="Filter by pickup location..."
              className="pl-12 h-12 rounded-xl border border-border bg-muted/30 focus:bg-background transition-all text-sm"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
            <Input 
              value={dropoffQuery}
              onChange={(e) => setDropoffQuery(e.target.value)}
              placeholder="Filter by destination..."
              className="pl-12 h-12 rounded-xl border border-border bg-muted/30 focus:bg-background transition-all text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                toast({ title: "Routing Filter", description: `Active search for rides towards your destination.` });
              }}
              className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              Find Rides
            </Button>
            {(pickupQuery || dropoffQuery) && (
              <Button 
                variant="outline" 
                onClick={() => { setPickupQuery(""); setDropoffQuery(""); }} 
                className="h-12 rounded-xl border-border px-4"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Available Runs</h2>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {filterOptions.map((option) => (
              <Button
                key={option.id}
                variant={selectedFilter === option.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(option.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full h-8 px-3 text-xs flex-shrink-0 transition-all ${
                  selectedFilter === option.id 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "hover:bg-muted/50 border-border/50 text-muted-foreground"
                }`}
              >
                <option.icon className="w-3.5 h-3.5" />
                <span>{option.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Available Rides */}
      <div className="px-4 py-4 space-y-4">
        {filteredRides.map((ride) => (
          <Card 
            key={ride.id} 
            className="p-0 overflow-hidden cursor-pointer bg-card border border-border/40 hover:shadow-md transition-shadow rounded-2xl animate-fade-in"
            onClick={() => navigate(`/ride/${ride.id}`)}
          >
            <div className="p-5">
              {/* Vehicle Type & Status Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`p-2.5 rounded-2xl flex-shrink-0 ${
                    ride.vehicleType === 'car' ? 'bg-primary/10 text-primary' : 'bg-orange-500/10 text-orange-500'
                  }`}>
                    {getVehicleIcon(ride.vehicleType)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-foreground capitalize">{ride.vehicleType} Run</h3>
                      {ride.availableNow && (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-transparent text-[10px] px-2 py-0">
                          <Navigation className="w-2.5 h-2.5 mr-1" />
                          ETA {ride.eta}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{ride.distance} • {ride.duration}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-base font-extrabold text-primary">{ride.price}</div>
                  <div className="text-xs text-muted-foreground font-medium mt-0.5">{ride.seats} seats left</div>
                </div>
              </div>

              {/* Route Info */}
              <div className="relative mb-4 pl-1">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0"></div>
                  <span className="font-semibold text-sm text-foreground truncate">{ride.from}</span>
                </div>
                <div className="flex items-center gap-3 ml-[4.5px] py-0.5">
                  <div className="w-[1px] h-3 bg-muted-foreground/30"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0"></div>
                  <span className="font-semibold text-sm text-foreground truncate">{ride.to}</span>
                </div>
              </div>

              {/* Driver Info */}
              <div className="flex flex-col gap-3 p-4 bg-muted/30 rounded-2xl border border-border/40">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={ride.driver.avatar}
                    alt={ride.driver.name}
                    className="w-10 h-10 rounded-full object-cover border border-border ring-2 ring-primary/5"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-foreground truncate">{ride.driver.name}</h4>
                      {ride.driver.verified && (
                        <Shield className="w-3.5 h-3.5 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground font-semibold">{ride.driver.rating}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-background border-border/40 font-semibold px-2 py-0.5">
                    {ride.time}
                  </Badge>
                </div>
                
                <Button 
                  size="sm" 
                  className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-bold hover:shadow-md transition-all active:scale-[0.98]"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/ride/${ride.id}`);
                  }}
                >
                  Book Seat Now
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredRides.length === 0 && (
          <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border/40">
            <Car className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-40" />
            <h3 className="text-base font-bold mb-1">No rides found</h3>
            <p className="text-xs text-muted-foreground">Try clearing route search filters</p>
          </div>
        )}
      </div>

      {/* Offer a Ride FAB */}
      <button 
        onClick={() => setIsOfferOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-primary text-white rounded-full shadow-glow hover:shadow-xl transition-all duration-300 flex items-center justify-center z-30 hover:scale-105 active:scale-95"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* Offer a Ride Form Modal */}
      <Dialog open={isOfferOpen} onOpenChange={setIsOfferOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-border bg-card">
          <DialogHeader>
            <DialogTitle>Offer a Ride Run</DialogTitle>
            <DialogDescription>
              Pool transport to campus buildings or transit centers.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Pickup Station</label>
                <Input
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="e.g. Engineering Block"
                  className="rounded-xl border-border bg-muted/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Destination</label>
                <Input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="e.g. Main Gate"
                  className="rounded-xl border-border bg-muted/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Departure Time</label>
                <Input
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 2:30 PM"
                  className="rounded-xl border-border bg-muted/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Cost per seat (₦)</label>
                <Input
                  type="number"
                  value={priceStr}
                  onChange={(e) => setPriceStr(e.target.value)}
                  placeholder="e.g. 600"
                  className="rounded-xl border-border bg-muted/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Available Seats</label>
                <Select value={seats} onValueChange={setSeats}>
                  <SelectTrigger className="rounded-xl border-border bg-muted/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["1", "2", "3", "4"].map((num) => (
                      <SelectItem key={num} value={num}>{num} seat{num !== '1' ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Vehicle Mode</label>
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger className="rounded-xl border-border bg-muted/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">🚗 Car</SelectItem>
                    <SelectItem value="bike">🏍️ Bike</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-border/50 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsOfferOpen(false)} className="rounded-xl h-11 px-4">
                Cancel
              </Button>
              <Button 
                onClick={handleOfferSubmit}
                className="bg-primary text-primary-foreground font-bold rounded-xl h-11 px-6 shadow-md"
              >
                List Ride Offer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RideScreen;