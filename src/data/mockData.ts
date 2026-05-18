export const events = [
  { 
    id: 1, 
    title: 'Tech Conference 2024: Future of AI', 
    date: 'Dec 15', 
    time: '10:00 AM', 
    location: 'Main Auditorium', 
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop',
    type: 'free',
    attendees: 234
  },
  { 
    id: 2, 
    title: 'Cultural Night 2024', 
    date: 'Dec 20', 
    time: '6:00 PM', 
    location: 'Student Center', 
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=200&fit=crop',
    type: 'paid',
    attendees: 156
  },
  { 
    id: 3, 
    title: 'Career Fair 2024', 
    date: 'Jan 10', 
    time: '9:00 AM', 
    location: 'Sports Complex', 
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop',
    type: 'free',
    attendees: 425
  }
];

export const statusUsers = [
  { id: 1, name: "Add Status", avatar: null, hasNew: false, isAddButton: true, timestamp: null },
  { id: 2, name: "Sarah", avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c8c0?w=80&h=80&fit=crop&crop=face", hasNew: true, timestamp: "2h ago", seen: false },
  { id: 3, name: "John", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face", hasNew: true, timestamp: "4h ago", seen: false },
  { id: 4, name: "Emma", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face", hasNew: false, timestamp: "1d ago", seen: true },
  { id: 5, name: "Mike", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face", hasNew: true, timestamp: "6h ago", seen: false },
  { id: 6, name: "Alex", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop&crop=face", hasNew: false, timestamp: "2d ago", seen: true },
];

export const threads = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      handle: "@sarah_cs23",
      course: "Computer Science, Year 3",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c8c0?w=48&h=48&fit=crop&crop=face",
      verified: true,
      online: true
    },
    timestamp: "2h",
    content: "Just finished my machine learning project! The neural network is finally working perfectly. Anyone else struggling with backpropagation? 🤖 #MachineLearning #CS",
    media: {
      type: "image",
      url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop",
      alt: "Machine learning project dashboard"
    },
    metrics: { likes: 24, comments: 8, reposts: 3, bookmarks: 12 },
    isThread: false,
    threadCount: 0
  },
  {
    id: 2,
    user: {
      name: "Mike Chen",
      handle: "@mike_biz",
      course: "Business Administration, Year 2",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face",
      verified: false,
      online: true
    },
    timestamp: "4h",
    content: "Study group forming for tomorrow's marketing exam! Meeting at the library 3rd floor. Bring your notes and let's ace this together! 📚",
    media: null,
    metrics: { likes: 15, comments: 12, reposts: 5, bookmarks: 8 },
    isThread: true,
    threadCount: 3
  },
  {
    id: 3,
    user: {
      name: "Emma Wilson",
      handle: "@emma_eng",
      course: "Engineering, Year 4",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop&crop=face",
      verified: true,
      online: false
    },
    timestamp: "6h",
    content: "The campus food court has amazing new dishes this semester! The sustainability club is also doing great work with the new recycling program. 🌱 #Sustainability",
    media: {
      type: "video",
      url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=300&fit=crop",
      alt: "Campus food court video"
    },
    metrics: { likes: 32, comments: 6, reposts: 8, bookmarks: 15 },
    isThread: false,
    threadCount: 0
  }
];

export const studentProducts = [
  { 
    id: 1, 
    name: "iPhone 13 Pro Max – 128GB (Used)", 
    price: "₦295,000", 
    rating: 4.2, 
    reviews: 13, 
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=160&h=160&fit=crop",
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
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=160&h=160&fit=crop",
    category: "Food",
    portion: "1 plate with bottle water",
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
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=160&h=160&fit=crop",
    category: "Educational Materials",
    fileType: "PDF Scan (40 pages)",
    description: "A+ quality notes for GST 102 – Communication in English. Well-organized with diagrams and examples. Scanned, clear PDF.",
    deliveryTime: "Instant download",
    seller: "Ope Bamidele",
    phone: "0701-223-3321"
  }
];

export const campusProducts = [
  {
    id: 101,
    name: "Official University T-Shirt",
    price: "₦8,500",
    rating: 4.9,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=160&h=160&fit=crop",
    category: "Apparel",
    description: "Official university branded t-shirt. 100% cotton, available in multiple sizes.",
    stock: 45,
    deliveryTime: "2-3 days",
    brand: "University Official"
  },
  {
    id: 102,
    name: "University Textbook - Mathematics 101",
    price: "₦12,000",
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=160&h=160&fit=crop",
    category: "Books",
    description: "Official textbook for Mathematics 101. Latest edition with updated curriculum.",
    stock: 23,
    deliveryTime: "1-2 days",
    brand: "University Press"
  },
  {
    id: 103,
    name: "University Water Bottle",
    price: "₦3,500",
    rating: 4.8,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=160&h=160&fit=crop",
    category: "Accessories",
    description: "Eco-friendly university branded water bottle. 500ml capacity.",
    stock: 78,
    deliveryTime: "1 day",
    brand: "University Official"
  }
];

export const rides = [
  {
    id: 1,
    driver: 'Michael Adebayo',
    from: 'Main Gate',
    to: 'City Center',
    time: '2:30 PM',
    price: '₦800',
    seats: 3,
    rating: 4.8
  },
  {
    id: 2,
    driver: 'Sarah Johnson',
    from: 'Engineering Block',
    to: 'Shopping Mall',
    time: '3:00 PM',
    price: '₦600',
    seats: 2,
    rating: 4.9
  }
];
