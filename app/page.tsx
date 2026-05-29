'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Reveal from '@/components/Reveal';
import ListingCard from '@/components/ListingCard';
import { useEffect, useMemo, useState } from 'react';
import AIChat from './components/AIChat';
import { supabase } from '@/lib/supabase';
import type { Listing } from '@/lib/types';
import type { User } from '@supabase/supabase-js';
import {
  FaArrowLeft, FaArrowRight, FaBolt, FaCamera, FaChevronRight,
  FaGamepad, FaLaptop, FaMobileAlt, FaRocket,
  FaShieldAlt, FaShoppingCart, FaStopwatch, FaSyncAlt,
  FaTshirt, FaCar, FaHome, FaTv, FaBook, FaBaby,
  FaDog, FaTools, FaFutbol,
} from 'react-icons/fa';

const heroSlides = [
  {
    title: 'Buy & Sell Electronics & Gadgets',
    description: 'Discover premium electronics and connected devices across Bangladesh with a smart marketplace experience.',
    cta: 'Browse Now',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=80',
    tag: 'Electronics',
  },
  {
    title: 'Find the Best Smartphone Deals',
    description: 'Browse the latest mobile devices, accessories, and verified sellers near you.',
    cta: 'Browse Mobiles',
    image: 'https://images.unsplash.com/photo-1512499617640-c2f99912e96f?auto=format&fit=crop&w=1600&q=80',
    tag: 'Mobiles',
  },
  {
    title: 'Sell Your Item Fast with Confidence',
    description: 'Post anything from furniture to vehicles and reach buyers instantly with trusted listings.',
    cta: 'Post Item',
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80',
    tag: 'Fast Sale',
  },
];

const categories = [
  { icon: <FaLaptop />, name: 'Electronics', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80', accent: 'from-cyan-500 to-sky-600' },
  { icon: <FaMobileAlt />, name: 'Mobiles', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80', accent: 'from-fuchsia-500 to-pink-600' },
  { icon: <FaGamepad />, name: 'Gaming', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80', accent: 'from-amber-500 to-orange-600' },
  { icon: <FaCamera />, name: 'Cameras', image: 'https://images.unsplash.com/photo-1519183071298-a2962d048b1f?auto=format&fit=crop&w=900&q=80', accent: 'from-violet-500 to-indigo-600' },
  { icon: <FaTshirt />, name: 'Clothing', image: 'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=900&q=80', accent: 'from-lime-500 to-emerald-600' },
  { icon: <FaStopwatch />, name: 'Wearables', image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=900&q=80', accent: 'from-sky-500 to-blue-600' },
  { icon: <FaCar />, name: 'Cars', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80', accent: 'from-red-500 to-rose-600' },
  { icon: <FaHome />, name: 'Land & Property', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80', accent: 'from-yellow-500 to-amber-600' },
  { icon: <FaTv />, name: 'Furniture', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80', accent: 'from-teal-500 to-cyan-600' },
  { icon: <FaBook />, name: 'Books', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80', accent: 'from-blue-500 to-indigo-600' },
  { icon: <FaBaby />, name: 'Baby Items', image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80', accent: 'from-pink-500 to-rose-600' },
  { icon: <FaDog />, name: 'Pets & Cattle', image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80', accent: 'from-green-500 to-teal-600' },
  { icon: <FaTools />, name: 'Tools', image: 'https://images.unsplash.com/photo-1519974719765-e6559eac2575?auto=format&fit=crop&w=900&q=80', accent: 'from-orange-500 to-red-600' },
  { icon: <FaFutbol />, name: 'Sports', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80', accent: 'from-emerald-500 to-green-600' },
];

const featureCards = [
  { label: 'Fast Connection', icon: <FaBolt />, description: 'Connect with sellers instantly.' },
  { label: 'Secure Platform', icon: <FaShieldAlt />, description: 'Safe and trusted marketplace.' },
  { label: 'AI Assistant', icon: <FaRocket />, description: 'Get help from our AI anytime.' },
  { label: 'Easy Posting', icon: <FaSyncAlt />, description: 'Post your item in minutes.' },
];

const marketplaceCategories = [
  'Electronics', 'Mobiles', 'Cars', 'Land & Property', 'Clothing',
  'Furniture', 'Books', 'Baby Items', 'Pets & Cattle', 'Tools',
  'Sports', 'Gaming', 'Cameras', 'Wearables', 'Other',
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [viewType, setViewType] = useState<'all' | 'single' | 'used'>('all');
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // User + Role fetch
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
        setUserRole(profile?.role ?? null);
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setUserRole(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Listings fetch
  const fetchListings = async () => {
    setListingsLoading(true);
    let query = supabase.from('listings').select('*').eq('is_sold', false);
    if (categoryFilter) query = query.eq('category', categoryFilter);
    if (viewType === 'single') query = query.eq('type', 'single');
    if (viewType === 'used') query = query.eq('condition', 'used');
    if (conditionFilter) query = query.eq('condition', conditionFilter);
    if (search) query = query.ilike('title', '%' + search + '%');
    const { data } = await query.order('created_at', { ascending: false });
    setListings(data || []);
    setListingsLoading(false);
  };

  // Hero auto slide
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

  return (
    <main className="min-h-screen overflow-hidden text-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            key={activeHero.image}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image
              src={activeHero.image}
              alt={activeHero.title}
              fill sizes="100vw"
              className="object-cover opacity-60"
              priority
            />
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black" />

        <div className="relative px-8 py-24 lg:py-32 max-w-7xl mx-auto">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-center">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
                {activeHero.tag}<FaChevronRight className="text-xs" />
              </span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-5xl md:text-6xl xl:text-7xl font-black leading-tight text-white"
              >
                {activeHero.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="max-w-2xl text-lg text-zinc-200"
              >
                {activeHero.description}
              </motion.p>

              <div className="flex flex-wrap items-center gap-4">
                <a href="#marketplace" className="btn-primary px-6 py-3.5 text-base md:text-lg rounded-2xl">
                  Browse now <FaChevronRight />
                </a>

                {/* Role based button */}
                {!user && (
                  <Link href="/login" className="btn-ghost px-6 py-3.5 text-base md:text-lg rounded-2xl">
                    Login to Sell
                  </Link>
                )}
                {user && userRole === 'seller' && (
                  <Link href="/seller/dashboard/add-product" className="btn-ghost px-6 py-3.5 text-base md:text-lg rounded-2xl">
                    Post a Listing
                  </Link>
                )}
                {user && userRole === 'buyer' && (
                  <Link href="/buyer/home" className="btn-ghost px-6 py-3.5 text-base md:text-lg rounded-2xl">
                    My Dashboard
                  </Link>
                )}
              </div>
            </div>

            {/* Feature Cards */}
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                {featureCards.slice(0, 2).map((f) => (
                  <motion.div key={f.label} whileHover={{ y: -6 }}
                    className="rounded-[32px] border border-zinc-700 bg-zinc-900/90 p-6">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500 text-black text-lg">{f.icon}</div>
                    <h3 className="text-lg font-bold mb-1 text-white">{f.label}</h3>
                    <p className="text-zinc-300 text-sm">{f.description}</p>
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-5">
                {featureCards.slice(2).map((f) => (
                  <motion.div key={f.label} whileHover={{ y: -6 }}
                    className="rounded-[32px] border border-zinc-700 bg-zinc-900/90 p-6">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500 text-black text-lg">{f.icon}</div>
                    <h3 className="text-lg font-bold mb-1 text-white">{f.label}</h3>
                    <p className="text-zinc-300 text-sm">{f.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Slide Controls */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              onClick={() => setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
              className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-zinc-600 bg-black/70 text-xl text-white hover:border-green-400 transition-all"
            >
              <FaArrowLeft />
            </button>
            {heroSlides.map((_, index) => (
              <button key={index} onClick={() => setActiveSlide(index)}
                className={`h-3 w-3 rounded-full transition-all ${activeSlide === index ? 'bg-green-400' : 'bg-zinc-600'}`}
              />
            ))}
            <button
              onClick={() => setActiveSlide((prev) => (prev + 1) % heroSlides.length)}
              className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-zinc-600 bg-black/70 text-xl text-white hover:border-green-400 transition-all"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* ── Marketplace ── */}
      <section id="marketplace" className="px-4 md:px-8 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="section-title">Marketplace</h2>
            <p className="section-subtitle">Real products from real people across Bangladesh</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-2 rounded-xl border border-white/10 bg-zinc-900/80 p-1 overflow-x-auto">
              {(['all', 'single', 'used'] as const).map((type) => (
                <button key={type} onClick={() => setViewType(type)}
                  className={`px-3 md:px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                    viewType === type
                      ? type === 'used' ? 'bg-amber-500 text-zinc-950' : 'bg-emerald-500 text-zinc-950'
                      : 'text-zinc-300 hover:text-white'
                  }`}>
                  {type === 'all' ? 'All Products' : type === 'single' ? 'Single Items' : 'Used Goods'}
                </button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <input
                placeholder="Search products..."
                className="bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 md:px-5 py-2 md:py-3 flex-1 outline-none focus:border-green-400 placeholder-zinc-500 text-sm md:text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 md:px-5 py-2 md:py-3 outline-none text-sm md:text-base"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {marketplaceCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                className="bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 md:px-5 py-2 md:py-3 outline-none text-sm md:text-base"
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
              >
                <option value="">All Conditions</option>
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
            </div>
          </div>

          {/* Listings Grid */}
          {listingsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-zinc-800 animate-pulse" />
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <Reveal key={listing.id} className="">
                  <ListingCard listing={listing} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="text-center mt-16 py-12 border border-zinc-800 rounded-2xl px-4">
              <FaShoppingCart className="text-5xl md:text-6xl text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400 text-lg md:text-xl mb-2">No products found</p>
              <p className="text-zinc-600 mb-6 text-sm md:text-base">Be the first to post a product!</p>
              {!user && (
                <Link href="/login">
                  <button className="bg-green-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-green-400">
                    Login to Sell
                  </button>
                </Link>
              )}
              {user && userRole === 'seller' && (
                <Link href="/seller/dashboard/add-product">
                  <button className="bg-green-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-green-400">
                    Start Selling
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Categories ── */}
      <section id="categories" className="px-4 md:px-8 py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">All Categories</h2>
          <p className="text-zinc-400 mb-12 text-sm md:text-base">Browse by category to find exactly what you need</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-3 md:gap-4">
            {categories.map((cat) => (
              <motion.div key={cat.name} whileHover={{ y: -8 }}
                onClick={() => {
                  setCategoryFilter(cat.name);
                  document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition-all cursor-pointer"
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/45" />
                  <div className="absolute left-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-black text-xl shadow-lg">
                    {cat.icon}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                    <p className="text-sm uppercase tracking-[0.2em] text-zinc-300">Category</p>
                    <h3 className="text-lg font-bold text-white">{cat.name}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" className="border-t border-zinc-800 mt-20 px-4 md:px-8 py-16">
        <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-green-400 mb-4">Smart MarketBD</h2>
            <p className="text-zinc-400 text-sm md:text-base">Bangladesh&apos;s premier buy &amp; sell marketplace.</p>
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-5 text-white">Quick Links</h3>
            <div className="flex flex-col gap-3 text-zinc-400 text-sm md:text-base">
              <a href="#" className="hover:text-green-400">Home</a>
              <a href="#marketplace" className="hover:text-green-400">Marketplace</a>
              <a href="#categories" className="hover:text-green-400">Categories</a>
              <Link href="/hot-deals" className="hover:text-green-400">🔥 Hot Deals</Link>
              <Link href="/used-goods" className="hover:text-green-400">♻️ Used Goods</Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-5 text-white">Categories</h3>
            <div className="flex flex-col gap-3 text-zinc-400 text-sm md:text-base">
              {marketplaceCategories.slice(0, 6).map((c) => (
                <a key={c} href="#categories" className="hover:text-green-400">{c}</a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-5 text-white">Newsletter</h3>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 md:px-5 py-3 md:py-4 outline-none mb-4 placeholder-zinc-500 text-sm md:text-base"
            />
            <button className="w-full bg-green-500 hover:bg-green-400 text-black py-3 md:py-4 rounded-xl font-bold transition-all">
              Subscribe
            </button>
          </div>
        </div>
        <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-zinc-500 text-xs md:text-sm">
          © 2026 Smart MarketBD — All Rights Reserved | Developed by Forhad Rahman Sagor
        </div>
      </footer>

      {/* AI Chat - সবার জন্য */}
      <AIChat />
    </main>
  );
}