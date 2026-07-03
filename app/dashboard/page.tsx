'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div className="p-8">Loading...</div>;
  }

  if (!session) {
    return <div className="p-8">Not authenticated. Redirecting...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-4">Welcome, {session.user?.name}!</h1>
        <p className="text-gray-600 mb-6">Email: {session.user?.email}</p>
        
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}