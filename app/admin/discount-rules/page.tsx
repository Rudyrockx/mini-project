'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus } from 'lucide-react';

interface Rule {
  id: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  discountPercent: number;
}

export default function DiscountRulesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    discountPercent: '',
  });

  useEffect(() => {
    if (!session || session?.user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    fetchRules();
  }, [session]);

  const fetchRules = async () => {
    try {
      const res = await fetch('/api/admin/discount-rules');
      const data = await res.json();
      setRules(data.rules || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await fetch('/api/admin/discount-rules', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Rule added!');
        setFormData({ category: '', minPrice: '', maxPrice: '', discountPercent: '' });
        setShowForm(false);
        fetchRules();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add rule');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this rule?')) return;

    try {
      const res = await fetch(`/api/admin/discount-rules/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        alert('Rule deleted!');
        fetchRules();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-black">Discount Rules</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Rule
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-black mb-4">New Discount Rule</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Category (e.g., Electronics)"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="border px-4 py-2 rounded text-black"
              />
              <input
                type="number"
                placeholder="Min Price"
                value={formData.minPrice}
                onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
                className="border px-4 py-2 rounded text-black"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={formData.maxPrice}
                onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
                className="border px-4 py-2 rounded text-black"
              />
              <input
                type="number"
                placeholder="Discount %"
                value={formData.discountPercent}
                onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                className="border px-4 py-2 rounded text-black"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAdd}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Save Rule
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Rules Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {rules.length === 0 ? (
            <div className="p-6 text-center text-black">No rules added yet</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-black font-semibold">Category</th>
                  <th className="px-6 py-3 text-left text-black font-semibold">Price Range</th>
                  <th className="px-6 py-3 text-left text-black font-semibold">Discount</th>
                  <th className="px-6 py-3 text-left text-black font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3 text-black">{rule.category}</td>
                    <td className="px-6 py-3 text-black">
                      ${rule.minPrice} - ${rule.maxPrice}
                    </td>
                    <td className="px-6 py-3 text-black font-bold">{rule.discountPercent}%</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleDelete(rule.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}