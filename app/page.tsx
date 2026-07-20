'use client';

import {useSession } from 'next-auth/react';
import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, ChevronRight, Eye, Star, Truck, Headphones, ShieldCheck, ArrowRight, X, Search, Sparkles, ShoppingBag} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  badge?: string;
  description: string;
  specs: Record<string, string>;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
}

interface Toast {
  id: number;
  message: string;
  type?: 'success' | 'info' | 'warning';
}


export default function Home() {
  const { data: session } = useSession();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);  
  const [favorites, setFavorites] = useState<number[]>([]);
  const [addedProduct, setAddedProduct] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [trendFilter, setTrendFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const productsSectionRef = useRef<HTMLDivElement>(null);
  const collectionsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      const data = await res.json();
      
      // Convert database products to match Product interface
      const formattedProducts = data.products?.map((p: any) => ({
        id: parseInt(p.id) || Math.random(),
        name: p.name,
        category: p.category,
        categorySlug: p.category.toLowerCase().replace(/\s+/g, '-'),
        price: p.price,
        rating: p.rating || 0,
        reviewsCount: p.reviews || 0,
        image: p.image || '',
        description: p.description || '',
        specs: {
          'Category': p.category,
          'Price': `$${p.price}`,
          'In Stock': p.inStock ? 'Yes' : 'No',
        },
        isBestSeller: false,
        isNewArrival: false,
      })) || [];
      
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch wishlist on mount
  useEffect(() => {
    if (session) {
      fetchWishlist();
    }
  }, [session]);

const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist', { credentials: 'include' });
      const data = await res.json();
      const ids = data.items?.map((item: any) => item.productId) || [];
      setWishlistIds(ids);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // add to cart /

  const addToCart = async (productId: string) => {
    if (!session) {
      alert('Please login first');
      return;
    }

    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (res.ok) {
        showToast('Added to cart!', 'success');
        
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

// wishlist toggle  

const toggleWishlist = async (productIdStr: string) => {
  if (!session) {
    showToast('Please login first', 'warning');
    return;
  }

  const isInWishlist = wishlistIds.includes(productIdStr);

  try {
    if (isInWishlist) {
      // Remove logic...
    } else {
      console.log('Adding to wishlist, productId:', productIdStr);  // ← ADD THIS
      
      const res = await fetch('/api/wishlist/add', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: productIdStr }),
      });

      const data = await res.json();
      console.log('Wishlist add response:', data);  // ← ADD THIS
    }
    fetchWishlist();
  } catch (error) {
    console.error('Error toggling wishlist:', error);
  }
};

// toast counter
  const toastCounterRef = useRef(0);
  // Toast trigger utility
  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = ++toastCounterRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Helper scroll function
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };




  // Filter products based on search and selected categories
  const filteredProducts = useMemo(() => {
  return products.filter(product => {
    const matchesCategory = categoryFilter === 'All' || product.categorySlug === categoryFilter.toLowerCase().replace(/\s+/g, '-');
    const matchesTrend = 
      trendFilter === 'All' || 
      (trendFilter === 'New Arrivals' && product.isNewArrival) ||
      (trendFilter === 'Best Sellers' && product.isBestSeller);
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesTrend && matchesSearch;
  });
}, [products, categoryFilter, trendFilter, searchQuery]);


  return (
    <div id="luxe-app" className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col selection:bg-[#6c2ce6]/20 relative overflow-x-hidden antialiased">
    
      
     
      

      {/* Main Hero Container */}
      <main className="relative min-h-[580px] md:h-[760px] flex items-center overflow-hidden">
        
        {/* Hero Section */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[4000ms] ease-out hover:scale-105"
          style={{ 
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC3akQD8Wzt78ji7Ogxn6SEmCK9omkyayl4mfqGU_jnJTb4pbaZpU8wS1fd1Qh2efNU9cF5tDTiC3xeVViaepeB8eEvOUFhuG8OnFt4V7CyHsU4CaSVIaNcGAuUTxMO1Eq91qXPF9--wOgjzobID-n4eyqKcaMJs6utDoWlpXCotOAmulQFdpnkgcQWghgj-QhEePblkuFI0LHjNYbHDprCcLmqrW6rWbDRlU-w3Y6WpiQ2t1ClYwTFFAVdCsJj5tOTt3jKLo1Q2ftl')" 
          }}
        />
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/40 md:bg-black/35" />

        <div className="relative z-10 px-6 md:px-16 max-w-7xl mx-auto w-full">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6 animate-fade-in">
              <Sparkles className="w-6 h-6 text-[#FFD700]" />
              <span className="text-xs font-semibold tracking-wider uppercase text-[#FFD700]">
                Luxury Premium Lifestyle</span>
            </div>
            
            <h1 className="font-bold text-4xl md:text-6xl mb-6 leading-tight tracking-tight drop-shadow-sm">
              Redefine Your Lifestyle
            </h1>
            <p className="text-base md:text-lg mb-8 opacity-95 leading-relaxed font-light drop-shadow-sm max-w-xl">
              Curated premium essentials for the modern professional. Experience the absolute pinnacle of design, rich functionality, and timeless material elegance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href='/products'
                className="bg-[#6c2ce6] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#6c2ce6]/95 transition-all shadow-lg hover:shadow-xl hover:shadow-[#6c2ce6]/25 transform active:scale-98 cursor-pointer flex items-center justify-center gap-2 group"
              >
                Shop Now
                
              </Link>
              <Link 
                href='/products'
                className="border border-white/50 text-white backdrop-blur-sm px-8 py-4 rounded-xl font-semibold hover:bg-white/15 transition-all cursor-pointer flex items-center justify-center"
              >
                Explore Collections
              </Link>
            </div>
          </div>
        </div>
        </main>

        {/* Product Showcase Section */}
       <section ref={collectionsSectionRef} className="py-20 px-4 md:px-16 max-w-7xl mx-auto w-full scroll-mt-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0b1c30]">Curated Collections</h2>
            <p className="text-[#45464d] text-base mt-2">Discover the perfect, handcrafted fit for your dynamic lifestyle.</p>
          </div>
          <button 
            onClick={() => {
              setCategoryFilter('All');
              scrollToSection(productsSectionRef);
              showToast('Showing all premium collections', 'info');
            }}
            className="text-[#6c2ce6] font-semibold text-sm flex items-center gap-1 hover:underline transition-all group cursor-pointer"
          >
            View All Categories 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Collection 1: Men */}
          <div className="relative group overflow-hidden rounded-2xl bg-white shadow-md border border-[#e5eeff] h-[480px]">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBkxhhGWsmbuAlts16NpatFcNOSn1r8wGFip5brujU8V1m_UNZLpxIzyoB7kaL_lKsFV45hz6X6Fo6DbA1GzimGMkaJOvU_A8XNm1G05uuK2-nuSyVZfH2E2EIVgeV28_EeFs0RPg4qQXzl_9REH-kmt_6iYoKZnf8CS0LA8U86o9B4nPpzH2Ogcr6npgZWlu2HiXkotOWA9IUdbdo8drc5FgfrH21C-LOdBx7KgChQSfEl7CDUwhOu1-X4FEhyPVuXBYOwqc6fKGVL')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#d0bcff] mb-1 block">Tailored for Excellence</span>
              <h3 className="text-2xl font-bold mb-1">Men</h3>
              <p className="text-white/80 text-sm mb-5 font-light">Crafted for structured style and sharp sophistication.</p>
              <button 
                onClick={() => {
                  setCategoryFilter('Apparel');
                  scrollToSection(productsSectionRef);
                  showToast('Filtered by Apparel category', 'info');
                }}
                className="bg-white text-[#0b1c30] px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#6c2ce6] hover:text-white transition-all transform active:scale-95 cursor-pointer shadow-md"
              >
                Shop Collection
              </button>
            </div>
          </div>

          {/* Collection 2: Women */}
          <div className="relative group overflow-hidden rounded-2xl bg-white shadow-md border border-[#e5eeff] h-[480px]">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAtgou-M8PwdJg-1vhekxstLtFduSHu8iPecYh0IFQrhx3sEWyya8BSx01vP7UUq4qnnU96UZORaD7fXMqF3TgQK1FmSj-q1vdlRoxxe6B4699sVYqe7JqwGy6sj4ZtuoMhY7wpc40yHnaIEtoYw6vn3qwGK0Os_tBjXjiGMSJrMPFIkmNUUE2c1WMucCIXvoX68wFMuZP1DNenyH0gGPaSGMFwdMTnPRuJuYLAtNuFcuwJDGp5TrA4wTHYgnVA4i5iX7bjiJ1SmKPM')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#d0bcff] mb-1 block">Effortless Sophistication</span>
              <h3 className="text-2xl font-bold mb-1">Women</h3>
              <p className="text-white/80 text-sm mb-5 font-light">Ethereal, high-grade fabrics designed for organic luxury.</p>
              <button 
                onClick={() => {
                  setCategoryFilter('Apparel');
                  scrollToSection(productsSectionRef);
                  showToast('Filtered by Apparel category', 'info');
                }}
                className="bg-white text-[#0b1c30] px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#6c2ce6] hover:text-white transition-all transform active:scale-95 cursor-pointer shadow-md"
              >
                Shop Collection
              </button>
            </div>
          </div>

          {/* Collection 3: Accessories */}
          <div className="relative group overflow-hidden rounded-2xl bg-white shadow-md border border-[#e5eeff] h-[480px]">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBL1zQtwWdp8lg8K2vXOV9dGLsVse3et56Mw3d6e8bfEL5lDSVyS1ez5WhNxqrSBH4ANMmCiBMcryoxk_DQAWwpapoJg3LgSvRjsvFle03XVhcXZbSZ0zo6NxFVr4jCf4-IEypzuzieDikWrUpvQbLdUiHy1jqLvxzVYQ4jIvqQ2TOV9PQYejFNmpsTlgEWnHSKfsS5Wd8iEQik6q3ceKR_124JsVJrscJ-p1sURX7tnhtNAJrripogP74QB5NvybTdbu24M86SgoaL')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#d0bcff] mb-1 block">The Finishing Touches</span>
              <h3 className="text-2xl font-bold mb-1">Accessories</h3>
              <p className="text-white/80 text-sm mb-5 font-light">Fine details engineered for functional elegance.</p>
              <button 
                onClick={() => {
                  setCategoryFilter('Accessories');
                  scrollToSection(productsSectionRef);
                  showToast('Filtered by Accessories', 'info');
                }}
                className="bg-white text-[#0b1c30] px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#6c2ce6] hover:text-white transition-all transform active:scale-95 cursor-pointer shadow-md"
              >
                Shop Collection
              </button>
            </div>
          </div>

        </div>
      </section>

        
           

        {/* Product List and Dynamic Grid Section */}
        <section ref={productsSectionRef} className="py-20 bg-[#eff4ff] scroll-mt-20">
        <div className="px-4 md:px-16 max-w-7xl mx-auto w-full">
          
          {/* Header and Category Filters */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6 border-b border-[#c6c6cd]/40 pb-6">
            <div>
              <h2 className="text-3xl font-bold text-[#0b1c30] flex items-center gap-2">
                Trending Now
                {searchQuery && <span className="text-sm font-normal text-[#45464d]">for "{searchQuery}"</span>}
              </h2>
              <p className="text-sm text-[#45464d] mt-1">Explore our hot-selling premium products and fresh luxury arrivals.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Trend Filters */}
              <button 
                onClick={() => setTrendFilter('All')}
                className={`px-5 py-2 rounded-full font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  trendFilter === 'All' 
                    ? 'bg-[#6c2ce6] text-white shadow-md' 
                    : 'bg-white border border-[#c6c6cd] text-[#45464d] hover:border-[#6c2ce6] hover:text-[#6c2ce6]'
                }`}
              >
                All Trend
              </button>
              <button 
                onClick={() => setTrendFilter('New Arrivals')}
                className={`px-5 py-2 rounded-full font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  trendFilter === 'New Arrivals' 
                    ? 'bg-[#6c2ce6] text-white shadow-md' 
                    : 'bg-white border border-[#c6c6cd] text-[#45464d] hover:border-[#6c2ce6] hover:text-[#6c2ce6]'
                }`}
              >
                New Arrivals
              </button>
              <button 
                onClick={() => setTrendFilter('Best Sellers')}
                className={`px-5 py-2 rounded-full font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  trendFilter === 'Best Sellers' 
                    ? 'bg-[#6c2ce6] text-white shadow-md' 
                    : 'bg-white border border-[#c6c6cd] text-[#45464d] hover:border-[#6c2ce6] hover:text-[#6c2ce6]'
                }`}
              >
                Best Sellers
              </button>
            </div>
          </div>

          {/* Sub-Category horizontal scroll bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-8 scrollbar-hide">
            {['All', 'Home', 'Electronics', 'Audio', 'Apparel', 'Accessories'].map(cat => (
              <button 
                key={cat}
                onClick={() => {
                  setCategoryFilter(cat);
                  showToast(`Selected Category: ${cat}`, 'info');
                }}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  categoryFilter === cat 
                    ? 'bg-[#131b2e] text-white' 
                    : 'bg-white text-[#45464d] hover:bg-white/80 border border-[#e5eeff]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
            {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center shadow-sm max-w-lg mx-auto border border-[#e5eeff]">
                  <div className="w-16 h-16 bg-[#eff4ff] rounded-full flex items-center justify-center mx-auto mb-4 text-[#6c2ce6]">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0b1c30]">No Products Found</h3>
                  <p className="text-[#45464d] text-sm mt-2">We couldn't find any premium essentials matching your current query or category filters.</p>
                  <button 
                    onClick={() => {
                      setCategoryFilter('All');
                      setTrendFilter('All');
                      setSearchQuery('');
                    }}
                    className="mt-6 bg-[#6c2ce6] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#6c2ce6]/90 transition-all cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map(product => {
                const isFavorite = favorites.includes(product.id);
                return (
                  <div 
                    key={product.id}
                    className="group bg-white rounded-2xl border border-[#c6c6cd]/50 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Image Area with badges */}
                    <div className="relative h-72 w-full overflow-hidden bg-slate-50">
                      {product.badge && (
                        <div className="absolute top-4 left-4 z-10 bg-[#6c2ce6] text-white text-[10px] font-bold px-3 py-1.5 rounded tracking-wider uppercase shadow-sm">
                          {product.badge}
                        </div>
                      )}
                      
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Backdrop Hover Mask */}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Wishlist Button */}
                      <button 
                        onClick={() => toggleWishlist(product.id.toString())}
                        className={`absolute top-4 right-4 z-10 p-2 rounded-full shadow-md backdrop-blur-md transition-all cursor-pointer ${
                          wishlistIds.includes(product.id.toString())
                            ? 'bg-rose-50 text-rose-500 hover:bg-rose-100' 
                            : 'bg-white/80 text-[#45464d] hover:bg-white hover:text-[#6c2ce6]'
                        }`}
                        title={wishlistIds.includes(product.id.toString()) ? "Remove from Wishlist" : "Add to Wishlist"}
                      >
                        <Heart className="w-4.5 h-4.5" fill={wishlistIds.includes(product.id.toString()) ? "currentColor" : "none"} />
                      </button>

                      {/* Floating Add to Cart Button (revealed on hover) */}
                      <div className="absolute bottom-4 left-4 right-4 flex gap-2 translate-y-14 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                        <button 
                          onClick={() => addToCart(product.id.toString())}
                          className="flex-1 bg-[#6c2ce6] text-white py-3 px-4 rounded-xl font-semibold text-xs hover:bg-[#6c2ce6]/90 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer transform active:scale-95"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Add to Cart
                        </button>
                        <button 
                          onClick={() => setSelectedProduct(product)}
                          className="bg-white text-[#0b1c30] p-3 rounded-xl hover:bg-[#eff4ff] transition-all shadow-md flex items-center justify-center cursor-pointer"
                          title="Quick View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Meta and Content */}
                    <div className="p-5 flex flex-col flex-grow justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[#45464d] text-xs font-semibold uppercase tracking-widest">{product.category}</span>
                          {product.isBestSeller && (
                            <span className="text-[10px] font-bold text-[#6c2ce6] bg-[#6c2ce6]/10 px-1.5 py-0.5 rounded">BEST SELLER</span>
                          )}
                        </div>
                        
                        <h4 
                          onClick={() => setSelectedProduct(product)}
                          className="font-bold text-lg text-[#0b1c30] mb-2 hover:text-[#6c2ce6] transition-colors cursor-pointer line-clamp-1"
                        >
                          {product.name}
                        </h4>

                        {/* Star Rating */}
                        <div className="flex items-center gap-1 mb-4">
                          <div className="flex text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star}
                                className={`w-3.5 h-3.5 ${star <= Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs text-[#45464d] font-medium">({product.reviewsCount})</span>
                        </div>
                      </div>

                      {/* Price and Action row */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#e5eeff]">
                        <p className="text-[#6c2ce6] font-bold text-xl">${product.price.toFixed(2)}</p>
                        <button 
                          onClick={() => setSelectedProduct(product)}
                          className="text-xs font-semibold text-[#0b1c30] hover:text-[#6c2ce6] flex items-center gap-0.5 cursor-pointer"
                        >
                          Details
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* Value Propositions Section */}
      <section className="py-20 px-4 md:px-16 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-[#eff4ff] transition-all duration-300">
            <div className="w-16 h-16 bg-[#854eff]/10 rounded-full flex items-center justify-center text-[#6c2ce6] mb-5">
              <Truck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#0b1c30] mb-2">Free Shipping</h3>
            <p className="text-[#45464d] text-sm leading-relaxed max-w-xs">
              Complimentary standard courier delivery on all premium orders over $150. Global priority shipping options are available.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-[#eff4ff] transition-all duration-300">
            <div className="w-16 h-16 bg-[#854eff]/10 rounded-full flex items-center justify-center text-[#6c2ce6] mb-5">
              <Headphones className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#0b1c30] mb-2">24/7 Support</h3>
            <p className="text-[#45464d] text-sm leading-relaxed max-w-xs">
              Our dedicated concierge team is available around the clock to assist you with order status, sizing, or product specifications.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-[#eff4ff] transition-all duration-300">
            <div className="w-16 h-16 bg-[#854eff]/10 rounded-full flex items-center justify-center text-[#6c2ce6] mb-5">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#0b1c30] mb-2">Secure Payments</h3>
            <p className="text-[#45464d] text-sm leading-relaxed max-w-xs">
              Industry-leading 256-bit encryption safeguards all financial transactions and private personal data on our luxury network.
            </p>
          </div>

        </div>
      </section>

      
      
      {/* Product Detail Modal Overlay */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 md:p-6" role="dialog" aria-modal="true">
          {/* Blur backdrop */}
          <div 
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
          />

          {/* Modal Container */}
          <div className="relative bg-white dark:bg-zinc-900 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2 border border-[#e5eeff] dark:border-zinc-800 animate-fade-in">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-20 p-2 text-[#45464d] bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700 hover:text-[#6c2ce6] hover:shadow-md rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Product Image Area */}
            <div className="relative h-64 md:h-full min-h-[320px] bg-slate-50 dark:bg-zinc-850">
              {selectedProduct.badge && (
                <div className="absolute top-4 left-4 z-10 bg-[#6c2ce6] text-white text-[10px] font-bold px-3 py-1.5 rounded tracking-wider uppercase">
                  {selectedProduct.badge}
                </div>
              )}
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Metadata & Purchasing Area */}
            <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
              <div>
                <span className="text-xs font-bold text-[#6c2ce6] uppercase tracking-widest block mb-1">{selectedProduct.category}</span>
                <h3 className="text-2xl md:text-3xl font-bold text-[#0b1c30] dark:text-white mb-3">{selectedProduct.name}</h3>

                {/* Rating & Review */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`w-4 h-4 ${star <= Math.floor(selectedProduct.rating) ? 'fill-current' : 'text-slate-200'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[#45464d] dark:text-zinc-300">{selectedProduct.rating.toFixed(1)} Stars</span>
                  <span className="text-xs text-slate-300">|</span>
                  <span className="text-xs font-semibold text-[#6c2ce6] underline hover:no-underline cursor-pointer">{selectedProduct.reviewsCount} verified reviews</span>
                </div>

                <p className="text-2xl font-bold text-[#6c2ce6] mb-5">${selectedProduct.price.toFixed(2)}</p>

                {/* Description */}
                <p className="text-sm text-[#45464d] dark:text-zinc-300 leading-relaxed mb-6 font-light">
                  {selectedProduct.description}
                </p>

                {/* Technical Specifications */}
                <div className="border-t border-[#e5eeff] dark:border-zinc-800 pt-4 mb-6 space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#0b1c30] dark:text-white mb-2">Specifications</h5>
                  {Object.entries(selectedProduct.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-xs py-1">
                      <span className="text-[#45464d] dark:text-zinc-400">{key}</span>
                      <span className="font-semibold text-[#0b1c30] dark:text-white">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action area */}
                <div className="border-t border-[#e5eeff] dark:border-zinc-800 pt-6 flex flex-col sm:flex-row gap-4">
                  {/* Add to Cart - Direct */}
                  <button 
                    onClick={() => {
                      addToCart(selectedProduct.id.toString());
                      setSelectedProduct(null);
                    }}
                    className="flex-1 bg-[#6c2ce6] hover:bg-[#6c2ce6]/95 text-white py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>

                  {/* View Details - Link to Product Page */}
                  <Link
                    href={`/products/${selectedProduct.id}`}
                    className="flex-1 border border-[#c6c6cd] text-[#6c2ce6] hover:bg-[#c6c6cd]/10 py-4 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Link>

                  {/* Wishlist */}
                  <button 
                    onClick={() => toggleWishlist(selectedProduct.id.toString())}
                    className="px-4 py-4 rounded-xl border border-[#c6c6cd] text-[#45464d] hover:text-rose-500 hover:bg-rose-50 transition-colors flex items-center justify-center cursor-pointer"
                    title="Add to Wishlist"
                  >
                    <Heart className="w-5 h-5" fill={favorites.includes(selectedProduct.id) ? "currentColor" : "none"} />
                  </button>
                </div>

            </div>
          </div>
        </div>
      )}
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

      

      {/* Dynamic Toasts List */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-white text-xs font-semibold border transition-all duration-300 animate-slide-in ${
              toast.type === 'success' 
                ? 'bg-emerald-600 border-emerald-500' 
                : toast.type === 'warning' 
                  ? 'bg-amber-600 border-amber-500' 
                  : 'bg-indigo-650 border-indigo-600'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
