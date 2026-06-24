import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-black text-3xl font-bold mb-4">Welcome, {session.user?.name}!</h1>
        <p className="text-gray-600 mb-6">Email: {session.user?.email}</p>
        <div className="flex justify-between items-center mb-6">
          
          <Link href="/profile" className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
            Go To Profile
          </Link>

        

        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/login' });
          }}
        >
          <button
            type="submit"
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
          >
            Sign Out
          </button>
          
        </form>
        </div>
      </div>
    </div>
  );
}