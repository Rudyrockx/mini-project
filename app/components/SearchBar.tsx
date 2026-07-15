'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
      setQuery('');
    }
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className="bg-white dark:bg-zinc-900 border-b border-[#e5eeff] dark:border-zinc-800/30 py-4 px-4 sm:px-8 shadow-xs relative z-30"
    >
      <div className="max-w-7xl mx-auto">
        <div className="relative flex items-center max-w-2xl mx-auto">
          {/* Search Icon on the Left */}
          <Search className="absolute left-4 text-zinc-400 dark:text-zinc-500 w-5 h-5 pointer-events-none" />
          
          {/* Main Search Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search premium essentials, timepieces, collections..."
            className="w-full pl-12 pr-28 py-3.5 bg-[#f8f9ff] dark:bg-zinc-950 border border-[#e5eeff] dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6c2ce6]/25 focus:border-[#6c2ce6] text-sm text-[#0b1c30] dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 transition-all shadow-inner"
          />

          {/* Action elements on the Right */}
          <div className="absolute right-2 flex items-center gap-1">
            {/* Clear Button */}
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1.5 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 rounded-full text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 transition-all cursor-pointer"
                title="Clear query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            {/* Search Submit Button */}
            <button 
              type="submit" 
              className="bg-[#6c2ce6] hover:bg-[#6c2ce6]/90 text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer hover:shadow active:scale-95"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}