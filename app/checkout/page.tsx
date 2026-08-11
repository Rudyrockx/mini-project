'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';





import dynamic from 'next/dynamic';
import {
  MapPin,
  Truck,
  Package,
  CreditCard,
  Lock,
  ShieldCheck,
  ShoppingBag,
  User,
  ArrowRight,
  Wallet,
  CheckCircle2,

} from 'lucide-react';
import AddressAutocomplete from '@/app/components/AddressAutocomplete';
import 'leaflet/dist/leaflet.css';
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });



interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    description?: string;
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
  const [map, setMap] = useState<any>(null);
   const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    latitude: 0,
    longitude: 0,
  });

  // Form State
  const [fullName, setFullName] = useState('John Doe');
  const [address, setAddress] = useState('123 Luxury Lane');
  const [city, setCity] = useState('New York');
  const [zipCode, setZipCode] = useState('10001');
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 000-0000');

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    if (session?.user?.name) {
      setFullName(session.user.name);
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
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    try {
      // Use Geoapify reverse geocoding
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API}`
      );
      
      const data = await response.json();
      const address = data.features?.[0]?.properties?.formatted || `${lat}, ${lng}`;
      
      // Update form data with clicked location
      setFormData((prev) => ({
        ...prev,
        address: address,
        latitude: lat,
        longitude: lng,
      }));
    } catch (error) {
      console.error('Error getting address:', error);
      setFormData((prev) => ({
        ...prev,
        address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        latitude: lat,
        longitude: lng,
      }));
    }
  }, []);

  useEffect(() => {
    if (!map) return;
    const onClick = (e: any) => {
      handleMapClick(e.latlng.lat, e.latlng.lng);
    };
    map.on('click', onClick);
    return () => {
      map.off('click', onClick);
    };
  }, [map, handleMapClick]);


  const loadRazorpayScript = () => {
    if (document.getElementById('razorpay-sdk')) return;
    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const handlePayment = async () => {
    const amountToPay = calculatedTotal;
    setProcessing(true);

    try {
      const orderRes = await fetch('/api/orders/create', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountToPay,
          currency: 'INR',
          cartItems: cartItems.length > 0 ? cartItems : mockCartItems,
        }),
      });

      if (!orderRes.ok) {
        alert('Failed to create order');
        setProcessing(false);
        return;
      }

      const orderData = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.razorpayOrderId,
        handler: async (response: any) => {
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
          name: fullName || session?.user?.name,
          email: session?.user?.email,
          contact: phoneNumber,
        },
      };

      if (typeof window !== 'undefined') {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } 
    } catch (error) {
      console.error('Error:', error);
      alert('Payment error');
    } finally {
      setProcessing(false);
    }
  };

  // Sample items matching the reference design when cart is empty
  const mockCartItems = [
    {
      id: 'mock-1',
      name: 'Sculptural Tote',
      variant: 'Color: Ivory | Qty: 1',
      price: 850.0,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'mock-2',
      name: 'Horizon Chrono',
      variant: 'Style: Brushed Steel | Qty: 1',
      price: 1200.0,
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&auto=format&fit=crop&q=80',
    },
  ];

  const hasRealCart = cartItems.length > 0;
  const rawSubtotal = hasRealCart
    ? cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0)
    : 2050.0;

  const shippingCost = shippingMethod === 'express' ? 25.0 : 0.0;
  const estimatedTax = Math.round(rawSubtotal * 0.08 * 100) / 100;
  const calculatedTotal = rawSubtotal + shippingCost + estimatedTax;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-slate-500 font-medium">
        Loading checkout...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* LUXE Top Navigation Header */}
      

      {/* Main Checkout Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Checkout</h1>
          <p className="text-slate-500 text-sm mt-1">Review your details and complete your purchase.</p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Cards */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Shipping Address */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-purple-600">
                  <Truck className="w-5 h-5 stroke-[2]" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Shipping Address</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Luxury Lane"
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="New York"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Zip Code</label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="10001"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
              {/* Address Autocomplete panel */}
            <div className="bg-white dark:bg-zinc-900 border border-[#e5eeff] dark:border-zinc-800/30 rounded-3xl mt-5 p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="font-heading text-lg font-bold text-[#0b1c30] dark:text-zinc-50 border-b border-[#e5eeff] dark:border-zinc-800 pb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#6c2ce6]" />
                Address for Delivery
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#45464d] dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Physical Address Search
                  </label>
                  <AddressAutocomplete
                    value={formData.address}
                    onChange={(address, lat, lng) => {
                      setFormData((prev) => ({
                        ...prev,
                        address: address,
                        latitude: lat,
                        longitude: lng,
                      }));
                    }}
                    
                  />
                  <p className="text-[10px] text-[#45464d] dark:text-zinc-500 mt-1.5 uppercase tracking-wider font-semibold">
                    Type to search coordinates pinpoint
                  </p>
                </div>

                
              </div>
            </div>
            <div className="relative border border-[#e5eeff] dark:border-zinc-800 rounded-2xl overflow-hidden shadow-inner bg-[#f8f9ff] dark:bg-zinc-950 z-0 mt-5">
                {typeof window !== 'undefined' && (
                  <MapContainer
                    ref={setMap}
                    center={[formData.latitude || 20.5937, formData.longitude || 78.9629]}
                    zoom={formData.latitude && formData.longitude ? 15 : 4}
                    style={{ width: '100%', height: '400px' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; OpenStreetMap contributors'
                    />
                    {formData.latitude && formData.longitude && (
                     <Marker position={[formData.latitude, formData.longitude]}>
                        <Popup>{formData.address || 'Your Location'}</Popup>
                    </Marker>
                    )}
                  </MapContainer>
                )}
              </div>
            </div>

            {/* 2. Shipping Method */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-purple-600">
                  <Package className="w-5 h-5 stroke-[2]" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Shipping Methods</h2>
              </div>

              <div className="space-y-3">
                {/* Standard Shipping */}
                <label
                  onClick={() => setShippingMethod('standard')}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    shippingMethod === 'standard'
                      ? 'border-purple-600 bg-purple-50/20 ring-1 ring-purple-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        shippingMethod === 'standard' ? 'border-purple-600 bg-purple-600' : 'border-slate-300'
                      }`}
                    >
                      {shippingMethod === 'standard' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Standard Shipping</p>
                      <p className="text-xs text-slate-500 mt-0.5">3-5 Business Days</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">Free</span>
                </label>

                {/* Express Delivery */}
                <label
                  onClick={() => setShippingMethod('express')}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    shippingMethod === 'express'
                      ? 'border-purple-600 bg-purple-50/20 ring-1 ring-purple-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        shippingMethod === 'express' ? 'border-purple-600 bg-purple-600' : 'border-slate-300'
                      }`}
                    >
                      {shippingMethod === 'express' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Express Delivery</p>
                      <p className="text-xs text-slate-500 mt-0.5">Next Day Arrival</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">$25.00</span>
                </label>
              </div>
            </div>

            {/* 3. Payment Details */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-purple-600">
                  <CreditCard className="w-5 h-5 stroke-[2]" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Payment Details</h2>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                    paymentMethod === 'card'
                      ? 'border-slate-900 text-slate-900 bg-white ring-1 ring-slate-900'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-slate-900 text-slate-900 bg-white ring-1 ring-slate-900'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white'
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  PayPal
                </button>
              </div>

              {/* Form Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-400 pr-10"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Expiry Date</label>
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM / YY"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">CVV</label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="***"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 text-slate-400 text-xs">
                  <div className="p-1 rounded bg-slate-100 text-slate-500">
                    <Lock className="w-3 h-3" />
                  </div>
                  <span>Your transaction is secured with 256-bit SSL encryption.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h2>

              {/* Items List */}
              <div className="space-y-4 mb-6">
                {hasRealCart
                  ? cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-100 flex-shrink-0 overflow-hidden">
                          {item.product?.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-semibold bg-slate-100">
                              Product
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-slate-900 truncate">{item.product?.name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-medium text-slate-900">
                          ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))
                  : mockCartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-100 flex-shrink-0 overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-slate-900 truncate">{item.name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{item.variant}</p>
                        </div>
                        <span className="text-sm font-medium text-slate-900">${item.price.toFixed(2)}</span>
                      </div>
                    ))}
              </div>

              <hr className="border-slate-100 my-6" />

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">${rawSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-purple-600">
                    {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Tax</span>
                  <span className="font-medium text-slate-900">${estimatedTax.toFixed(2)}</span>
                </div>
              </div>

              {/* Total Price */}
              <div className="flex justify-between items-baseline mb-6 pt-2 border-t border-slate-100">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-2xl font-bold text-slate-900">
                  ${calculatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Place Order Button */}
              <button
                type="button"
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-[#6C3CE9] hover:bg-[#5b31ca] text-white py-3.5 px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                <span>{processing ? 'Processing...' : 'Place Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 mt-6 text-slate-400">
                <div className="p-2 rounded-lg border border-slate-200">
                  <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div className="p-2 rounded-lg border border-slate-200">
                  <CreditCard className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div className="p-2 rounded-lg border border-slate-200">
                  <Lock className="w-5 h-5 stroke-[1.5]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* LUXE Footer */}
      <footer className="bg-slate-50 border-t border-slate-200/60 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-900 tracking-wider mr-2">LUXE</span>
            <span>© 2024 LUXE Premium Retail. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-slate-800 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-slate-800 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-slate-800 transition-colors">
              Shipping Info
            </Link>
            <Link href="#" className="hover:text-slate-800 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
