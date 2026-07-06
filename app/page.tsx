'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  rating: number;
  image: string;
  badge?: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Sonic Aura Headphones",
    category: "Audio",
    price: "₹299.00",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Chronos Watch",
    category: "Accessories",
    price: "₹189.00",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
    badge: "New",
  },
  {
    id: 3,
    name: "Optic Classic Sunglasses",
    category: "Eyewear",
    price: "₹145.00",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Veloce Sport Sneaker",
    category: "Footwear",
    price: "₹120.00",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80",
    badge: "Trending",
  },
  {
    id: 5,
    name: "Terra Trail Boots",
    category: "Footwear",
    price: "₹210.00",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    name: "Instant Snap Camera",
    category: "Photography",
    price: "₹99.00",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 7,
    name: "Retro Synth Radio",
    category: "Audio",
    price: "₹150.00",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&auto=format&fit=crop&q=80",
    badge: "Limited",
  },
  {
    id: 8,
    name: "Arcade Lounge Chair",
    category: "Furniture",
    price: "₹340.00",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 9,
    name: "Neo Kinetic Trainers",
    category: "Footwear",
    price: "₹135.00",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 10,
    name: "Aetheria Balancing Serum",
    category: "Skincare",
    price: "₹65.00",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 11,
    name: "Apex Ultra Laptop",
    category: "Computers",
    price: "₹1,299.00",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&auto=format&fit=crop&q=80",
    badge: "Hot Buy",
  },
  {
    id: 12,
    name: "Vantage Leather Duffel",
    category: "Luggage",
    price: "₹275.00",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=500&auto=format&fit=crop&q=80",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'profile' | 'search' | 'map' | 'pdf'>('profile');
  const [typedAddress, setTypedAddress] = useState('');
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'done'>('idle');
  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const [addedProduct, setAddedProduct] = useState<string | null>(null);

  const toggleLike = (id: number) => {
    setLikedProducts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addToCart = (productName: string) => {
    setAddedProduct(productName);
    setTimeout(() => setAddedProduct(null), 2000);
  };

  // Address Autocomplete simulation helper
  useEffect(() => {
    if (activeTab === 'search') {
      setTypedAddress('');
      let index = 0;
      const fullText = '1600 Amphitheatre Pkwy, Mountain View...';
      const interval = setInterval(() => {
        if (index < fullText.length) {
          setTypedAddress((prev) => prev + fullText.charAt(index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const triggerUpload = () => {
    if (uploadState === 'idle') {
      setUploadState('uploading');
      setTimeout(() => setUploadState('done'), 1500);
    } else {
      setUploadState('idle');
    }
  };

  const triggerPdfExport = () => {
    setIsPdfExporting(true);
    setTimeout(() => setIsPdfExporting(false), 2000);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between py-12 lg:py-20 overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      
      {/* Decorative Subtle Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/5 dark:bg-violet-600/10 blur-3xl pointer-events-none" />

      {/* Main Hero Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col items-center justify-center gap-12 lg:gap-16">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Animated Tech Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-200/50 bg-indigo-50/40 dark:border-indigo-900/30 dark:bg-indigo-950/20 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[18px] font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              Welcome to Shopflix 
            </span>
          </div>

          {/* Heading with Elegant Font Pairing */}
          <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-zinc-955 to-zinc-700 dark:from-zinc-50 dark:to-zinc-300 bg-clip-text text-transparent leading-none">
            Explore our Vast Collection of <br />
            <span className="bg-gradient-to-r from-indigo-500 via-violet-600 to-indigo-550 bg-clip-text text-transparent">
              Premium Products
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
           This is a mock minimalist dashboard.
          </p>

          {/* Call to Actions (CTAs) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-650 hover:to-violet-700 text-white text-sm font-semibold px-8 py-3.5 rounded-2xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              Get Started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
            
            <Link
              href="/pricing"
              className="w-full sm:w-auto flex justify-center items-center gap-2 border border-zinc-200/80 hover:border-zinc-350 dark:border-zinc-800 dark:hover:border-zinc-700 bg-white/40 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-900 backdrop-blur-sm text-zinc-700 dark:text-zinc-300 text-sm font-semibold px-8 py-3.5 rounded-2xl transition-all"
            >
              Pricing Plans
            </Link>
          </div>
        </div>

        {/* Product Showcase Section */}
        <section className="w-full max-w-7xl py-12 px-4 sm:px-6 lg:px-8 border-t border-zinc-200/40 dark:border-zinc-800/40 mt-6 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-200/30 bg-indigo-50/20 dark:border-indigo-900/20 dark:bg-indigo-950/10 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-650 dark:text-indigo-400">Featured Products</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Curated Design, Premium Quality
              </h2>
              <p className="text-sm text-zinc-550 dark:text-zinc-400 mt-2 max-w-xl">
                Explore our signature products crafted for ultimate style, durability, and functionality.
              </p>
            </div>
            {/* Optional category filters or quick stats */}
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <span className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-semibold">All Items</span>
              <span className="px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer">New Arrivals</span>
              <span className="px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer">Popular</span>
            </div>
          </div>

          {/* Product Grid */}
<div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl">
  {products.map((product) => (
    <Link key={product.id} href={`/products/${product.id}`}>
      <div className="group relative cursor-pointer bg-white dark:bg-zinc-900 rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">
        
        {/* Product Image */}
        <div className="relative overflow-hidden h-48 bg-zinc-100 dark:bg-zinc-800">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          {product.badge && (
            <span className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          <p className="text-xs text-gray-500">{product.category}</p>
          <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {product.rating}
            </span>
          </div>

          {/* Price & Like */}
          <div className="flex justify-between items-center pt-2 border-t border-zinc-200 dark:border-zinc-700">
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
              {product.price}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleLike(product.id);
                addToCart(product.name);
              }}
              className="text-lg transition"
            >
              {likedProducts.includes(product.id) ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  ))}
</div>
        </section>

        
           

        {/* Minimalist Grid-less Feature Highlights */}
        <div className="w-full max-w-4xl py-6 border-t border-zinc-200/50 dark:border-zinc-800/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1.5">
              <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold font-mono">01. PROFILE SETUP</span>
              <h3 className="font-heading text-sm font-bold text-zinc-900 dark:text-zinc-100">Custom Credentials</h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">Customize bio credentials and upload custom avatars dynamically.</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold font-mono">02. ADDRESS LOOKUP</span>
              <h3 className="font-heading text-sm font-bold text-zinc-900 dark:text-zinc-100">API Autocomplete</h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">Instantly validate geographical locations in milliseconds.</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold font-mono">03. MAP VISUALIZATION</span>
              <h3 className="font-heading text-sm font-bold text-zinc-900 dark:text-zinc-100">Interactive Layers</h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">Display location pins on dynamic open-source map markers.</p>
            </div>
            <div className="space-y-1.5">
              <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold font-mono">04. REPORTING</span>
              <h3 className="font-heading text-sm font-bold text-zinc-900 dark:text-zinc-100">PDF Summaries</h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">Export coordinate maps and profiles in a print-ready format.</p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[10px] tracking-wide text-zinc-400 dark:text-zinc-500 pt-12">
        &copy; {new Date().getFullYear()} Mini-Project Platform. All rights reserved. Built with minimalist design aesthetics.
      </footer>

      {/* Toast Notification */}
      <div 
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl shadow-2xl border border-zinc-800 dark:border-zinc-200 transition-all duration-300 ${
          addedProduct ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-indigo-500 dark:text-indigo-650">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <div className="text-xs font-semibold">
          Added <span className="underline">{addedProduct}</span> to cart!
        </div>
      </div>
    </div>
  );
}
