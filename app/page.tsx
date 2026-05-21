"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import RobotCursor from "./components/RobotCursor";

import {
  FaArrowLeft,
  FaArrowRight,
  FaBolt,
  FaCamera,
  FaChevronRight,
  FaGamepad,
  FaHeart,
  FaLaptop,
  FaMobileAlt,
  FaRocket,
  FaSearch,
  FaShieldAlt,
  FaShoppingCart,
  FaStar,
  FaStopwatch,
  FaSyncAlt,
  FaTshirt,
} from "react-icons/fa";

const heroSlides = [
  {
    title: "AI-powered shopping for every need",
    description:
      "Discover premium gadgets, fashion and lifestyle deals with immersive visuals and smart recommendations.",
    cta: "Shop the Future",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80",
    tag: "New Arrivals",
  },
  {
    title: "Your style, your way",
    description:
      "Curated fashion drops with limited edition collections and bold design statements.",
    cta: "Browse Fashion",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80",
    tag: "Exclusive",
  },
  {
    title: "Powerful gear for next-gen gamers",
    description:
      "Level up your setup with performance hardware, immersive lighting and unbeatable deals.",
    cta: "Explore Gaming",
    image:
      "https://images.unsplash.com/photo-1538481143235-5d630028e4a6?auto=format&fit=crop&w=1600&q=80",
    tag: "Hot Drop",
  },
];

const categories = [
  { icon: <FaLaptop />, name: "Laptops", accent: "from-cyan-500 to-sky-600" },
  { icon: <FaMobileAlt />, name: "Mobiles", accent: "from-fuchsia-500 to-pink-600" },
  { icon: <FaGamepad />, name: "Gaming", accent: "from-amber-500 to-orange-600" },
  { icon: <FaCamera />, name: "Cameras", accent: "from-violet-500 to-indigo-600" },
  { icon: <FaTshirt />, name: "Fashion", accent: "from-lime-500 to-emerald-600" },
  { icon: <FaStopwatch />, name: "Wearables", accent: "from-sky-500 to-blue-600" },
];

const featureCards = [
  {
    label: "Fast Delivery",
    icon: <FaBolt />,
    description: "Same-day shipping on top-tier products.",
  },
  {
    label: "Secure Payments",
    icon: <FaShieldAlt />,
    description: "Encrypted checkout with global trust.",
  },
  {
    label: "Smart Support",
    icon: <FaRocket />,
    description: "24/7 expert help for every order.",
  },
  {
    label: "Easy Returns",
    icon: <FaSyncAlt />,
    description: "Hassle-free returns and exchanges.",
  },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const activeHero = useMemo(() => heroSlides[activeSlide], [activeSlide]);

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <RobotCursor />
      <nav className="flex flex-wrap items-center justify-between gap-4 px-8 py-5 border-b border-zinc-800 sticky top-0 bg-black/90 backdrop-blur-xl z-50">
        <h1 className="text-3xl font-black tracking-tight text-green-400">Smart MarketBD</h1>

        <div className="hidden md:flex items-center gap-8 text-lg font-medium">
          <a href="#" className="hover:text-green-400 transition-all">
            Home
          </a>
          <a href="#products" className="hover:text-green-400 transition-all">
            Products
          </a>
          <a href="#categories" className="hover:text-green-400 transition-all">
            Categories
          </a>
          <a href="#contact" className="hover:text-green-400 transition-all">
            Contact
          </a>
        </div>

        <div className="flex items-center gap-4">
          <button className="rounded-full border border-zinc-800 p-3 hover:border-green-400 transition-all">
            <FaSearch className="text-xl" />
          </button>
          <button className="rounded-full border border-zinc-800 p-3 hover:border-green-400 transition-all">
            <FaShoppingCart className="text-xl" />
          </button>
          <button className="bg-green-500 hover:bg-green-400 px-5 py-2 rounded-2xl font-bold transition-all">
            Login
          </button>
        </div>
      </nav>

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
              fill
              sizes="100vw"
              className="object-cover opacity-80"
            />
          </motion.div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/95"></div>

        <div className="relative px-8 py-24 lg:py-32 max-w-7xl mx-auto">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-center">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-green-500 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-300">
                {activeHero.tag}
                <FaChevronRight className="text-xs" />
              </span>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-5xl md:text-6xl xl:text-7xl font-black leading-tight"
              >
                {activeHero.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="max-w-2xl text-lg text-zinc-300"
              >
                {activeHero.description}
              </motion.p>

              <div className="flex flex-wrap items-center gap-4">
                <button className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-400 px-8 py-4 rounded-3xl text-lg font-bold transition-all shadow-2xl shadow-green-500/10">
                  {activeHero.cta}
                  <FaChevronRight />
                </button>
                <button className="inline-flex items-center gap-3 border border-zinc-700 hover:border-green-400 px-8 py-4 rounded-3xl text-lg font-bold transition-all">
                  Discover Deals
                </button>
              </div>
            </div>

            <div className="space-y-5 lg:space-y-6">
              <div className="grid grid-cols-2 gap-5">
                {featureCards.slice(0, 2).map((feature) => (
                  <motion.div
                    key={feature.label}
                    whileHover={{ y: -6 }}
                    className="rounded-[32px] border border-zinc-800 bg-zinc-950/80 p-8 shadow-xl shadow-black/20"
                  >
                    <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-green-500 text-black">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.label}</h3>
                    <p className="text-zinc-400 text-sm">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-5">
                {featureCards.slice(2).map((feature) => (
                  <motion.div
                    key={feature.label}
                    whileHover={{ y: -6 }}
                    className="rounded-[32px] border border-zinc-800 bg-zinc-950/80 p-8 shadow-xl shadow-black/20"
                  >
                    <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-green-500 text-black">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.label}</h3>
                    <p className="text-zinc-400 text-sm">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
              className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-zinc-700 bg-black/70 text-xl text-white hover:border-green-400 transition-all"
            >
              <FaArrowLeft />
            </button>
            {heroSlides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`h-3 w-3 rounded-full transition-all ${
                  activeSlide === index ? "bg-green-400" : "bg-zinc-700"
                }`}
              />
            ))}
            <button
              onClick={() => setActiveSlide((prev) => (prev + 1) % heroSlides.length)}
              className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-zinc-700 bg-black/70 text-xl text-white hover:border-green-400 transition-all"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      </section>

      <section id="categories" className="px-8 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-5xl font-black">Top Categories</h2>
              <p className="text-zinc-400 mt-3 max-w-2xl">
                Browse premium categories curated for your next purchase.
              </p>
            </div>
            <button className="inline-flex items-center gap-2 text-green-400 font-bold hover:text-white transition-all">
              View all categories
              <FaChevronRight />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {categories.map((category) => (
              <motion.div
                key={category.name}
                whileHover={{ y: -8 }}
                className="rounded-[32px] border border-zinc-800 bg-zinc-950/70 p-8 shadow-xl shadow-black/10 transition-all hover:border-green-400"
              >
                <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${category.accent} text-3xl text-black`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-zinc-400 text-sm">
                  Premium picks, latest styles, and top-rated items for every category.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="px-8 py-24 bg-zinc-950/70">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-5xl font-black">Flash Sale</h2>
              <p className="text-zinc-400 mt-3 max-w-2xl">
                Catch limited-time offers on top devices with premium savings.
              </p>
            </div>
            <button className="rounded-full border border-zinc-700 px-7 py-3 text-green-400 font-semibold hover:border-green-400 transition-all">
              View all deals
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                name: "Premium Gaming Laptop",
                desc: "High performance machine with RGB power.",
                price: "৳120K",
                badge: "-40%",
                image:
                  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
              },
              {
                name: "Designer Smartwatch",
                desc: "Luxury wearable with health tracking.",
                price: "৳45K",
                badge: "-35%",
                image:
                  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
              },
              {
                name: "Pro Camera Kit",
                desc: "Capture every moment in vivid detail.",
                price: "৳78K",
                badge: "-28%",
                image:
                  "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=1000&q=80",
              },
            ].map((product) => (
              <motion.div
                key={product.name}
                whileHover={{ y: -10 }}
                className="rounded-[36px] border border-zinc-800 bg-zinc-900 overflow-hidden shadow-2xl shadow-black/20"
              >
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-6 top-6 flex items-center justify-between rounded-full bg-black/70 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                    <span>{product.badge}</span>
                    <FaHeart className="text-green-400" />
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 text-yellow-400 mb-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <FaStar key={index} />
                    ))}
                  </div>
                  <h3 className="text-3xl font-black mb-3">{product.name}</h3>
                  <p className="text-zinc-400 mb-6">{product.desc}</p>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-3xl font-black text-green-400">{product.price}</span>
                    <button className="rounded-3xl bg-green-500 px-6 py-3 font-bold uppercase tracking-wide text-black hover:bg-green-400 transition-all">
                      Buy Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-8 py-24">
        <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-6">
            <h2 className="text-5xl font-black">Featured Products</h2>
            <p className="text-zinc-400 max-w-2xl">
              Shop our top-rated items chosen for quality, style and performance.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  title: "iPhone Premium",
                  price: "৳89K",
                  image:
                    "https://images.unsplash.com/photo-1511707267537-b85faf00021e?auto=format&fit=crop&w=1000&q=80",
                },
                {
                  title: "Ultra Monitor",
                  price: "৳52K",
                  image:
                    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80",
                },
              ].map((product) => (
                <motion.div
                  key={product.title}
                  whileHover={{ y: -8 }}
                  className="rounded-[32px] border border-zinc-800 bg-zinc-950/80 overflow-hidden"
                >
                  <div className="relative h-72 w-full">
                    <Image src={product.image} alt={product.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{product.title}</h3>
                    <p className="text-zinc-400 mb-4">Flagship smartphone collection.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-green-400">{product.price}</span>
                      <button className="rounded-2xl bg-green-500 px-5 py-2 font-bold text-black hover:bg-green-400 transition-all">
                        Buy
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="rounded-[40px] border border-zinc-800 bg-gradient-to-br from-green-500/10 to-black/40 p-10 shadow-2xl shadow-black/20">
            <div className="mb-8 flex items-center justify-between rounded-3xl bg-black/60 p-6">
              <div>
                <p className="text-zinc-400 uppercase tracking-[0.3em] text-xs">Best Value</p>
                <h3 className="text-3xl font-black">Smart Market Picks</h3>
              </div>
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-green-500 text-black text-2xl">
                <FaShoppingCart />
              </div>
            </div>
            <div className="space-y-6">
              {[
                "Secure checkout with every order",
                "Free express shipping on selected items",
                "Premium customer support anytime",
              ].map((text) => (
                <div key={text} className="flex items-start gap-4">
                  <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-green-500 text-black">
                    <FaChevronRight />
                  </span>
                  <p className="text-zinc-300">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="border-t border-zinc-800 mt-20 px-8 py-16">
        <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-4">
          <div>
            <h2 className="text-3xl font-black text-green-400 mb-4">Smart MarketBD</h2>
            <p className="text-zinc-400">Premium futuristic online marketplace platform.</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-5">Quick Links</h3>
            <div className="flex flex-col gap-3 text-zinc-400">
              <a href="#">Home</a>
              <a href="#products">Products</a>
              <a href="#categories">Categories</a>
              <a href="#contact">Contact</a>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-5">Categories</h3>
            <div className="flex flex-col gap-3 text-zinc-400">
              <a href="#">Laptop</a>
              <a href="#">Gaming</a>
              <a href="#">Mobile</a>
              <a href="#">Fashion</a>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-5">Newsletter</h3>
            <input
              type="text"
              placeholder="Enter email"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-4 outline-none mb-4"
            />
            <button className="w-full bg-green-500 hover:bg-green-400 py-4 rounded-xl font-bold transition-all">
              Subscribe
            </button>
          </div>
        </div>
        <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-zinc-500">
          © 2026 Smart MarketBD — All Rights Reserved | Developed by Forhad Rahman Sagor
        </div>
      </footer>
    </main>
  );
}
