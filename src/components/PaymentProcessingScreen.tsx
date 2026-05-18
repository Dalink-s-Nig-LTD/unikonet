import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, ShieldCheck, Loader2 } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { Button } from "@/components/ui/button";

const PaymentProcessingScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { checkout, cartItems } = useAppStore();
  
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  
  const orderData = location.state as {
    total: number;
    deliveryMethod: 'Delivery' | 'Pickup';
    address: string;
    paymentMethod: string;
  } || {
    total: 0,
    deliveryMethod: 'Pickup',
    address: '',
    paymentMethod: 'card_1'
  };

  useEffect(() => {
    // Prevent access if cart is empty (direct URL access)
    if (cartItems.length === 0 && status === 'processing') {
      navigate('/store', { replace: true });
      return;
    }

    // Simulate payment processing flow
    const processTimer = setTimeout(() => {
      // 95% success rate simulation
      const isSuccess = Math.random() > 0.05;
      
      setStatus(isSuccess ? 'success' : 'error');
      
      if (isSuccess) {
        // Complete the order in global state
        checkout({
          items: [...cartItems],
          total: orderData.total,
          deliveryMethod: orderData.deliveryMethod,
          paymentMethod: orderData.paymentMethod
        });
      }
    }, 2500);

    return () => clearTimeout(processTimer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 font-inter text-center">
      
      {status === 'processing' && (
        <div className="animate-fade-in flex flex-col items-center">
          <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
            <ShieldCheck className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Processing Payment</h2>
          <p className="text-muted-foreground text-sm max-w-xs">
            Please wait while we secure your transaction with Paystack. Do not close this window.
          </p>
        </div>
      )}

      {status === 'success' && (
        <div className="animate-fade-in flex flex-col items-center">
          <div className="w-24 h-24 mb-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground text-sm max-w-xs mb-8">
            Your order has been placed. The seller has been notified and your funds are securely held in escrow.
          </p>
          <div className="w-full space-y-3">
            <Button 
              onClick={() => navigate('/orders', { replace: true })}
              className="w-full h-12 rounded-xl font-bold"
            >
              View Order Details
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/store', { replace: true })}
              className="w-full h-12 rounded-xl font-bold border-border/50 text-foreground"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="animate-fade-in flex flex-col items-center">
          <div className="w-24 h-24 mb-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Transaction Failed</h2>
          <p className="text-muted-foreground text-sm max-w-xs mb-8">
            We couldn't process your payment. Please check your card balance or try a different payment method.
          </p>
          <div className="w-full space-y-3">
            <Button 
              onClick={() => navigate('/checkout', { replace: true })}
              className="w-full h-12 rounded-xl font-bold bg-foreground text-background hover:bg-foreground/90"
            >
              Try Again
            </Button>
            <Button 
              variant="ghost"
              onClick={() => navigate('/cart', { replace: true })}
              className="w-full h-12 rounded-xl font-bold text-muted-foreground"
            >
              Return to Cart
            </Button>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default PaymentProcessingScreen;
