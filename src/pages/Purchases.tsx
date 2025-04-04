import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Download, Home } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';

interface Purchase {
  id: string;
  items: Array<{
    id: string;
    title: string;
    author: string;
    price: number;
    file_url: string;
  }>;
  total_amount: number;
  status: string;
  created_at: string;
}

const Purchases = () => {
  const { user } = useStore();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('purchases')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setPurchases(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch purchases');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [user]);

  const handleDownload = async (bookId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-download-url`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.id,
          book_id: bookId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get download URL');
      }

      // Open the download URL in a new tab
      window.open(data.url, '_blank');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download book');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Purchase History</h1>
          <Link to="/" className="text-gray-600 hover:text-indigo-600 flex items-center gap-2">
            <Home className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {purchases.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No purchases found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">
                        Order ID: {purchase.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        Date: {new Date(purchase.created_at).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      purchase.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : purchase.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {purchase.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                        <p className="text-gray-500">{item.author}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-indigo-600 font-medium">${item.price}</p>
                        {purchase.status === 'completed' && (
                          <button
                            onClick={() => handleDownload(item.id)}
                            className="flex items-center gap-2 text-green-600 hover:text-green-700"
                            title="Download E-book"
                          >
                            <Download className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-indigo-600">
                      ${purchase.total_amount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Purchases;