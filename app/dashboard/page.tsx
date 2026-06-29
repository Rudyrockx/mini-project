import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Simulated metrics for premium aesthetic
  const stats = [
    { name: 'Account Status', value: 'Active', icon: '⚡', color: 'text-emerald-500' },
    { name: 'Subscription Plan', value: 'Free Tier', icon: '⭐', color: 'text-amber-500' },
    { name: 'Saved Locations', value: '1 Address', icon: '📍', color: 'text-indigo-500' },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] p-4 sm:p-8 lg:p-12 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-violet-500/5 blur-3xl animate-float-delayed" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-heading text-2xl font-bold shadow-lg shadow-indigo-500/20">
              {session.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                Welcome back, {session.user?.name}! 👋
              </h1>
              <p className="text-sm text-zinc-650 dark:text-zinc-400 mt-1">
                Managed account: <span className="font-medium text-zinc-800 dark:text-zinc-300">{session.user?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-755 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              Go To Profile
            </Link>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/login' });
              }}
            >
              <button
                type="submit"
                className="px-5 py-2.5 border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md rounded-3xl p-6 shadow-md hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-zinc-650 dark:text-zinc-400 font-medium">
                  {stat.name}
                </span>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Grid for two panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quick Actions Panel */}
          <div className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
            <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              Quick Shortcuts
            </h3>
            <p className="text-sm text-zinc-655 dark:text-zinc-400">
              Easily update your verified address location on Google Maps/OpenStreetMap, export PDF transcripts, or explore premium plans.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/profile"
                className="flex flex-col items-center justify-center p-4 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all text-center group"
              >
                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📍</span>
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Update Address</span>
              </Link>
              <Link
                href="/pricing"
                className="flex flex-col items-center justify-center p-4 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-violet-50/30 dark:hover:bg-violet-950/10 hover:border-violet-200 dark:hover:border-violet-900 transition-all text-center group"
              >
                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">💎</span>
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Upgrade Plan</span>
              </Link>
            </div>
          </div>

          {/* Account Profile Status */}
          <div className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
            <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              Profile Strength
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-zinc-650 dark:text-zinc-400 mb-1.5 uppercase">
                  <span>Completion Status</span>
                  <span>75%</span>
                </div>
                <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <ul className="text-xs space-y-2.5 text-zinc-650 dark:text-zinc-400 pt-2">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> Account Verified via Email
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span> Username and Profile Linked
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500">⏳</span> Home Location & Map Coords Pending Verification
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}