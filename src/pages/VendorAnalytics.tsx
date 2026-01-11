import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useAuth } from '../context/AuthContext';
import { formatters } from '../utils/formatters';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface VendorStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  avgOrderValue: number;
  topProducts: Array<{
    name: string;
    sold: number;
    revenue: number;
  }>;
  categorySales: Array<{
    category: string;
    sales: number;
    revenue: number;
  }>;
  monthlySales: Array<{
    month: string;
    sales: number;
    revenue: number;
  }>;
}

export function VendorAnalytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `${API_URL}/vendor/analytics?period=${period}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomDateFilter = () => {
    if (startDate && endDate) {
      setPeriod('custom');
      loadAnalytics();
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">Please log in as a vendor to access analytics</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sales Analytics</h1>
        <p className="text-gray-600 mt-1">Track your sales performance and trends</p>
      </div>

      {/* Period Selector */}
      <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Period Selection</h2>
          <div className="flex flex-wrap gap-2">
            {['week', 'month', 'quarter', 'year'].map(p => (
              <Button
                key={p}
                onClick={() => setPeriod(p)}
                variant={period === p ? 'primary' : 'outline'}
                className={period === p ? 'bg-white text-blue-600' : 'bg-blue-50 text-gray-700'}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Button>
            ))}
          </div>
          {period === 'custom' && (
            <div className="flex gap-4 pt-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1"
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleCustomDateFilter} className="bg-white text-blue-600 hover:bg-gray-50">
                Apply
              </Button>
            </div>
          )}
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : stats ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 font-medium">Total Sales</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatters.formatPrice(stats.totalSales)}
              </p>
              <p className="text-xs text-gray-500 mt-2">Revenue earned</p>
            </Card>

            <Card className="p-6 border-l-4 border-green-500">
              <p className="text-sm text-gray-600 font-medium">Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalOrders}
              </p>
              <p className="text-xs text-gray-500 mt-2">Total orders</p>
            </Card>

            <Card className="p-6 border-l-4 border-purple-500">
              <p className="text-sm text-gray-600 font-medium">Avg Order Value</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatters.formatPrice(stats.avgOrderValue)}
              </p>
              <p className="text-xs text-gray-500 mt-2">Per transaction</p>
            </Card>

            <Card className="p-6 border-l-4 border-orange-500">
              <p className="text-sm text-gray-600 font-medium">Products</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalProducts}
              </p>
              <p className="text-xs text-gray-500 mt-2">Active listings</p>
            </Card>
          </div>

          {/* Top Products */}
          {stats.topProducts.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Top Products</h2>
              <div className="space-y-3">
                {stats.topProducts.map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between pb-3 border-b border-gray-200 last:border-0">
                    <div>
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sold} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">
                        {formatters.formatPrice(product.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Category Sales */}
          {stats.categorySales.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sales by Category</h2>
              <div className="space-y-4">
                {stats.categorySales.map((cat, idx) => {
                  const totalRevenue = stats.totalSales;
                  const percentage = totalRevenue > 0 ? (cat.revenue / totalRevenue) * 100 : 0;
                  return (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">{cat.category}</span>
                        <span className="text-sm font-bold text-gray-600">
                          {percentage.toFixed(1)}% • {formatters.formatPrice(cat.revenue)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Monthly Trend */}
          {stats.monthlySales.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sales Trend</h2>
              <div className="space-y-3">
                {stats.monthlySales.map((month, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{month.month}</span>
                      <span className="text-sm font-bold text-gray-900">
                        {month.sold} orders • {formatters.formatPrice(month.revenue)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full"
                        style={{
                          width: `${Math.min(100, (month.revenue / (stats.totalSales / (stats.monthlySales.length || 1))) * 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Tips */}
          <Card className="p-6 bg-blue-50 border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-3">💡 Tips to Boost Sales</h3>
            <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
              <li>Focus on your top-selling categories</li>
              <li>Optimize listings for better visibility</li>
              <li>Monitor customer feedback and reviews</li>
              <li>Plan inventory based on sales trends</li>
              <li>Run promotions during peak seasons</li>
            </ul>
          </Card>
        </>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No analytics data available</p>
        </Card>
      )}
    </div>
  );
}
