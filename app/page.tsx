import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col justify-between py-12 sm:py-20">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/10 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl animate-float" />
      <div className="absolute top-1/3 right-1/10 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl animate-float-delayed" />

      {/* Main Hero Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center">
        {/* Hero Headline */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-200/50 bg-indigo-50/30 dark:border-indigo-800/30 dark:bg-indigo-950/30 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-indigo-550 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-indigo-700 dark:text-indigo-300">
              Welcome to the New GeoProfile
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 dark:from-zinc-50 dark:via-indigo-100 dark:to-zinc-50 bg-clip-text text-transparent leading-none">
            Your Profile & Address, <br />
            <span className="bg-gradient-to-r from-indigo-550 to-violet-650 bg-clip-text text-transparent">
              Beautifully Unified
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-655 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            An elegant dashboard to customize your profile details, lookup global addresses in real-time, view interactive maps, export PDF reports, and manage premium subscription tiers.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-750 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
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
              className="w-full sm:w-auto flex justify-center items-center gap-2 border border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900 backdrop-blur-md text-zinc-700 dark:text-zinc-300 font-semibold px-8 py-3.5 rounded-2xl transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="group relative p-8 rounded-3xl bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-900 hover:scale-[1.02] hover:shadow-xl hover:shadow-zinc-200/20 dark:hover:shadow-black/20 transition-all duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-650 group-hover:bg-indigo-550 group-hover:text-white transition-colors duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>
            <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-6 mb-2">
              Profile Customization
            </h3>
            <p className="text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed">
              Upload custom avatar credentials directly to cloud storage and manage personal detail fields with a beautiful dashboard interface.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group relative p-8 rounded-3xl bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-900 hover:scale-[1.02] hover:shadow-xl hover:shadow-zinc-200/20 dark:hover:shadow-black/20 transition-all duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-650 group-hover:bg-indigo-550 group-hover:text-white transition-colors duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-6 mb-2">
              Address Search
            </h3>
            <p className="text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed">
              Find global locations in milliseconds using advanced Geoapify API autocomplete lookup with full coordinate analysis.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group relative p-8 rounded-3xl bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-900 hover:scale-[1.02] hover:shadow-xl hover:shadow-zinc-200/20 dark:hover:shadow-black/20 transition-all duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-650 group-hover:bg-indigo-550 group-hover:text-white transition-colors duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                />
              </svg>
            </div>
            <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-6 mb-2">
              Interactive Mapping
            </h3>
            <p className="text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed">
              Visualize selected home addresses on a dynamic OpenStreetMap map using Leaflet marker systems and interactive popups.
            </p>
          </div>

          {/* Card 4 */}
          <div className="group relative p-8 rounded-3xl bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/30 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-900 hover:scale-[1.02] hover:shadow-xl hover:shadow-zinc-200/20 dark:hover:shadow-black/20 transition-all duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-650 group-hover:bg-indigo-550 group-hover:text-white transition-colors duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
            <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-6 mb-2">
              Export PDF Profile
            </h3>
            <p className="text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed">
              Export all your verified location markers and user credentials into a beautiful structured PDF report for easy printing.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-zinc-400 dark:text-zinc-500 pt-16">
        &copy; {new Date().getFullYear()} GeoProfile Platform. All rights reserved. Created with modern web aesthetics.
      </footer>
    </div>
  );
}
