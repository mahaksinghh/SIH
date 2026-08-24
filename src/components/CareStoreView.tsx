import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Check,
  CreditCard,
  ShieldCheck,
  Truck,
  Leaf,
  Info,
  Sparkles,
  Search,
  Zap,
  Flame,
  Pill,
  HeartHandshake,
  Activity,
  Layers,
  Star,
  Eye,
  X,
  Clock,
  Award,
  CheckCircle2,
  Tag,
  ArrowRight,
  PackageCheck,
  HelpCircle,
  MapPin,
  Bike,
  Radio,
  Store,
  Navigation,
} from 'lucide-react';
import { CartItem, LanguageCode, Product, User, DeliveryPartner, VillageDarkStore } from '../types';
import { SEED_PRODUCTS, SEED_DELIVERY_PARTNERS, SEED_VILLAGE_DARK_STORES } from '../data/seedData';
import { getTranslation } from '../services/translations';
import { VillageQuickDeliveryMap } from './VillageQuickDeliveryMap';

interface CareStoreViewProps {
  currentUser: User | null;
  currentLanguage: LanguageCode;
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onCheckout: () => void;
}

export const CareStoreView: React.FC<CareStoreViewProps> = ({
  currentUser,
  currentLanguage,
  cart,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onCheckout,
}) => {
  const [products] = useState<Product[]>(SEED_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Delivery Partner State
  const [selectedDeliveryPartner, setSelectedDeliveryPartner] = useState<DeliveryPartner>(SEED_DELIVERY_PARTNERS[0]);
  const [showDeliveryMapModal, setShowDeliveryMapModal] = useState<boolean>(false);

  // Cart Drawer & Checkout State
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'address' | 'partner' | 'payment' | 'success'>('cart');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Checkout address & payment
  const [addressForm, setAddressForm] = useState({
    fullName: currentUser?.name || 'Sunita Sharma',
    phone: currentUser?.phone || '+91 98765 43210',
    villageOrStreet: 'Ward 4, Govindgarh Road',
    district: currentUser?.district || 'Jaipur Rural',
    state: currentUser?.state || 'Rajasthan',
    pincode: '303702',
  });

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'CARD'>('UPI');
  const [orderTrackingId, setOrderTrackingId] = useState<string>('STR-RUR-9021');

  const t = (key: string) => getTranslation(currentLanguage, key);

  const categories = [
    { id: 'all', label: 'All Products', icon: Sparkles, count: products.length },
    { id: 'nutrition_supplements', label: 'Period Tablets & Nutrition', icon: Pill, count: products.filter(p => p.category === 'nutrition_supplements').length },
    { id: 'pain_relief', label: 'Cramp Comfort & Hot Bags', icon: Flame, count: products.filter(p => p.category === 'pain_relief').length },
    { id: 'smart_devices', label: 'Smart Care Devices', icon: Zap, count: products.filter(p => p.category === 'smart_devices').length },
    { id: 'biodegradable_pads', label: 'Bio-Organic & Anion Pads', icon: Leaf, count: products.filter(p => p.category === 'biodegradable_pads').length },
    { id: 'reusable_cloth_pads', label: 'Reusable Cloth & Underwear', icon: Layers, count: products.filter(p => p.category === 'reusable_cloth_pads').length },
    { id: 'menstrual_cups', label: 'Menstrual Cups', icon: HeartHandshake, count: products.filter(p => p.category === 'menstrual_cups').length },
    { id: 'intimate_hygiene', label: 'Intimate Cleaners & Wipes', icon: ShieldCheck, count: products.filter(p => p.category === 'intimate_hygiene').length },
  ];

  // Filtering & Sorting
  const filteredProducts = products
    .filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tag && p.tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.features?.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const priceA = a.priceInr || a.price;
      const priceB = b.priceInr || b.price;
      if (sortBy === 'price_low') return priceA - priceB;
      if (sortBy === 'price_high') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // Default order
    });

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.priceInr || item.product.price) * item.quantity, 0);
  const discountAmount = Math.round((cartSubtotal * appliedDiscount) / 100);
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  const handleApplyCoupon = () => {
    setCouponError(null);
    setCouponSuccess(null);
    const code = couponCode.trim().toUpperCase();
    if (code === 'STREESURE20' || code === 'CARE20') {
      setAppliedDiscount(20);
      setCouponSuccess('20% StreeSure Wellness Discount applied!');
    } else if (code === 'RURALCARE' || code === 'ASHA50') {
      setAppliedDiscount(25);
      setCouponSuccess('25% Grassroots Rural Subsidy Coupon applied!');
    } else {
      setCouponError('Invalid coupon code. Try STREESURE20 or RURALCARE');
    }
  };

  const handlePlaceOrder = () => {
    const randomId = 'STR-' + Math.floor(100000 + Math.random() * 900000);
    setOrderTrackingId(randomId);
    setCheckoutStep('success');
    onCheckout();
  };

  const handleCloseCart = () => {
    setShowCartDrawer(false);
    setCheckoutStep('cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Banner */}
      <div className="glass-blossom-glow rounded-3xl p-6 sm:p-10 border border-rose-500/25 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Subsidized Grassroots Menstrual & Period Care</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            StreeSure Care Store
          </h1>
          <p className="text-xs sm:text-sm text-rose-100/80 leading-relaxed">
            Essential herbal period pain tablets, soothing rechargeable hot bags, continuous heat patches, TENS pulse stimulators, bio-organic pads, and medical-grade cups subsidized for affordable rural and community access.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-rose-300/80 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              AYUSH & FDA Approved Essentials
            </span>
            <span className="flex items-center gap-1">
              <Truck className="w-4 h-4 text-teal-400" />
              Free Rural PHC Delivery
            </span>
            <span className="flex items-center gap-1">
              <Leaf className="w-4 h-4 text-pink-400" />
              100% Rash-Free & Eco-Certified
            </span>
          </div>
        </div>

        {/* View Cart Pill */}
        <div className="relative z-10 flex flex-col items-start md:items-end gap-2">
          <button
            type="button"
            id="btn-open-cart-drawer"
            onClick={() => {
              setShowCartDrawer(true);
              setCheckoutStep('cart');
            }}
            className="flex items-center gap-3 px-6 py-3.5 rounded-2xl btn-berry-primary text-xs sm:text-sm font-bold shadow-xl hover:scale-105 transition-all"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-white" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-amber-400 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
            </div>
            <span>View Care Cart</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-lg font-mono font-black text-white">
              ₹{cartTotal}
            </span>
          </button>
          <span className="text-[11px] text-rose-300/70">
            Cash on Delivery & Instant UPI Available
          </span>
        </div>
      </div>

      {/* 2. Blinkit & Zepto Village Quick-Delivery Network Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-950/90 via-purple-950/70 to-slate-950 border border-pink-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-pink-900/50 shrink-0">
            <Bike className="w-6 h-6 animate-bounce duration-1000" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-pink-300 border border-rose-500/40 flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400 animate-ping" />
                Zepto & Blinkit Rural Quick Hubs Active
              </span>
              <span className="text-[11px] text-emerald-400 font-bold">
                ⚡ 15–25 Mins Doorstep Delivery in Villages
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white">
              Rural Micro-Dark Stores Delivering Tablets, Hot Bags, Patches & Pads
            </h3>
            <p className="text-xs text-rose-200/70">
              Discreet, tamper-proof packaging delivered to remote hamlets, farms, and village homes via electric bikes & ASHA Sanginis.
            </p>
          </div>
        </div>

        <button
          type="button"
          id="btn-open-village-map"
          onClick={() => setShowDeliveryMapModal(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-black shadow-lg shadow-rose-950/60 flex items-center gap-2 shrink-0 transition hover:scale-102"
        >
          <Navigation className="w-4 h-4 text-white animate-spin duration-3000" />
          <span>View Village Dark-Stores & Live GPS Route</span>
        </button>
      </div>

      {/* 3. Medical Transparency & Usage Notice */}
      <div className="glass-blossom-card p-4 rounded-2xl border border-rose-500/20 text-xs text-rose-200/80 flex items-start gap-3">
        <Info className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p>
            <strong className="text-white">Healthcare & Safety Guidance:</strong> Products available in the StreeSure Care Store include herbal pain supplements, thermal heating aids, smart electrotherapy units, and hygienic disposables designed for cycle comfort. They are not intended to replace formal prescription medical therapies for severe clinical conditions.
          </p>
          <p className="text-[11px] text-rose-300/70">
            For unmanageable pelvic pain or suspected severe endometriosis, please consult our verified gynecologists via the Tele-Consultation tab.
          </p>
        </div>
      </div>

      {/* 3. Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-rose-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="store-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tablets, hot bags, patches, pads, devices..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#170c22] border border-rose-500/25 text-white placeholder-rose-300/40 text-xs focus:outline-none focus:border-rose-400 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-rose-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort Dropdown & Item Count */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3 text-xs">
          <span className="text-rose-300/70 whitespace-nowrap">
            Showing <strong className="text-white">{filteredProducts.length}</strong> items
          </span>
          <div className="flex items-center gap-2">
            <span className="text-rose-300/70">Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-[#170c22] border border-rose-500/25 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-rose-400 cursor-pointer"
            >
              <option value="featured">Featured / Recommended</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Category Tabs Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              id={`category-tab-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'btn-berry-primary shadow-md shadow-rose-900/40 scale-105'
                  : 'bg-[#150a1e] border border-rose-500/20 text-rose-200 hover:bg-rose-500/10 hover:border-rose-500/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-pink-400'}`} />
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/25 text-white' : 'bg-rose-950/60 text-rose-300'}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 5. Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="glass-blossom-card rounded-3xl p-12 text-center space-y-3">
          <ShoppingBag className="w-12 h-12 text-rose-400/50 mx-auto" />
          <h3 className="text-lg font-bold text-white">No products found</h3>
          <p className="text-xs text-rose-200/70 max-w-sm mx-auto">
            Try adjusting your search query or select another category above.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-full btn-berry-primary text-xs font-bold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => {
            const inCart = cart.find((i) => i.product.id === prod.id);
            const price = prod.priceInr || prod.price;

            return (
              <div
                key={prod.id}
                id={`product-card-${prod.id}`}
                className="glass-blossom-card rounded-3xl p-4 border border-rose-500/20 hover:border-rose-400/50 transition-all flex flex-col justify-between group hover:-translate-y-1 shadow-lg"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="relative mb-3.5 overflow-hidden rounded-2xl bg-[#09030e] aspect-4/3">
                    <img
                      src={prod.imageUrl || prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                    {/* Top-Left Tag / Subsidy Badge */}
                    {prod.tag && (
                      <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md">
                        {prod.tag}
                      </span>
                    )}

                    {/* Top-Right Eco/Medical Badge */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
                      {prod.ecoFriendly && (
                        <span className="bg-teal-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                          <Leaf className="w-2.5 h-2.5" /> Eco
                        </span>
                      )}
                    </div>

                    {/* Quick View Button on Hover */}
                    <button
                      type="button"
                      onClick={() => setQuickViewProduct(prod)}
                      className="absolute inset-x-3 bottom-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-rose-200 text-xs font-bold backdrop-blur-xs flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-md"
                    >
                      <Eye className="w-3.5 h-3.5 text-pink-400" />
                      <span>Quick Details</span>
                    </button>
                  </div>

                  {/* Rating & Review Count */}
                  <div className="flex items-center justify-between text-[11px] text-rose-300/80 mb-1.5">
                    <div className="flex items-center gap-1 text-amber-300 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{prod.rating || 4.8}</span>
                      <span className="text-rose-300/50 font-normal">
                        ({prod.reviewCount || 210})
                      </span>
                    </div>
                    {prod.isSubsidized && (
                      <span className="text-emerald-400 font-semibold text-[10px]">
                        Subsidized Rate
                      </span>
                    )}
                  </div>

                  {/* Product Title & Short Description */}
                  <h3 className="text-sm font-bold text-white mb-1.5 line-clamp-2 leading-snug group-hover:text-rose-200 transition">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-rose-200/70 mb-3 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>

                  {/* Key Feature Pills */}
                  {prod.features && prod.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {prod.features.slice(0, 2).map((feat, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20 truncate max-w-full"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price & Action Row */}
                <div className="pt-3 border-t border-rose-500/20 flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-white font-mono">
                        ₹{price}
                      </span>
                      {prod.originalPrice && (
                        <span className="text-xs text-rose-300/50 line-through font-mono">
                          ₹{prod.originalPrice}
                        </span>
                      )}
                    </div>
                    {prod.discountPercent && (
                      <span className="text-[10px] font-bold text-emerald-400 block">
                        {prod.discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Cart Action Buttons */}
                  {inCart ? (
                    <div className="flex items-center gap-1.5 bg-[#170a20] border border-rose-500/40 rounded-2xl p-1">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(prod.id, inCart.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-200 flex items-center justify-center transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-5 text-center text-white">
                        {inCart.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(prod.id, inCart.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-200 flex items-center justify-center transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      id={`btn-add-to-cart-${prod.id}`}
                      onClick={() => onAddToCart(prod)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl btn-berry-primary text-xs font-bold shadow-md hover:scale-105 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. QUICK VIEW / PRODUCT DETAILS MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="glass-blossom-card bg-[#140a1d] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-rose-500/30 p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 text-rose-300 hover:text-white p-2 rounded-full bg-rose-950/60 hover:bg-rose-900 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Product Image */}
              <div className="space-y-3">
                <img
                  src={quickViewProduct.imageUrl || quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full aspect-square rounded-2xl object-cover border border-rose-500/30"
                />
                <div className="flex items-center gap-2 text-xs text-rose-300/80">
                  <Truck className="w-4 h-4 text-teal-400" />
                  <span>Dispatched via PHC / ASHA node within 48 hrs</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <div>
                  {quickViewProduct.tag && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[10px] font-bold mb-1.5">
                      {quickViewProduct.tag}
                    </span>
                  )}
                  <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                    {quickViewProduct.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center gap-1 text-amber-300 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{quickViewProduct.rating || 4.8}</span>
                    </div>
                    <span className="text-xs text-rose-300/60">
                      ({quickViewProduct.reviewCount || 240} verified reviews)
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white font-mono">
                    ₹{quickViewProduct.priceInr || quickViewProduct.price}
                  </span>
                  {quickViewProduct.originalPrice && (
                    <span className="text-sm text-rose-300/50 line-through font-mono">
                      ₹{quickViewProduct.originalPrice}
                    </span>
                  )}
                  {quickViewProduct.discountPercent && (
                    <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/15">
                      {quickViewProduct.discountPercent}% OFF Subsidized
                    </span>
                  )}
                </div>

                <p className="text-xs text-rose-200/80 leading-relaxed">
                  {quickViewProduct.description}
                </p>

                {/* Features List */}
                {quickViewProduct.features && (
                  <div className="space-y-1.5 pt-2 border-t border-rose-500/20">
                    <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider block">
                      Key Highlights
                    </span>
                    <ul className="space-y-1 text-xs text-rose-200/80">
                      {quickViewProduct.features.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Usage Instructions */}
                {quickViewProduct.usageInstructions && (
                  <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/20 space-y-1">
                    <span className="text-[11px] font-bold text-rose-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-pink-400" />
                      How to Use & Dosage
                    </span>
                    <p className="text-xs text-rose-200/70 leading-relaxed">
                      {quickViewProduct.usageInstructions}
                    </p>
                  </div>
                )}

                {/* Safety Certifications */}
                {quickViewProduct.safetyCertifications && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {quickViewProduct.safetyCertifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-teal-500/15 text-teal-300 border border-teal-500/30 flex items-center gap-1"
                      >
                        <Award className="w-3 h-3 text-teal-300" />
                        {cert}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 border-t border-rose-500/20 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart(quickViewProduct);
                      setQuickViewProduct(null);
                      setShowCartDrawer(true);
                    }}
                    className="flex-1 py-3 rounded-2xl btn-berry-primary text-xs font-bold shadow-lg flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Care Cart</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickViewProduct(null)}
                    className="px-4 py-3 rounded-2xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/30 text-rose-200 text-xs font-bold transition"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. CART DRAWER & CHECKOUT FLOW */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#12071a] border-l border-rose-500/30 w-full max-w-lg h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Top Bar */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-rose-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Your Care Cart
                    </h3>
                    <span className="text-[11px] text-rose-300/70">
                      {cart.length} unique item{cart.length === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCloseCart}
                  className="p-1.5 rounded-full bg-rose-950/60 text-rose-300 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step Flow Indicators */}
              <div className="flex items-center justify-between py-3 px-1 border-b border-rose-500/10 text-[10px] sm:text-[11px] font-bold overflow-x-auto">
                <span className={checkoutStep === 'cart' ? 'text-pink-400 underline underline-offset-4' : 'text-rose-300/50'}>
                  1. Items
                </span>
                <span>→</span>
                <span className={checkoutStep === 'address' ? 'text-pink-400 underline underline-offset-4' : 'text-rose-300/50'}>
                  2. Address
                </span>
                <span>→</span>
                <span className={checkoutStep === 'partner' ? 'text-pink-400 underline underline-offset-4' : 'text-rose-300/50'}>
                  3. Partner
                </span>
                <span>→</span>
                <span className={checkoutStep === 'payment' ? 'text-pink-400 underline underline-offset-4' : 'text-rose-300/50'}>
                  4. Payment
                </span>
              </div>

              {/* STEP 1: CART ITEMS */}
              {checkoutStep === 'cart' && (
                <div className="space-y-4 py-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                      <ShoppingBag className="w-12 h-12 text-rose-400/40 mx-auto" />
                      <p className="text-xs text-rose-200/60">
                        Your care cart is currently empty.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowCartDrawer(false)}
                        className="px-4 py-2 rounded-full btn-berry-primary text-xs font-bold"
                      >
                        Explore Essentials
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-rose-500/15 space-y-3 max-h-[45vh] overflow-y-auto pr-1">
                      {(cart || []).map((item) => (
                        <div key={item.product.id} className="pt-3 flex items-start justify-between gap-3">
                          <img
                            src={item.product.imageUrl || item.product.image}
                            alt={item.product.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-rose-500/20 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white line-clamp-1">
                              {item.product.name}
                            </h4>
                            <div className="flex items-baseline gap-2 text-xs mt-0.5">
                              <span className="font-bold text-pink-400 font-mono">
                                ₹{item.product.priceInr || item.product.price}
                              </span>
                              <span className="text-[10px] text-rose-300/50">
                                × {item.quantity} = ₹
                                {(item.product.priceInr || item.product.price) * item.quantity}
                              </span>
                            </div>
                            {item.product.tag && (
                              <span className="text-[9px] text-emerald-400 font-semibold block">
                                {item.product.tag}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1 shrink-0 bg-[#1e0e2a] border border-rose-500/30 rounded-xl p-1">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 rounded-md text-rose-300 hover:text-white hover:bg-rose-500/20 transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 rounded-md text-rose-300 hover:text-white hover:bg-rose-500/20 transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onRemoveFromCart(item.product.id)}
                              className="p-1 rounded-md text-rose-400 hover:text-rose-200 hover:bg-rose-900/40 ml-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Coupon Code Box */}
                  {cart.length > 0 && (
                    <div className="pt-3 border-t border-rose-500/20 space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Coupon: STREESURE20 or RURALCARE"
                          className="flex-1 px-3 py-2 rounded-xl bg-[#1a0c24] border border-rose-500/30 text-white placeholder-rose-300/40 text-xs focus:outline-none focus:border-rose-400 font-mono uppercase"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold border border-rose-500/40 transition"
                        >
                          Apply
                        </button>
                      </div>
                      {couponSuccess && (
                        <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                          <Check className="w-3 h-3" /> {couponSuccess}
                        </p>
                      )}
                      {couponError && (
                        <p className="text-[11px] text-rose-400">
                          {couponError}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: ADDRESS */}
              {checkoutStep === 'address' && (
                <div className="space-y-3.5 py-4">
                  <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                    Rural / Village Delivery Address
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="text-[11px] text-rose-200/70 block mb-1">
                        Recipient Full Name
                      </label>
                      <input
                        type="text"
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#1a0c24] border border-rose-500/30 text-white focus:outline-none focus:border-rose-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-rose-200/70 block mb-1">
                        Mobile Phone (For ASHA / Delivery Updates)
                      </label>
                      <input
                        type="text"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#1a0c24] border border-rose-500/30 text-white focus:outline-none focus:border-rose-400 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-rose-200/70 block mb-1">
                        Village / Ward / Street Address
                      </label>
                      <input
                        type="text"
                        value={addressForm.villageOrStreet}
                        onChange={(e) => setAddressForm({ ...addressForm, villageOrStreet: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#1a0c24] border border-rose-500/30 text-white focus:outline-none focus:border-rose-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-rose-200/70 block mb-1">
                          District / City
                        </label>
                        <input
                          type="text"
                          value={addressForm.district}
                          onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-[#1a0c24] border border-rose-500/30 text-white focus:outline-none focus:border-rose-400"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-rose-200/70 block mb-1">
                          PIN Code
                        </label>
                        <input
                          type="text"
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-[#1a0c24] border border-rose-500/30 text-white focus:outline-none focus:border-rose-400 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: DELIVERY PARTNER SELECTION (Blinkit / Zepto / ASHA / Drone) */}
              {checkoutStep === 'partner' && (
                <div className="space-y-3.5 py-4">
                  <div>
                    <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center justify-between">
                      <span>Select Village Delivery Partner</span>
                      <span className="text-[10px] text-emerald-400 lowercase font-normal">
                        ⚡ Quick Village Commerce
                      </span>
                    </h4>
                    <p className="text-[11px] text-rose-200/70 mt-1">
                      Choose your preferred rural delivery fleet or community healthcare runner.
                    </p>
                  </div>

                  <div className="space-y-2.5 max-h-[48vh] overflow-y-auto pr-1 text-xs">
                    {SEED_DELIVERY_PARTNERS.map((partner) => {
                      const isSelected = selectedDeliveryPartner.id === partner.id;
                      return (
                        <div
                          key={partner.id}
                          onClick={() => setSelectedDeliveryPartner(partner)}
                          className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-2.5 ${
                            isSelected
                              ? 'bg-rose-950/70 border-pink-500 shadow-md ring-1 ring-pink-500/40'
                              : 'bg-[#1a0c24] border-rose-500/20 hover:bg-rose-900/30'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <img
                                src={partner.riderPhoto}
                                alt={partner.riderName}
                                className="w-11 h-11 rounded-xl object-cover border border-rose-500/40 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-white">
                                    {partner.partnerLabel}
                                  </span>
                                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-pink-500/20 text-pink-300 border border-pink-500/30">
                                    {partner.logoBadge}
                                  </span>
                                </div>
                                <p className="text-[11px] text-rose-200/80">
                                  Rider: <strong className="text-white">{partner.riderName}</strong> ({partner.vehicleType})
                                </p>
                              </div>
                            </div>

                            {/* Speed / ETA */}
                            <div className="text-right shrink-0">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 block">
                                ⚡ {partner.estimatedTime || `${partner.estimatedMinutes} Mins`}
                              </span>
                              <span className="text-[10px] text-rose-300/60 font-mono mt-0.5 block">
                                {partner.distanceKm} km away
                              </span>
                            </div>
                          </div>

                          {/* Highlights */}
                          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-rose-500/15 text-rose-300/80">
                            <span className="flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-400" />
                              {partner.discreetPackaging !== false ? 'Discreet Tamper-Proof' : 'Eco-Bag'}
                            </span>
                            <span className="text-amber-300 font-bold">
                              ★ {partner.rating} ({partner.totalDeliveries}+)
                            </span>
                            <span className="text-emerald-400 font-bold">
                              {(partner.deliveryFeeInr ?? partner.deliveryFee) === 0 ? 'FREE' : `₹${partner.deliveryFeeInr ?? partner.deliveryFee}`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: PAYMENT METHOD */}
              {checkoutStep === 'payment' && (
                <div className="space-y-4 py-4">
                  <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                    Select Payment Mode
                  </h4>
                  <div className="space-y-2 text-xs">
                    <label
                      onClick={() => setPaymentMethod('UPI')}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition ${
                        paymentMethod === 'UPI'
                          ? 'bg-rose-500/20 border-pink-400 text-white'
                          : 'bg-[#1a0c24] border-rose-500/20 text-rose-200/80 hover:bg-rose-500/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <div>
                          <span className="font-bold block">Instant UPI (GPay / PhonePe / Paytm)</span>
                          <span className="text-[10px] text-rose-300/60">Simulated QR Code & Fast Confirmation</span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'UPI'}
                        onChange={() => setPaymentMethod('UPI')}
                      />
                    </label>

                    <label
                      onClick={() => setPaymentMethod('COD')}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition ${
                        paymentMethod === 'COD'
                          ? 'bg-rose-500/20 border-pink-400 text-white'
                          : 'bg-[#1a0c24] border-rose-500/20 text-rose-200/80 hover:bg-rose-500/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Truck className="w-4 h-4 text-emerald-400" />
                        <div>
                          <span className="font-bold block">Cash on Delivery (COD)</span>
                          <span className="text-[10px] text-rose-300/60">Pay at local PHC or to ASHA Facilitator</span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                      />
                    </label>

                    <label
                      onClick={() => setPaymentMethod('CARD')}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition ${
                        paymentMethod === 'CARD'
                          ? 'bg-rose-500/20 border-pink-400 text-white'
                          : 'bg-[#1a0c24] border-rose-500/20 text-rose-200/80 hover:bg-rose-500/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <CreditCard className="w-4 h-4 text-purple-400" />
                        <div>
                          <span className="font-bold block">RuPay / Debit / Credit Card</span>
                          <span className="text-[10px] text-rose-300/60">100% Encrypted & Subsidized Portal</span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'CARD'}
                        onChange={() => setPaymentMethod('CARD')}
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 5: ORDER SUCCESS */}
              {checkoutStep === 'success' && (
                <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-900/50">
                    <PackageCheck className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-emerald-400 font-bold tracking-wider uppercase">
                      Order Confirmed #{orderTrackingId}
                    </span>
                    <h3 className="text-xl font-extrabold text-white">
                      Dispatched to {selectedDeliveryPartner.partnerLabel}!
                    </h3>
                    <p className="text-xs text-rose-200/70 max-w-xs mx-auto">
                      Your period care package is packed and out for delivery. Rider {selectedDeliveryPartner.riderName} is en route.
                    </p>
                  </div>

                  {/* Rider Summary card */}
                  <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/20 text-xs text-left space-y-2">
                    <div className="flex justify-between text-rose-200/80">
                      <span>Delivery Partner:</span>
                      <strong className="text-white flex items-center gap-1.5">
                        <span>{selectedDeliveryPartner.partnerLabel}</span>
                        <span className="text-[10px] text-pink-300">({selectedDeliveryPartner.riderName})</span>
                      </strong>
                    </div>
                    <div className="flex justify-between text-rose-200/80">
                      <span>Expected ETA:</span>
                      <span className="text-emerald-400 font-bold font-mono">⚡ {selectedDeliveryPartner.estimatedTime || `${selectedDeliveryPartner.estimatedMinutes} Mins`}</span>
                    </div>
                    <div className="flex justify-between text-rose-200/80">
                      <span>Destination:</span>
                      <span className="text-white text-right">{addressForm.villageOrStreet}, {addressForm.district}</span>
                    </div>
                  </div>

                  {/* Open Live GPS Map Tracker */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowCartDrawer(false);
                      setShowDeliveryMapModal(true);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-black shadow-xl shadow-rose-950/60 flex items-center justify-center gap-2 hover:scale-102 transition"
                  >
                    <Navigation className="w-4 h-4 text-white animate-spin duration-3000" />
                    <span>Track Live Village Delivery Partner on Map</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCloseCart}
                    className="w-full py-2.5 rounded-2xl bg-rose-950/50 hover:bg-rose-900/50 text-rose-300 text-xs font-bold transition"
                  >
                    Return to Store
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Summary & Actions (When not in success state) */}
            {checkoutStep !== 'success' && cart.length > 0 && (
              <div className="pt-4 border-t border-rose-500/20 space-y-3">
                {/* Cost Calculation */}
                <div className="space-y-1 text-xs text-rose-200/70">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono text-white font-bold">₹{cartSubtotal}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Subsidy Discount ({appliedDiscount}%):</span>
                      <span className="font-mono">-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Village Delivery ({selectedDeliveryPartner.partnerLabel}):</span>
                    <span className="text-emerald-400 font-bold">
                      {(selectedDeliveryPartner.deliveryFeeInr ?? selectedDeliveryPartner.deliveryFee ?? 0) === 0 ? 'FREE' : `₹${selectedDeliveryPartner.deliveryFeeInr ?? selectedDeliveryPartner.deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-rose-500/20">
                    <span>Total Amount:</span>
                    <span className="font-mono text-lg text-pink-400">₹{cartTotal + (selectedDeliveryPartner.deliveryFeeInr ?? selectedDeliveryPartner.deliveryFee ?? 0)}</span>
                  </div>
                </div>

                {/* Step Action Buttons */}
                {checkoutStep === 'cart' && (
                  <button
                    type="button"
                    id="btn-proceed-to-address"
                    onClick={() => setCheckoutStep('address')}
                    className="w-full py-3.5 rounded-2xl btn-berry-primary text-xs font-bold shadow-lg flex items-center justify-center gap-2 hover:scale-102 transition"
                  >
                    <span>Proceed to Delivery Address</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {checkoutStep === 'address' && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('cart')}
                      className="px-4 py-3 rounded-2xl bg-rose-950/60 text-rose-300 text-xs font-bold border border-rose-500/30"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      id="btn-proceed-to-partner"
                      onClick={() => setCheckoutStep('partner')}
                      className="flex-1 py-3 rounded-2xl btn-berry-primary text-xs font-bold shadow-lg flex items-center justify-center gap-2"
                    >
                      <span>Select Delivery Partner</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {checkoutStep === 'partner' && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('address')}
                      className="px-4 py-3 rounded-2xl bg-rose-950/60 text-rose-300 text-xs font-bold border border-rose-500/30"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      id="btn-proceed-to-payment"
                      onClick={() => setCheckoutStep('payment')}
                      className="flex-1 py-3 rounded-2xl btn-berry-primary text-xs font-bold shadow-lg flex items-center justify-center gap-2"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {checkoutStep === 'payment' && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('partner')}
                      className="px-4 py-3 rounded-2xl bg-rose-950/60 text-rose-300 text-xs font-bold border border-rose-500/30"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      id="btn-confirm-order"
                      onClick={handlePlaceOrder}
                      className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 hover:scale-102 transition"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirm Order (₹{cartTotal + (selectedDeliveryPartner.deliveryFeeInr ?? selectedDeliveryPartner.deliveryFee ?? 0)})</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. FULL-SCREEN VILLAGE QUICK-DELIVERY & GPS ROUTE MODAL */}
      {showDeliveryMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto">
            <VillageQuickDeliveryMap
              orderId={orderTrackingId}
              selectedPartner={selectedDeliveryPartner}
              orderedItems={cart}
              deliveryAddress={{
                fullName: addressForm.fullName,
                phone: addressForm.phone,
                villageOrStreet: addressForm.villageOrStreet,
                district: addressForm.district,
                pincode: addressForm.pincode,
              }}
              totalAmount={cartTotal + selectedDeliveryPartner.deliveryFeeInr}
              onClose={() => setShowDeliveryMapModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

