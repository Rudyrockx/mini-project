'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}
interface WishlistItem {
  id: string;
  productId: string;
  addedAt: string;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
  };
}

export default function CartPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    fetchCart();
  }, [session]);




  const fetchCart = async () => {
  try {
    const res = await fetch('/api/cart', {
      credentials: 'include',  // ← Add this
    });
    const data = await res.json();
    setItems(data.items || []);
    setTotal(data.total || 0);
  } catch (error) {
    console.error('Error fetching cart:', error);
  } finally {
    setLoading(false);
  }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await fetch('/api/cart/update', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity }),
      });
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };


  const fetchWishlist = async () => {
  try {
    const res = await fetch('/api/wishlist', { credentials: 'include' });
    const data = await res.json();
    setWishlistItems(data.items || []);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
  }
};

const removeFromWishlist = async (itemId: string) => {
  try {
    const res = await fetch('/api/wishlist/remove', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId }),
    });

    if (res.ok) {
      fetchWishlist();
    }
  } catch (error) {
    console.error('Error removing from wishlist:', error);
  }
};

const moveToCart = async (product: any) => {
  try {
    await fetch('/api/cart/add', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.id,
        quantity: 1,
      }),
    });
    alert('Added to cart!');
    fetchCart();
  } catch (error) {
    console.error('Error:', error);
  }
  };




  if (loading) {
    return <div className="p-8 text-center">Loading cart...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-black mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link href="/products" className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  



  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6 flex gap-6">
                {/* Product Image */}
                <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product?.image && (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {item.product?.name}
                  </h3>
                  <p className="text-2xl font-bold text-blue-600 mb-4">
                    ${item.product?.price}
                  </p>

                  {/* Quantity Control */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="text-black px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                    >
                      −
                    </button>
                    <span className="text-lg font-semibold text-black min-w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-black px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-2xl font-bold text-black">
                    ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-8">
            <h2 className="text-2xl font-bold text-black mb-6">Order Summary</h2>
            
            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between text-black">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-black">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-black">
                <span>Tax</span>
                <span>${(total * 0.1).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-2xl font-bold text-black mb-6">
              <span>Total</span>
              <span>${(total * 1.1).toFixed(2)}</span>
            </div>

            <Link href="/checkout" className="w-full block text-center bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 mb-3">
              Proceed to Checkout
            </Link>
            <Link href="/products" className="w-full block text-center bg-gray-200 text-black py-3 rounded-lg font-bold hover:bg-gray-300">
              Continue Shopping
            </Link>
          </div>
                    {/* WISHLIST SECTION */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-black mb-2">My Wish List</h2>
            <p className="text-gray-600 mb-8">
              You have {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later.
            </p>

            {wishlistItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 mb-4">Your wishlist is empty</p>
                <Link href="/products" className="text-blue-600 hover:underline">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                    {/* Image */}
                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                      {item.product?.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-black mb-2">{item.product?.name}</h3>
                      <p className="text-2xl font-bold text-purple-600 mb-2">
                        ${item.product?.price}
                      </p>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {item.product?.description}
                      </p>

                      {/* Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => moveToCart(item.product)}
                          className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 font-bold text-sm"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:text-red-600 hover:border-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

