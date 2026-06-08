import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";
import LoginScreen from "./components/LoginScreen";
import ProfileSetupScreen from "./components/ProfileSetupScreen";
import FeedScreen from "./components/FeedScreen";
import UniStoreScreen from "./components/UniStoreScreen";
import RideScreen from "./components/RideScreen";
import ChatScreen from "./components/ChatScreen";
import ChatThread from "./components/ChatThread";
import ProductDetailScreen from "./components/ProductDetailScreen";
import ProfileScreen from "./components/ProfileScreen";
import RideBookingDetailScreen from "./components/RideBookingDetailScreen";
import EventDetailScreen from "./components/EventDetailScreen";
import PostDetailScreen from "./components/PostDetailScreen";
import UniversitySelectionScreen from "./components/UniversitySelectionScreen";
import CartScreen from "./components/CartScreen";
import CheckoutScreen from "./components/CheckoutScreen";
import PaymentProcessingScreen from "./components/PaymentProcessingScreen";
import OrderHistoryScreen from "./components/OrderHistoryScreen";
import WishlistScreen from "./components/WishlistScreen";
import SellerProfileScreen from "./components/SellerProfileScreen";
import UserProfileScreen from "./components/UserProfileScreen";
import MediaViewerScreen from "./components/MediaViewerScreen";
import DiscoverScreen from "./components/DiscoverScreen";
import SearchDiscoverScreen from "./components/SearchDiscoverScreen";
import NotificationsScreen from "./components/NotificationsScreen";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          {/* Full-screen routes (No tab bar) */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/select-university" element={<UniversitySelectionScreen />} />
          <Route path="/setup" element={<ProfileSetupScreen />} />
          <Route path="/product/:productId" element={<ProductDetailScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/checkout" element={<CheckoutScreen />} />
          <Route path="/payment-processing" element={<PaymentProcessingScreen />} />
          <Route path="/orders" element={<OrderHistoryScreen />} />
          <Route path="/wishlist" element={<WishlistScreen />} />
          <Route path="/seller/:sellerName" element={<SellerProfileScreen />} />
          <Route path="/ride/:rideId" element={<RideBookingDetailScreen />} />
          <Route path="/event/:eventId" element={<EventDetailScreen />} />
          <Route path="/chat/:chatId" element={<ChatThread />} />
          <Route path="/post/:postId" element={<PostDetailScreen />} />
          <Route path="/user/:userId" element={<UserProfileScreen />} />
          <Route path="/media/:mediaId" element={<MediaViewerScreen />} />
          <Route path="/search" element={<SearchDiscoverScreen />} />
          <Route path="/notifications" element={<NotificationsScreen />} />

          {/* Main app routes with persistent tab bar */}
          <Route element={<MainLayout />}>
            <Route path="/feed" element={<FeedScreen />} />
            <Route path="/store" element={<UniStoreScreen />} />
            <Route path="/ride" element={<RideScreen />} />
            <Route path="/chat" element={<ChatScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/discover" element={<DiscoverScreen />} />
            <Route path="/home" element={<Index />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
