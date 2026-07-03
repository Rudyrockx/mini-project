'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
export const dynamic = 'force-dynamic';
export default function MockPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const planName = searchParams.get('plan');
  const price = searchParams.get('price');
  const duration = searchParams.get('duration');

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/plans/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName,
          duration: parseInt(duration || '1'),
          stripePaymentId: `mock_${Date.now()}`,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert(`${planName} plan activated successfully!`);
        router.push('/dashboard');
      } else {
        alert('Failed to activate plan');
      }
    } catch (error) {
      alert('Error processing payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 overflow-hidden">
      {/* Decorative ambient backgrounds */}
      <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl animate-float-delayed" />

      <div className="relative z-10 w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 shadow-2xl border border-zinc-200/50 dark:border-zinc-800/30 space-y-6">
        
        {/* Title */}
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-650 text-white shadow-md shadow-indigo-500/25 mb-4">
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
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
              />
            </svg>
          </div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Mock Checkout
          </h1>
          <p className="text-sm text-zinc-650 dark:text-zinc-400 mt-2 text-center">
            Complete your transaction sheet to activate your tier
          </p>
        </div>

        {/* Pricing Summary */}
        <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider border-b border-zinc-200/30 dark:border-zinc-800/30 pb-2">
            Order Summary
          </h4>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <span className="text-zinc-500 font-medium">Selected Tier:</span>
            <span className="text-right text-zinc-800 dark:text-zinc-200 font-bold">{planName}</span>
            
            <span className="text-zinc-500 font-medium">Access Duration:</span>
            <span className="text-right text-zinc-800 dark:text-zinc-200 font-semibold">{duration} Days</span>
            
            <span className="text-zinc-500 font-medium border-t border-dashed border-zinc-200 dark:border-zinc-800 pt-3">Amount Due:</span>
            <span className="text-right text-indigo-650 dark:text-indigo-400 font-extrabold text-lg border-t border-dashed border-zinc-200 dark:border-zinc-800 pt-2 font-heading">
              Rs. {price}
            </span>
          </div>
        </div>

        {/* Stripe Mock Form fields */}
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-zinc-650 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
              Cardholder Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-650 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
              Card Information
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="4242  4242  4242  4242"
                maxLength={19}
                className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                💳
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-650 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                Expiration Date
              </label>
              <input
                type="text"
                placeholder="MM / YY"
                maxLength={5}
                className="w-full px-4 py-3 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-650 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                CVC Code
              </label>
              <input
                type="password"
                placeholder="•••"
                maxLength={3}
                className="w-full px-4 py-3 bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all text-sm text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400"
              />
            </div>
          </div>
        </div>

        {/* Mock Payment Banner */}
        <div className="flex gap-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/20 dark:border-indigo-900/30 text-zinc-700 dark:text-zinc-300 p-4 rounded-2xl text-xs leading-relaxed">
          <span className="text-base">ℹ️</span>
          <div className="space-y-1">
            <p className="font-semibold text-indigo-700 dark:text-indigo-400">Simulation Mode</p>
            <p className="text-zinc-600 dark:text-zinc-400">
              This checkout operates in mock environment. Completing checkout activates subscription automatically.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-500/15 hover:shadow-emerald-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing payment...
              </>
            ) : (
              'Complete Payment'
            )}
          </button>

          <button
            onClick={() => router.push('/pricing')}
            className="w-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 py-3.5 rounded-2xl text-zinc-700 dark:text-zinc-300 font-semibold text-sm transition-all cursor-pointer"
          >
            Cancel Checkout
          </button>
        </div>

      </div>
    </div>
  );
}