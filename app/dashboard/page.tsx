'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  User,
  CreditCard,
  Map,
  Sparkles,
  FileText,
  ShoppingBag,
  LogOut,
  Settings,
  AlertTriangle,
  Clock
} from 'lucide-react';

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
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4 bg-[#f8f9ff] dark:bg-zinc-950">
        <div className="h-10 w-10 border-4 border-[#6c2ce6] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[#45464d] dark:text-zinc-400 font-medium">
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
    <div className="bg-[#f8f9ff] dark:bg-zinc-950 relative min-h-[calc(100vh-4rem)] p-4 sm:p-8 lg:p-12 overflow-hidden selection:bg-[#6c2ce6]/20">
      {/* Decorative ambient backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#6c2ce6]/5 dark:bg-[#6c2ce6]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#854eff]/5 dark:bg-[#854eff]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-zinc-900 border border-[#e5eeff] dark:border-zinc-800/30 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 rounded-2xl overflow-hidden border border-[#e5eeff] dark:border-zinc-800 bg-gradient-to-br from-[#6c2ce6] to-[#854eff] flex items-center justify-center shadow-md shrink-0">
              {avatar ? (
                <img src={avatar} alt={name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-white uppercase">
                  {name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0b1c30] dark:text-zinc-50">
                  Welcome, {name}!
                </h1>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#6c2ce6]/10 text-[#6c2ce6] dark:bg-[#854eff]/10 dark:text-[#d0bcff] border border-[#6c2ce6]/25 dark:border-[#854eff]/20">
                  {role}
                </span>
              </div>
              <p className="text-sm text-[#45464d] dark:text-zinc-400 mt-1">
                {email} • Manage subscriptions, verified geolocations, and profile parameters.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            <Link
              href="/profile"
              className="px-5 py-2.5 bg-[#6c2ce6] hover:bg-[#6c2ce6]/90 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-1.5 cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              Account Settings
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="px-5 py-2.5 border border-rose-200 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-650 dark:text-rose-400 text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Panels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: Account Overview & Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Profile Summary Panel */}
            <div className="bg-white dark:bg-zinc-900 border border-[#e5eeff] dark:border-zinc-800/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="font-heading text-lg font-bold text-[#0b1c30] dark:text-zinc-50 border-b border-[#e5eeff] dark:border-zinc-800 pb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-[#6c2ce6]" />
                Account Overview
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl bg-[#f8f9ff] dark:bg-zinc-800/50 border border-[#e5eeff] dark:border-zinc-800/30">
                  <span className="block text-[10px] font-bold text-[#45464d] uppercase tracking-wider mb-1">
                    Display Name
                  </span>
                  <span className="text-sm font-bold text-[#0b1c30] dark:text-zinc-200">
                    {name}
                  </span>
                </div>
                
                <div className="p-4 rounded-2xl bg-[#f8f9ff] dark:bg-zinc-800/50 border border-[#e5eeff] dark:border-zinc-800/30">
                  <span className="block text-[10px] font-bold text-[#45464d] uppercase tracking-wider mb-1">
                    Email Account
                  </span>
                  <span className="text-sm font-bold text-[#0b1c30] dark:text-zinc-200 break-all">
                    {email}
                  </span>
                </div>
                
                <div className="p-4 rounded-2xl bg-[#f8f9ff] dark:bg-zinc-800/50 border border-[#e5eeff] dark:border-zinc-800/30">
                  <span className="block text-[10px] font-bold text-[#45464d] uppercase tracking-wider mb-1">
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

                <div className="p-4 rounded-2xl bg-[#f8f9ff] dark:bg-zinc-800/50 border border-[#e5eeff] dark:border-zinc-800/30">
                  <span className="block text-[10px] font-bold text-[#45464d] uppercase tracking-wider mb-1">
                    Primary Address
                  </span>
                  <span className="text-sm font-bold text-[#0b1c30] dark:text-zinc-200 truncate block">
                    {profile?.address || 'No location configured'}
                  </span>
                </div>
              </div>

              {profile?.address && (
                <div className="p-4 rounded-2xl bg-[#eff4ff] dark:bg-[#854eff]/10 border border-[#e5eeff] dark:border-zinc-800/30 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-[#6c2ce6] dark:text-indigo-400 uppercase tracking-wider">
                      📍 Verified Address
                    </span>
                    <p className="text-xs text-[#0b1c30] dark:text-zinc-300">
                      {profile.address}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    className="text-xs font-bold text-[#6c2ce6] dark:text-indigo-400 hover:text-[#5500cb] hover:underline shrink-0"
                  >
                    View Map →
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions Grid */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-bold text-[#0b1c30] dark:text-zinc-50">
                Quick Actions
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/profile"
                  className="flex items-center gap-4 p-5 bg-white dark:bg-zinc-900 border border-[#e5eeff] dark:border-zinc-800/30 rounded-2xl shadow-sm hover:shadow-md hover:border-[#c6c6cd]/50 hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff4ff] dark:bg-[#854eff]/10 text-[#6c2ce6] dark:text-indigo-400 group-hover:scale-110 transition-transform shrink-0">
                    <Map className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-[#0b1c30] dark:text-zinc-250">
                      Update Address & Map
                    </h4>
                    <p className="text-xs text-[#45464d] dark:text-zinc-400 mt-0.5">
                      Configure geocoding parameters and coordinates canvas.
                    </p>
                  </div>
                </Link>

                <Link
                  href="/pricing"
                  className="flex items-center gap-4 p-5 bg-white dark:bg-zinc-900 border border-[#e5eeff] dark:border-zinc-800/30 rounded-2xl shadow-sm hover:shadow-md hover:border-[#c6c6cd]/50 hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff4ff] dark:bg-[#854eff]/10 text-[#6c2ce6] dark:text-indigo-400 group-hover:scale-110 transition-transform shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-[#0b1c30] dark:text-zinc-250">
                      Pricing & Upgrade
                    </h4>
                    <p className="text-xs text-[#45464d] dark:text-zinc-400 mt-0.5">
                      View subscription tiers and upgrade billing parameters.
                    </p>
                  </div>
                </Link>

                <button
                  onClick={handleDownloadProfile}
                  disabled={downloadingPdf || !profile}
                  className="flex items-center gap-4 p-5 bg-white dark:bg-zinc-900 border border-[#e5eeff] dark:border-zinc-800/30 rounded-2xl shadow-sm hover:shadow-md hover:border-[#c6c6cd]/50 hover:-translate-y-0.5 transition-all duration-200 group w-full text-left disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff4ff] dark:bg-[#854eff]/10 text-[#6c2ce6] dark:text-indigo-450 group-hover:scale-110 transition-transform shrink-0">
                    {downloadingPdf ? (
                      <div className="h-4 w-4 border-2 border-[#6c2ce6] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0b1c30] dark:text-zinc-250">
                      {downloadingPdf ? 'Exporting PDF...' : 'Download Data Report'}
                    </h4>
                    <p className="text-xs text-[#45464d] dark:text-zinc-400 mt-0.5">
                      Export all coordinates and account specifications to PDF.
                    </p>
                  </div>
                </button>

                <Link
                  href="/"
                  className="flex items-center gap-4 p-5 bg-white dark:bg-zinc-900 border border-[#e5eeff] dark:border-zinc-800/30 rounded-2xl shadow-sm hover:shadow-md hover:border-[#c6c6cd]/50 hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff4ff] dark:bg-[#854eff]/10 text-[#6c2ce6] dark:text-indigo-400 group-hover:scale-110 transition-transform shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-[#0b1c30] dark:text-zinc-250">
                      Explore Shop
                    </h4>
                    <p className="text-xs text-[#45464d] dark:text-zinc-400 mt-0.5">
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
            <div className="bg-white dark:bg-zinc-900 border border-[#e5eeff] dark:border-zinc-800/30 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full min-h-[420px]">
              <div className="space-y-6">
                <h3 className="font-heading text-lg font-bold text-[#0b1c30] dark:text-zinc-50 border-b border-[#e5eeff] dark:border-zinc-800 pb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#6c2ce6]" />
                  Billing Status
                </h3>

                {activeSub ? (
                  <div className="space-y-6">
                    {/* Active Subscription Details */}
                    <div className="text-center p-6 bg-gradient-to-br from-[#6c2ce6]/10 to-[#854eff]/10 border border-[#6c2ce6]/20 dark:border-[#854eff]/20 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-[#6c2ce6] text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-sm">
                        Active
                      </div>
                      <h4 className="text-xs font-bold text-[#6c2ce6] dark:text-indigo-400 uppercase tracking-wider">
                        Current Plan
                      </h4>
                      <h2 className="font-heading text-3xl font-extrabold bg-gradient-to-r from-[#6c2ce6] to-[#854eff] dark:from-[#d0bcff] dark:to-violet-400 bg-clip-text text-transparent mt-1.5">
                        {activeSub.plan.name} Tier
                      </h2>
                      <p className="text-[10px] text-[#45464d] dark:text-zinc-400 mt-1 uppercase font-semibold flex items-center justify-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#6c2ce6]" />
                        {activeSub.plan.durationHours} Hours Duration
                      </p>
                    </div>

                    <div className="space-y-3.5 text-sm">
                      <div className="flex justify-between border-b border-[#e5eeff] dark:border-zinc-800 pb-2">
                        <span className="text-[#45464d] dark:text-zinc-400 font-medium">Activated At</span>
                        <span className="text-[#0b1c30] dark:text-zinc-200 font-semibold">
                          {new Date(activeSub.activatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex justify-between border-b border-[#e5eeff] dark:border-zinc-800 pb-2">
                        <span className="text-[#45464d] dark:text-zinc-400 font-medium">Expires At</span>
                        <span className="text-[#0b1c30] dark:text-zinc-200 font-semibold">
                          {new Date(activeSub.expiresAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex justify-between border-b border-[#e5eeff] dark:border-zinc-800 pb-2">
                        <span className="text-[#45464d] dark:text-zinc-400 font-medium">Time Left</span>
                        <span className="text-[#6c2ce6] dark:text-[#d0bcff] font-bold">
                          {getSubscriptionTimeRemaining(activeSub.expiresAt)}
                        </span>
                      </div>

                      {activeSub.stripePaymentId && (
                        <div className="flex justify-between pb-2">
                          <span className="text-[#45464d] dark:text-zinc-400 font-medium">Payment ID</span>
                          <span className="text-[#45464d] dark:text-zinc-500 font-mono text-[10px] truncate max-w-[130px]" title={activeSub.stripePaymentId}>
                            {activeSub.stripePaymentId}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 text-center py-6">
                    <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-heading font-bold text-lg text-[#0b1c30] dark:text-zinc-100">
                        No Active Tier
                      </h4>
                      <p className="text-xs text-[#45464d] dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">
                        Upgrade your account to a premium membership to unlock free shipping, priority assistance, and coordinate PDF downloads.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6">
                <Link
                  href="/pricing"
                  className="w-full py-3.5 bg-[#6c2ce6] hover:bg-[#6c2ce6]/90 text-white text-sm font-semibold rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  {activeSub ? 'Change Plan' : 'Get Premium'}
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
