'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  ChevronRight,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  LayoutDashboard,
  User,
  Shield,
  DollarSign
} from 'lucide-react';

const ROUTE_CONFIG: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  products: { label: 'Products', icon: ShoppingBag },
  cart: { label: 'Cart', icon: ShoppingCart },
  checkout: { label: 'Checkout', icon: CreditCard },
  dashboard: { label: 'Dashboard', icon: LayoutDashboard },
  profile: { label: 'Profile', icon: User },
  pricing: { label: 'Pricing', icon: DollarSign },
  admin: { label: 'Admin', icon: Shield },
};

function formatSegment(segment: string) {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const [resolvedLabels, setResolvedLabels] = useState<Record<string, string>>({});
  const [loadingSegments, setLoadingSegments] = useState<Record<string, boolean>>({});

  // Get active segments, filtering out empty entries
  const segments = pathname ? pathname.split('/').filter(Boolean) : [];

  // Hide breadcrumbs on home, login, and signup pages
  const isIgnoredRoute = 
    pathname === '/' || 
    pathname === '/login' || 
    pathname === '/signup';

  useEffect(() => {
    if (isIgnoredRoute) return;

    segments.forEach((segment, index) => {
      // Check if it follows 'products' and is not a statically mapped route
      const isProductId = index > 0 && segments[index - 1] === 'products' && !ROUTE_CONFIG[segment];
      
      if (isProductId && !resolvedLabels[segment] && !loadingSegments[segment]) {
        setLoadingSegments(prev => ({ ...prev, [segment]: true }));
        
        fetch(`/api/products/${segment}`)
          .then(res => res.json())
          .then(data => {
            if (data?.success && data?.product?.name) {
              setResolvedLabels(prev => ({ ...prev, [segment]: data.product.name }));
            } else {
              setResolvedLabels(prev => ({ ...prev, [segment]: 'Product Details' }));
            }
          })
          .catch(() => {
            setResolvedLabels(prev => ({ ...prev, [segment]: 'Product Details' }));
          })
          .finally(() => {
            setLoadingSegments(prev => ({ ...prev, [segment]: false }));
          });
      }
    });
  }, [pathname, segments, isIgnoredRoute, resolvedLabels, loadingSegments]);

  if (isIgnoredRoute || segments.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-2">
      <nav aria-label="Breadcrumb" className="flex">
        <ol className="flex items-center flex-wrap gap-1.5 md:gap-2 text-xs md:text-sm font-medium text-zinc-500 dark:text-zinc-400 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/40 px-4 py-2.5 rounded-2xl shadow-xs">
          {/* Home Link */}
          <li className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-all duration-205 ease-in-out transform hover:scale-[1.02] active:scale-98"
            >
              <Home className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              <span>Home</span>
            </Link>
          </li>

          {/* Path segments */}
          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const path = `/${segments.slice(0, index + 1).join('/')}`;
            
            // Get styling configs
            const config = ROUTE_CONFIG[segment];
            const SegmentIcon = config?.icon;
            
            // Resolve custom or formatted labels
            const label = resolvedLabels[segment] || (config ? config.label : formatSegment(segment));
            const isLoading = loadingSegments[segment];

            return (
              <li key={path} className="flex items-center">
                <ChevronRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700 mx-0.5" />
                
                {isLast ? (
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50/40 dark:bg-indigo-950/20">
                    {SegmentIcon && <SegmentIcon className="w-4 h-4" />}
                    {isLoading ? (
                      <span className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-md inline-block" />
                    ) : (
                      <span>{label}</span>
                    )}
                  </span>
                ) : (
                  <Link
                    href={path}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-all duration-205 ease-in-out transform hover:scale-[1.02] active:scale-98"
                  >
                    {SegmentIcon && <SegmentIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />}
                    <span>{label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
