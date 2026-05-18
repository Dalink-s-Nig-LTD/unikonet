import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart, MapPin, Clock, Shield, Share2, MessageSquare, Check, CreditCard } from 'lucide-react';
import ScreenHeader from './ScreenHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '../store/useAppStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

const ProductDetailScreen = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { 
    campusProducts, 
    studentProducts, 
    cartItems,
    updateCartItemQuantity, 
    createNewChat 
  } = useAppStore();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState('1');
  const [selectedSize, setSelectedSize] = useState('M');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Combine products dynamically from global state
  const allProducts = [...campusProducts, ...studentProducts];
  const product = allProducts.find(p => p.id === parseInt(productId || ''));

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-inter p-6 text-center">
        <h3 className="text-xl font-bold mb-2">Product Not Found</h3>
        <p className="text-sm text-muted-foreground mb-4">This product listing may have expired.</p>
        <Button onClick={() => navigate("/store")} className="rounded-xl">Back to Store Hub</Button>
      </div>
    );
  }

  const isCampusProduct = !!product.isCampus || product.id >= 100;
  const inCart = cartItems.some(item => item.productId === product.id);

  // Mocked features & reviews if not in product definition
  const productFeatures = product.condition 
    ? ["Direct Peer Purchase", product.condition, "Cash/Transfer on delivery", "Verified Student Listing"]
    : ["100% Genuine Branded Merchandise", "Machine Washable", "Official University Logo", "Multiple Colors Available"];
    
  const productReviews = [
    { id: 1, name: "Sarah Ahmed", rating: 5, comment: "Excellent purchase! The seller was incredibly helpful and quick to respond.", date: "2 days ago" },
    { id: 2, name: "Michael Johnson", rating: 4, comment: "High quality item, very happy with the description accuracy.", date: "1 week ago" }
  ];

  const handleAddToCart = () => {
    updateCartItemQuantity(product.id, parseInt(selectedQuantity));
    toast({
      title: inCart ? "Cart Updated" : "Added to Cart",
      description: `${selectedQuantity}x ${product.name} has been added to your shopping cart.`,
    });
  };

  const handleBuyNow = () => {
    setShowCheckoutModal(true);
  };

  const handleConfirmPurchase = () => {
    setCheckoutSuccess(true);
    setTimeout(() => {
      setShowCheckoutModal(false);
      setCheckoutSuccess(false);
      toast({
        title: "Order Completed! 🎉",
        description: `Your order for ${product.name} has been placed successfully! Check your inbox.`,
      });
      navigate('/store');
    }, 2500);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: `${product.name} has been ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Product link copied to clipboard!",
    });
  };

  const handleChatWithSeller = () => {
    const sellerName = product.seller || "Ayomide Johnson";
    const chatId = createNewChat(
      sellerName, 
      `https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop&crop=face`
    );
    toast({
      title: "Chat Opened",
      description: `Opening direct negotiation thread with ${sellerName}...`,
    });
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle font-inter pb-12">
      <ScreenHeader
        title="Product Details"
        action={
          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              aria-label="Share"
              className="h-10 w-10 inline-flex items-center justify-center rounded-2xl transition-colors text-foreground hover:bg-muted/60"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleWishlist}
              aria-label="Wishlist"
              className={`h-10 w-10 inline-flex items-center justify-center rounded-2xl transition-colors hover:bg-muted/60 ${isWishlisted ? 'text-red-500' : 'text-foreground'}`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        }
      />

      {/* Product Image Carousel */}
      <div className="relative h-96 bg-gradient-to-br from-muted/20 to-muted/5 rounded-b-[2.5rem] overflow-hidden shadow-elegant">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {isCampusProduct && (
          <Badge className="absolute top-4 left-4 bg-primary text-white border-none shadow-md">
            <Shield className="h-3 w-3 mr-1" />
            Official Store
          </Badge>
        )}
        {!isCampusProduct && (
          <Badge className="absolute top-4 left-4 bg-accent text-white border-none shadow-md">
            Student Seller
          </Badge>
        )}
      </div>

      {/* Product Info */}
      <div className="px-4 pb-20 mt-4">
        <Card className="p-8 mx-2 rounded-[2rem] bg-gradient-to-br from-card to-card/85 shadow-elegant border-2 border-border/50 animate-fade-in">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2 leading-tight">{product.name}</h1>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <span className="text-3xl font-extrabold bg-gradient-primary bg-clip-text text-transparent">{product.price}</span>
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 fill-accent text-accent" />
                <span className="font-semibold text-foreground">{product.rating}</span>
                <span className="text-muted-foreground text-sm">({product.reviews || 0} reviews)</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 flex-wrap gap-y-2">
              <Badge variant="secondary" className="px-3 py-1 text-xs">
                {product.category}
              </Badge>
              {isCampusProduct && product.stock !== undefined && (
                <span className="text-sm text-green-600 font-semibold">{product.stock} in stock</span>
              )}
              {!isCampusProduct && product.condition && (
                <Badge variant="outline" className="px-3 py-1 border-primary/20 text-primary text-xs bg-primary/5">
                  {product.condition}
                </Badge>
              )}
            </div>
          </div>

          {/* Size/Quantity Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {isCampusProduct && product.category === 'Apparel' && (
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Size</label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full rounded-xl border-border bg-muted/20">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Quantity</label>
              <Select value={selectedQuantity} onValueChange={setSelectedQuantity}>
                <SelectTrigger className="w-full rounded-xl border-border bg-muted/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-2xl mb-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Delivery / Prep</p>
                <span className="text-sm font-medium text-foreground">{product.deliveryTime}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Pickup Location</p>
                <span className="text-sm font-medium text-foreground truncate block max-w-[120px]">
                  {isCampusProduct ? "Main Bookstore" : "Engineering Hall"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              variant={inCart ? "secondary" : "outline"}
              onClick={handleAddToCart}
              className={`h-12 font-bold rounded-2xl transition-all ${inCart ? 'bg-green-500/10 text-green-600 border-green-200' : 'border-border/50 hover:bg-muted/50'}`}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {inCart ? "In Cart" : "Add to Cart"}
            </Button>
            <Button
              onClick={handleBuyNow}
              className="h-12 font-bold rounded-2xl bg-gradient-primary shadow-glow hover:shadow-lg hover:scale-105 active:scale-95 transition-all text-white"
            >
              Buy Now
            </Button>
          </div>

          {/* Contact Seller (for student products) */}
          {!isCampusProduct && (
            <Card className="p-5 mb-6 border border-border/50 bg-card rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Student Seller</p>
                  <h3 className="font-bold text-foreground">{product.seller || "Ayomide Johnson"}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{product.phone || "0803-456-7890"}</p>
                </div>
                <Button 
                  onClick={handleChatWithSeller} 
                  variant="outline" 
                  className="rounded-xl border-primary/20 text-primary hover:bg-primary/5 h-10 px-4"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat Seller
                </Button>
              </div>
            </Card>
          )}

          {/* Tabs for Description and Reviews */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/40 p-1 rounded-xl">
              <TabsTrigger value="description" className="rounded-lg">Description</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-4 animate-fade-in">
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed text-sm">{product.description}</p>
                
                {productFeatures && (
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-2">Product Specifics:</h4>
                    <ul className="space-y-2">
                      {productFeatures.map((feature, index) => (
                        <li key={index} className="flex items-center text-xs text-muted-foreground">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 shrink-0"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-4 animate-fade-in">
              <div className="space-y-4">
                {productReviews.map((review) => (
                  <Card key={review.id} className="p-4 border border-border/40 bg-muted/10 rounded-xl shadow-none">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-foreground text-xs">{review.name}</h4>
                        <div className="flex items-center space-x-1 mt-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= review.rating ? 'fill-accent text-accent' : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium">{review.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{review.comment}</p>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Checkout Payment Dialog Modal */}
      <Dialog open={showCheckoutModal} onOpenChange={setShowCheckoutModal}>
        <DialogContent className="sm:max-w-md rounded-3xl border-border bg-card">
          <DialogHeader>
            <DialogTitle>Complete Campus Order</DialogTitle>
            <DialogDescription>
              Confirm details to pay directly or complete peer exchange.
            </DialogDescription>
          </DialogHeader>
          
          {checkoutSuccess ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-glow shadow-green-500/20 text-white mb-2">
                <Check className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Purchase Confirmed!</h3>
              <p className="text-sm text-muted-foreground max-w-[280px]">
                Order reserved successfully. Generating invoice slip...
              </p>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="p-4 bg-muted/40 rounded-2xl space-y-2 text-sm border border-border/30">
                <div className="flex justify-between font-semibold">
                  <span className="text-muted-foreground">Item:</span>
                  <span className="text-foreground max-w-[200px] truncate">{product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Qty:</span>
                  <span className="text-foreground">{selectedQuantity}</span>
                </div>
                {isCampusProduct && product.category === 'Apparel' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Selected Size:</span>
                    <span className="text-foreground">{selectedSize}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pickup Station:</span>
                  <span className="text-foreground font-medium">
                    {isCampusProduct ? "Main Bookstore" : "Engineering Hall"}
                  </span>
                </div>
                <Separator className="bg-border/30 my-2" />
                <div className="flex justify-between text-base font-bold">
                  <span className="text-foreground">Total:</span>
                  <span className="text-primary">{product.price}</span>
                </div>
              </div>

              {isCampusProduct ? (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground text-center">
                    Pay securely using your student portal credits or linked debit card.
                  </p>
                  <Button 
                    onClick={handleConfirmPurchase} 
                    className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold shadow-md hover:shadow-lg active:scale-95 transition-all"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pay Now ({product.price})
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground text-center">
                    This is a peer student exchange. Confirm RSVP to reserve this item and notify the seller. Payment will be completed on physical exchange!
                  </p>
                  <Button 
                    onClick={handleConfirmPurchase} 
                    className="w-full h-12 rounded-xl bg-gradient-primary text-white font-bold shadow-md hover:shadow-lg active:scale-95 transition-all"
                  >
                    Confirm Peer Order
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetailScreen;