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
  },
  {
    name: 'Silver',
    price: 999,
    duration: 6,
    features: ['6 hours access', 'Full profile', 'Map display', 'Priority support'],
  },
  {
    name: 'Gold',
    price: 2999,
    duration: 12,
    features: ['12 hours access', 'Premium profile', 'Analytics', '24/7 support'],
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

  if (price === 0) {
    // Free plan - no payment needed
    await activatePlan(planName, duration, null);
    return;
  }

  // Redirect to mock payment page
  router.push(`/mock-payment?plan=${planName}&price=${price}&duration=${duration}`);
  };

   

  const activatePlan = async (
    planName: string,
    duration: number,
    stripePaymentId: string | null
  ) => {
    try {
      const res = await fetch('/api/plans/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName,
          duration,
          stripePaymentId,
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Choose Your Plan</h1>
          <p className="text-black">Select a plan and get instant access</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-2xl font-bold text-black mb-2">{plan.name}</h2>
              <div className="mb-4">
                <span className="text-4xl font-bold text-black">
                  Rs.{plan.price}
                </span>
                <p className="text-black text-sm mt-2">{plan.duration} hours access</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="text-black text-sm">
                    ✓ {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() =>
                  handleSelectPlan(plan.name, plan.price, plan.duration)
                }
                disabled={loading === plan.name}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loading === plan.name ? 'Processing...' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/dashboard" className="text-blue-500 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}