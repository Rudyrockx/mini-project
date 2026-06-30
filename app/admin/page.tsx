'use client';
export const dynamic = 'force-dynamic';

import { Suspense, useEffect, useState } from 'react';
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

export default function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.role?.toLowerCase() !== 'admin') {
      router.push('/dashboard');
      return;
    }

    fetchUsers();
  }, [session, page, search]);

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
        // Update URL
        const newParams = new URLSearchParams();
        newParams.set('page', page.toString());
        if (search) newParams.set('search', search);
        router.push(`/admin?${newParams.toString()}`, { scroll: false });
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
      <Suspense fallback={<div>Loading...</div>}>
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
        </Suspense>

        {/* User Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
          <div className="mt-8 flex justify-center items-center gap-4">
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
      </div>
    </div>
  );
}