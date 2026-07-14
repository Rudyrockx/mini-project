'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  role: string;
  createdAt: Date;
  subscriptions: Array<{
    plan: { name: string; durationHours: number };
    isActive: boolean;
    expiresAt: Date;
  }>;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 10,
    totalPages: 1,
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session?.user?.role?.toLowerCase() !== 'admin') {
      router.push('/dashboard');
      return;
    }

    fetchUsers();
    fetchProducts();
  }, [session, status, page, search]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      if (search) queryParams.append('search', search);

      const res = await fetch(`/api/admin/users?${queryParams}`);
      const data = await res.json();

      if (data.success) {
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (res.ok) {
        alert('Product deleted!');
        fetchProducts();
      } else {
        alert('Failed to delete');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting product');
    }
  };

  if (status === 'loading') {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-black">Admin Panel</h1>
          <Link
            href="/dashboard"
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* USERS SECTION */}
        <h2 className="text-2xl font-bold text-black mb-4">Users</h2>
        
        {/* Search */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Search Users (Name or Email)
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type name or email..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Search
            </button>
          </form>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          {loading ? (
            <div className="p-6 text-center text-black">Loading...</div>
          ) : users.length === 0 ? (
            <div className="p-6 text-center text-black">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-black font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-black font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-black font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-black font-semibold">Current Plan</th>
                    <th className="px-6 py-3 text-left text-black font-semibold">Expires</th>
                    <th className="px-6 py-3 text-left text-black font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const currentPlan = user.subscriptions[0];
                    return (
                      <tr key={user.id} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-3 text-black">{user.name || 'N/A'}</td>
                        <td className="px-6 py-3 text-black">{user.email}</td>
                        <td className="px-6 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              user.emailVerified
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {user.emailVerified ? 'Verified' : 'Unverified'}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-black">
                          {currentPlan?.plan?.name || 'No Plan'}
                        </td>
                        <td className="px-6 py-3 text-black">
                          {currentPlan?.expiresAt
                            ? new Date(currentPlan.expiresAt).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-3 text-black">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-4 mb-12">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-black">
              Page {page} of {pagination.totalPages} (Total: {pagination.total} users)
            </span>

            <button
              onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
              disabled={page === pagination.totalPages}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* PRODUCTS SECTION */}
        <h2 className="text-2xl font-bold text-black mb-4">Products</h2>
        
        <div className="flex justify-end mb-4">
          <Link
            href="/admin/add-products"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            + Add Product
          </Link>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {products.length === 0 ? (
            <div className="p-6 text-center text-black">No products found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-black font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-black font-semibold">Category</th>
                    <th className="px-6 py-3 text-left text-black font-semibold">Price</th>
                    <th className="px-6 py-3 text-left text-black font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-3 text-black">{product.name}</td>
                      <td className="px-6 py-3 text-black">{product.category}</td>
                      <td className="px-6 py-3 text-black">${product.price}</td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}