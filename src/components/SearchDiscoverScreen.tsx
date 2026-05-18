import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronLeft, Users, Package, MessageSquare, Compass } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "../store/useAppStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SearchDiscoverScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { threads, studentProducts, campusProducts, clubs } = useAppStore();
  const allProducts = [...campusProducts, ...studentProducts];

  // Filtering logic
  const query = searchQuery.toLowerCase();
  
  const filteredPosts = query ? threads.filter(t => t.content.toLowerCase().includes(query) || t.user.name.toLowerCase().includes(query)) : [];
  
  // For people, we mock it by extracting unique users from threads
  const uniqueUsers = Array.from(new Map(threads.map(t => [t.user.handle, t.user])).values());
  const filteredPeople = query ? uniqueUsers.filter(u => u.name.toLowerCase().includes(query) || u.handle.toLowerCase().includes(query)) : [];
  
  const filteredProducts = query ? allProducts.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)) : [];
  const filteredClubs = query ? clubs.filter(c => c.name.toLowerCase().includes(query) || c.category.toLowerCase().includes(query)) : [];

  return (
    <div className="min-h-screen bg-background font-inter pb-safe">
      {/* Search Header */}
      <div className="bg-card px-4 pt-12 pb-4 shadow-sm border-b border-border/50 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              autoFocus
              type="text"
              placeholder="Search posts, people, products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-muted/50 border-none text-foreground rounded-xl focus-visible:ring-1 focus-visible:ring-primary transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {!searchQuery ? (
        <div className="p-6 text-center mt-10">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Search className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-base font-bold text-foreground mb-1">What are you looking for?</h3>
          <p className="text-sm text-muted-foreground">Search across the entire campus ecosystem.</p>
          
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {['#CampusEvents', 'Textbooks', 'Tech Club', 'MacBook'].map(tag => (
              <Badge key={tag} onClick={() => setSearchQuery(tag.replace('#', ''))} variant="secondary" className="px-3 py-1 cursor-pointer hover:bg-primary/20">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-4 mt-4">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1 rounded-xl mb-4 h-10">
              <TabsTrigger value="posts" className="rounded-lg text-xs font-semibold px-0"><MessageSquare className="w-3 h-3 mr-1" /> Posts</TabsTrigger>
              <TabsTrigger value="people" className="rounded-lg text-xs font-semibold px-0"><Users className="w-3 h-3 mr-1" /> People</TabsTrigger>
              <TabsTrigger value="products" className="rounded-lg text-xs font-semibold px-0"><Package className="w-3 h-3 mr-1" /> Store</TabsTrigger>
              <TabsTrigger value="clubs" className="rounded-lg text-xs font-semibold px-0"><Compass className="w-3 h-3 mr-1" /> Clubs</TabsTrigger>
            </TabsList>
            
            {/* Posts Tab */}
            <TabsContent value="posts" className="space-y-3 mt-0 animate-fade-in">
              {filteredPosts.length > 0 ? filteredPosts.map(post => (
                <Card key={post.id} className="p-4 cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
                  <div className="flex gap-3">
                    <img src={post.user.avatar} alt="" className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-sm">{post.user.name}</span>
                        <span className="text-xs text-muted-foreground">{post.user.handle}</span>
                      </div>
                      <p className="text-sm mt-1 line-clamp-3">{post.content}</p>
                    </div>
                  </div>
                </Card>
              )) : <div className="text-center py-10 text-muted-foreground text-sm">No posts found for "{searchQuery}"</div>}
            </TabsContent>

            {/* People Tab */}
            <TabsContent value="people" className="space-y-3 mt-0 animate-fade-in">
              {filteredPeople.length > 0 ? filteredPeople.map(user => (
                <div key={user.handle} className="flex items-center justify-between p-3 bg-card rounded-2xl border border-border/50">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt="" className="w-12 h-12 rounded-full" />
                    <div>
                      <h4 className="font-bold text-sm">{user.name}</h4>
                      <p className="text-xs text-muted-foreground">{user.handle} • {user.course}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 text-xs rounded-full">Follow</Button>
                </div>
              )) : <div className="text-center py-10 text-muted-foreground text-sm">No users found for "{searchQuery}"</div>}
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-3 mt-0 animate-fade-in grid grid-cols-2 gap-3">
              {filteredProducts.length > 0 ? filteredProducts.map(product => (
                <Card key={product.id} className="overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                  <div className="h-24 bg-muted"><img src={product.image} className="w-full h-full object-cover" /></div>
                  <div className="p-2">
                    <h4 className="text-xs font-bold line-clamp-1">{product.name}</h4>
                    <p className="text-primary text-xs font-extrabold">{product.price}</p>
                  </div>
                </Card>
              )) : <div className="col-span-2 text-center py-10 text-muted-foreground text-sm">No products found for "{searchQuery}"</div>}
            </TabsContent>

            {/* Clubs Tab */}
            <TabsContent value="clubs" className="space-y-3 mt-0 animate-fade-in">
              {filteredClubs.length > 0 ? filteredClubs.map(club => (
                <div key={club.id} className="flex items-center justify-between p-3 bg-card rounded-2xl border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{club.avatar}</div>
                    <div>
                      <h4 className="font-bold text-sm">{club.name}</h4>
                      <p className="text-xs text-muted-foreground">{club.members} members</p>
                    </div>
                  </div>
                  <Button size="sm" variant={club.joined ? "secondary" : "default"} className="h-8 text-xs rounded-full">
                    {club.joined ? 'Joined' : 'Join'}
                  </Button>
                </div>
              )) : <div className="text-center py-10 text-muted-foreground text-sm">No clubs found for "{searchQuery}"</div>}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default SearchDiscoverScreen;
