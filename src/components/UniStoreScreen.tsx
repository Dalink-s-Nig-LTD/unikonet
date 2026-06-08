import { useState, useMemo } from 'react';
import { Search, Filter, Star, Heart, Plus, ShoppingBag, CreditCard, ChevronRight, X, Bell } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '../store/useAppStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const UniStoreScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('campus-store');
  const [isSellOpen, setIsSellOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sell Form States
  const [name, setName] = useState("");
  const [priceStr, setPriceStr] = useState("");
  const [category, setCategory] = useState("Gadgets");
  const [condition, setCondition] = useState("New");
  const [description, setDescription] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("1 day");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { 
    campusProducts, 
    studentProducts, 
    cartItemIds, 
    addToCart, 
    removeFromCart,
    addStudentProduct,
    notifications
  } = useAppStore();

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const toggleCart = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItemIds.includes(productId)) {
      removeFromCart(productId);
      toast({ title: "Removed from Cart", description: "Item removed from your cart." });
    } else {
      addToCart(productId);
      toast({ title: "Added to Cart 🎉", description: "Item added to your shopping cart." });
    }
  };

  const tabs = [
    { id: 'campus-store', label: 'Campus Store' },
    { id: 'student-store', label: 'Student Store' }
  ];

  const banners = [
    { id: 1, title: 'New Gadgets!', subtitle: 'Latest tech arrivals', bgClass: 'bg-gradient-primary' },
    { id: 2, title: 'Back to School', subtitle: 'Essential supplies', bgClass: 'bg-gradient-success' },
  ];

  // Retrieve products dynamically from Zustand store
  const rawProducts = activeTab === 'campus-store' ? campusProducts : studentProducts;

  // Apply search query filter (Memoized)
  const products = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return rawProducts.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query)
    );
  }, [rawProducts, searchQuery]);

  // Category image presets
  const storeImagePresets = [
    { category: "Gadgets", label: "iPhone", url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop" },
    { category: "Food", label: "Jollof Rice", url: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop" },
    { category: "Educational Materials", label: "Textbook", url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop" },
    { category: "Apparel", label: "Hoodie", url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop" },
    { category: "Accessories", label: "Bottle", url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop" }
  ];

  const handleSellSubmit = () => {
    if (!name.trim() || !priceStr.trim() || !description.trim()) {
      toast({ title: "Validation Error", description: "Please complete all standard fields.", variant: "destructive" });
      return;
    }

    // Auto assign image preset if none selected
    let finalImage = selectedImage;
    if (!finalImage) {
      const match = storeImagePresets.find(p => p.category === category);
      finalImage = match ? match.url : "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop";
    }

    // Parse price properly
    const priceFormatted = priceStr.startsWith("₦") ? priceStr : `₦${Number(priceStr).toLocaleString()}`;

    addStudentProduct({
      name: name.trim(),
      price: priceFormatted,
      category,
      condition,
      description: description.trim(),
      deliveryTime,
      image: finalImage,
      seller: "Alex Doe",
      phone: "0812-345-6789"
    });

    // Reset Form
    setName("");
    setPriceStr("");
    setDescription("");
    setSelectedImage(null);
    setIsSellOpen(false);

    toast({
      title: "Listing Active! 🏷️",
      description: `Your product "${name}" is now listed in the Student Store.`
    });
  };

  return (
    <div className="min-h-screen bg-background font-inter pb-24 relative">
      {/* Header & Tabs */}
      <div className="bg-background/85 backdrop-blur-md px-4 sm:px-6 pt-5 pb-3 border-b border-border/50 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Store</h1>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/search')}
              className="p-2 bg-muted/50 rounded-full hover:bg-muted text-foreground transition-all relative"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/notifications')}
              className="p-2 bg-muted/50 rounded-full hover:bg-muted text-foreground transition-all relative"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-background">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => navigate('/cart')}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-primary/10 rounded-full hover:bg-primary/20 transition-all text-primary font-bold text-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{cartItemIds.length} items</span>
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex-1 ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search in ${activeTab === 'campus-store' ? 'official stock' : 'student items'}...`}
            className="pl-9 pr-10 h-11 rounded-xl bg-muted/30 border-transparent focus:border-primary focus:bg-background transition-all text-sm"
          />
          <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-muted-foreground">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Banners */}
      <div className="px-4 py-4">
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`${banner.bgClass} rounded-2xl p-5 min-w-[260px] text-white shadow-sm flex-shrink-0 relative overflow-hidden`}
            >
              <h3 className="text-lg font-bold mb-1">{banner.title}</h3>
              <p className="text-xs opacity-90">{banner.subtitle}</p>
              <div className="absolute right-2 -bottom-2 opacity-15">
                <ShoppingBag className="w-20 h-20" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {products.map((product) => {
          const isAdded = cartItemIds.includes(product.id);
          return (
            <Card 
              key={product.id} 
              className="p-0 bg-card border border-border/40 rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow animate-fade-in"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="aspect-square overflow-hidden relative bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className={`absolute top-2.5 right-2.5 h-8 w-8 rounded-full shadow-sm transition-all ${
                    isAdded ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-background/80 hover:bg-background text-foreground'
                  }`}
                  onClick={(e) => toggleCart(product.id, e)}
                >
                  <Heart className={`h-4 w-4 ${isAdded ? 'fill-current' : ''}`} />
                </Button>
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-bold text-sm text-foreground mb-1 line-clamp-1">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-primary text-sm">{product.price}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-semibold text-foreground">{product.rating}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="px-2 py-0 text-[9px] bg-muted/65 text-muted-foreground border-none font-medium truncate block max-w-full">
                  {product.category}
                </Badge>
              </div>
            </Card>
          );
        })}

        {products.length === 0 && (
          <div className="col-span-2 text-center py-16 text-muted-foreground text-sm bg-card rounded-2xl border border-dashed border-border/40">
            No products found matching your search.
          </div>
        )}
      </div>

      {/* Floating Sell Button (Accessible anywhere on store hub) */}
      <button 
        onClick={() => setIsSellOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-primary text-white rounded-full shadow-glow hover:shadow-xl transition-all duration-300 flex items-center justify-center z-30 hover:scale-105 active:scale-95"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* Sell Item Form Dialog Modal */}
      <Dialog open={isSellOpen} onOpenChange={setIsSellOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-border bg-card max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>List Item for Sale</DialogTitle>
            <DialogDescription>
              Offer peer gadgets, food portions, or textbooks to other students.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Product Title</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. iPhone 13 Pro Max (Used)"
                className="rounded-xl border-border bg-muted/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Price (₦)</label>
                <Input
                  type="number"
                  value={priceStr}
                  onChange={(e) => setPriceStr(e.target.value)}
                  placeholder="e.g. 295000"
                  className="rounded-xl border-border bg-muted/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="rounded-xl border-border bg-muted/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Gadgets", "Food", "Educational Materials", "Apparel", "Accessories"].map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Condition</label>
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger className="rounded-xl border-border bg-muted/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["New", "Lightly Used", "Heavily Used", "Freshly Cooked"].map((cond) => (
                      <SelectItem key={cond} value={cond}>{cond}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Delivery / Prep</label>
                <Input
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  placeholder="e.g. 1 hour, 1 day"
                  className="rounded-xl border-border bg-muted/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Item Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Give specifications, parameters, flaws, or features of this item..."
                className="min-h-20 rounded-xl border-border bg-muted/20"
              />
            </div>

            {/* Photo presets matched to selected category */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Select Catalog Photo Preset</label>
              <div className="grid grid-cols-5 gap-2">
                {storeImagePresets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setSelectedImage(
                      selectedImage === preset.url ? null : preset.url
                    )}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === preset.url ? 'border-primary scale-95 shadow-md' : 'border-transparent opacity-65 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/45 flex items-end p-0.5">
                      <span className="text-[7.5px] text-white font-bold tracking-tight truncate w-full text-center">{preset.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-border/50 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsSellOpen(false)} className="rounded-xl h-11 px-4">
                Cancel
              </Button>
              <Button 
                onClick={handleSellSubmit}
                className="bg-primary text-primary-foreground font-bold rounded-xl h-11 px-6 shadow-md"
              >
                List Product
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UniStoreScreen;