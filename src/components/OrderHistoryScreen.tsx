import { useNavigate } from "react-router-dom";
import { ChevronLeft, Package, Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore, Order } from "../store/useAppStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OrderHistoryScreen = () => {
  const navigate = useNavigate();
  const { orders, campusProducts, studentProducts } = useAppStore();
  const allProducts = [...campusProducts, ...studentProducts];

  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'Processing':
        return { color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Clock };
      case 'Shipped':
        return { color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Package };
      case 'Delivered':
        return { color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle2 };
      case 'Cancelled':
        return { color: 'text-red-500', bg: 'bg-red-500/10', icon: XCircle };
    }
  };

  const activeOrders = orders.filter(o => o.status === 'Processing' || o.status === 'Shipped');
  const pastOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'Cancelled');

  const OrderCard = ({ order }: { order: Order }) => {
    const StatusConfig = getStatusConfig(order.status);
    const StatusIcon = StatusConfig.icon;
    
    // Get the first item's details for the thumbnail
    const firstItem = order.items[0];
    const product = allProducts.find(p => p.id === firstItem?.productId);
    
    const extraItemsCount = order.items.length - 1;

    return (
      <Card className="p-4 rounded-2xl border border-border/50 shadow-sm mb-4 bg-card animate-fade-in cursor-pointer hover:shadow-md transition-shadow" onClick={() => {}}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{order.id}</span>
            <p className="text-xs text-muted-foreground mt-0.5">{order.date}</p>
          </div>
          <Badge className={`${StatusConfig.bg} ${StatusConfig.color} border-none font-semibold text-[10px] uppercase tracking-wide flex items-center gap-1 shadow-none`}>
            <StatusIcon className="w-3 h-3" />
            {order.status}
          </Badge>
        </div>

        <div className="flex items-center gap-4 py-3 border-y border-border/50 my-3">
          <div className="w-16 h-16 rounded-xl bg-muted flex-shrink-0 overflow-hidden">
            {product ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-6 h-6 m-auto text-muted-foreground/50 h-full" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-foreground line-clamp-1">{product?.name || "Multiple Items"}</h4>
            {extraItemsCount > 0 && (
              <p className="text-xs text-muted-foreground font-medium mt-1">+{extraItemsCount} other item{extraItemsCount > 1 ? 's' : ''}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
              Method: <span className="font-semibold text-foreground">{order.deliveryMethod}</span>
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-muted-foreground font-medium">Total:</span>
          <span className="text-base font-extrabold text-foreground">₦{order.total.toLocaleString()}</span>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-subtle font-inter pb-safe">
      {/* Header */}
      <div className="bg-card px-4 pt-12 pb-4 shadow-sm border-b border-border/50 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Order History</h1>
        </div>
      </div>

      <div className="px-4 mt-6">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-xl mb-6">
            <TabsTrigger value="active" className="rounded-lg font-semibold">Active ({activeOrders.length})</TabsTrigger>
            <TabsTrigger value="past" className="rounded-lg font-semibold">Past Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            {activeOrders.length > 0 ? (
              activeOrders.map(order => <OrderCard key={order.id} order={order} />)
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">No Active Orders</h3>
                <p className="text-sm text-muted-foreground">You don't have any orders currently processing.</p>
                <Button onClick={() => navigate('/store')} variant="outline" className="mt-6 rounded-xl font-bold">
                  Browse Store
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            {pastOrders.length > 0 ? (
              pastOrders.map(order => <OrderCard key={order.id} order={order} />)
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">No Past Orders</h3>
                <p className="text-sm text-muted-foreground">Your completed orders will appear here.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrderHistoryScreen;
