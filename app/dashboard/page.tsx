'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ActiveSubscription {
  id: string;
  planId: string;
  activatedAt: string;
  expiresAt: string;
  isActive: boolean;
  stripePaymentId: string | null;
  plan: {
    id: string;
    name: string;
    price: number;
    durationHours: number;
  };
}

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  role: string;
  createdAt: string;
  activeSubscription: ActiveSubscription | null;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setProfile(data.user);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard profile:', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const handleDownloadProfile = async () => {
    setDownloadingPdf(true);
    try {
      const res = await fetch('/api/profile/download');
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `profile-${profile?.name || 'user'}.pdf`;
        a.click();
      } else {
        alert('Failed to download profile PDF');
      }
    } catch (error) {
      console.error('PDF download error:', error);
      alert('Error downloading profile PDF');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const getSubscriptionTimeRemaining = (expiresAtStr: string | undefined) => {
    if (!expiresAtStr) return '';
    const expiry = new Date(expiresAtStr);
    const now = new Date();
    const diffMs = expiry.getTime() - now.getTime();
    if (diffMs <= 0) return 'Expired';

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours >= 24) {
      const days = Math.floor(diffHours / 24);
      const hours = diffHours % 24;
      return `${days}d ${hours}h remaining`;
    }
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMins}m remaining`;
  };

  if (status === 'loading' || (session && loadingProfile)) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
          Loading dashboard services...
        </span>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const name = profile?.name || session.user?.name || 'Member';
  const email = profile?.email || session.user?.email || '';
  const avatar = profile?.avatarUrl || session.user?.image;
  const role = profile?.role || 'user';
  const activeSub = profile?.activeSubscription;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] p-4 sm:p-8 lg:p-12 overflow-hidden">
      {/* Decorative ambient backgrounds */}
      <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-violet-500/5 blur-3xl animate-float-delayed" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-indigo-500 to-violet-650 flex items-center justify-center shadow-md">
              {avatar ? (
                <img src={avatar} alt={name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-white uppercase">
                  {name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Welcome, {name}!
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-350 border border-indigo-200/50 dark:border-indigo-900/30">
                  {role}
                </span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {email} • Manage subscriptions, verified geolocations, and profile parameters.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-750 text-white text-sm font-semibold rounded-xl shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              Account Settings
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="px-5 py-2.5 border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-650 dark:text-red-400 text-sm font-semibold rounded-xl transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Panels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: Account Overview & Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Profile Summary Panel */}
            <div className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
              <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50 border-b border-zinc-150 dark:border-zinc-850 pb-3 flex items-center gap-2">
                <span>👤</span> Account Overview
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200/40 dark:border-zinc-800/30">
                  <span className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                    Display Name
                  </span>
                  <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    {name}
                  </span>
                </div>
                
                <div className="p-4 rounded-2xl bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200/40 dark:border-zinc-800/30">
                  <span className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                    Email Account
                  </span>
                  <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 break-all">
                    {email}
                  </span>
                </div>
                
                <div className="p-4 rounded-2xl bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200/40 dark:border-zinc-800/30">
                  <span className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                    Verified Coordinates
                  </span>
                  {profile?.latitude && profile?.longitude ? (
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-450 font-mono">
                      {profile.latitude.toFixed(5)}, {profile.longitude.toFixed(5)}
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-zinc-400">
                      Not Set (Add via Settings)
                    </span>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200/40 dark:border-zinc-800/30">
                  <span className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                    Primary Address
                  </span>
                  <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate block">
                    {profile?.address || 'No location configured'}
                  </span>
                </div>
              </div>

              {profile?.address && (
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">
                      📍 Verified Address
                    </span>
                    <p className="text-xs text-zinc-700 dark:text-zinc-300">
                      {profile.address}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
                  >
                    View Map →
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions Grid */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Quick Actions
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/profile"
                  className="flex items-center gap-4 p-5 bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md rounded-2xl shadow-sm hover:scale-[1.01] hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    🗺️
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-250">
                      Update Address & Map
                    </h4>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Configure geocoding parameters and coordinates canvas.
                    </p>
                  </div>
                </Link>

                <Link
                  href="/pricing"
                  className="flex items-center gap-4 p-5 bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md rounded-2xl shadow-sm hover:scale-[1.01] hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-650 dark:text-violet-400 group-hover:scale-110 transition-transform">
                    💎
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-250">
                      Pricing & Upgrade
                    </h4>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      View subscription tiers and upgrade billing parameters.
                    </p>
                  </div>
                </Link>

                <button
                  onClick={handleDownloadProfile}
                  disabled={downloadingPdf || !profile}
                  className="flex items-center gap-4 p-5 bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md rounded-2xl shadow-sm hover:scale-[1.01] hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group w-full text-left disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-450 group-hover:scale-110 transition-transform">
                    {downloadingPdf ? (
                      <div className="h-4 w-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      '📄'
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-250">
                      {downloadingPdf ? 'Exporting PDF...' : 'Download Data Report'}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Export all coordinates and account specifications to PDF.
                    </p>
                  </div>
                </button>

                <Link
                  href="/"
                  className="flex items-center gap-4 p-5 bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md rounded-2xl shadow-sm hover:scale-[1.01] hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-450 group-hover:scale-110 transition-transform">
                    🛍️
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-250">
                      Explore Shop
                    </h4>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Back to homepage product collection & listings.
                    </p>
                  </div>
                </Link>
              </div>
            </div>

          </div>

          {/* Column 3: Subscription Panel */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Membership Details Card */}
            <div className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md rounded-3xl p-6 shadow-lg flex flex-col justify-between h-full min-h-[420px]">
              <div className="space-y-6">
                <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50 border-b border-zinc-150 dark:border-zinc-850 pb-3 flex items-center gap-2">
                  <span>💳</span> Billing Status
                </h3>

                {activeSub ? (
                  <div className="space-y-6">
                    {/* Active Subscription Details */}
                    <div className="text-center p-6 bg-gradient-to-br from-indigo-500/10 to-violet-650/10 border border-indigo-200/30 dark:border-indigo-900/30 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                        Active
                      </div>
                      <h4 className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                        Current Plan
                      </h4>
                      <h2 className="font-heading text-3xl font-extrabold bg-gradient-to-r from-indigo-650 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent mt-1">
                        {activeSub.plan.name} Tier
                      </h2>
                      <p className="text-[10px] text-zinc-500 mt-1 uppercase font-semibold">
                        ⏱️ {activeSub.plan.durationHours} Hours Total Duration
                      </p>
                    </div>

                    <div className="space-y-3.5 text-sm">
                      <div className="flex justify-between border-b border-zinc-150 dark:border-zinc-850 pb-2">
                        <span className="text-zinc-500 font-medium">Activated At</span>
                        <span className="text-zinc-800 dark:text-zinc-200 font-semibold">
                          {new Date(activeSub.activatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex justify-between border-b border-zinc-150 dark:border-zinc-850 pb-2">
                        <span className="text-zinc-500 font-medium">Expires At</span>
                        <span className="text-zinc-800 dark:text-zinc-200 font-semibold">
                          {new Date(activeSub.expiresAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex justify-between border-b border-zinc-150 dark:border-zinc-850 pb-2">
                        <span className="text-zinc-500 font-medium">Time Left</span>
                        <span className="text-indigo-650 dark:text-indigo-400 font-bold">
                          {getSubscriptionTimeRemaining(activeSub.expiresAt)}
                        </span>
                      </div>

                      {activeSub.stripePaymentId && (
                        <div className="flex justify-between pb-2">
                          <span className="text-zinc-500 font-medium">Payment ID</span>
                          <span className="text-zinc-500 dark:text-zinc-450 font-mono text-[10px] truncate max-w-[130px]">
                            {activeSub.stripePaymentId}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 text-center py-6">
                    <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 text-3xl">
                      ⚠️
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-heading font-bold text-lg text-zinc-900 dark:text-zinc-100">
                        No Active Tier
                      </h4>
                      <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
                        Upgrade your account to a premium membership to unlock free shipping, priority assistance, and coordinate PDF downloads.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6">
                <Link
                  href="/pricing"
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-violet-650 hover:from-indigo-600 hover:to-violet-750 text-white text-sm font-semibold rounded-2xl shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  {activeSub ? 'Change Subscription Plan' : 'Get Premium Membership'}
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}