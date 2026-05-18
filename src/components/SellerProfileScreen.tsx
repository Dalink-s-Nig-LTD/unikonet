import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Star, MessageCircle, MapPin, Package, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "../store/useAppStore";
import { useToast } from "@/hooks/use-toast";

const SellerProfileScreen = () => {
  const { sellerName } = useParams();
  const decodedName = decodeURIComponent(sellerName || "");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { studentProducts, createNewChat } = useAppStore();

  const sellerProducts = studentProducts.filter(p => p.seller === decodedName);

  const handleContactSeller = () => {
    const chatId = createNewChat(
      decodedName, 
      `https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=120&h=120&fit=crop&crop=face`
    );
    toast({
      title: "Chat Opened",
      description: `Opening direct messaging with ${decodedName}...`,
    });
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle font-inter pb-safe">
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-primary/80 to-accent/80">
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-12 left-4 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
        
        <div className="px-6 pt-0 relative z-10">
          <div className="flex flex-col items-center -mt-12 mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-background overflow-hidden bg-muted mb-3 shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=120&h=120&fit=crop&crop=face" 
                alt={decodedName} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-1 mb-1">
              <h1 className="text-xl font-extrabold text-foreground">{decodedName}</h1>
              <ShieldCheck className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              Verified Student Seller
            </p>
            
            <div className="flex gap-4 mt-4">
              <div className="flex flex-col items-center">
                <span className="font-bold text-foreground text-lg">{sellerProducts.length}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Listings</span>
              </div>
              <div className="w-px bg-border/60"></div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-foreground text-lg flex items-center gap-1">
                  4.8 <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 -mt-0.5" />
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Rating</span>
              </div>
              <div className="w-px bg-border/60"></div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-foreground text-lg">24</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Sold</span>
              </div>
            </div>
            
            <Button 
              onClick={handleContactSeller}
              className="mt-6 w-full max-w-[200px] rounded-xl font-bold gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Message Seller
            </Button>
          </div>
          
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border/50 pb-2">
            Active Listings ({sellerProducts.length})
          </h2>
          
          <div className="grid grid-cols-2 gap-4 pb-12 animate-fade-in">
            {sellerProducts.length > 0 ? (
              sellerProducts.map(product => (
                <Card 
                  key={product.id} 
                  className="overflow-hidden bg-card border-border/50 shadow-sm rounded-[1.5rem] cursor-pointer group"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="relative h-32 bg-muted">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-xs text-foreground line-clamp-1 mb-1">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-primary text-sm">{product.price}</span>
                      <Badge variant="outline" className="px-1.5 py-0 border-primary/20 text-primary text-[10px] bg-primary/5">
                        {product.condition || 'Used'}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-10">
                <Package className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">This seller has no active listings.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfileScreen;
