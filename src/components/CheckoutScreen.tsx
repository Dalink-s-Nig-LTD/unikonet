import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, CreditCard, Building, Truck, ShieldCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppStore } from "../store/useAppStore";
import { useToast } from "@/hooks/use-toast";

const CheckoutScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cartItems, campusProducts, studentProducts } = useAppStore();

  const [deliveryMethod, setDeliveryMethod] = useState<'Delivery' | 'Pickup'>('Delivery');
  const [address, setAddress] = useState("Block C, Room 204, Main Hostel");
  const [paymentMethod, setPaymentMethod] = useState("card_1");

  const allProducts = [...campusProducts, ...studentProducts];
  
  const subtotal = cartItems.reduce((total, item) => {
    const product = allProducts.find(p => p.id === item.productId);
    if (!product) return total;
    const priceNum = parseFloat(product.price.replace(/[^0-9.]/g, ''));
    return total + (priceNum * item.quantity);
  }, 0);

  const deliveryFee = deliveryMethod === 'Delivery' ? 1500 : 0;
  const serviceFee = 500;
  const total = subtotal + deliveryFee + serviceFee;

  const handleProceedToPayment = () => {
    if (deliveryMethod === 'Delivery' && !address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter a valid delivery address.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, we'd pass the order data to the next screen via state or store
    navigate("/payment-processing", { 
      state: { 
        total, 
        deliveryMethod, 
        address,
        paymentMethod
      } 
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h3 className="text-xl font-bold mb-2">Cart is Empty</h3>
        <Button onClick={() => navigate("/store")}>Return to Store</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle font-inter pb-24">
      {/* Header */}
      <div className="bg-card px-4 pt-12 pb-4 shadow-sm border-b border-border/50 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Checkout</h1>
        </div>
      </div>

      <div className="px-4 mt-6 space-y-6 animate-fade-in">
        
        {/* Delivery Options */}
        <section>
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Fulfillment Method</h2>
          <div className="grid grid-cols-2 gap-3">
            <div 
              onClick={() => setDeliveryMethod('Delivery')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                deliveryMethod === 'Delivery' 
                  ? 'border-primary bg-primary/5 shadow-sm' 
                  : 'border-border/50 bg-card hover:border-primary/30'
              }`}
            >
              <Truck className={`w-6 h-6 mb-2 ${deliveryMethod === 'Delivery' ? 'text-primary' : 'text-muted-foreground'}`} />
              <h3 className={`font-bold text-sm ${deliveryMethod === 'Delivery' ? 'text-primary' : 'text-foreground'}`}>Campus Delivery</h3>
              <p className="text-xs text-muted-foreground mt-1">Delivered to your hostel/faculty</p>
            </div>
            
            <div 
              onClick={() => setDeliveryMethod('Pickup')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                deliveryMethod === 'Pickup' 
                  ? 'border-primary bg-primary/5 shadow-sm' 
                  : 'border-border/50 bg-card hover:border-primary/30'
              }`}
            >
              <Building className={`w-6 h-6 mb-2 ${deliveryMethod === 'Pickup' ? 'text-primary' : 'text-muted-foreground'}`} />
              <h3 className={`font-bold text-sm ${deliveryMethod === 'Pickup' ? 'text-primary' : 'text-foreground'}`}>Pickup Point</h3>
              <p className="text-xs text-muted-foreground mt-1">Collect from the student union</p>
            </div>
          </div>
        </section>

        {/* Address Input */}
        {deliveryMethod === 'Delivery' && (
          <section className="animate-fade-in">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Delivery Address</h2>
            <Card className="p-4 rounded-2xl border border-border/50 shadow-sm bg-card">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <Input 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your hostel and room number..."
                    className="border-none bg-transparent shadow-none px-0 h-auto focus-visible:ring-0 text-foreground font-medium"
                  />
                  <div className="h-px bg-border/50 w-full mt-2"></div>
                  <p className="text-xs text-muted-foreground mt-2">Ensure your location is reachable by campus runners.</p>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Payment Methods */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Payment Method</h2>
            <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">Add New</span>
          </div>
          <Card className="rounded-2xl border border-border/50 shadow-sm bg-card overflow-hidden divide-y divide-border/50">
            
            <div 
              onClick={() => setPaymentMethod('card_1')}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">GTBank Master Card</h3>
                  <p className="text-xs text-muted-foreground">**** 4532</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card_1' ? 'border-primary' : 'border-muted-foreground/30'}`}>
                {paymentMethod === 'card_1' && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
              </div>
            </div>

            <div 
              onClick={() => setPaymentMethod('transfer')}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Bank Transfer</h3>
                  <p className="text-xs text-muted-foreground">Direct Paystack Transfer</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'transfer' ? 'border-primary' : 'border-muted-foreground/30'}`}>
                {paymentMethod === 'transfer' && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
              </div>
            </div>

          </Card>
        </section>

        <section className="bg-primary/5 rounded-2xl p-4 flex items-start gap-3 border border-primary/10">
          <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Payments are secured by Paystack. Your funds are held in escrow until you confirm receipt of your items.
          </p>
        </section>

        {/* Floating Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border/50 z-30 pb-safe">
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="font-medium text-muted-foreground text-sm">Total Payment</span>
            <span className="font-extrabold text-foreground text-xl">₦{total.toLocaleString()}</span>
          </div>
          <Button 
            onClick={handleProceedToPayment}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-base flex items-center justify-center shadow-glow"
          >
            Pay Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutScreen;
