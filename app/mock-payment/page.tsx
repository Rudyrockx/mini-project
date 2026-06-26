'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-3xl font-bold text-black mb-6">Mock Payment</h1>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Plan</p>
            <p className="text-2xl font-bold text-black">{planName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Amount</p>
            <p className="text-2xl font-bold text-black">${price}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Duration</p>
            <p className="text-2xl font-bold text-black">{duration} hours</p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
          <p className="text-sm text-black">
            <strong>This is a mock payment page.</strong> In production, this would redirect to Stripe.
          </p>
          <p className="text-xs text-gray-600 mt-2">Click "Complete Payment" to activate your plan.</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 font-bold"
          >
            {loading ? 'Processing...' : 'Complete Payment'}
          </button>

          <button
            onClick={() => router.push('/pricing')}
            className="w-full bg-gray-300 text-black py-3 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}