import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  course: string;
  department?: string;
  year?: string;
  interests?: string[];
  bio?: string;
  coverImage?: string;
  mutuals?: number;
  university?: string;
}

export interface ThreadCommentReply {
  id: number;
  user: {
    name: string;
    handle: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
}

export interface ThreadComment {
  id: number;
  user: {
    name: string;
    handle: string;
    avatar: string;
    course?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies: ThreadCommentReply[];
}

export interface Thread {
  id: number;
  user: {
    name: string;
    handle: string;
    course: string;
    avatar: string;
    verified: boolean;
    online: boolean;
  };
  timestamp: string;
  content: string;
  media: {
    type: "image" | "video";
    url: string;
    alt: string;
    thumbnail?: string;
  } | null;
  metrics: {
    likes: number;
    comments: number;
    reposts: number;
    bookmarks: number;
  };
  isThread: boolean;
  threadCount: number;
  commentsList: ThreadComment[];
}

export interface Product {
  id: number;
  name: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  condition?: string;
  description: string;
  deliveryTime: string;
  seller?: string;
  phone?: string;
  portion?: string;
  fileType?: string;
  brand?: string;
  stock?: number;
  isCampus?: boolean;
}

export interface Ride {
  id: number;
  driver: {
    name: string;
    rating: number;
    avatar: string;
    verified: boolean;
    matricNo: string;
    carModel?: string;
    plateNumber?: string;
    phone?: string;
  };
  from: string;
  to: string;
  time: string;
  price: string;
  seats: number;
  totalSeats: number;
  vehicleType: string;
  eta: string;
  duration: string;
  distance: string;
  availableNow: boolean;
}

export interface Event {
  id: number;
  title: string;
  host: string;
  department: string;
  location: string;
  date: string;
  time: string;
  poster: string;
  image: string;
  description: string;
  ticketType: 'free' | 'paid';
  price: number;
  maxTickets: number;
  attendees: number;
  isJoined: boolean;
  hasTicket?: boolean;
}

export interface CartItem {
  productId: number;
  quantity: number;
  size?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  deliveryMethod: 'Delivery' | 'Pickup';
  paymentMethod: string;
}

export interface PaymentMethod {
  id: string;
  type: 'Card' | 'Bank Transfer';
  last4?: string;
  bankName?: string;
}

export interface Notification {
  id: number;
  type: 'Like' | 'Reply' | 'Follow' | 'Order' | 'System';
  message: string;
  timestamp: string;
  read: boolean;
  relatedId?: number;
}

export interface Message {
  id: number;
  text: string;
  timestamp: string;
  isOutgoing: boolean;
}

export interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  isGroup: boolean;
  messages: Message[];
}

export interface Club {
  id: number;
  name: string;
  description: string;
  avatar: string;
  category: string;
  members: number;
  joined: boolean;
}

interface AppState {
  currentUser: User | null;
  cartItemIds: number[];
  cartItems: CartItem[];
  savedPostIds: number[];
  likedPostIds: number[];
  threads: Thread[];
  studentProducts: Product[];
  campusProducts: Product[];
  rides: Ride[];
  events: Event[];
  chats: Chat[];
  clubs: Club[];
  orders: Order[];
  wishlistIds: number[];
  paymentMethods: PaymentMethod[];
  notifications: Notification[];
  followers: string[];
  following: string[];
  
  setCurrentUser: (user: Partial<User>) => void;
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  toggleSavedPost: (id: number) => void;
  toggleLikedPost: (id: number) => void;
  
  addThread: (content: string, media?: { type: "image" | "video"; url: string; alt: string }) => void;
  addCommentToThread: (threadId: number, content: string) => void;
  addStudentProduct: (product: Omit<Product, 'id' | 'rating' | 'reviews' | 'isCampus'>) => void;
  addRide: (ride: Omit<Ride, 'id' | 'eta' | 'duration' | 'distance' | 'availableNow'>) => void;
  bookRideSeat: (rideId: number) => boolean;
  rsvpEvent: (eventId: number, quantity: number) => void;
  joinClub: (clubId: number) => void;
  sendMessage: (chatId: number, messageText: string) => void;
  createNewChat: (targetName: string, targetAvatar: string, isGroup?: boolean) => number;
  updateCartItemQuantity: (productId: number, quantity: number) => void;
  checkout: (orderData: Omit<Order, 'id' | 'date' | 'status'>) => void;
  toggleWishlist: (productId: number) => void;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  markNotificationRead: (id: number) => void;
  toggleFollow: (handle: string) => void;
  repostThread: (threadId: number) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: {
    id: "user_1",
    name: "Alex Doe",
    handle: "@alex_doe",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=120&h=120&fit=crop&crop=face",
    course: "Computer Science, Year 3",
    department: "Computer Sciences",
    year: "Year 3",
    interests: ["AI/ML", "React", "Mobile Development"],
    bio: "Computer Science junior. Passionate about software engineering, beautiful user experiences, and solving university life problems with code!",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=300&fit=crop",
    mutuals: 0,
  },
  cartItemIds: [],
  cartItems: [],
  savedPostIds: [],
  likedPostIds: [],
  orders: [],
  wishlistIds: [],
  paymentMethods: [],
  notifications: [],
  followers: [],
  following: [],
  
  threads: [
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        handle: "@sarah_cs23",
        course: "Computer Science, Year 3",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c8c0?w=80&h=80&fit=crop&crop=face",
        verified: true,
        online: true
      },
      timestamp: "2h",
      content: "Just finished my machine learning project! The neural network is finally working perfectly. Anyone else struggling with backpropagation? 🤖 #MachineLearning #CS",
      media: {
        type: "image",
        url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop",
        alt: "Machine learning project dashboard"
      },
      metrics: { likes: 24, comments: 2, reposts: 3, bookmarks: 12 },
      isThread: true,
      threadCount: 3,
      commentsList: [
        {
          id: 1,
          user: {
            name: "Mike Chen",
            handle: "@mike_biz",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
            course: "Business"
          },
          content: "Great work! I had similar issues with gradient descent. What optimizer did you use?",
          timestamp: "1h ago",
          likes: 5,
          replies: [
            {
              id: 11,
              user: {
                name: "Sarah Johnson",
                handle: "@sarah_cs23",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c8c0?w=40&h=40&fit=crop&crop=face"
              },
              content: "I used Adam optimizer with learning rate decay. Made a huge difference!",
              timestamp: "45m ago",
              likes: 2
            }
          ]
        },
        {
          id: 2,
          user: {
            name: "Emma Wilson",
            handle: "@emma_eng",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
            course: "Engineering"
          },
          content: "This looks amazing! Could you share your dataset preprocessing steps?",
          timestamp: "30m ago",
          likes: 3,
          replies: []
        }
      ]
    },
    {
      id: 2,
      user: {
        name: "Mike Chen",
        handle: "@mike_biz",
        course: "Business Administration, Year 2",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
        verified: false,
        online: true
      },
      timestamp: "4h",
      content: "Study group forming for tomorrow's marketing exam! Meeting at the library 3rd floor. Bring your notes and let's ace this together! 📚",
      media: null,
      metrics: { likes: 15, comments: 0, reposts: 5, bookmarks: 8 },
      isThread: false,
      threadCount: 0,
      commentsList: []
    },
    {
      id: 3,
      user: {
        name: "Emma Wilson",
        handle: "@emma_eng",
        course: "Engineering, Year 4",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
        verified: true,
        online: false
      },
      timestamp: "6h",
      content: "The campus food court has amazing new dishes this semester! The sustainability club is also doing great work with the new recycling program. 🌱 #Sustainability",
      media: {
        type: "image",
        url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=300&fit=crop",
        alt: "Campus food court video"
      },
      metrics: { likes: 32, comments: 0, reposts: 8, bookmarks: 15 },
      isThread: false,
      threadCount: 0,
      commentsList: []
    }
  ],
  
  studentProducts: [
    { 
      id: 1, 
      name: "iPhone 13 Pro Max – 128GB (Used)", 
      price: "₦295,000", 
      rating: 4.2, 
      reviews: 13, 
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=300&fit=crop",
      category: "Gadgets",
      condition: "Lightly Used, No Cracks",
      description: "Selling my iPhone 13 Pro Max, space gray. Used for 8 months, still under AppleCare. No issues at all, comes with original charger and case.",
      deliveryTime: "1–2 days",
      seller: "Ayomide Johnson",
      phone: "0803-456-7890"
    },
    { 
      id: 2, 
      name: "Home-Cooked Jollof Rice + Chicken (1 Plate)", 
      price: "₦1,200", 
      rating: 4.8, 
      reviews: 42, 
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=300&fit=crop",
      category: "Food",
      condition: "Freshly Made",
      description: "Spicy jollof rice with seasoned fried chicken. Perfect for lunch or dinner. Freshly cooked daily, order before 11 AM.",
      deliveryTime: "1 hour",
      seller: "Chef Timi's Kitchen",
      phone: "0812-987-6543"
    },
    { 
      id: 3, 
      name: "GST 102 Handwritten Notes (PDF)", 
      price: "₦500", 
      rating: 4.6, 
      reviews: 18, 
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=300&fit=crop",
      category: "Educational Materials",
      condition: "Excellent (PDF)",
      description: "A+ quality notes for GST 102 – Communication in English. Well-organized with diagrams and examples. Scanned, clear PDF.",
      deliveryTime: "Instant download",
      seller: "Ope Bamidele",
      phone: "0701-223-3321"
    }
  ],
  
  campusProducts: [
    {
      id: 101,
      name: "Official University T-Shirt",
      price: "₦8,500",
      rating: 4.9,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
      category: "Apparel",
      description: "Official university branded t-shirt. 100% cotton, available in multiple sizes.",
      stock: 45,
      deliveryTime: "2-3 days",
      brand: "University Official",
      isCampus: true
    },
    {
      id: 102,
      name: "University Textbook - Mathematics 101",
      price: "₦12,000",
      rating: 4.7,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop",
      category: "Books",
      description: "Official textbook for Mathematics 101. Latest edition with updated curriculum.",
      stock: 23,
      deliveryTime: "1-2 days",
      brand: "University Press",
      isCampus: true
    },
    {
      id: 103,
      name: "University Water Bottle",
      price: "₦3,500",
      rating: 4.8,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop",
      category: "Accessories",
      description: "Eco-friendly university branded water bottle. 500ml capacity.",
      stock: 78,
      deliveryTime: "1 day",
      brand: "University Official",
      isCampus: true
    }
  ],
  
  rides: [
    {
      id: 1,
      driver: {
        name: 'Michael Adebayo',
        rating: 4.8,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
        verified: true,
        matricNo: 'CSC/2021/123',
        carModel: 'Honda Civic 2020',
        plateNumber: 'ABC-123-XY',
        phone: '+234 801 234 5678'
      },
      from: 'Main Gate',
      to: 'City Center Mall',
      time: '2:30 PM',
      price: '₦800',
      seats: 3,
      totalSeats: 4,
      vehicleType: 'car',
      eta: '5 min',
      duration: '25 min',
      distance: '12.5 km',
      availableNow: true
    },
    {
      id: 2,
      driver: {
        name: 'Sarah Johnson',
        rating: 4.9,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c8c0?w=80&h=80&fit=crop&crop=face',
        verified: true,
        matricNo: 'MCE/2022/456',
        carModel: 'Suzuki Powerbike',
        plateNumber: 'SUZ-999-BI',
        phone: '+234 809 999 8888'
      },
      from: 'Engineering Block',
      to: 'Main Hall',
      time: '3:00 PM',
      price: '₦600',
      seats: 2,
      totalSeats: 2,
      vehicleType: 'bike',
      eta: '3 min',
      duration: '10 min',
      distance: '3.1 km',
      availableNow: true
    }
  ],
  
  events: [
    { 
      id: 1, 
      title: 'Tech Conference 2024: Future of AI', 
      host: 'Computer Science Association',
      department: 'Faculty of Science',
      location: 'Main Auditorium, Block A',
      date: 'December 15, 2024',
      time: '10:00 AM - 4:00 PM',
      poster: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop',
      description: `Join us for an exciting day exploring the future of Artificial Intelligence and its impact on various industries. This conference will feature renowned speakers, interactive workshops, and networking opportunities.`,
      ticketType: 'free',
      price: 0,
      maxTickets: 5,
      attendees: 234,
      isJoined: false,
      hasTicket: false
    },
    { 
      id: 2, 
      title: 'Cultural Night 2024', 
      host: 'Student Union Government',
      department: 'Student Affairs',
      location: 'Student Center Gardens',
      date: 'December 20, 2024',
      time: '6:00 PM - 11:00 PM',
      poster: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=250&fit=crop',
      image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=200&fit=crop',
      description: `Celebrate our diverse campus cultures with an evening of music, dance, fashion, and international culinary delights! Standard ticket covers entry and a cultural food plate.`,
      ticketType: 'paid',
      price: 1500,
      maxTickets: 3,
      attendees: 156,
      isJoined: false,
      hasTicket: false
    },
    { 
      id: 3, 
      title: 'Career Fair 2024', 
      host: 'Alumni & Placement Cell',
      department: 'Academic Affairs',
      location: 'Sports Complex Main Court',
      date: 'January 10, 2025',
      time: '9:00 AM - 5:00 PM',
      poster: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop',
      description: `Meet recruiters from top tech companies, banks, consulting firms, and startups. Bring your updated CV and professional dress code is advised!`,
      ticketType: 'free',
      price: 0,
      maxTickets: 1,
      attendees: 425,
      isJoined: false,
      hasTicket: false
    }
  ],
  
  chats: [
    {
      id: 1,
      name: "Study Group - CS301",
      lastMessage: "Meeting tomorrow at 3 PM",
      time: "2h",
      unread: 3,
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=80&h=80&fit=crop",
      isGroup: true,
      messages: [
        { id: 1, text: "Hey guys, did we finalize the study guide?", timestamp: "10:00 AM", isOutgoing: false },
        { id: 2, text: "Almost, just adding the last chapter summaries.", timestamp: "10:15 AM", isOutgoing: false },
        { id: 3, text: "Meeting tomorrow at 3 PM at the main library to review!", timestamp: "10:30 AM", isOutgoing: false }
      ]
    },
    {
      id: 2,
      name: "Sarah Johnson",
      lastMessage: "Thanks for the ML notes!",
      time: "4h",
      unread: 1,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c8c0?w=80&h=80&fit=crop&crop=face",
      isGroup: false,
      messages: [
        { id: 1, text: "Hey! How are you doing with the ML assignment?", timestamp: "10:30 AM", isOutgoing: false },
        { id: 2, text: "I'm struggling a bit with neural network implementation.", timestamp: "10:32 AM", isOutgoing: true },
        { id: 3, text: "Sure! Let me share my notes with you.", timestamp: "10:35 AM", isOutgoing: false },
        { id: 4, text: "Thanks for the ML notes!", timestamp: "10:45 AM", isOutgoing: false }
      ]
    },
    {
      id: 3,
      name: "Campus Ride Share",
      lastMessage: "New ride available to downtown",
      time: "6h",
      unread: 0,
      avatar: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=80&h=80&fit=crop",
      isGroup: true,
      messages: [
        { id: 1, text: "Any rides going towards City Mall today?", timestamp: "8:00 AM", isOutgoing: false },
        { id: 2, text: "Yes! Offering a ride in 30 mins.", timestamp: "8:15 AM", isOutgoing: false },
        { id: 3, text: "New ride available to downtown", timestamp: "8:20 AM", isOutgoing: false }
      ]
    },
    {
      id: 4,
      name: "Mike Chen",
      lastMessage: "See you at the library",
      time: "1d",
      unread: 0,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      isGroup: false,
      messages: [
        { id: 1, text: "Let's meet at the 3rd floor library?", timestamp: "Yesterday", isOutgoing: false },
        { id: 2, text: "Sounds good, see you at the library!", timestamp: "Yesterday", isOutgoing: true }
      ]
    }
  ],
  
  clubs: [
    {
      id: 1,
      name: "Computer Science Association",
      description: "Bringing coders, builders, and designers together to explore state-of-the-art tech, AI, and host regular hackathons on campus.",
      avatar: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100&h=100&fit=crop",
      category: "Academic & Tech",
      members: 342,
      joined: false
    },
    {
      id: 2,
      name: "Business & Entreprenuership Club",
      description: "Fostering students with business ideas, hosting elevator pitches, and connecting campus sellers to professional mentors.",
      avatar: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&h=100&fit=crop",
      category: "Career & Business",
      members: 218,
      joined: false
    },
    {
      id: 3,
      name: "Photography & Media Group",
      description: "Capturing beautiful memories across Redeemer's campus. Weekly photowalks, camera gear tutorials, and exhibitions.",
      avatar: "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=100&h=100&fit=crop",
      category: "Creative Arts",
      members: 145,
      joined: false
    }
  ],
  
  setCurrentUser: (user) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, ...user } : null
  })),
  
  addToCart: (id) => set((state) => {
    if (state.cartItemIds.includes(id)) return {};
    return { cartItemIds: [...state.cartItemIds, id] };
  }),
  
  removeFromCart: (id) => set((state) => ({
    cartItemIds: state.cartItemIds.filter(item => item !== id)
  })),
  
  clearCart: () => set({ cartItemIds: [] }),
  
  toggleSavedPost: (id) => set((state) => ({
    savedPostIds: state.savedPostIds.includes(id) 
      ? state.savedPostIds.filter(postId => postId !== id)
      : [...state.savedPostIds, id]
  })),
  
  toggleLikedPost: (id) => set((state) => {
    const isLiked = state.likedPostIds.includes(id);
    const updatedLiked = isLiked
      ? state.likedPostIds.filter(postId => postId !== id)
      : [...state.likedPostIds, id];
      
    // Update thread like metric count dynamically
    const updatedThreads = state.threads.map(thread => {
      if (thread.id === id) {
        return {
          ...thread,
          metrics: {
            ...thread.metrics,
            likes: thread.metrics.likes + (isLiked ? -1 : 1)
          }
        };
      }
      return thread;
    });
    
    return {
      likedPostIds: updatedLiked,
      threads: updatedThreads
    };
  }),
  
  addThread: (content, media) => set((state) => {
    if (!state.currentUser) return {};
    
    const newThread: Thread = {
      id: Date.now(),
      user: {
        name: state.currentUser.name,
        handle: state.currentUser.handle,
        course: state.currentUser.course,
        avatar: state.currentUser.avatar,
        verified: true,
        online: true
      },
      timestamp: "Just now",
      content,
      media: media ? { ...media, alt: media.alt || "Uploaded media" } : null,
      metrics: { likes: 0, comments: 0, reposts: 0, bookmarks: 0 },
      isThread: false,
      threadCount: 0,
      commentsList: []
    };
    
    return {
      threads: [newThread, ...state.threads]
    };
  }),
  
  addCommentToThread: (threadId, content) => set((state) => {
    if (!state.currentUser) return {};
    
    const updatedThreads = state.threads.map(thread => {
      if (thread.id === threadId) {
        const newComment: ThreadComment = {
          id: Date.now(),
          user: {
            name: state.currentUser!.name,
            handle: state.currentUser!.handle,
            avatar: state.currentUser!.avatar,
            course: state.currentUser!.course
          },
          content,
          timestamp: "Just now",
          likes: 0,
          replies: []
        };
        
        return {
          ...thread,
          metrics: {
            ...thread.metrics,
            comments: thread.metrics.comments + 1
          },
          commentsList: [...thread.commentsList, newComment]
        };
      }
      return thread;
    });
    
    return { threads: updatedThreads };
  }),
  
  addStudentProduct: (product) => set((state) => {
    const newProduct: Product = {
      ...product,
      id: Date.now(),
      rating: 5.0,
      reviews: 0
    };
    return {
      studentProducts: [newProduct, ...state.studentProducts]
    };
  }),
  
  addRide: (ride) => set((state) => {
    const newRide: Ride = {
      ...ride,
      id: Date.now(),
      eta: '5 min',
      duration: '15 min',
      distance: '3.5 km',
      availableNow: true
    };
    return {
      rides: [newRide, ...state.rides]
    };
  }),
  
  bookRideSeat: (rideId) => {
    let success = false;
    set((state) => {
      const updatedRides = state.rides.map(ride => {
        if (ride.id === rideId && ride.seats > 0) {
          success = true;
          return { ...ride, seats: ride.seats - 1 };
        }
        return ride;
      });
      return { rides: updatedRides };
    });
    return success;
  },
  
  rsvpEvent: (eventId, quantity) => set((state) => {
    const updatedEvents = state.events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          attendees: event.attendees + quantity,
          hasTicket: true
        };
      }
      return event;
    });
    return { events: updatedEvents };
  }),
  
  joinClub: (clubId) => set((state) => {
    const updatedClubs = state.clubs.map(club => {
      if (club.id === clubId) {
        const joined = !club.joined;
        return {
          ...club,
          joined,
          members: club.members + (joined ? 1 : -1)
        };
      }
      return club;
    });
    return { clubs: updatedClubs };
  }),
  
  sendMessage: (chatId, messageText) => set((state) => {
    const updatedChats = state.chats.map(chat => {
      if (chat.id === chatId) {
        const newMessage: Message = {
          id: Date.now(),
          text: messageText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOutgoing: true
        };
        
        return {
          ...chat,
          lastMessage: messageText,
          time: "Just now",
          unread: 0,
          messages: [...chat.messages, newMessage]
        };
      }
      return chat;
    });
    return { chats: updatedChats };
  }),
  
  createNewChat: (targetName, targetAvatar, isGroup = false) => {
    const activeChats = get().chats;
    const existing = activeChats.find(c => c.name === targetName);
    if (existing) return existing.id;
    
    const newId = Date.now();
    set((state) => {
      const newChat: Chat = {
        id: newId,
        name: targetName,
        lastMessage: "Conversation started",
        time: "Just now",
        unread: 0,
        avatar: targetAvatar,
        isGroup,
        messages: []
      };
      return {
        chats: [newChat, ...state.chats]
      };
    });
    return newId;
  },

  updateCartItemQuantity: (productId, quantity) => set((state) => {
    const existing = state.cartItems.find(item => item.productId === productId);
    if (existing) {
      if (quantity <= 0) {
        return { 
          cartItems: state.cartItems.filter(item => item.productId !== productId),
          cartItemIds: state.cartItemIds.filter(id => id !== productId)
        };
      }
      return {
        cartItems: state.cartItems.map(item => item.productId === productId ? { ...item, quantity } : item)
      };
    } else if (quantity > 0) {
      return {
        cartItems: [...state.cartItems, { productId, quantity }],
        cartItemIds: [...state.cartItemIds, productId]
      };
    }
    return state;
  }),

  checkout: (orderData) => set((state) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString(),
      status: 'Processing'
    };
    return {
      orders: [newOrder, ...state.orders],
      cartItems: [],
      cartItemIds: []
    };
  }),

  toggleWishlist: (productId) => set((state) => ({
    wishlistIds: state.wishlistIds.includes(productId)
      ? state.wishlistIds.filter(id => id !== productId)
      : [...state.wishlistIds, productId]
  })),

  addPaymentMethod: (method) => set((state) => ({
    paymentMethods: [...state.paymentMethods, { ...method, id: Date.now().toString() }]
  })),

  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),

  toggleFollow: (handle) => set((state) => {
    const isFollowing = state.following.includes(handle);
    return {
      following: isFollowing
        ? state.following.filter(h => h !== handle)
        : [...state.following, handle]
    };
  }),

  repostThread: (threadId) => set((state) => {
    const thread = state.threads.find(t => t.id === threadId);
    if (!thread) return state;

    const newThread: Thread = {
      ...thread,
      id: Date.now(),
      timestamp: "Just now",
      metrics: { likes: 0, comments: 0, reposts: 0, bookmarks: 0 },
      commentsList: []
    };
    
    return {
      threads: [newThread, ...state.threads]
    };
  })
}));
