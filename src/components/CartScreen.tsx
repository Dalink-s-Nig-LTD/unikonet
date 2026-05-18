import { useNavigate } from "react-router-dom";
import { ChevronLeft, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "../store/useAppStore";
import { useToast } from "@/hooks/use-toast";

const CartScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    cartItems, 
    campusProducts, 
    studentProducts, 
    updateCartItemQuantity,
    clearCart
  } = useAppStore();

  const allProducts = [...campusProducts, ...studentProducts];

  const cartDetails = cartItems.map(item => {
    const product = allProducts.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = cartDetails.reduce((total, item) => {
    const priceNum = parseFloat(item.product!.price.replace(/[^0-9.]/g, ''));
    return total + (priceNum * item.quantity);
  }, 0);

  const deliveryFee = subtotal > 0 ? 1500 : 0;
  const serviceFee = subtotal > 0 ? 500 : 0;
  const total = subtotal + deliveryFee + serviceFee;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Please add items to your cart before proceeding.",
        variant: "destructive"
      });
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle font-inter pb-24">
      {/* Header */}
      <div className="bg-card px-4 pt-12 pb-4 shadow-sm border-b border-border/50 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Your Cart</h1>
          <button 
            onClick={clearCart}
            className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 mt-6">
        {cartDetails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground text-sm mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Button 
              onClick={() => navigate("/store")} 
              className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 h-12 font-bold"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {cartDetails.map((item) => (
              <Card key={item.productId} className="p-3 border border-border/50 shadow-sm rounded-2xl flex gap-4 overflow-hidden">
                <div className="w-24 h-24 bg-muted rounded-xl flex-shrink-0 overflow-hidden">
                  <img src={item.product!.image} alt={item.product!.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 py-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm text-foreground line-clamp-2 pr-2">{item.product!.name}</h3>
                    <span className="font-extrabold text-primary text-sm whitespace-nowrap">{item.product!.price}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center space-x-3 bg-muted/50 rounded-lg p-1 border border-border/50">
                      <button 
                        onClick={() => updateCartItemQuantity(item.productId, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center bg-card rounded-md shadow-sm text-foreground hover:bg-muted"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center bg-primary text-white rounded-md shadow-sm hover:bg-primary/90"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Summary Card */}
            <Card className="mt-8 p-5 border border-border/50 shadow-sm rounded-3xl bg-card">
              <h3 className="font-bold text-base text-foreground mb-4">Order Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({cartDetails.length} items)</span>
                  <span className="font-medium text-foreground">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-foreground">₦{deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Service Fee</span>
                  <span className="font-medium text-foreground">₦{serviceFee.toLocaleString()}</span>
                </div>
                
                <div className="border-t border-border/50 pt-3 mt-3 flex justify-between items-center">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-extrabold text-primary text-lg">₦{total.toLocaleString()}</span>
                </div>
              </div>
            </Card>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border/50 z-30 pb-safe">
              <Button 
                onClick={handleCheckout}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-base flex items-center justify-between px-6 shadow-glow"
              >
                <span>Proceed to Checkout</span>
                <div className="flex items-center gap-2">
                  <span className="bg-white/20 px-2 py-1 rounded-lg text-sm">₦{total.toLocaleString()}</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartScreen;
