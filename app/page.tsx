'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'profile' | 'search' | 'map' | 'pdf'>('profile');
  const [typedAddress, setTypedAddress] = useState('');
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'done'>('idle');
  const [isPdfExporting, setIsPdfExporting] = useState(false);

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
            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              Welcome to the New Mini-Project
            </span>
          </div>

          {/* Heading with Elegant Font Pairing */}
          <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-zinc-955 to-zinc-700 dark:from-zinc-50 dark:to-zinc-300 bg-clip-text text-transparent leading-none">
            Your Profile & Address, <br />
            <span className="bg-gradient-to-r from-indigo-500 via-violet-600 to-indigo-550 bg-clip-text text-transparent">
              Beautifully Unified
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            A secure, minimalist dashboard designed to manage your credentials, perform real-time address validation, visualize markers on dynamic maps, and generate custom PDF profiles.
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

        {/* Showcase Device / Dashboard Mockup (Interactive) */}
        <div className="w-full max-w-4xl rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/30 dark:bg-zinc-950/20 backdrop-blur-md shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 overflow-hidden transition-all">
          
          {/* Windows-style Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-100/50 dark:bg-zinc-900/50 border-b border-zinc-200/40 dark:border-zinc-800/40">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <span className="w-3 h-3 rounded-full bg-green-400/80" />
            </div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500 font-mono select-none px-3 py-0.5 rounded bg-zinc-200/30 dark:bg-zinc-800/30 border border-zinc-200/30 dark:border-zinc-800/30">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-zinc-400">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
              </svg>
              geoprofile.app/dashboard
            </div>
            <div className="w-12" /> {/* spacer to balance buttons */}
          </div>

          {/* Interactive Workspace Area */}
          <div className="grid grid-cols-1 md:grid-cols-4 min-h-[300px]">
            
            {/* Sidebar Navigation */}
            <div className="md:col-span-1 border-r border-zinc-200/40 dark:border-zinc-800/40 p-4 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'profile'
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 border border-transparent'
                }`}
              >
                👤 Profile Settings
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'search'
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 border border-transparent'
                }`}
              >
                🔍 Address Lookup
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'map'
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 border border-transparent'
                }`}
              >
                🗺️ Location Mapping
              </button>
              <button
                onClick={() => setActiveTab('pdf')}
                className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'pdf'
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 border border-transparent'
                }`}
              >
                📄 PDF Report
              </button>
            </div>

            {/* Dynamic Screen View */}
            <div className="md:col-span-3 p-6 flex flex-col justify-center bg-white/40 dark:bg-zinc-955/40">
              
              {/* Profile Screen */}
              {activeTab === 'profile' && (
                <div className="space-y-4 max-w-sm mx-auto w-full animate-fade-in">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-900 flex items-center justify-center text-xl font-bold text-zinc-600 dark:text-zinc-400 overflow-hidden shadow-inner">
                      {uploadState === 'done' ? (
                        <span className="text-zinc-800 dark:text-zinc-100 font-sans">JD</span>
                      ) : (
                        '?'
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">John Doe</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">john.doe@example.com</p>
                    </div>
                  </div>
                  <div className="border border-zinc-200/50 dark:border-zinc-800/30 rounded-xl p-3.5 bg-zinc-50/50 dark:bg-zinc-900/20">
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 uppercase font-bold tracking-wider mb-1.5">Avatar Status</p>
                    <button
                      onClick={triggerUpload}
                      className="w-full flex items-center justify-center gap-2 text-xs font-semibold py-2 px-3 border border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 rounded-lg shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                    >
                      {uploadState === 'idle' && (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-zinc-500">
                            <path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.242 4.242l7-7a3 3 0 000-4.242zM5.793 14.207a1 1 0 011.414-1.414l5.5 5.5a1 1 0 01-1.414 1.414l-5.5-5.5z" clipRule="evenodd" />
                          </svg>
                          Upload Custom Avatar
                        </>
                      )}
                      {uploadState === 'uploading' && (
                        <>
                          <span className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                          Uploading to storage...
                        </>
                      )}
                      {uploadState === 'done' && (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-500">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                          </svg>
                          <span className="text-emerald-600 dark:text-emerald-450 font-semibold">Avatar Uploaded!</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Search Screen */}
              {activeTab === 'search' && (
                <div className="space-y-4 max-w-sm mx-auto w-full animate-fade-in">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Autocomplete Address Finder</label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={typedAddress}
                        placeholder="Search location..."
                        className="w-full text-xs py-2.5 pl-3 pr-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 font-mono text-zinc-700 dark:text-zinc-300 focus:outline-none"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded text-[9px] flex items-center justify-center text-zinc-450 font-mono shadow-sm">⌘K</span>
                    </div>
                  </div>
                  {typedAddress.length > 5 && (
                    <div className="border border-indigo-100/50 dark:border-indigo-900/20 bg-indigo-50/20 dark:bg-indigo-950/10 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-400 dark:text-zinc-500 font-semibold">COORDINATES FOUND</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-650 dark:text-emerald-400 font-bold uppercase scale-90">Validated</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                        <div>Lat: 37.4220° N</div>
                        <div>Lng: -122.0841° W</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Map Screen */}
              {activeTab === 'map' && (
                <div className="max-w-sm mx-auto w-full space-y-3.5 animate-fade-in">
                  <div className="relative h-36 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/40 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                    
                    {/* Simulated Map Visual */}
                    <div className="absolute inset-0 opacity-40 dark:opacity-20 bg-grid-pattern scale-110 pointer-events-none" />
                    
                    {/* Pulsing Pin Marker */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-455 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-600"></span>
                      </div>
                      <div className="h-6 w-0.5 bg-violet-600/80 rounded-full" />
                      <div className="px-2.5 py-1.5 rounded-xl border border-violet-100 dark:border-violet-950 bg-white/95 dark:bg-zinc-950/95 shadow-lg text-[9px] font-bold text-zinc-800 dark:text-zinc-200 -mt-1 backdrop-blur-sm select-none">
                        📍 Googleplex, CA
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-[10px] text-zinc-400 dark:text-zinc-500 italic">
                    Visualized dynamically using interactive OpenStreetMap layers.
                  </div>
                </div>
              )}

              {/* PDF Screen */}
              {activeTab === 'pdf' && (
                <div className="space-y-4 max-w-sm mx-auto w-full animate-fade-in text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-600 border border-zinc-200/50 dark:border-zinc-800/50 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Profile Summary PDF</p>
                    <p className="text-[11px] text-zinc-450 dark:text-zinc-500">Includes verification status and geographical coordinates.</p>
                  </div>
                  <button
                    onClick={triggerPdfExport}
                    className="w-full max-w-[200px] flex items-center justify-center gap-2 text-xs font-semibold py-2 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl shadow-sm transition-all mx-auto cursor-pointer"
                  >
                    {isPdfExporting ? (
                      <>
                        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Generating Document...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                          <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v6.59l1.95-2.1a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0L6.2 9.26a.75.75 0 111.1-1.02l1.95 2.1V3.75A.75.75 0 0110 3zm-5 9a.75.75 0 01.75.75v1.5a.25.25 0 00.25.25h8a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 0113.25 16H6.75A1.75 1.75 0 015 14.25v-1.5A.75.75 0 015 12z" clipRule="evenodd" />
                        </svg>
                        Download PDF
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>

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
    </div>
  );
}
