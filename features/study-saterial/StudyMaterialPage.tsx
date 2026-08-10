'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { FreeResource } from '../../types';
import { 
  FileText, Search, Filter, CheckCircle, 
  Sparkles, Star, BookOpen, Layers, Award,
  Check, Eye, X, ChevronRight, Zap,
  ShoppingBag, Heart, Grid, List, Tag, ShieldCheck, Clock, RefreshCw,
  ArrowUpDown, Trash2, BookMarked,
  CreditCard, Truck, PackageCheck, MapPin, Phone, Mail, User, Lock, QrCode,
  Plus, Minus, Percent, ShoppingCart
} from 'lucide-react';

export interface CartItem {
  cartItemId: string;
  resourceId: string;
  resource: FreeResource;
  quantity: number;
  format: 'Paperback Edition' | 'Digital E-Book';
  unitPrice: number;
}

export const StudyMaterialPage: React.FC<{ resources: FreeResource[] }> = ({ resources: FREE_RESOURCES }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Filters State
  const categoryFromUrl = searchParams.get('category') || 'All';
  const examFromUrl = searchParams.get('exam') || 'All';

  const [selectedType, setSelectedType] = useState<string>(categoryFromUrl);
  const [selectedExam, setSelectedExam] = useState<string>(examFromUrl);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedPageFilter, setSelectedPageFilter] = useState<string>('All');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('bestselling');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Saved / Wishlist items
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gyanam_store_saved');
      return saved ? JSON.parse(saved) : ['res-1', 'res-3'];
    } catch {
      return ['res-1', 'res-3'];
    }
  });

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('gyanam_store_cart');
      if (savedCart) {
        return JSON.parse(savedCart);
      }
    } catch {
      // fallback default cart
    }
    const defaultBook = FREE_RESOURCES[1] || FREE_RESOURCES[0];
    return [
      {
        cartItemId: `${defaultBook.id}-Paperback Edition`,
        resourceId: defaultBook.id,
        resource: defaultBook,
        quantity: 1,
        format: 'Paperback Edition',
        unitPrice: defaultBook.price || 299
      }
    ];
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [spotlightIndex, setSpotlightIndex] = useState<number>(0);

  // Promo Code State
  const [promoInput, setPromoInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number; maxDiscount: number } | null>(null);
  const [promoError, setPromoError] = useState<string>('');

  // Modals & Previews
  const [previewResource, setPreviewResource] = useState<FreeResource | null>(null);
  const [activeDetailImage, setActiveDetailImage] = useState<string | null>(null);
  const [detailFormat, setDetailFormat] = useState<'Paperback Edition' | 'Hardcover Edition' | 'Digital E-Book'>('Paperback Edition');
  const [detailQty, setDetailQty] = useState<number>(1);
  const [pincodeCheck, setPincodeCheck] = useState<string>('781001');
  const [pincodeStatus, setPincodeStatus] = useState<{ msg: string; success: boolean } | null>(null);

  // Reset detail view state when previewResource changes
  useEffect(() => {
    if (previewResource) {
      setActiveDetailImage(previewResource.coverImage || (previewResource.images && previewResource.images[0]) || null);
      setDetailFormat('Paperback Edition');
      setDetailQty(1);
      setPincodeStatus(null);
    }
  }, [previewResource]);

  // Checkout Flow State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutStep, setCheckoutStep] = useState<'address' | 'payment' | 'confirmation'>('address');
  const [addressForm, setAddressForm] = useState({
    fullName: 'Rohan Sharma',
    mobile: '9876543210',
    email: 'rohan.sharma@gmail.com',
    addressLine: 'House No. 42, G.S. Road, Near Ganeshguri Flyover',
    pincode: '781006',
    city: 'Guwahati',
    state: 'Assam'
  });
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState<string>('rohan@okaxis');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<{
    orderId: string;
    items: CartItem[];
    amountPaid: number;
    savings: number;
    date: string;
    address: typeof addressForm;
    paymentMethod: string;
  } | null>(null);

  // Book Request Form State
  const [requestSubject, setRequestSubject] = useState<string>('');
  const [requestExam, setRequestExam] = useState<string>('');
  const [requestEmail, setRequestEmail] = useState<string>('');
  const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);

  // Sync cart with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gyanam_store_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Sync state with URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    const ex = searchParams.get('exam');
    if (cat) setSelectedType(cat);
    if (ex) setSelectedExam(ex);
  }, [searchParams]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const updateParams = (type: string, exam: string) => {
    const params = new URLSearchParams();
    if (type !== 'All') params.set('category', type);
    if (exam !== 'All') params.set('exam', exam);
    router.push(`/study-material${params.toString() ? '?' + params.toString() : ''}`);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    updateParams(type, selectedExam);
  };

  const handleExamChange = (exam: string) => {
    setSelectedExam(exam);
    updateParams(selectedType, exam);
  };

  const toggleSaveItem = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let updated: string[];
    if (savedIds.includes(id)) {
      updated = savedIds.filter(sId => sId !== id);
      showToast('Removed from wishlist');
    } else {
      updated = [...savedIds, id];
      showToast('Added to wishlist ❤️');
    }
    setSavedIds(updated);
    try {
      localStorage.setItem('gyanam_store_saved', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  // Cart Functions
  const addToCart = (
    resource: FreeResource, 
    format: string = 'Paperback Edition',
    openImmediately: boolean = false,
    quantityToAdd: number = 1
  ) => {
    const basePrice = resource.price || 199;
    let unitPrice = basePrice;
    if (format === 'Digital E-Book') {
      unitPrice = Math.max(49, basePrice - 50);
    } else if (format === 'Hardcover Edition') {
      unitPrice = basePrice + 80;
    }
    const cartItemId = `${resource.id}-${format}`;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantityToAdd;
        return updated;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            resourceId: resource.id,
            resource,
            quantity: quantityToAdd,
            format: format as any,
            unitPrice
          }
        ];
      }
    });

    showToast(`Added ${quantityToAdd}x "${resource.title.slice(0, 22)}..." to cart! 🛒`);
    if (openImmediately) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'GYANaM20') {
      setAppliedPromo({ code: 'GYANaM20', discountPercent: 20, maxDiscount: 300 });
      showToast('Promo code GYANaM20 applied! (20% OFF)');
    } else if (code === 'WELCOME100') {
      setAppliedPromo({ code: 'WELCOME100', discountPercent: 15, maxDiscount: 200 });
      showToast('Welcome code applied! (15% OFF)');
    } else {
      setPromoError('Invalid coupon code. Try GYANaM20 for 20% off.');
    }
  };

  // Calculations
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const cartOriginalTotal = cartItems.reduce((acc, item) => acc + ((item.resource.originalPrice || item.unitPrice * 1.5) * item.quantity), 0);
  const shippingFee = cartSubtotal > 499 || cartItems.length === 0 ? 0 : 49;
  
  let promoDiscount = 0;
  if (appliedPromo && cartSubtotal > 0) {
    const calc = Math.round((cartSubtotal * appliedPromo.discountPercent) / 100);
    promoDiscount = Math.min(calc, appliedPromo.maxDiscount);
  }

  const grandTotal = Math.max(0, cartSubtotal - promoDiscount + shippingFee);
  const totalCartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Trigger Checkout
  const startCheckout = () => {
    if (cartItems.length === 0) {
      showToast('Your cart is empty!');
      return;
    }
    setIsCartOpen(false);
    setCheckoutStep('address');
    setIsCheckoutOpen(true);
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      const generatedOrderId = `GYN-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderObj = {
        orderId: generatedOrderId,
        items: [...cartItems],
        amountPaid: grandTotal,
        savings: (cartOriginalTotal - cartSubtotal) + promoDiscount,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        address: { ...addressForm },
        paymentMethod: paymentMethod === 'upi' ? `UPI (${upiId})` : paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'netbanking' ? 'Net Banking' : 'Cash on Delivery (COD)'
      };

      setCompletedOrder(orderObj);
      setCartItems([]);
      setCheckoutStep('confirmation');
      showToast('🎉 Order placed successfully!');
    }, 1800);
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestSubject || !requestExam) return;
    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestSubject('');
      setRequestExam('');
      setRequestEmail('');
      setRequestSubmitted(false);
      showToast('Book request submitted to Gyanam Publishing cell!');
    }, 3000);
  };

  // Filter & Sort Logic
  const filteredResources = FREE_RESOURCES.filter(item => {
    const matchesType = selectedType === 'All' ? true :
      selectedType === 'Book' ? (item.type === 'Book' || item.type === 'PDF Notes' || item.type === 'NCERT Gist') :
      selectedType === 'PYQ Paper' ? item.type === 'PYQ Paper' :
      selectedType === 'Question Bank' ? (item.type === 'Question Bank' || item.type === 'Formula Sheet') :
      selectedType === 'Magazine' ? (item.type === 'Magazine' || item.type === 'Current Affairs Magazine') :
      selectedType === 'Course Material' ? (item.type === 'Course Material' || item.type === 'Syllabus PDF') :
      item.type === selectedType;

    const matchesExam = selectedExam === 'All' ? true :
      item.category.toLowerCase().includes(selectedExam.toLowerCase()) ||
      (item.targetExams && item.targetExams.some(e => e.toLowerCase().includes(selectedExam.toLowerCase())));

    const matchesLanguage = selectedLanguage === 'All' ? true :
      item.language?.toLowerCase().includes(selectedLanguage.toLowerCase());

    const matchesPages = selectedPageFilter === 'All' ? true :
      selectedPageFilter === 'short' ? (item.pagesCount && item.pagesCount <= 50) :
      selectedPageFilter === 'medium' ? (item.pagesCount && item.pagesCount > 50 && item.pagesCount <= 120) :
      selectedPageFilter === 'long' ? (item.pagesCount && item.pagesCount > 120) : true;

    const price = item.price || 199;
    const matchesPrice = selectedPriceFilter === 'All' ? true :
      selectedPriceFilter === 'under100' ? price < 100 :
      selectedPriceFilter === '100-200' ? (price >= 100 && price <= 200) :
      selectedPriceFilter === '200-300' ? (price > 200 && price <= 300) :
      selectedPriceFilter === 'above300' ? price > 300 : true;

    const matchesRating = item.rating >= minRating;

    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.chapters && item.chapters.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesType && matchesExam && matchesLanguage && matchesPages && matchesPrice && matchesRating && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'bestselling') return b.downloadsCount - a.downloadsCount;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'priceAsc') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'priceDesc') return (b.price || 0) - (a.price || 0);
    return 0;
  });

  const savedList = FREE_RESOURCES.filter(r => savedIds.includes(r.id));

  return (
    <div className="min-h-screen bg-[#FFF8F8] text-slate-800 font-sans pb-28">
      
      {/* FLOATING TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-4 right-4 z-[99] bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-amber-400/40 text-xs font-bold"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. E-COMMERCE PROMO TICKER BAR */}
      <div className="bg-[#B91C1C] text-white text-[10px] sm:text-[11px] font-extrabold py-1.5 px-3 flex items-center justify-between sm:justify-center gap-1.5 sm:gap-2 shadow-inner overflow-hidden w-full">
        <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 flex-1 sm:flex-initial">
          <Truck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="truncate">
            <span className="sm:hidden">FAST NATIONWIDE DELIVERY</span>
            <span className="hidden sm:inline">FAST NATIONWIDE DELIVERY & E-BOOKS</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-amber-200">
          <span>•</span>
          <span>Use Code <strong className="bg-amber-400 text-red-950 px-1.5 py-0.5 rounded font-black">GYANaM20</strong> for 20% OFF</span>
        </div>
        <span className="bg-emerald-400 text-slate-950 px-1.5 sm:px-2 py-0.5 rounded-full text-[8.5px] sm:text-[10px] font-black uppercase tracking-wider shrink-0 whitespace-nowrap">
          100% <span className="hidden xs:inline">Faculty </span>Certified
        </span>
      </div>

      {/* 2. E-COMMERCE STORE MARKETPLACE HERO */}
      <section className="bg-gradient-to-br from-[#B91C1C] via-[#991B1B] to-[#7F1D1D] text-white py-5 sm:py-10 px-3 sm:px-6 relative overflow-hidden shadow-lg border-b border-red-900">
        
        {/* Decorative ambient background glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1340px] mx-auto space-y-4 sm:space-y-6 relative z-10">
          
          {/* Store Navigation & Cart Header Bar */}
          <div className="flex items-center justify-between border-b border-white/15 pb-2.5 sm:pb-3.5">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold text-red-100 truncate pr-2">
              <button onClick={() => router.push('/')} className="hover:text-amber-300 transition flex items-center gap-1 cursor-pointer shrink-0">
                <span>Home</span>
              </button>
              <ChevronRight className="w-3 h-3 opacity-60 shrink-0" />
              <span className="text-amber-300 font-extrabold flex items-center gap-1 truncate">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="hidden sm:inline">Gyanam Official</span> Bookstore
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Wishlist button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="hidden sm:flex items-center gap-1.5 bg-black/25 hover:bg-black/40 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition border border-white/20 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>Wishlist ({savedIds.length})</span>
              </button>

              {/* Main Shopping Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-amber-400 hover:bg-amber-300 text-red-950 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 sm:gap-2.5 cursor-pointer shadow-lg transform active:scale-95"
              >
                <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-950" />
                <span className="font-black text-[11px] sm:text-xs">Cart ({totalCartItemCount})</span>
                <span className="bg-red-950 text-amber-300 px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-black">
                  ₹{cartSubtotal}
                </span>
              </button>
            </div>
          </div>

          {/* HERO GRID (SEARCH + FEATURED BESTSELLER SHOWCASE) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center pt-1 sm:pt-2">
            
            {/* LEFT COLUMN: HEADLINE + E-COMMERCE SEARCH BAR */}
            <div className="lg:col-span-7 space-y-3.5 sm:space-y-5">
              
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-200 text-[10px] sm:text-[11px] font-black uppercase tracking-wider">
                <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
                <span>GYANaM OFFICIAL EXAM BOOKSTORE</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                Exam Preparation Books & <span className="text-amber-300 underline decoration-amber-400/50 underline-offset-4 sm:underline-offset-8">Workbooks Store</span>
              </h1>

              <p className="text-[11px] sm:text-sm text-red-100/90 leading-relaxed max-w-xl">
                Buy official hardcover books, 10-year shift-wise solved PYQs, and faculty master notes. Fast courier dispatch across India or instant digital access on your device.
              </p>

              {/* E-COMMERCE SEARCH BAR (Amazon / Shopify Mobile App Style) */}
              <div className="space-y-2 pt-1">
                <div className="bg-white p-1.5 rounded-2xl shadow-2xl border-2 border-amber-300/80 flex items-center gap-1 sm:gap-1.5">
                  
                  {/* Category Dropdown */}
                  <select
                    value={selectedType}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-black text-gray-800 bg-gray-100 sm:bg-gray-50 rounded-xl focus:outline-none cursor-pointer border-0 shrink-0 max-w-[105px] sm:max-w-none truncate"
                  >
                    <option value="All">All Books</option>
                    <option value="Book">Textbooks</option>
                    <option value="PYQ Paper">PYQs</option>
                    <option value="Question Bank">Question Banks</option>
                    <option value="Magazine">Magazines</option>
                    <option value="Course Material">Faculty Kits</option>
                  </select>

                  {/* Main Input */}
                  <div className="relative flex-1 flex items-center min-w-0">
                    <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 absolute left-2 sm:left-3 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search books, PYQs, exams..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-7 sm:pl-9 pr-6 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-gray-900 bg-transparent focus:outline-none placeholder-gray-400 truncate"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-1 text-xs font-bold text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Search Button */}
                  <button
                    onClick={() => {}}
                    className="bg-amber-400 hover:bg-amber-300 text-red-950 font-black text-xs px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl transition flex items-center justify-center gap-1 shrink-0 cursor-pointer shadow-md"
                  >
                    <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">SEARCH STORE</span>
                  </button>

                </div>

                {/* Popular Tags */}
                <div className="flex flex-wrap items-center gap-1 text-[10px] sm:text-[11px] pt-0.5">
                  <span className="font-bold text-amber-200/90 flex items-center gap-1 shrink-0">
                    <Zap className="w-3 h-3 text-amber-300 fill-amber-300" /> Bestselling:
                  </span>
                  {[
                    { tag: 'Assam ADRE 3.0', exam: 'Assam Govt' },
                    { tag: 'SSC CGL 10-Yr PYQ', exam: 'SSC' },
                    { tag: 'Vedic Math', exam: 'All' },
                    { tag: 'Polity Mind Maps', exam: 'UPSC' }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchQuery(item.tag);
                        if (item.exam !== 'All') handleExamChange(item.exam);
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white hover:text-amber-300 border border-white/20 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold transition cursor-pointer"
                    >
                      #{item.tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Trust Value Props */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2 text-left border-t border-white/10">
                <div className="flex items-start gap-1.5">
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] sm:text-xs font-extrabold text-white block leading-tight">Fast Delivery</span>
                    <span className="text-[9px] sm:text-[10px] text-red-200 hidden sm:block">2-3 days doorstep dispatch</span>
                  </div>
                </div>
                <div className="flex items-start gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] sm:text-xs font-extrabold text-white block leading-tight">100% Original</span>
                    <span className="text-[9px] sm:text-[10px] text-red-200 hidden sm:block">Faculty Verified Books</span>
                  </div>
                </div>
                <div className="flex items-start gap-1.5">
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] sm:text-xs font-extrabold text-white block leading-tight">COD / UPI</span>
                    <span className="text-[9px] sm:text-[10px] text-red-200 hidden sm:block">100% Safe Payments</span>
                  </div>
                </div>
              </div>

            </div>

                        {/* RIGHT COLUMN: FEATURED BESTSELLER SHOWCASE (3D E-COMMERCE BOOK DEAL CARD) */}
            <div className="lg:col-span-5">
              {(() => {
                const spotlightItem = FREE_RESOURCES[spotlightIndex % FREE_RESOURCES.length];
                const price = spotlightItem.price || 199;
                const origPrice = spotlightItem.originalPrice || 399;
                const discount = Math.round(((origPrice - price) / origPrice) * 100);

                return (
                  <div className="bg-gradient-to-br from-red-900 via-red-800 to-red-950 p-5 rounded-3xl border-2 border-amber-400/60 shadow-2xl space-y-4 relative overflow-hidden group">
                    
                    {/* Top Stripe */}
                    <div className="flex items-center justify-between border-b border-white/15 pb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
                        </span>
                        <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                          BESTSELLER BOOK DEAL OF THE DAY
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px]">
                        <button
                          onClick={() => setSpotlightIndex(prev => (prev > 0 ? prev - 1 : FREE_RESOURCES.length - 1))}
                          className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-white rounded font-black cursor-pointer"
                          title="Previous Book"
                        >
                          ‹
                        </button>
                        <span className="text-gray-300 font-bold">{(spotlightIndex % FREE_RESOURCES.length) + 1}/{FREE_RESOURCES.length}</span>
                        <button
                          onClick={() => setSpotlightIndex(prev => prev + 1)}
                          className="px-2 py-0.5 bg-white/10 hover:bg-white/20 text-white rounded font-black cursor-pointer"
                          title="Next Book"
                        >
                          ›
                        </button>
                      </div>
                    </div>

                    {/* Book Showcase */}
                    <div className="flex items-center gap-4">
                      
                      {/* 3D Book Graphic */}
                      <div className={`w-28 sm:w-32 h-40 rounded-2xl bg-gradient-to-br ${spotlightItem.coverBg || 'from-red-600 to-red-900'} text-white flex flex-col justify-between shadow-2xl relative border border-white/20 shrink-0 transform group-hover:scale-105 transition duration-300 overflow-hidden`}>
                        {spotlightItem.coverImage ? (
                          <>
                            <img 
                              src={spotlightItem.coverImage} 
                              alt={spotlightItem.title} 
                              className="w-full h-full object-cover"
                            />
                            {/* Book Spine Overlay Effect */}
                            <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-black/60 to-transparent border-r border-white/20 z-10" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                            <div className="absolute top-2 left-2.5 z-10">
                              <span className="px-1.5 py-0.5 bg-amber-400 text-red-950 font-black text-[8px] uppercase rounded shadow-sm">
                                {spotlightItem.badge || 'BESTSELLER'}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="p-3 h-full flex flex-col justify-between relative">
                            <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-black/30 border-r border-white/20" />
                            
                            <div className="pl-2 space-y-1">
                              <span className="px-1.5 py-0.2 bg-amber-400 text-red-950 font-black text-[8px] uppercase rounded">
                                {spotlightItem.badge || 'BESTSELLER'}
                              </span>
                              <h4 className="font-extrabold text-[11px] leading-tight line-clamp-3 text-white">
                                {spotlightItem.title}
                              </h4>
                            </div>

                            <div className="pl-2 border-t border-white/20 pt-1 text-[9px] font-bold text-amber-200">
                              {spotlightItem.pagesCount} Pages Hardcover
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Details & Pricing */}
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold bg-amber-400 text-red-950 px-2 py-0.5 rounded uppercase">
                            SAVE {discount}%
                          </span>
                          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                            <Check className="w-3 h-3" /> In Stock
                          </span>
                        </div>

                        <h3 className="font-black text-sm sm:text-base text-white line-clamp-2 leading-snug">
                          {spotlightItem.title}
                        </h3>

                        <p className="text-[11px] text-gray-300 line-clamp-2">
                          {spotlightItem.description}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] pt-1">
                          <span className="text-amber-300 font-extrabold flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-current text-amber-300" />
                            <span>{spotlightItem.rating}★</span>
                          </span>
                          <span className="text-gray-400">({spotlightItem.reviewsCount || 1200}+ reviews)</span>
                        </div>

                        {/* E-Commerce Price Tag */}
                        <div className="flex items-baseline gap-2 pt-1">
                          <span className="text-2xl font-black text-amber-400">₹{price}</span>
                          <span className="text-xs text-gray-400 line-through font-bold">
                            ₹{origPrice}
                          </span>
                          <span className="text-[10px] font-extrabold text-emerald-400">
                            (You save ₹{origPrice - price})
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* E-Commerce Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                      <button
                        onClick={() => addToCart(spotlightItem, 'Paperback Edition', false)}
                        className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer border border-white/15"
                      >
                        <ShoppingCart className="w-4 h-4 text-amber-300" /> Add to Cart
                      </button>

                      <button
                        onClick={() => {
                          addToCart(spotlightItem, 'Paperback Edition', true);
                        }}
                        className="py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-red-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transform active:scale-95"
                      >
                        <ShoppingBag className="w-4 h-4 text-red-950" />
                        <span>Buy Now</span>
                      </button>
                    </div>

                  </div>
                );
              })()}
            </div>

          </div>

        </div>
      </section>

      {/* 3. STORE QUICK CATEGORY CIRCLES / TILES BAR */}
      <section className="max-w-[1340px] mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        <div className="bg-white p-2.5 sm:p-4 rounded-2xl border border-red-100 shadow-sm flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'All', label: 'All Store Titles', icon: Layers, badge: '500+ Items' },
            { id: 'Book', label: 'Books', icon: BookOpen, badge: 'Hardcover' },
            { id: 'PYQ Paper', label: 'PYQ Papers', icon: FileText, badge: '10-Yr Solved' },
            { id: 'Question Bank', label: 'Question Banks', icon: Zap, badge: '10k+ MCQs' },
            { id: 'Magazine', label: 'CA Magazines', icon: Award, badge: 'July 2026' },
            { id: 'Course Material', label: 'Faculty Kits', icon: PackageCheck, badge: 'Box Sets' }
          ].map(cat => {
            const Icon = cat.icon;
            const active = selectedType === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleTypeChange(cat.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border text-xs font-extrabold whitespace-nowrap transition cursor-pointer shrink-0 ${
                  active 
                    ? 'bg-red-600 text-white border-red-600 shadow-md' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:text-red-600 hover:bg-red-50/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${active ? 'text-amber-300' : 'text-red-600'}`} />
                <span>{cat.label}</span>
                <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded font-black ${
                  active ? 'bg-white/20 text-white' : 'bg-red-50 text-red-700'
                }`}>
                  {cat.badge}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. MAIN STORE BODY: SIDEBAR + PRODUCT LISTING GRID */}
      <div className="max-w-[1340px] mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT E-COMMERCE FILTER SIDEBAR (DESKTOP) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white p-5 rounded-2xl border border-red-100 shadow-sm space-y-6 sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-sm font-black text-gray-900">
                <Filter className="w-4 h-4 text-red-600" />
                <span>Store Filters</span>
              </div>

              {(selectedType !== 'All' || selectedExam !== 'All' || selectedLanguage !== 'All' || selectedPageFilter !== 'All' || selectedPriceFilter !== 'All' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedType('All');
                    setSelectedExam('All');
                    setSelectedLanguage('All');
                    setSelectedPageFilter('All');
                    setSelectedPriceFilter('All');
                    setMinRating(0);
                    setSearchQuery('');
                    router.push('/study-material');
                  }}
                  className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Filter 1: Department */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider block">
                Book Department
              </span>
              <div className="space-y-1">
                {[
                  { id: 'All', name: 'All Store Titles' },
                  { id: 'Book', name: 'Books & Theory Textbooks' },
                  { id: 'PYQ Paper', name: 'Previous Year Papers (PYQs)' },
                  { id: 'Question Bank', name: 'Practice Question Banks' },
                  { id: 'Magazine', name: 'Current Affairs Magazines' },
                  { id: 'Course Material', name: 'Complete Course Material Kits' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleTypeChange(item.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                      selectedType === item.id 
                        ? 'bg-red-50 text-red-700 font-extrabold border-l-4 border-red-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{item.name}</span>
                    {selectedType === item.id && <Check className="w-3.5 h-3.5 text-red-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 2: Target Exam */}
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider block">
                Target Exam
              </span>
              <div className="space-y-1">
                {[
                  { id: 'All', name: 'All Competitive Exams' },
                  { id: 'SSC', name: 'SSC CGL & CHSL' },
                  { id: 'Banking', name: 'IBPS PO & SBI' },
                  { id: 'Assam Govt', name: 'Assam ADRE 3.0 & APSC' },
                  { id: 'UPSC', name: 'UPSC CSE & State PSC' }
                ].map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => handleExamChange(ex.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                      selectedExam === ex.id 
                        ? 'bg-red-50 text-red-700 font-extrabold border-l-4 border-red-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{ex.name}</span>
                    {selectedExam === ex.id && <Check className="w-3.5 h-3.5 text-red-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 3: Price Range */}
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider block">
                Price Range
              </span>
              <div className="space-y-1">
                {[
                  { id: 'All', label: 'All Prices' },
                  { id: 'under100', label: 'Under ₹100' },
                  { id: '100-200', label: '₹100 - ₹200' },
                  { id: '200-300', label: '₹200 - ₹300' },
                  { id: 'above300', label: 'Above ₹300' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPriceFilter(p.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                      selectedPriceFilter === p.id 
                        ? 'bg-red-50 text-red-700 font-extrabold' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{p.label}</span>
                    {selectedPriceFilter === p.id && <Check className="w-3.5 h-3.5 text-red-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 4: Language */}
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider block">
                Language Medium
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {['All', 'Bilingual', 'English', 'Assamese'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border text-center transition cursor-pointer ${
                      selectedLanguage === lang 
                        ? 'bg-red-600 text-white border-red-600' 
                        : 'bg-white text-gray-600 border-gray-200 hover:border-red-200'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter 5: Ratings */}
            <div className="space-y-2 pt-3 border-t border-gray-100">
              <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider block">
                Minimum Customer Rating
              </span>
              <div className="flex items-center gap-1">
                {[0, 4.5, 4.8, 4.9].map(r => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition cursor-pointer ${
                      minRating === r 
                        ? 'bg-amber-400 text-red-950 shadow-sm' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {r === 0 ? 'All' : `${r}★+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Store Guarantee Box */}
            <div className="p-3.5 bg-red-50 rounded-xl border border-red-100 space-y-1.5 text-[11px]">
              <span className="font-extrabold text-red-800 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-red-600" /> 100% Genuine Publications
              </span>
              <p className="text-gray-600 leading-normal">
                Directly published and printed by Gyanam Academic Wing. Includes ISBN verification.
              </p>
            </div>

          </aside>

          {/* MOBILE LEFT SLIDE-IN FILTER DRAWER WITH BLURRED BACKDROP */}
          <AnimatePresence>
            {isMobileFilterOpen && (
              <div className="fixed inset-0 z-50 lg:hidden flex">
                {/* Slightly Blurred Backdrop covering the right portion of the screen */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
                />

                {/* Smooth Left Side Drawer */}
                <motion.aside
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                  className="relative w-[78%] sm:w-[320px] max-w-[85vw] h-full bg-white z-50 shadow-2xl overflow-y-auto p-4 sm:p-5 border-r border-red-200 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-5">
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2 text-sm font-black text-gray-900">
                        <Filter className="w-4 h-4 text-red-600" />
                        <span>Store Filters</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {(selectedType !== 'All' || selectedExam !== 'All' || selectedLanguage !== 'All' || selectedPageFilter !== 'All' || selectedPriceFilter !== 'All' || searchQuery) && (
                          <button
                            onClick={() => {
                              setSelectedType('All');
                              setSelectedExam('All');
                              setSelectedLanguage('All');
                              setSelectedPageFilter('All');
                              setSelectedPriceFilter('All');
                              setMinRating(0);
                              setSearchQuery('');
                              router.push('/study-material');
                            }}
                            className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                          >
                            Reset
                          </button>
                        )}
                        <button 
                          onClick={() => setIsMobileFilterOpen(false)}
                          className="p-1.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 transition text-xs font-bold flex items-center justify-center cursor-pointer"
                          aria-label="Close filters"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Filter 1: Department */}
                    <div className="space-y-2">
                      <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider block">
                        Book Department
                      </span>
                      <div className="space-y-1">
                        {[
                          { id: 'All', name: 'All Store Titles' },
                          { id: 'Book', name: 'Books & Theory Textbooks' },
                          { id: 'PYQ Paper', name: 'Previous Year Papers (PYQs)' },
                          { id: 'Question Bank', name: 'Practice Question Banks' },
                          { id: 'Magazine', name: 'Current Affairs Magazines' },
                          { id: 'Course Material', name: 'Complete Course Material Kits' }
                        ].map(item => (
                          <button
                            key={item.id}
                            onClick={() => handleTypeChange(item.id)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                              selectedType === item.id 
                                ? 'bg-red-50 text-red-700 font-extrabold border-l-4 border-red-600' 
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <span>{item.name}</span>
                            {selectedType === item.id && <Check className="w-3.5 h-3.5 text-red-600" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Filter 2: Target Exam */}
                    <div className="space-y-2 pt-3 border-t border-gray-100">
                      <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider block">
                        Target Exam
                      </span>
                      <div className="space-y-1">
                        {[
                          { id: 'All', name: 'All Competitive Exams' },
                          { id: 'SSC', name: 'SSC CGL & CHSL' },
                          { id: 'Banking', name: 'IBPS PO & SBI' },
                          { id: 'Assam Govt', name: 'Assam ADRE 3.0 & APSC' },
                          { id: 'UPSC', name: 'UPSC CSE & State PSC' }
                        ].map(ex => (
                          <button
                            key={ex.id}
                            onClick={() => handleExamChange(ex.id)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                              selectedExam === ex.id 
                                ? 'bg-red-50 text-red-700 font-extrabold border-l-4 border-red-600' 
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <span>{ex.name}</span>
                            {selectedExam === ex.id && <Check className="w-3.5 h-3.5 text-red-600" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Filter 3: Price Range */}
                    <div className="space-y-2 pt-3 border-t border-gray-100">
                      <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider block">
                        Price Range
                      </span>
                      <div className="space-y-1">
                        {[
                          { id: 'All', label: 'All Prices' },
                          { id: 'under100', label: 'Under ₹100' },
                          { id: '100-200', label: '₹100 - ₹200' },
                          { id: '200-300', label: '₹200 - ₹300' },
                          { id: 'above300', label: 'Above ₹300' }
                        ].map(p => (
                          <button
                            key={p.id}
                            onClick={() => setSelectedPriceFilter(p.id)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                              selectedPriceFilter === p.id 
                                ? 'bg-red-50 text-red-700 font-extrabold' 
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <span>{p.label}</span>
                            {selectedPriceFilter === p.id && <Check className="w-3.5 h-3.5 text-red-600" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Filter 4: Language */}
                    <div className="space-y-2 pt-3 border-t border-gray-100">
                      <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider block">
                        Language Medium
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {['All', 'Bilingual', 'English', 'Assamese'].map(lang => (
                          <button
                            key={lang}
                            onClick={() => setSelectedLanguage(lang)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border text-center transition cursor-pointer ${
                              selectedLanguage === lang 
                                ? 'bg-red-600 text-white border-red-600' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-red-200'
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Filter 5: Ratings */}
                    <div className="space-y-2 pt-3 border-t border-gray-100">
                      <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider block">
                        Minimum Customer Rating
                      </span>
                      <div className="flex items-center gap-1">
                        {[0, 4.5, 4.8, 4.9].map(r => (
                          <button
                            key={r}
                            onClick={() => setMinRating(r)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition cursor-pointer ${
                              minRating === r 
                                ? 'bg-amber-400 text-red-950 shadow-sm' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {r === 0 ? 'All' : `${r}★+`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Store Guarantee Box */}
                    <div className="p-3 bg-red-50 rounded-xl border border-red-100 space-y-1 text-[11px]">
                      <span className="font-extrabold text-red-800 flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-red-600" /> 100% Genuine Publications
                      </span>
                      <p className="text-gray-600 leading-normal text-[10px]">
                        Directly published and printed by Gyanam Academic Wing.
                      </p>
                    </div>
                  </div>

                  {/* Apply Filters Sticky Button at Bottom */}
                  <div className="pt-3 border-t border-gray-100 sticky bottom-0 bg-white">
                    <button
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-amber-300" />
                      <span>Show {filteredResources.length} Filtered Books</span>
                    </button>
                  </div>

                </motion.aside>
              </div>
            )}
          </AnimatePresence>

          {/* RIGHT PRODUCT LISTING MAIN GRID */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* TOP BAR: SORTING, VIEW TOGGLE & RESULTS COUNT */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-red-100 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4">
              
              <div className="flex items-center justify-between gap-2 text-xs font-bold text-gray-700">
                <span>Showing <strong className="text-red-600 text-xs sm:text-sm">{filteredResources.length}</strong> Exam Books</span>
                {searchQuery && <span className="text-gray-400 text-[10px] sm:text-xs truncate max-w-[120px]">"{searchQuery}"</span>}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                
                {/* Mobile Filter Toggle Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5" /> Filters
                </button>

                {/* Sort selector */}
                <div className="flex items-center gap-1 text-xs min-w-0">
                  <ArrowUpDown className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span className="font-extrabold text-gray-700 hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-2 sm:px-3 py-1.5 text-xs font-bold bg-red-50/50 border border-red-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer max-w-[130px] sm:max-w-none truncate"
                  >
                    <option value="bestselling">Bestselling</option>
                    <option value="rating">Top Rated</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                  </select>
                </div>

                {/* View toggle buttons - hidden on small mobile to save space */}
                <div className="hidden sm:flex items-center border border-gray-200 rounded-xl p-0.5 bg-gray-50 shrink-0">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      viewMode === 'grid' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
                    }`}
                    title="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      viewMode === 'list' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

            {/* PRODUCT ITEMS GRID / LIST */}
            {filteredResources.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-red-100 shadow-sm space-y-4 z-10">
                <FileText className="w-12 h-12 text-red-300 mx-auto" />
                <h3 className="text-lg font-black text-gray-900">No Books Match Your Selected Filters</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Try adjusting your search keywords, price filter, or exam categories to discover available Gyanam books.
                </p>
                <button
                  onClick={() => {
                    setSelectedType('All');
                    setSelectedExam('All');
                    setSelectedLanguage('All');
                    setSelectedPageFilter('All');
                    setSelectedPriceFilter('All');
                    setMinRating(0);
                    setSearchQuery('');
                  }}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl transition cursor-pointer"
                >
                  Clear All Filters & View All Books
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              
              /* E-COMMERCE PRODUCT GRID (2-Columns on Mobile, 3/4 on Desktop) */
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
                {filteredResources.map((res) => {
                  const isSaved = savedIds.includes(res.id);
                  const price = res.price || 199;
                  const origPrice = res.originalPrice || 399;
                  const discount = Math.round(((origPrice - price) / origPrice) * 100);

                  return (
                    <motion.div
                      key={res.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-2xl border border-red-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group overflow-hidden relative"
                    >
                      
                      {/* E-BOOK / BOOK COVER IMAGE CONTAINER */}
                      <div 
                        onClick={() => setPreviewResource(res)}
                        className="relative bg-gray-900 overflow-hidden cursor-pointer group/cover aspect-[4/3] sm:aspect-[3/2] flex items-center justify-center"
                      >
                        {res.coverImage ? (
                          <img 
                            src={res.coverImage} 
                            alt={res.title} 
                            className="w-full h-full object-cover group-hover/cover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${res.coverBg || 'from-red-600 to-red-800'} p-3 text-white flex flex-col justify-between`}>
                            <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-red-950 px-1.5 py-0.5 rounded w-fit">
                              {res.badge || 'PRINT'}
                            </span>
                            <h4 className="font-black text-xs sm:text-sm line-clamp-2">{res.title}</h4>
                            <span className="text-[10px] text-red-100">{res.fileSize}</span>
                          </div>
                        )}

                        {/* Book Spine Overlay Effect */}
                        <div className="absolute top-0 bottom-0 left-0 w-2.5 sm:w-3 bg-gradient-to-r from-black/50 to-transparent border-r border-white/20 z-10" />

                        {/* Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 pointer-events-none" />

                        {/* Top Badges Row */}
                        <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 z-20">
                          <span className="px-1.5 py-0.5 bg-amber-400 text-red-950 font-black text-[8.5px] sm:text-[10px] uppercase rounded tracking-wider shadow-sm truncate max-w-[110px] sm:max-w-none leading-none">
                            {res.badge || 'PRINT EDITION'}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaveItem(res.id, e);
                            }}
                            className={`p-1 sm:p-1.5 rounded-full backdrop-blur-md transition cursor-pointer shrink-0 ${
                              isSaved 
                                ? 'bg-white text-red-600 shadow-md' 
                                : 'bg-black/30 text-white hover:bg-white hover:text-red-600'
                            }`}
                            title={isSaved ? "Remove from Wishlist" : "Save to Wishlist"}
                          >
                            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSaved ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        {/* Multi-Image Gallery Indicator Pill */}
                        {res.images && res.images.length > 1 && (
                          <div className="absolute bottom-2 right-2 z-20 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-bold text-white flex items-center gap-1 shadow-sm">
                            <Eye className="w-3 h-3 text-amber-300" />
                            <span>{res.images.length} Photos</span>
                          </div>
                        )}

                        {/* Rating Badge Overlay Bottom Left */}
                        <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1 text-[10px] font-black text-amber-300 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                          <Star className="w-3 h-3 fill-current text-amber-300" />
                          <span>{res.rating}★</span>
                        </div>
                      </div>

                      {/* PRODUCT BODY */}
                      <div className="p-3 sm:p-4 space-y-2 flex-1 flex flex-col justify-between">
                        
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold text-gray-500">
                            <span className="text-red-600 font-extrabold uppercase tracking-wider truncate">{res.type} • {res.category}</span>
                            <span className="hidden sm:inline text-emerald-700 font-extrabold bg-emerald-50 px-1 rounded">In Stock</span>
                          </div>

                          <h3 
                            onClick={() => setPreviewResource(res)}
                            className="font-extrabold text-xs sm:text-sm text-gray-900 leading-tight line-clamp-2 hover:text-red-600 transition cursor-pointer"
                          >
                            {res.title}
                          </h3>

                          <p className="text-[11px] sm:text-xs text-gray-600 leading-snug line-clamp-2">
                            {res.description}
                          </p>

                          <div className="text-[10px] font-bold text-gray-500 flex items-center justify-between pt-1">
                            <span>By {res.author || 'Gyanam Faculty'}</span>
                            <span>{res.pagesCount || 150} Pages</span>
                          </div>
                        </div>

                        {/* PRICING & ACTION BUTTONS */}
                        <div className="pt-2 border-t border-gray-100 space-y-2">
                          
                          {/* Price Tag */}
                          <div className="flex items-baseline justify-between gap-1 flex-wrap">
                            <div className="flex items-baseline gap-1.5 flex-wrap">
                              <span className="text-base sm:text-lg font-black text-red-600">₹{price}</span>
                              <span className="text-[10px] sm:text-xs font-bold text-gray-400 line-through">
                                ₹{origPrice}
                              </span>
                              <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                                {discount}% OFF
                              </span>
                            </div>
                          </div>

                          {/* E-Commerce Buttons */}
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              onClick={() => setPreviewResource(res)}
                              className="py-1.5 sm:py-2 px-1.5 sm:px-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-[11px] sm:text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600" />
                              <span>Details</span>
                            </button>

                            <button
                              onClick={() => addToCart(res, 'Paperback Edition', true)}
                              className="py-1.5 sm:py-2 px-1.5 sm:px-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[11px] sm:text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
                              <span>Add</span>
                            </button>
                          </div>

                        </div>

                      </div>

                    </motion.div>
                  );
                })}
              </div>

            ) : (

              /* COMPACT E-COMMERCE LIST VIEW */
              <div className="space-y-4">
                {filteredResources.map((res) => {
                  const isSaved = savedIds.includes(res.id);
                  const price = res.price || 199;
                  const origPrice = res.originalPrice || 399;

                  return (
                    <motion.div
                      key={res.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white rounded-2xl p-3 sm:p-4 border border-red-100 shadow-sm hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3 sm:gap-4 flex-1">
                        {/* Book Cover Preview Thumbnail */}
                        <div 
                          onClick={() => setPreviewResource(res)}
                          className="w-16 h-22 sm:w-20 sm:h-26 rounded-xl overflow-hidden bg-gray-900 shrink-0 shadow-sm relative group cursor-pointer border border-gray-200"
                        >
                          {res.coverImage ? (
                            <img src={res.coverImage} alt={res.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${res.coverBg || 'from-red-600 to-red-800'} p-1.5 text-white flex flex-col justify-between`}>
                              <span className="text-[8px] font-black uppercase tracking-tight">{res.type}</span>
                              <h4 className="text-[10px] font-black line-clamp-2">{res.title}</h4>
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                              {res.category}
                            </span>
                            <span className="text-[11px] font-bold text-gray-500">By {res.author || 'Gyanam Faculty'}</span>
                            <span className="text-[11px] font-black text-amber-600 flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current text-amber-400" /> {res.rating}★
                            </span>
                          </div>

                          <h3 
                            onClick={() => setPreviewResource(res)}
                            className="font-extrabold text-sm sm:text-base text-gray-900 hover:text-red-600 transition cursor-pointer"
                          >
                            {res.title}
                          </h3>

                          <p className="text-xs text-gray-600 line-clamp-1">
                            {res.description}
                          </p>
                        </div>
                      </div>

                      {/* Price & Action Row */}
                      <div className="flex items-center gap-3 w-full md:w-auto justify-between border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 shrink-0">
                        <div className="text-right">
                          <div className="text-base font-black text-red-600">₹{price}</div>
                          <div className="text-[10px] text-gray-400 line-through font-bold">₹{origPrice}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPreviewResource(res)}
                            className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition cursor-pointer"
                            title="Preview Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => addToCart(res, 'Paperback Edition', true)}
                            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <ShoppingCart className="w-3.5 h-3.5 text-amber-300" />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

            )}

          </main>

        </div>
      </div>

      {/* 5. BOOK CONCIERGE / SPECIAL ORDER SECTION */}
      <section className="max-w-[1340px] mx-auto px-4 sm:px-6 pt-16">
        <div className="bg-gradient-to-r from-white via-red-50/50 to-white rounded-3xl p-6 sm:p-10 border border-red-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-3">
            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-black uppercase rounded-md inline-block">
              Custom Printing & Bulk Concierge
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              Looking for a Specific Exam Book or Custom Subject Module?
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Our academic publishing wing prints and dispatches custom exam workbooks for institutions, coaching centers, and individual aspirants. Request your specific subject or target exam.
            </p>
          </div>

          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-red-200 shadow-md space-y-4">
            {requestSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-black text-emerald-900">Book Special Request Received!</h4>
                <p className="text-xs text-emerald-800">Our publication team will reach out via email/phone within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-3">
                <h3 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-2">
                  Request Special Book Print Order
                </h3>

                <div>
                  <label className="text-[11px] font-extrabold text-gray-700 block mb-1">Subject / Book Title Needed</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern History Tribal Movements or Reasoning Puzzles"
                    value={requestSubject}
                    onChange={(e) => setRequestSubject(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-extrabold text-gray-700 block mb-1">Target Exam</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Assam ADRE 3.0"
                      value={requestExam}
                      onChange={(e) => setRequestExam(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-extrabold text-gray-700 block mb-1">Email / Phone</label>
                    <input
                      type="text"
                      placeholder="For order confirmation"
                      value={requestEmail}
                      onChange={(e) => setRequestEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl transition shadow-md cursor-pointer"
                >
                  Submit Special Order Inquiry →
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* 6. SHOPIFY-STYLE CART SLIDE-OVER DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl relative"
            >
              {/* Cart Drawer Header */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-red-600 text-white">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-amber-300" />
                  <h3 className="text-base font-black">Shopping Cart ({totalCartItemCount} items)</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/20 text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="p-5 overflow-y-auto space-y-4 flex-1">
                {cartItems.length === 0 ? (
                  <div className="text-center py-16 space-y-4 text-gray-500">
                    <ShoppingBag className="w-16 h-16 text-red-200 mx-auto" />
                    <h4 className="text-base font-black text-gray-800">Your Cart is Currently Empty</h4>
                    <p className="text-xs text-gray-400 max-w-xs mx-auto">
                      Explore our official exam books and add workbooks or notes to your cart.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-5 py-2.5 bg-red-600 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
                    >
                      Browse Bookstore
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div 
                      key={item.cartItemId} 
                      className="p-3.5 bg-red-50/40 rounded-2xl border border-red-100 flex items-start gap-3 relative"
                    >
                      {/* Mini Book Icon */}
                      <div className={`w-12 h-16 rounded-lg bg-gradient-to-br ${item.resource.coverBg || 'from-red-600 to-red-800'} text-white flex flex-col items-center justify-center shrink-0 shadow-sm p-1 text-center`}>
                        <BookOpen className="w-5 h-5 text-amber-300" />
                      </div>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-gray-900 truncate">{item.resource.title}</h4>
                          <button
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-gray-400 hover:text-red-600 transition cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Format selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-white text-red-800 border border-red-200">
                            {item.format}
                          </span>
                        </div>

                        {/* Price & Quantity Controls */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.cartItemId, -1)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100 font-bold text-xs"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 py-1 text-xs font-black text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.cartItemId, 1)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100 font-bold text-xs"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-black text-red-600">
                              ₹{item.unitPrice * item.quantity}
                            </span>
                            <span className="text-[10px] text-gray-400 block">₹{item.unitPrice} each</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Drawer Footer & Price Summary */}
              {cartItems.length > 0 && (
                <div className="p-5 border-t border-gray-100 bg-gray-50 space-y-3">
                  
                  {/* Coupon Input */}
                  <form onSubmit={handleApplyPromo} className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code (e.g. GYANaM20)"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs font-bold uppercase bg-white border border-gray-200 rounded-xl focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && <p className="text-[10px] text-red-600 font-bold">{promoError}</p>}
                    {appliedPromo && (
                      <p className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Code {appliedPromo.code} applied ({appliedPromo.discountPercent}% discount)
                      </p>
                    )}
                  </form>

                  {/* Summary Breakdown */}
                  <div className="space-y-1.5 text-xs border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span className="font-bold text-gray-900">₹{cartSubtotal}</span>
                    </div>

                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Promo Discount ({appliedPromo?.code}):</span>
                        <span>- ₹{promoDiscount}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-600">
                      <span>Courier Shipping:</span>
                      <span className="font-bold text-gray-900">
                        {shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${shippingFee}`}
                      </span>
                    </div>

                    <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                      <span>Total Amount:</span>
                      <span className="text-red-600">₹{grandTotal}</span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <button
                    onClick={startCheckout}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-300" />
                    <span>Proceed to Checkout (₹{grandTotal})</span>
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. SHOPIFY-STYLE CHECKOUT MODAL */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-red-100 my-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Close button */}
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Checkout Progress Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-red-600" />
                  <h3 className="text-xl font-black text-gray-900">Gyanam Bookstore Checkout</h3>
                </div>

                {/* Progress Steps */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-extrabold">
                  <div className={`p-2 rounded-xl flex items-center justify-center gap-1.5 ${
                    checkoutStep === 'address' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <MapPin className="w-3.5 h-3.5" /> 1. Shipping
                  </div>
                  <div className={`p-2 rounded-xl flex items-center justify-center gap-1.5 ${
                    checkoutStep === 'payment' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <CreditCard className="w-3.5 h-3.5" /> 2. Payment
                  </div>
                  <div className={`p-2 rounded-xl flex items-center justify-center gap-1.5 ${
                    checkoutStep === 'confirmation' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <PackageCheck className="w-3.5 h-3.5" /> 3. Order Placed
                  </div>
                </div>
              </div>

              {/* STEP 1: SHIPPING ADDRESS */}
              {checkoutStep === 'address' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-red-600" /> Customer & Shipping Address
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-extrabold text-gray-700 block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-extrabold text-gray-700 block mb-1">Mobile Number (SMS Tracking)</label>
                      <input
                        type="tel"
                        value={addressForm.mobile}
                        onChange={(e) => setAddressForm({ ...addressForm, mobile: e.target.value })}
                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="font-extrabold text-gray-700 block mb-1">Email Address (Order Receipt)</label>
                    <input
                      type="email"
                      value={addressForm.email}
                      onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                      required
                    />
                  </div>

                  <div className="text-xs">
                    <label className="font-extrabold text-gray-700 block mb-1">Street Address / House No.</label>
                    <input
                      type="text"
                      value={addressForm.addressLine}
                      onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="font-extrabold text-gray-700 block mb-1">Pincode</label>
                      <input
                        type="text"
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-extrabold text-gray-700 block mb-1">City</label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-extrabold text-gray-700 block mb-1">State</label>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                        required
                      />
                    </div>
                  </div>

                  {/* Delivery Speed Selection */}
                  <div className="space-y-2 pt-2">
                    <label className="font-extrabold text-xs text-gray-800 block">Select Courier Speed</label>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <button
                        type="button"
                        onClick={() => setDeliverySpeed('standard')}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
                          deliverySpeed === 'standard' ? 'border-red-600 bg-red-50/50 font-extrabold' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-gray-900">Standard Delivery</span>
                          <span className="text-emerald-600 font-bold">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">4-5 Working Days Dispatch</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliverySpeed('express')}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
                          deliverySpeed === 'express' ? 'border-red-600 bg-red-50/50 font-extrabold' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-gray-900">Express Air Mail</span>
                          <span className="text-red-600 font-bold">₹99</span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">1-2 Working Days Priority</p>
                      </button>
                    </div>
                  </div>

                  {/* Step 1 Next Button */}
                  <button
                    onClick={() => setCheckoutStep('payment')}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer mt-2"
                  >
                    Continue to Payment Method →
                  </button>
                </div>
              )}

              {/* STEP 2: PAYMENT METHOD */}
              {checkoutStep === 'payment' && (
                <form onSubmit={handleCompleteOrder} className="space-y-4">
                  <h4 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-600" /> Secure Payment Method
                  </h4>

                  {/* Payment Method Selector */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {[
                      { id: 'upi', label: 'UPI / GPay', icon: QrCode },
                      { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                      { id: 'netbanking', label: 'Net Banking', icon: Lock },
                      { id: 'cod', label: 'Cash on Delivery', icon: Truck }
                    ].map(pm => {
                      const Icon = pm.icon;
                      const active = paymentMethod === pm.id;
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setPaymentMethod(pm.id as any)}
                          className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                            active ? 'border-red-600 bg-red-50 text-red-900 font-black' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${active ? 'text-red-600' : 'text-gray-500'}`} />
                          <span className="text-[11px] font-bold">{pm.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Method Details */}
                  {paymentMethod === 'upi' && (
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2 text-xs">
                      <label className="font-extrabold text-gray-800 block">Enter VPA / UPI ID</label>
                      <input
                        type="text"
                        placeholder="e.g. mobile@upi or username@okaxis"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl font-bold"
                        required
                      />
                      <p className="text-[10px] text-gray-500">Supports Google Pay, PhonePe, Paytm, BHIM & Amazon Pay.</p>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 text-xs">
                      <div>
                        <label className="font-extrabold text-gray-800 block mb-1">Card Number</label>
                        <input
                          type="text"
                          placeholder="4532 •••• •••• 8920"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl font-bold"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-extrabold text-gray-800 block mb-1">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            placeholder="08/28"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl font-bold"
                            required
                          />
                        </div>
                        <div>
                          <label className="font-extrabold text-gray-800 block mb-1">CVV</label>
                          <input
                            type="password"
                            placeholder="•••"
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl font-bold"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                      <span className="font-extrabold block">Cash on Delivery Confirmation:</span>
                      <p>You can pay cash upon receiving your hardcover book from our courier partner. An additional ₹30 COD handling charge applies.</p>
                    </div>
                  )}

                  {/* Summary Box */}
                  <div className="p-4 bg-red-50/60 rounded-2xl border border-red-100 text-xs space-y-1.5">
                    <div className="flex justify-between font-bold text-gray-700">
                      <span>Items Total ({totalCartItemCount} books):</span>
                      <span>₹{cartSubtotal}</span>
                    </div>
                    {promoDiscount > 0 && (
                      <div className="flex justify-between font-bold text-emerald-600">
                        <span>Coupon Discount:</span>
                        <span>- ₹{promoDiscount}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-gray-700">
                      <span>Courier Shipping:</span>
                      <span>{deliverySpeed === 'express' ? '₹99 (Express)' : shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-red-600 border-t border-red-200 pt-2">
                      <span>Final Order Amount:</span>
                      <span>₹{grandTotal + (deliverySpeed === 'express' ? 99 : 0)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('address')}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs rounded-xl cursor-pointer"
                    >
                      ← Back to Shipping
                    </button>

                    <button
                      type="submit"
                      disabled={isProcessingPayment}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isProcessingPayment ? (
                        <span className="animate-pulse">Processing Order...</span>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-200" />
                          <span>Pay & Confirm Order (₹{grandTotal + (deliverySpeed === 'express' ? 99 : 0)})</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: ORDER CONFIRMATION */}
              {checkoutStep === 'confirmation' && completedOrder && (
                <div className="text-center space-y-5 py-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 animate-bounce" />
                  </div>

                  <div className="space-y-1">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full uppercase">
                      Order Confirmed #{completedOrder.orderId}
                    </span>
                    <h3 className="text-2xl font-black text-gray-900 pt-2">Thank You For Your Order!</h3>
                    <p className="text-xs text-gray-600 max-w-sm mx-auto">
                      Your books are being packaged at Gyanam Central Warehouse. A dispatch tracking SMS will be sent to <strong>{completedOrder.address.mobile}</strong>.
                    </p>
                  </div>

                  {/* Order Details Receipt Box */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-left text-xs space-y-2 max-w-md mx-auto">
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="font-extrabold text-gray-600">Order Date:</span>
                      <span className="font-black text-gray-900">{completedOrder.date}</span>
                    </div>

                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="font-extrabold text-gray-600">Payment Status:</span>
                      <span className="font-black text-emerald-600 flex items-center gap-1">
                        <Check className="w-3 h-3" /> PAID via {completedOrder.paymentMethod}
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="font-extrabold text-gray-600">Total Paid:</span>
                      <span className="font-black text-red-600 text-sm">₹{completedOrder.amountPaid}</span>
                    </div>

                    <div className="space-y-1 pt-1">
                      <span className="font-extrabold text-gray-700 block">Delivery Address:</span>
                      <p className="text-[11px] text-gray-600">
                        {completedOrder.address.fullName}, {completedOrder.address.addressLine}, {completedOrder.address.city}, {completedOrder.address.state} - {completedOrder.address.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => {
                        setIsCheckoutOpen(false);
                      }}
                      className="px-6 py-2.5 bg-red-600 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer hover:bg-red-700 transition"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. E-COMMERCE PRODUCT DETAIL PAGE MODAL */}
      <AnimatePresence>
        {previewResource && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md overflow-hidden">
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl max-w-4xl w-full h-[92vh] sm:h-auto sm:max-h-[92vh] flex flex-col shadow-2xl relative border-t sm:border border-red-100 overflow-hidden"
            >
              {/* Sticky Top Header */}
              <div className="flex items-center justify-between border-b border-gray-100 p-3.5 sm:px-8 sm:py-4 bg-white/95 backdrop-blur-sm z-20 shrink-0">
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold text-gray-500 truncate">
                  <span className="text-red-600 hover:underline cursor-pointer shrink-0" onClick={() => setPreviewResource(null)}>Gyanam Store</span>
                  <span>/</span>
                  <span className="text-gray-700 shrink-0">{previewResource.category}</span>
                  <span>/</span>
                  <span className="text-gray-900 truncate max-w-[120px] sm:max-w-[220px]">{previewResource.type}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => toggleSaveItem(previewResource.id, e)}
                    className={`p-2 rounded-full border transition cursor-pointer ${
                      savedIds.includes(previewResource.id)
                        ? 'bg-red-50 text-red-600 border-red-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 border-gray-200'
                    }`}
                    title="Save to Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${savedIds.includes(previewResource.id) ? 'fill-current' : ''}`} />
                  </button>
                  <button 
                    onClick={() => setPreviewResource(null)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-700 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* MAIN SCROLLABLE CONTENT BODY */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">

                {/* MAIN PRODUCT BODY (2 COLUMNS) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                  
                  {/* LEFT COLUMN: IMAGE GALLERY, SPECS, SUMMARY, CHAPTERS */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {/* MAIN IMAGE DISPLAY & THUMBNAILS */}
                    <div className="space-y-3">
                      <div className="relative rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 text-white overflow-hidden shadow-lg flex items-center justify-center min-h-[240px] sm:min-h-[340px] group">
                        
                        {/* Book Spine Edge effect */}
                        <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/60 to-transparent border-r border-white/10 z-10" />

                        {/* Cover or Active Selected Image */}
                        {(activeDetailImage || previewResource.coverImage) ? (
                          <img
                            src={activeDetailImage || previewResource.coverImage}
                            alt={previewResource.title}
                            className="max-h-[240px] sm:max-h-[320px] w-auto object-contain rounded-lg shadow-2xl transform group-hover:scale-[1.02] transition duration-300 z-1"
                          />
                        ) : (
                          <div className={`w-full h-full p-6 bg-gradient-to-br ${previewResource.coverBg || 'from-red-600 to-red-800'} rounded-xl flex flex-col justify-between text-white`}>
                            <span className="px-2 py-1 bg-amber-400 text-red-950 font-black text-xs uppercase rounded w-fit">
                              {previewResource.badge || 'PRINT EDITION'}
                            </span>
                            <h3 className="text-xl font-black">{previewResource.title}</h3>
                            <p className="text-xs text-red-200">By {previewResource.author || 'Gyanam Faculty'}</p>
                          </div>
                        )}

                        {/* Badge Overlay */}
                        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-amber-400 text-red-950 font-black text-[10px] uppercase rounded-lg shadow-md">
                            {previewResource.badge || 'OFFICIAL PUBLICATION'}
                          </span>
                        </div>

                        {/* Image Counter Indicator */}
                        {previewResource.images && previewResource.images.length > 1 && (
                          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5 shadow-md border border-white/20">
                            <Eye className="w-3.5 h-3.5 text-amber-300" />
                            <span>{previewResource.images.length} High-Res Preview Photos</span>
                          </div>
                        )}
                      </div>

                      {/* THUMBNAIL GALLERY CAROUSEL */}
                      {previewResource.images && previewResource.images.length > 1 && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider block">
                            Tap Thumbnail to Preview Book Pages:
                          </span>
                          <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                            {previewResource.images.map((imgUrl, idx) => (
                              <button
                                key={idx}
                                onClick={() => setActiveDetailImage(imgUrl)}
                                className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                                  activeDetailImage === imgUrl 
                                    ? 'border-red-600 ring-2 ring-red-400 shadow-md scale-105' 
                                    : 'border-gray-200 hover:border-red-300 opacity-70 hover:opacity-100'
                                }`}
                              >
                                <img src={imgUrl} alt={`Sample ${idx + 1}`} className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* TITLE & RATINGS */}
                    <div className="space-y-2 border-b border-gray-100 pb-4">
                      <h2 className="text-lg sm:text-2xl font-black text-gray-900 leading-snug">
                        {previewResource.title}
                      </h2>

                      <div className="flex flex-wrap items-center gap-2.5 text-xs">
                        <span className="flex items-center gap-1 font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                          <Star className="w-4 h-4 fill-current text-amber-400" />
                          <span>{previewResource.rating} / 5.0</span>
                        </span>

                        <span className="text-gray-500 font-bold">
                          ({previewResource.reviewsCount || 1240} Student Reviews)
                        </span>

                        <span className="text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> 100% Genuine
                        </span>
                      </div>
                    </div>

                    {/* BOOK SUMMARY */}
                    <div className="space-y-2 bg-red-50/50 p-4 rounded-2xl border border-red-100">
                      <span className="text-xs font-black text-red-800 uppercase tracking-wider block">
                        Book Summary & Syllabus Coverage
                      </span>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        {previewResource.description}
                      </p>
                    </div>

                    {/* SPECIFICATIONS TABLE */}
                    <div className="space-y-3">
                      <span className="text-xs font-black text-gray-900 uppercase tracking-wider block">
                        Book Specifications & Details
                      </span>

                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-gray-400 font-bold block text-[10px] uppercase">Author / Faculty</span>
                          <span className="font-extrabold text-gray-800">{previewResource.author || 'Gyanam Faculty'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-bold block text-[10px] uppercase">Publisher</span>
                          <span className="font-extrabold text-gray-800">{previewResource.publisher || 'Gyanam Academic Wing'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-bold block text-[10px] uppercase">ISBN Number</span>
                          <span className="font-extrabold text-gray-800">{previewResource.isbn || '978-93-89102-14-1'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-bold block text-[10px] uppercase">Edition</span>
                          <span className="font-extrabold text-gray-800">{previewResource.edition || '2026 Revised Print'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-bold block text-[10px] uppercase">Page Count</span>
                          <span className="font-extrabold text-gray-800">{previewResource.pagesCount || 210} Pages</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-bold block text-[10px] uppercase">Language</span>
                          <span className="font-extrabold text-gray-800">{previewResource.language || 'English'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-bold block text-[10px] uppercase">Weight</span>
                          <span className="font-extrabold text-gray-800">{previewResource.weight || '350 grams'}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-400 font-bold block text-[10px] uppercase">Target Exams</span>
                          <span className="font-extrabold text-red-700">{previewResource.targetExams?.join(', ') || previewResource.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* CHAPTERS / INDEX */}
                    {previewResource.chapters && (
                      <div className="space-y-3">
                        <span className="text-xs font-black text-gray-900 uppercase tracking-wider block">
                          Table of Contents / Chapter Index
                        </span>
                        <div className="space-y-2">
                          {previewResource.chapters.map((chap, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 flex items-center justify-between hover:border-red-200 transition">
                              <div className="flex items-center gap-2.5">
                                <span className="w-5 h-5 rounded-md bg-red-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <span>{chap}</span>
                              </div>
                              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* RIGHT COLUMN: BUY BOX & OPTIONS */}
                  <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
                    
                    <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-red-100 shadow-xl space-y-5">
                      
                      {/* PRICE BANNER */}
                      <div className="p-4 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white rounded-2xl space-y-1 shadow-md">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-200 block">
                          SPECIAL FESTIVE DISCOUNT PRICE
                        </span>
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl sm:text-3xl font-black">
                              ₹{
                                detailFormat === 'Digital E-Book'
                                  ? Math.max(49, (previewResource.price || 199) - 50)
                                  : detailFormat === 'Hardcover Edition'
                                  ? (previewResource.price || 199) + 80
                                  : (previewResource.price || 199)
                              }
                            </span>
                            <span className="text-xs text-red-200 line-through font-bold">
                              ₹{previewResource.originalPrice || 499}
                            </span>
                          </div>

                          <span className="px-2 py-1 bg-amber-400 text-red-950 text-xs font-black rounded-lg">
                            SAVE {Math.round((((previewResource.originalPrice || 499) - (previewResource.price || 199)) / (previewResource.originalPrice || 499)) * 100)}% OFF
                          </span>
                        </div>
                      </div>

                      {/* FORMAT / BINDING SELECTION */}
                      <div className="space-y-2">
                        <span className="text-xs font-black text-gray-900 uppercase tracking-wider block">
                          Select Format / Edition:
                        </span>

                        <div className="space-y-2">
                          {[
                            { id: 'Paperback Edition', label: 'Paperback Physical Book', desc: 'Standard Printed Textbook', price: `₹${previewResource.price || 199}` },
                            { id: 'Hardcover Edition', label: 'Hardcover Deluxe Edition', desc: 'Durable Hardcover Binding', price: `₹${(previewResource.price || 199) + 80}` },
                            { id: 'Digital E-Book', label: 'Digital PDF E-Book', desc: 'Instant Access on App & Web', price: `₹${Math.max(49, (previewResource.price || 199) - 50)}` }
                          ].map(f => (
                            <button
                              key={f.id}
                              onClick={() => setDetailFormat(f.id as any)}
                              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                                detailFormat === f.id
                                  ? 'border-red-600 bg-red-50/60 ring-2 ring-red-400 shadow-sm'
                                  : 'border-gray-200 hover:border-red-200 bg-white'
                              }`}
                            >
                              <div>
                                <div className="text-xs font-black text-gray-900">{f.label}</div>
                                <div className="text-[10px] font-bold text-gray-500">{f.desc}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs font-black text-red-600">{f.price}</div>
                                {detailFormat === f.id && <Check className="w-4 h-4 text-red-600 ml-auto" />}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* QUANTITY SELECTOR */}
                      <div className="space-y-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-black text-gray-900 uppercase tracking-wider">
                          Quantity:
                        </span>

                        <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50 overflow-hidden">
                          <button
                            onClick={() => setDetailQty(Math.max(1, detailQty - 1))}
                            className="px-3 py-1.5 text-gray-700 font-black hover:bg-gray-200 transition cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-4 py-1.5 text-xs font-black text-gray-900 bg-white border-x border-gray-200">
                            {detailQty}
                          </span>
                          <button
                            onClick={() => setDetailQty(detailQty + 1)}
                            className="px-3 py-1.5 text-gray-700 font-black hover:bg-gray-200 transition cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* PINCODE CHECKER */}
                      <div className="space-y-2 pt-3 border-t border-gray-100">
                        <span className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1">
                          <Truck className="w-4 h-4 text-red-600" /> Check Courier Delivery:
                        </span>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            value={pincodeCheck}
                            onChange={(e) => setPincodeCheck(e.target.value.replace(/\D/g, ''))}
                            placeholder="Enter 6-digit Pincode"
                            className="flex-1 px-3 py-2 text-xs font-bold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                          <button
                            onClick={() => {
                              if (pincodeCheck.length === 6) {
                                setPincodeStatus({
                                  msg: `Free Express Delivery for ${pincodeCheck}! Estimated arrival in 2-3 Days via SpeedPost.`,
                                  success: true
                                });
                              } else {
                                setPincodeStatus({
                                  msg: 'Please enter a valid 6-digit pincode',
                                  success: false
                                });
                              }
                            }}
                            className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-black rounded-xl transition cursor-pointer"
                          >
                            Check
                          </button>
                        </div>

                        {pincodeStatus && (
                          <p className={`text-[11px] font-bold ${pincodeStatus.success ? 'text-emerald-700 bg-emerald-50' : 'text-red-600 bg-red-50'} p-2 rounded-lg border ${pincodeStatus.success ? 'border-emerald-200' : 'border-red-200'}`}>
                            {pincodeStatus.msg}
                          </p>
                        )}
                      </div>

                      {/* DESKTOP BUY NOW & ADD TO CART BUTTONS */}
                      <div className="hidden lg:block space-y-2.5 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => {
                            const res = previewResource;
                            setPreviewResource(null);
                            addToCart(res, detailFormat, true, detailQty);
                          }}
                          className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-2xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer transform active:scale-98"
                        >
                          <ShoppingBag className="w-4 h-4 text-amber-300" />
                          <span>BUY NOW (₹{((
                            detailFormat === 'Digital E-Book'
                              ? Math.max(49, (previewResource.price || 199) - 50)
                              : detailFormat === 'Hardcover Edition'
                              ? (previewResource.price || 199) + 80
                              : (previewResource.price || 199)
                          ) * detailQty)})</span>
                        </button>

                        <button
                          onClick={() => {
                            addToCart(previewResource, detailFormat, false, detailQty);
                          }}
                          className="w-full py-3 px-4 bg-gray-900 hover:bg-black text-white font-black text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <ShoppingCart className="w-4 h-4 text-amber-400" />
                          <span>ADD TO CART</span>
                        </button>
                      </div>

                      {/* TRUST GUARANTEES */}
                      <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2 text-[11px]">
                        <div className="flex items-center gap-2 text-gray-700 font-bold">
                          <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
                          <span>100% Genuine Print & Verified Material</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 font-bold">
                          <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Free Shipping on Orders Above ₹499</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 font-bold">
                          <RefreshCw className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>7-Day Easy Damage Replacement Guarantee</span>
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

                {/* RECOMMENDED PRODUCTS SECTION */}
                <div className="pt-8 border-t border-gray-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-red-600 block">
                        RECOMMENDED FOR YOUR PREPARATION
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-gray-900">
                        Popular Related Books in {previewResource.category}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {FREE_RESOURCES.filter(r => r.id !== previewResource.id && (r.category === previewResource.category || r.type === previewResource.type)).slice(0, 3).map((rec) => (
                      <div 
                        key={rec.id}
                        onClick={() => setPreviewResource(rec)}
                        className="p-3 rounded-2xl bg-white border border-gray-200 hover:border-red-300 shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-2 group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-12 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                            <img src={rec.coverImage || rec.images?.[0]} alt={rec.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-extrabold text-red-600 uppercase block line-clamp-1">{rec.badge}</span>
                            <h4 className="text-xs font-black text-gray-900 group-hover:text-red-600 transition line-clamp-2 leading-tight">{rec.title}</h4>
                            <div className="text-xs font-black text-red-600 pt-0.5">₹{rec.price || 199}</div>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(rec, 'Paperback Edition', false, 1);
                          }}
                          className="w-full py-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-700 text-[11px] font-black rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ShoppingCart className="w-3 h-3" /> Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* MOBILE FIXED BOTTOM ACTION BAR */}
              <div className="lg:hidden shrink-0 border-t border-gray-200 bg-white p-3 px-4 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] flex items-center justify-between gap-3">
                <div className="flex flex-col shrink-0">
                  <div className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
                    {detailFormat === 'Paperback Edition' ? 'Paperback' : detailFormat === 'Hardcover Edition' ? 'Hardcover' : 'E-Book'} ({detailQty}x)
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-red-600">
                      ₹{((
                        detailFormat === 'Digital E-Book'
                          ? Math.max(49, (previewResource.price || 199) - 50)
                          : detailFormat === 'Hardcover Edition'
                          ? (previewResource.price || 199) + 80
                          : (previewResource.price || 199)
                      ) * detailQty)}
                    </span>
                    <span className="text-[10px] text-gray-400 line-through font-bold">
                      ₹{(previewResource.originalPrice || 499) * detailQty}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-1 justify-end">
                  <button
                    onClick={() => {
                      addToCart(previewResource, detailFormat, false, detailQty);
                    }}
                    className="py-2.5 px-3 bg-gray-900 hover:bg-black text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-md"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-amber-300" />
                    <span>Add</span>
                  </button>

                  <button
                    onClick={() => {
                      const res = previewResource;
                      setPreviewResource(null);
                      addToCart(res, detailFormat, true, detailQty);
                    }}
                    className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer flex-1 active:scale-98"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9. FLOATING MOBILE STICKY CART BAR */}
      {totalCartItemCount > 0 && !isCartOpen && !isCheckoutOpen && !previewResource && (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-red-700 text-white p-3 rounded-2xl shadow-2xl border-2 border-amber-300 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-amber-400 text-red-950 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-md">
                {totalCartItemCount}
              </div>
              <div>
                <span className="text-xs font-black block">Cart: ₹{grandTotal || cartSubtotal}</span>
                <span className="text-[10px] text-amber-200 font-bold flex items-center gap-1">
                  <Truck className="w-3 h-3 text-amber-300" /> Free Dispatch
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-red-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer transform active:scale-95 transition shrink-0"
            >
              <ShoppingCart className="w-4 h-4 text-red-950" />
              <span>Checkout →</span>
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
};
