'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  category: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const [categories, setCategories] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 12,
    currentPage: 1,
    totalPages: 1,
  });

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, minPrice, maxPrice, minRating, page, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if(search) params.append('search', search);
      if (selectedCategory) params.append('category', selectedCategory);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (minRating) params.append('minRating', minRating);
      params.append('page', page.toString());

      const url = `/api/products?${params.toString()}`;
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      
      setProducts(data.products || []);
      setPagination(data.pagination || {
        total: 0,
        pageSize: 12,
        currentPage: 1,
        totalPages: 1,
      });

      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setPage(1);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading products...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Filter section */}
        <aside className="w-full lg:w-64 lg:h-[calc(100vh-120px)] lg:sticky lg:top-24 flex flex-col gap-sm p-gutter bg-surface overflow-y-auto custom-scrollbar rounded-2xl border border-gray-100 shadow-sm">
          <div className="mb-lg">
            <h2 className="bg-[#6c2ce6] text-[#ffffff] p-1 text-xl font-headline-xl text-headline-xl text-center ">Filters</h2>
            <p className="text-black-800 text-center font-label-md text-label-md text-on-surface-variant opacity-70">Refine your selection</p>
          </div>
          
          <nav className="flex flex-col gap-sm">
            {/* Categories */}
            <div className="flex items-center gap-3 p-3 text-secondary font-bold bg-secondary-fixed rounded-lg transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#6c2ce6" className="bi bi-tags-fill" viewBox="0 0 16 16">
                <path d="M2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                <path d="M1.293 7.793A1 1 0 0 1 1 7.086V2a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l.043-.043z"/>
              </svg>
              <span className="text-[#6c2ce6] p-2 rounded font-label-md text-label-md">Categories</span>
            </div>
            <div className="pl-11 flex flex-col gap-2 mb-md">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-2 text-body-sm text-black hover:text-primary cursor-pointer capitalize">
                  <input
                    className="rounded text-secondary focus:ring-secondary border-outline"
                    type="checkbox"
                    checked={selectedCategory === cat}
                    onChange={() => {
                      setSelectedCategory(selectedCategory === cat ? '' : cat);
                      setPage(1);
                    }}
                  />
                  {cat}
                </label>
              ))}
            </div>

            {/* Price Range */}
            <div className="flex items-center gap-3 p-3 text-on-surface-variant rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#6c2ce6" className="bi bi-cash " viewBox="0 0 16 16">
                  <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                  <path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2z"/>
                  </svg>
              <span className=" text-[#571acaff] p-2 rounded-xl font-label-md text-label-md">Price Range</span>
            </div>
            <div className="pl-11 pr-4 mb-md">
              <input
                className="text-[#422ce6ff] w-full h-1 bg-surface-container-highest rounded-lg cursor-pointer accent-secondary"
                type="range"
                min="0"
                max="5000"
                step="50"
                value={maxPrice || '5000'}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
              />
              <div className="flex justify-between mt-2 text-[10px] text-outline">
                <span>$0</span>
                <span className="text-secondary font-bold font-label-sm">${maxPrice || '5000'}</span>
                <span>$5000+</span>
              </div>
            </div>

            {/* Min Rating */}
            <div className="flex items-center gap-3 p-3 text-on-surface-variant rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#6c2ce6" className ="bi bi-star-fill" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
              <span className="  text-[#6c2ce6] rounded-xl p-2 font-label-md text-label-md">Min Rating</span>
            </div>
            <div className="pl-11 pr-4 mb-md">
              <select
                value={minRating}
                onChange={(e) => {
                  setMinRating(e.target.value);
                  setPage(1);
                }}
                className="w-full text-black px-3 py-2 bg-white border border-outline rounded-lg font-label-md text-label-md"
              >
                <option value="">All Ratings</option>
                <option value="3">3+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>

            
          </nav>
          
          <button
            onClick={resetFilters}
            className="bg-[#ffffff] mt-10 py-3 px-4 text-center text-secondary border border-secondary rounded-xl hover:bg-secondary-fixed transition-colors font-label-md text-label-md font-bold"
          >
            Clear All Filters
          </button>
        </aside>

        {/* Right Side: Products Section */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-black tracking-tight mb-2">All Products</h1>
              <p className="text-sm text-gray-500">Discover {pagination.total} premium items curated for your lifestyle.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Sort by:</span>
              <select className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-black font-semibold shadow-sm focus:outline-none">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center text-gray-600 py-12">No products available</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`} className="group">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer h-full flex flex-col overflow-hidden">
                      
                      {/* Product Image Container */}
                      <div className="bg-gray-100 h-64 flex items-center justify-center overflow-hidden relative">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="text-gray-400">No Image</div>
                        )}
                        
                        {/* Product Badges */}
                        {product.price > 1000 ? (
                          <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
                            Limited
                          </span>
                        ) : product.rating >= 4.5 ? (
                          <span className="absolute top-3 left-3 bg-secondary text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
                            New
                          </span>
                        ) : null}
                      </div>

                      {/* Product Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Category */}
                          <span className="text-[10px] font-bold text-secondary tracking-wider uppercase mb-1 block">
                            {product.category}
                          </span>
                          
                          {/* Name */}
                          <h3 className="text-sm font-bold text-black group-hover:text-secondary transition-colors line-clamp-1">
                            {product.name}
                          </h3>

                          {/* Rating Stars */}
                          <div className="flex items-center gap-0.5 mt-1.5">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-xs ${
                                  i < Math.floor(product.rating || 4.5) ? 'text-amber-400' : 'text-gray-200'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                            <span className="text-[10px] text-gray-400 ml-1 font-medium">
                              ({product.reviews || 0})
                            </span>
                          </div>
                        </div>

                        {/* Price and Cart Button */}
                        <div className="flex justify-between items-center mt-5 pt-3 border-t border-gray-50">
                          <span className="text-lg font-bold text-secondary">
                            ${product.price.toLocaleString()}
                          </span>
                          <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-bag-fill" viewBox="0 0 16 16">
  <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4z"/>
</svg>
                          </div>
                        </div>

                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2 text-xs font-semibold text-gray-500">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:text-black transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <span>&lsaquo;</span> Previous
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      return p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1;
                    })
                    .map((p, idx, arr) => {
                      const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                      return (
                        <div key={p} className="flex items-center">
                          {showEllipsis && <span className="px-2 text-gray-400">...</span>}
                          <button
                            onClick={() => setPage(p)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                              page === p
                                ? 'bg-secondary text-white font-bold'
                                : 'hover:bg-gray-100 hover:text-black'
                            }`}
                          >
                            {p}
                          </button>
                        </div>
                      );
                    })}

                  <button
                    onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                    disabled={page === pagination.totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:text-black transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  >
                    Next <span>&rsaquo;</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}