'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`);
      const data = await res.json();
      setProduct(data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleAddToCart = async () => {
  if (!product) {
    alert('Product not found');
    return;
  }

  try {
    const res = await fetch('/api/cart/add', {
      method: 'POST',
      credentials: 'include',  // ← Add this line
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.id,
        quantity,
      }),
    });

    if (res.ok) {
      alert('Added to cart!');
      setQuantity(1);
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
};

  

  if (loading) {
    return <div className="p-8 text-center">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600 mb-4">Product not found</p>
        <Link href="/products" className="text-blue-500 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Link href="/products" className="text-blue-500 hover:underline mb-8 inline-block">
        ← Back to Products
      </Link>

      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-gray-400">No Image Available</div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">{product.name}</h1>
              <p className="text-gray-600 text-sm">{product.category}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <span className="text-yellow-500 text-2xl">★</span>
                <span className="text-xl font-semibold text-black ml-2">
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-600">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <span className="text-4xl font-bold text-black">${product.price}</span>
              <p className="text-green-600 font-semibold">
                {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
              </p>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-black mb-2">Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <label className="text-black font-semibold">Quantity:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className=" text-black px-4 py-2 border border-gray-300 rounded-lg"
                >
                  {[1, 2, 3, 4, 5, 10].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <button
  onClick={handleAddToCart}
  disabled={!product.inStock}
  className={`w-full py-3 rounded-lg font-bold text-white transition ${
    product.inStock
      ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
      : 'bg-gray-400 cursor-not-allowed'
  }`}
>
  Add to Cart
</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}