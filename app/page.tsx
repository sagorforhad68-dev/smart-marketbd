"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import RobotCursor from "./components/RobotCursor";
import AIChat from './components/AIChat';
import { supabase } from '@/lib/supabase';
import {
  FaArrowLeft, FaArrowRight, FaBolt, FaCamera, FaChevronRight,
  FaGamepad, FaHeart, FaLaptop, FaMobileAlt, FaRocket, FaSearch,
  FaShieldAlt, FaShoppingCart, FaStar, FaStopwatch, FaSyncAlt,
  FaTshirt, FaUser, FaCar, FaHome, FaTv, FaBook, FaBaby,
  FaDog, FaTools, FaFutbol,
} from "react-icons/fa";

const heroSlides = [
  {
    title: "Buy & Sell Anything in Bangladesh",
    description: "Connect buyers and sellers across Bangladesh. Post your product and reach thousands of buyers instantly.",
    cta: "Start Selling",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80",
    tag: "New Arrivals",
  },
  {
    title: "Find the Best Deals Near You",
    description: "Browse thousands of products posted by real sellers. New and used items available.",
    cta: "Browse Now",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80",
    tag: "Hot Deals",
  },
  {
    title: "Sell Your Single Item Fast",
    description: "Have just one item to sell? Post it here. Once sold, it disappears automatically.",
    cta: "Post Item",
    image: "https://images.unsplash.com/photo-1538481143235-5d630028e4a6?auto=format&fit=crop&w=1600&q=80",
    tag: "Quick Sale",
  },
];

const categories = [
  { icon: <FaLaptop />, name: "Electronics", accent: "from-cyan-500 to-sky-600" },
  { icon: <FaMobileAlt />, name: "Mobiles", accent: "from-fuchsia-500 to-pink-600" },
  { icon: <FaGamepad />, name: "Gaming", accent: "from-amber-500 to-orange-600" },
  { icon: <FaCamera />, name: "Cameras", accent: "from-violet-500 to-indigo-600" },
  { icon: <FaTshirt />, name: "Clothing", accent: "from-lime-500 to-emerald-600" },
  { icon: <FaStopwatch />, name: "Wearables", accent: "from-sky-500 to-blue-600" },
  { icon: <FaCar />, name: "Cars", accent: "from-red-500 to-rose-600" },
  { icon: <FaHome />, name: "Land & Property", accent: "from-yellow-500 to-amber-600" },
  { icon: <FaTv />, name: "Furniture", accent: "from-teal-500 to-cyan-600" },
  { icon: <FaBook />, name: "Books", accent: "from-blue-500 to-indigo-600" },
  { icon: <FaBaby />, name: "Baby Items", accent: "from-pink-500 to-rose-600" },
  { icon: <FaDog />, name: "Pets & Cattle", accent: "from-green-500 to-teal-600" },
  { icon: <FaTools />, name: "Tools", accent: "from-orange-500 to-red-600" },
  { icon: <FaFutbol />, name: "Sports", accent: "from-emerald-500 to-green-600" },
];

const featureCards = [
  { label: "Fast Connection", icon: <FaBolt />, description: "Connect with sellers instantly." },
  { label: "Secure Platform", icon: <FaShieldAlt />, description: "Safe and trusted marketplace." },
  { label: "AI Assistant", icon: <FaRocket />, description: "Get help from our AI anytime." },
  { label: "Easy Posting", icon: <FaSyncAlt />, description: "Post your item in minutes." },
];

const marketplaceCategories = [
  'Electronics', 'Mobiles', 'Cars', 'Land & Property', 'Clothing',
  'Furniture', 'Books', 'Baby Items', 'Pets & Cattle', 'Tools',
  'Sports', 'Gaming', 'Cameras', 'Wearables', 'Other'
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [listings, setListings] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [viewType, setViewType] = useState<'all' | 'single' | 'used'>('all');
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchListings = async () => {
    let query = supabase.from('listings').select('*').eq('is_sold', false);
    if (categoryFilter) query = query.eq('category', categoryFilter);
    if (viewType === 'single') query = query.eq('type', 'single');
    if (viewType === 'used') query = query.eq('condition', 'used');
    if (conditionFilter) query = query.eq('condition', conditionFilter);
    if (search) query = query.ilike('title', '%' + search + '%');
    const { data } = await query.order('created_at', { ascending: false });
    setListings(data || []);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchListings();
  }, [categoryFilter, conditionFilter, viewType, search]);

  const activeHero = useMemo(() => heroSlides[activeSlide], [activeSlide]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowDropdown(false);
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <RobotCursor />

      {/* Navbar */}
      <nav className="flex flex-wrap items-center justify-between gap-4 px-8 py-5 border-b border-zinc-800 sticky top-0 bg-black/90 backdrop-blur-xl z-50">
        <h1 className="text-3xl font-black tracking-tight text-green-400">Smart MarketBD</h1>
        <div className="hidden md:flex items-center gap-8 text-lg font-medium">
          <a href="#" className="hover:text-green-400 transition-all">Home</a>
          <a href="#marketplace" className="hover:text-green-400 transition-all">Marketplace</a>
          <a href="#categories" className="hover:text-green-400 transition-all">Categories</a>
          <Link href="/used-goods" className="hover:text-green-400 transition-all">Used Goods</Link>
          <a href="#contact" className="hover:text-green-400 transition-all">Contact</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="rounded-full border border-zinc-800 p-3 hover:border-green-400 transition-all">
            <FaSearch className="text-xl" />
          </button>
          <button className="rounded-full border border-zinc-800 p-3 hover:border-green-400 transition-all">
            <FaShoppingCart className="text-xl" />
          </button>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-2xl font-bold transition-all"
              >
                <FaUser />
                <span className="hidden md:block max-w-[100px] truncate">{user.email?.split('@')[0]}</span>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-zinc-700">
                    <p className="text-xs text-zinc-400">Logged in as</p>
                    <p className="text-sm font-bold text-green-400 truncate">{user.email}</p>
                  </div>
                  <Link href="/dashboard" onClick={() => setShowDropdown(false)}>
                    <div className="px-4 py-3 hover:bg-zinc-800 cursor-pointer">📊 Dashboard</div>
                  </Link>
                  <Link href="/post-listing" onClick={() => setShowDropdown(false)}>
                    <div className="px-4 py-3 hover:bg-zinc-800 cursor-pointer">➕ Post Product</div>
                  </Link>
                  <Link href="/settings" onClick={() => setShowDropdown(false)}>
                    <div className="px-4 py-3 hover:bg-zinc-800 cursor-pointer">⚙️ Settings</div>
                  </Link>
                  <div onClick={handleLogout} className="px-4 py-3 hover:bg-zinc-800 cursor-pointer text-red-400 border-t border-zinc-700">
                    🚪 Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button className="bg-green-500 hover:bg-green-400 text-black px-5 py-2 rounded-2xl font-bold transition-all">Login</button>
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div key={activeHero.image} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="absolute inset-0">
            <Image src={activeHero.image} alt={activeHero.title} fill sizes="100vw" className="object-cover opacity-60" />
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black"></div>
        <div className="relative px-8 py-24 lg:py-32 max-w-7xl mx-auto">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-center">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-green-500 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-300">
                {activeHero.tag}<FaChevronRight className="text-xs" />
              </span>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
                className="text-5xl md:text-6xl xl:text-7xl font-black leading-tight text-white">
                {activeHero.title}
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}
                className="max-w-2xl text-lg text-zinc-200">
                {activeHero.description}
              </motion.p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/post-listing">
                  <button className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-400 text-black px-8 py-4 rounded-3xl text-lg font-bold transition-all">
                    {activeHero.cta}<FaChevronRight />
                  </button>
                </Link>
                <a href="#marketplace">
                  <button className="inline-flex items-center gap-3 border border-zinc-400 text-white hover:border-green-400 px-8 py-4 rounded-3xl text-lg font-bold transition-all">
                    Browse Products
                  </button>
                </a>
              </div>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                {featureCards.slice(0,2).map((f) => (
                  <motion.div key={f.label} whileHover={{ y: -6 }} className="rounded-[32px] border border-zinc-700 bg-zinc-900/90 p-6">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500 text-black text-lg">{f.icon}</div>
                    <h3 className="text-lg font-bold mb-1 text-white">{f.label}</h3>
                    <p className="text-zinc-300 text-sm">{f.description}</p>
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-5">
                {featureCards.slice(2).map((f) => (
                  <motion.div key={f.label} whileHover={{ y: -6 }} className="rounded-[32px] border border-zinc-700 bg-zinc-900/90 p-6">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500 text-black text-lg">{f.icon}</div>
                    <h3 className="text-lg font-bold mb-1 text-white">{f.label}</h3>
                    <p className="text-zinc-300 text-sm">{f.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 flex items-center justify-center gap-4">
            <button onClick={() => setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
              className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-zinc-600 bg-black/70 text-xl text-white hover:border-green-400 transition-all">
              <FaArrowLeft />
            </button>
            {heroSlides.map((_, index) => (
              <button key={index} onClick={() => setActiveSlide(index)}
                className={`h-3 w-3 rounded-full transition-all ${activeSlide === index ? "bg-green-400" : "bg-zinc-600"}`} />
            ))}
            <button onClick={() => setActiveSlide((prev) => (prev + 1) % heroSlides.length)}
              className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-zinc-600 bg-black/70 text-xl text-white hover:border-green-400 transition-all">
              <FaArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Marketplace */}
      <section id="marketplace" className="px-8 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
            <div>
              <h2 className="text-5xl font-black text-white">Marketplace</h2>
              <p className="text-zinc-400 mt-2">Real products from real people in Bangladesh</p>
            </div>
            {user && (
              <Link href="/post-listing">
                <button className="bg-green-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-green-400">
                  + Post a Product
                </button>
              </Link>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="flex gap-2 bg-zinc-900 rounded-xl p-1 border border-zinc-700">
              <button onClick={() => setViewType('all')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${viewType==='all'?'bg-green-500 text-black':'text-zinc-300'}`}>
                All Products
              </button>
              <button onClick={() => setViewType('single')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${viewType==='single'?'bg-green-500 text-black':'text-zinc-300'}`}>
                Single Items
              </button>
              <button onClick={() => setViewType('used')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${viewType==='used'?'bg-yellow-500 text-black':'text-zinc-300'}`}>
                Used Goods
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input placeholder="Search products..."
              className="bg-zinc-900 border border-zinc-700 text-white rounded-xl px-5 py-3 flex-1 outline-none focus:border-green-400 placeholder-zinc-500"
              value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="bg-zinc-900 border border-zinc-700 text-white rounded-xl px-5 py-3 outline-none"
              value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">All Categories</option>
              {marketplaceCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="bg-zinc-900 border border-zinc-700 text-white rounded-xl px-5 py-3 outline-none"
              value={conditionFilter} onChange={(e) => setConditionFilter(e.target.value)}>
              <option value="">All Conditions</option>
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-green-400 transition-all">
                {listing.image_url ? (
                  <div className="relative h-48">
                    <Image src={listing.image_url} alt={listing.title} fill className="object-cover" sizes="300px" />
                  </div>
                ) : (
                  <div className="h-48 bg-zinc-800 flex items-center justify-center">
                    <FaShoppingCart className="text-4xl text-zinc-600" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded-full">{listing.category}</span>
                    {listing.condition === 'used' && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">Used</span>}
                    {listing.type === 'single' && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">Single</span>}
                  </div>
                  <h3 className="text-lg font-bold mb-1 text-white">{listing.title}</h3>
                  <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{listing.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-black text-xl">৳{listing.price}</span>
                    <a href={`tel:${listing.phone}`}
                      className="bg-green-500 text-black px-3 py-1 rounded-lg text-sm font-bold hover:bg-green-400">
                      Contact
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {listings.length === 0 && (
            <div className="text-center mt-16 py-16 border border-zinc-800 rounded-2xl">
              <FaShoppingCart className="text-6xl text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400 text-xl mb-2">No products found</p>
              <p className="text-zinc-600 mb-6">Be the first to post a product!</p>
              {user ? (
                <Link href="/post-listing">
                  <button className="bg-green-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-green-400">Post a Product</button>
                </Link>
              ) : (
                <Link href="/login">
                  <button className="bg-green-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-green-400">Login to Post</button>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="px-8 py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black mb-4 text-white">All Categories</h2>
          <p className="text-zinc-400 mb-12">Browse by category to find exactly what you need</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((cat) => (
              <motion.div key={cat.name} whileHover={{ y: -8 }}
                onClick={() => { setCategoryFilter(cat.name); document.getElementById('marketplace')?.scrollIntoView({behavior: 'smooth'}) }}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 hover:border-green-400 transition-all cursor-pointer text-center">
                <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.accent} text-xl text-black`}>
                  {cat.icon}
                </div>
                <h3 className="text-sm font-bold text-white">{cat.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-zinc-800 mt-20 px-8 py-16">
        <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-4">
          <div>
            <h2 className="text-3xl font-black text-green-400 mb-4">Smart MarketBD</h2>
            <p className="text-zinc-400">Bangladesh's premier buy & sell marketplace.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-5 text-white">Quick Links</h3>
            <div className="flex flex-col gap-3 text-zinc-400">
              <a href="#" className="hover:text-green-400">Home</a>
              <a href="#marketplace" className="hover:text-green-400">Marketplace</a>
              <a href="#categories" className="hover:text-green-400">Categories</a>
              <Link href="/used-goods" className="hover:text-green-400">Used Goods</Link>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-5 text-white">Categories</h3>
            <div className="flex flex-col gap-3 text-zinc-400">
              {marketplaceCategories.slice(0,6).map(c => (
                <a key={c} href="#categories" className="hover:text-green-400">{c}</a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-5 text-white">Newsletter</h3>
            <input type="email" placeholder="Enter your email"
              className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-5 py-4 outline-none mb-4 placeholder-zinc-500" />
            <button className="w-full bg-green-500 hover:bg-green-400 text-black py-4 rounded-xl font-bold transition-all">Subscribe</button>
          </div>
        </div>
        <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-zinc-500">
          © 2026 Smart MarketBD — All Rights Reserved | Developed by Forhad Rahman Sagor
        </div>
      </footer>

      <AIChat />
    </main>
  );
}