import React, { useState, useEffect } from 'react';
import { useAdminAnalytics } from '../hooks/useAdminAnalytics';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { formatters } from '../utils/formatters';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  uniqueCustomers: number;
  newCustomers: number;
  repeatCustomers: number;
  conversionRate: number;
  totalDiscounts: number;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  sold: number;
  revenue: number;
  rating?: number;
}

interface CategoryData {
  category: string;
  sales: number;
  revenue: number;
}

interface PaymentData {
  method: string;
  count: number;
  revenue: number;
}

export function AdminAnalytics() {
  const { getAnalytics, getTopProducts, getCategoryAnalytics, getPaymentMethodAnalytics, loading, error } = useAdminAnalytics();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [paymentData, setPaymentData] = useState<PaymentData[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    loadAnalytics();
  }, [dateFilter]);

  const loadAnalytics = async () => {
    try {
      let start = undefined;
      let end = undefined;

      if (dateFilter === 'week') {
        const now = new Date();
        end = new Date();
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (dateFilter === 'month') {
        const now = new Date();
        end = new Date();
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (dateFilter === 'quarter') {
        const now = new Date();
        end = new Date();
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      } else if (dateFilter === 'custom' && startDate && endDate) {
        start = new Date(startDate);
        end = new Date(endDate);
      }

      const [analyticsData, products, categories, payments] = await Promise.all([
        getAnalytics(start, end),
        getTopProducts(10),
        getCategoryAnalytics(),
        getPaymentMethodAnalytics()
      ]);

      setAnalytics(analyticsData);
      setTopProducts(products);
      setCategoryData(categories);
      setPaymentData(payments);
    } catch (err) {
      console.error('Error loading analytics:', err);
    }
  };

  const handleCustomDateFilter = () => {
    if (startDate && endDate) {
      setDateFilter('custom');
      loadAnalytics();
    }
  };

  const getTotalRevenue = (data: PaymentData[]) => {
    return data.reduce((sum, item) => sum + item.revenue, 0);
  };

  const getTotalPayments = (data: PaymentData[]) => {
    return data.reduce((sum, item) => sum + item.count, 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">View comprehensive business metrics and performance</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-800 font-semibold">Error: {error}</p>
        </div>
      )}

      <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Date Range</h2>
          <div className="flex flex-wrap gap-2">
            {['all', 'week', 'month', 'quarter'].map(period => (
              <Button
                key={period}
                onClick={() => setDateFilter(period)}
                variant={dateFilter === period ? 'primary' : 'outline'}
                className={dateFilter === period ? 'bg-white text-blue-600' : 'bg-blue-50 text-gray-700'}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Button>
            ))}
          </div>
          {dateFilter === 'custom' && (
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
      ) : (
        <>
          {analytics && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-6 border-l-4 border-blue-500">
                  <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {formatters.formatPrice(analytics?.totalRevenue || 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">All time sales</p>
                </Card>

                <Card className="p-6 border-l-4 border-green-500">
                  <p className="text-sm text-gray-600 font-medium">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {(analytics?.totalOrders || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Completed orders</p>
                </Card>

                <Card className="p-6 border-l-4 border-purple-500">
                  <p className="text-sm text-gray-600 font-medium">Avg Order Value</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {formatters.formatPrice(analytics?.averageOrderValue || 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Per transaction</p>
                </Card>

                <Card className="p-6 border-l-4 border-orange-500">
                  <p className="text-sm text-gray-600 font-medium">Unique Customers</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {(analytics?.uniqueCustomers || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Total customers</p>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6">
                  <p className="text-sm text-gray-600 font-medium">New Customers</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {(analytics?.newCustomers || 0).toLocaleString()}
                  </p>
                </Card>

                <Card className="p-6">
                  <p className="text-sm text-gray-600 font-medium">Repeat Customers</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {(analytics?.repeatCustomers || 0).toLocaleString()}
                  </p>
                </Card>

                <Card className="p-6">
                  <p className="text-sm text-gray-600 font-medium">Conversion Rate</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">
                    {analytics.conversionRate.toFixed(2)}%
                  </p>
                </Card>
              </div>
            </>
          )}

          {topProducts.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Top 10 Products</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-700 font-semibold">Product</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-semibold">Category</th>
                      <th className="text-center py-3 px-4 text-gray-700 font-semibold">Units Sold</th>
                      <th className="text-right py-3 px-4 text-gray-700 font-semibold">Revenue</th>
                      <th className="text-center py-3 px-4 text-gray-700 font-semibold">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, idx) => (
                      <tr key={product._id} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-gray-50' : ''}`}>
                        <td className="py-3 px-4 font-medium text-gray-900">{product.name}</td>
                        <td className="py-3 px-4 text-gray-600">{product.category}</td>
                        <td className="text-center py-3 px-4 text-gray-900 font-semibold">
                          {product.sold.toLocaleString()}
                        </td>
                        <td className="text-right py-3 px-4 font-semibold text-green-600">
                          {formatters.formatPrice(product.revenue)}
                        </td>
                        <td className="text-center py-3 px-4">
                          {product.rating && (
                            <span className="text-yellow-500 font-semibold">
                              ★ {product.rating.toFixed(1)}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryData.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Sales by Category</h2>
                <div className="space-y-3">
                  {categoryData.map(cat => {
                    const totalRevenue = getTotalRevenue(paymentData);
                    const percentage = totalRevenue > 0 ? (cat.revenue / totalRevenue) * 100 : 0;
                    return (
                      <div key={cat.category}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                          <span className="text-sm font-bold text-gray-900">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatters.formatPrice(cat.revenue)} • {cat.sales} orders
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {paymentData.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Methods</h2>
                <div className="space-y-3">
                  {paymentData.map(payment => {
                    const totalPayments = getTotalPayments(paymentData);
                    const percentage = totalPayments > 0 ? (payment.count / totalPayments) * 100 : 0;
                    return (
                      <div key={payment.method}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">{payment.method}</span>
                          <span className="text-sm font-bold text-gray-900">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {payment.count} transactions • {formatters.formatPrice(payment.revenue)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>

          <Card className="p-6 bg-blue-50 border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-2">💡 Pro Tips</h3>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Monitor conversion rate trends for marketing optimization</li>
              <li>Focus on top-performing categories for inventory planning</li>
              <li>Track payment methods to optimize checkout process</li>
              <li>Analyze repeat customer percentage for loyalty program success</li>
            </ul>
          </Card>
        </>
      )}
    </div>
  );
}
