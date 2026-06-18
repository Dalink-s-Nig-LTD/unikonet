import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

// Static core entrance components for instant loading
import SplashScreen from "./components/SplashScreen";
import LandingScreen from "./components/LandingScreen";
import LoginScreen from "./components/LoginScreen";
import SignupScreen from "./components/SignupScreen";
import ForgotPasswordScreen from "./components/ForgotPasswordScreen";

// Lazy-loaded components for optimal bundle splitting
const ProfileSetupScreen = lazy(() => import("./components/ProfileSetupScreen"));
const FeedScreen = lazy(() => import("./components/FeedScreen"));
const UniStoreScreen = lazy(() => import("./components/UniStoreScreen"));
const RideScreen = lazy(() => import("./components/RideScreen"));
const ChatScreen = lazy(() => import("./components/ChatScreen"));
const ChatThread = lazy(() => import("./components/ChatThread"));
const ProductDetailScreen = lazy(() => import("./components/ProductDetailScreen"));
const ProfileScreen = lazy(() => import("./components/ProfileScreen"));
const RideBookingDetailScreen = lazy(() => import("./components/RideBookingDetailScreen"));
const EventDetailScreen = lazy(() => import("./components/EventDetailScreen"));
const PostDetailScreen = lazy(() => import("./components/PostDetailScreen"));
const OnboardingWizardScreen = lazy(() => import("./components/OnboardingWizardScreen"));
const UniversityWelcomeScreen = lazy(() => import("./components/UniversityWelcomeScreen"));
const CartScreen = lazy(() => import("./components/CartScreen"));
const CheckoutScreen = lazy(() => import("./components/CheckoutScreen"));
const PaymentProcessingScreen = lazy(() => import("./components/PaymentProcessingScreen"));
const OrderHistoryScreen = lazy(() => import("./components/OrderHistoryScreen"));
const WishlistScreen = lazy(() => import("./components/WishlistScreen"));
const SellerProfileScreen = lazy(() => import("./components/SellerProfileScreen"));
const UserProfileScreen = lazy(() => import("./components/UserProfileScreen"));
const MediaViewerScreen = lazy(() => import("./components/MediaViewerScreen"));
const DiscoverScreen = lazy(() => import("./components/DiscoverScreen"));
const SearchDiscoverScreen = lazy(() => import("./components/SearchDiscoverScreen"));
const NotificationsScreen = lazy(() => import("./components/NotificationsScreen"));
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Elegant minimalist campus loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center font-inter">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest animate-pulse">
        Loading Portal
      </p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Full-screen routes (No tab bar) */}
            <Route path="/" element={<SplashScreen />} />
            <Route path="/landing" element={<LandingScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
            <Route path="/select-university" element={<OnboardingWizardScreen />} />
            <Route path="/university-welcome" element={<UniversityWelcomeScreen />} />
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
        </Suspense>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
