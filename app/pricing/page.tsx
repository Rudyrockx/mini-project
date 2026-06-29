'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: 0,
    duration: 1,
    features: ['1 hour access', 'Basic profile', 'Address management'],
    color: 'border-zinc-200 dark:border-zinc-800',
    btnStyle: 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200',
    popular: false,
  },
  {
    name: 'Silver',
    price: 999,
    duration: 6,
    features: ['6 hours access', 'Full profile', 'Map display', 'Priority support'],
    color: 'border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/10 dark:bg-indigo-950/5',
    btnStyle: 'bg-gradient-to-r from-indigo-500 to-indigo-650 hover:from-indigo-600 hover:to-indigo-755 text-white shadow-indigo-500/10',
    popular: false,
  },
  {
    name: 'Gold',
    price: 2999,
    duration: 12,
    features: ['12 hours access', 'Premium profile', 'Analytics', '24/7 support'],
    color: 'border-violet-500 shadow-xl shadow-violet-500/5 dark:shadow-violet-950/10 bg-violet-50/20 dark:bg-violet-950/10 scale-105 border-2',
    btnStyle: 'bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-650 hover:to-fuchsia-700 text-white shadow-violet-550/20',
    popular: true,
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectPlan = async (planName: string, price: number, duration: number) => {
    if (!session?.user?.id) {
      router.push('/login');
      return;
    }

    setLoading(planName);

    if (price === 0) {
      // Free plan - no payment needed
      await activatePlan(planName, duration);
      return;
    }

    // Redirect to mock payment page
    router.push(`/mock-payment?plan=${planName}&price=${price}&duration=${duration}`);
  };

  const activatePlan = async (planName: string, duration: number) => {
    try {
      const res = await fetch('/api/plans/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName,
          duration,
          stripePaymentId: null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert(`${planName} plan activated!`);
        router.push('/dashboard');
      } else {
        alert('Failed to activate plan');
      }
    } catch (error) {
      alert('Error activating plan');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] p-4 sm:p-8 lg:p-12 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/10 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-violet-500/5 blur-3xl animate-float-delayed" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-12">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Choose Your Plan
          </h1>
          <p className="text-sm text-zinc-650 dark:text-zinc-400">
            Upgrade your account to unlock longer map access durations, dynamic analytics, and premium verified widgets.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 bg-white/40 dark:bg-zinc-900/40 border backdrop-blur-md hover:scale-[1.03] transition-all duration-300 ${plan.color}`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-heading text-xl font-bold text-zinc-900 dark:text-zinc-150">
                  {plan.name} Plan
                </h3>
                <div className="flex items-baseline mt-4 mb-1">
                  <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 font-heading">
                    Rs. {plan.price}
                  </span>
                  <span className="text-xs text-zinc-650 dark:text-zinc-400 ml-2">
                    / flat rate
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-450 uppercase font-semibold tracking-wider">
                  ⏱️ {plan.duration} Hour{plan.duration > 1 ? 's' : ''} total Access
                </p>
              </div>

              {/* Feature Perks List */}
              <ul className="space-y-3.5 border-t border-zinc-200/50 dark:border-zinc-800/30 pt-6 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 text-emerald-550 flex-shrink-0"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <button
                onClick={() => handleSelectPlan(plan.name, plan.price, plan.duration)}
                disabled={loading !== null}
                className={`w-full py-3.5 rounded-2xl text-sm font-semibold transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 ${plan.btnStyle}`}
              >
                {loading === plan.name ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Select plan'
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Back Link */}
        <div className="text-center pt-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-650 dark:text-indigo-400 hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}