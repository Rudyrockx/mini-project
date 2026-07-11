'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    fetchCart();
    loadRazorpayScript();
  }, [session]);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart', {
        credentials: 'include',
      });
      const data = await res.json();
      setCartItems(data.items || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching cart:', error);
      alert('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      alert('Cart is empty');
      return;
    }

    setProcessing(true);

    try {
      // Create order
      const orderRes = await fetch('/api/orders/create', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'INR',
          cartItems,
        }),
      });

      if (!orderRes.ok) {
        alert('Failed to create order');
        setProcessing(false);
        return;
      }

      const orderData = await orderRes.json();

      // Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.razorpayOrderId,
        handler: async (response: any) => {
          // Verify payment
          const verifyRes = await fetch('/api/orders/verify', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderData.orderId,
            }),
          });

          if (verifyRes.ok) {
            alert('Payment successful!');
            router.push('/orders');
          } else {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: session?.user?.name,
          email: session?.user?.email,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error:', error);
      alert('Payment error');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading checkout...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="p-8 text-center">
        <p>Cart is empty</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-8">Checkout</h1>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between mb-4 border-b pb-4">
              <span>{item.product?.name} x{item.quantity}</span>
              <span>₹{(item.product?.price || 0) * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between text-2xl font-bold text-black pt-4">
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {processing ? 'Processing...' : 'Pay with Razorpay'}
        </button>
      </div>
    </div>
  );
}