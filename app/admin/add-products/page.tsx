'use client'

import {useState, useEffect} from 'react';
import {useSession } from 'next-auth/react';
import {useRouter} from 'next/navigation';

export default function AddProductsPage(){
    const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [adding, setAdding] = useState(false);

    useEffect(() => {
    // Wait for session to load
    if (status === 'loading') return;

    // Check if user is authenticated
    if (!session) {
      router.push('/login');
      return;
    }

    // Check if user is admin
    if (session?.user?.role?.toLowerCase() !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [session, status, router]);

  // Show loading while checking auth
  if (status === 'loading' || !session || session?.user?.role?.toLowerCase() !== 'admin') {
    return <div className="p-8 text-center">Loading...</div>;
  }

    const handleAdd = async () => {
        setAdding(true);
        try {
            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    price: parseFloat(price),
                    category,
                    description: '',
                    rating: 0,
                    reviews: 0,
                    inStock: true,
                    image,
                }),
            });
            if (res.ok) {
                alert('Product added');
                setName('');
                setPrice('');
                setCategory('');
                setImage('');
            }
            
        } catch (error) {
            console.error('Error adding product:', error);
        } finally {
            setAdding(false);
        }
    };
     return (
    <div className="min-h screen bg-white p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-black">Add Product</h1>
      <input
        type="text"
        placeholder="Product name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded mb-4 text-black"
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full p-2 border rounded mb-4 text-black"
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 border rounded mb-4 text-black"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded mb-4 text-black"
      />
      <input
        type="text"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="w-full p-2 border rounded mb-4 text-black"
      />
      <button
        onClick={handleAdd}
        disabled={adding}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {adding ? 'Adding...' : 'Add Product'}
      </button>
    </div>
  );
}