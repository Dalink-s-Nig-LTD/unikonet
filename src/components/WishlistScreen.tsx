import { useNavigate } from "react-router-dom";
import { ChevronLeft, Heart, ShoppingBag, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "../store/useAppStore";
import { useToast } from "@/hooks/use-toast";

const WishlistScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { wishlistIds, campusProducts, studentProducts, addToCart, toggleWishlist, cartItemIds } = useAppStore();

  const allProducts = [...campusProducts, ...studentProducts];
  const wishlistProducts = wishlistIds.map(id => allProducts.find(p => p.id === id)).filter(Boolean);

  const handleAddToCart = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation(); // Prevent routing to detail
    if (cartItemIds.includes(productId)) {
      toast({ title: "Already in Cart", description: "This item is already in your cart." });
      return;
    }
    addToCart(productId);
    toast({ title: "Added to Cart", description: "Item successfully added to your cart." });
  };

  const handleRemove = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    toggleWishlist(productId);
    toast({ title: "Removed", description: "Item removed from your wishlist." });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle font-inter pb-safe">
      <div className="bg-card px-4 pt-12 pb-4 shadow-sm border-b border-border/50 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Saved Items</h1>
        </div>
      </div>

      <div className="px-4 mt-6">
        {wishlistProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="w-24 h-24 bg-red-100/50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-red-500/50" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">No saved items</h2>
            <p className="text-muted-foreground text-sm mb-8">Tap the heart icon on any product to save it for later.</p>
            <Button 
              onClick={() => navigate("/store")} 
              className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 h-12 font-bold"
            >
              Explore Store
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 pb-12 animate-fade-in">
            {wishlistProducts.map((product) => (
              <Card 
                key={product!.id} 
                className="overflow-hidden bg-card border-border/50 shadow-sm rounded-[1.5rem] cursor-pointer group"
                onClick={() => navigate(`/product/${product!.id}`)}
              >
                <div className="relative h-40 bg-muted">
                  <img src={product!.image} alt={product!.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <button 
                    onClick={(e) => handleRemove(e, product!.id)}
                    className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full shadow-sm hover:scale-110 transition-transform"
                  >
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  </button>
                </div>
                
                <div className="p-3">
                  <h3 className="font-bold text-xs text-foreground line-clamp-2 mb-1 min-h-[32px]">{product!.name}</h3>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-extrabold text-primary text-sm">{product!.price}</span>
                    <div className="flex items-center gap-1 text-xs font-semibold">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {product!.rating}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={(e) => handleAddToCart(e, product!.id)}
                    size="sm"
                    className="w-full h-8 text-xs font-bold rounded-lg bg-muted text-foreground hover:bg-primary hover:text-white transition-colors"
                  >
                    {cartItemIds.includes(product!.id) ? 'In Cart' : 'Add to Cart'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistScreen;
