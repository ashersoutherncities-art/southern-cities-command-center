'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Deal {
  id: number;
  name: string;
  status: string;
  value: number;
  probability: number;
}

export default function DealsWidget() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const data = await api.getDeals();
      setDeals(data as Deal[]);
    } catch (error) {
      console.error('Error loading deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      under_contract: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      negotiating: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      analyzing: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          🏡 Deals Pipeline
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {deals.length} active
        </span>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : deals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No deals in pipeline</div>
        ) : (
          deals.map(deal => (
            <div
              key={deal.id}
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white flex-1">
                  {deal.name}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getStatusColor(deal.status)}`}>
                  {deal.status.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ${(deal.value / 1000).toFixed(0)}K
                </span>
                <div className="text-right">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Probability</div>
                  <div className={`text-sm font-semibold ${
                    deal.probability >= 70 ? 'text-green-600' :
                    deal.probability >= 40 ? 'text-yellow-600' :
                    'text-orange-600'
                  }`}>
                    {deal.probability}%
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
