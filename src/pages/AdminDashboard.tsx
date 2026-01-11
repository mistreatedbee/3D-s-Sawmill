import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAnalytics } from '../hooks/useAdminAnalytics';
import { useAdminOrders } from '../hooks/useAdminOrders';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatters } from '../utils/formatters';
import { Home } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { getAnalytics, getTopProducts, loading: analyticsLoading } = useAdminAnalytics();
  const { loading: orderLoading } = useAdminOrders();

  const [analytics, setAnalytics] = useState<any>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [orderStats, setOrderStats] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const [analyticsData, productsData, ordersResponse] = await Promise.all([
        getAnalytics(),
        getTopProducts(5),
        fetch(`${API_URL}/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      setAnalytics(analyticsData);
      setTopProducts(productsData);
      
      // Get real order stats from database
      if (ordersResponse.ok) {
        const orders = await ordersResponse.json();
        const stats = {
          pending: orders.filter((o: any) => o.status === 'pending').length,
          processing: orders.filter((o: any) => o.status === 'processing' || o.status === 'confirmed' || o.status === 'packed').length,
          delivered: orders.filter((o: any) => o.status === 'delivered').length,
        };
        setOrderStats(stats);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'yellow',
      confirmed: 'blue',
      processing: 'blue',
      packed: 'blue',
      shipped: 'purple',
      out_for_delivery: 'purple',
      delivered: 'green',
      cancelled: 'red',
    };
    return colors[status] || 'gray';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-blue-100">Overview of your business metrics</p>
          </div>
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-white hover:bg-white/20 border border-white/30"
            leftIcon={<Home className="h-4 w-4" />}
          >
            Back to Home
          </Button>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-2">Total Revenue</div>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {analytics ? formatters.formatPrice(analytics.totalRevenue || 0) : 'R 0.00'}
          </div>
          <p className="text-xs text-gray-500">This period</p>
        </Card>

        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-2">Total Orders</div>
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {analytics?.totalOrders || 0}
          </div>
          <p className="text-xs text-gray-500">Completed & pending</p>
        </Card>

        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-2">Unique Customers</div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {analytics?.uniqueCustomers || 0}
          </div>
          <p className="text-xs text-gray-500">This period</p>
        </Card>

        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-2">Avg. Order Value</div>
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {analytics ? formatters.formatPrice(analytics.averageOrderValue || 0) : 'R 0.00'}
          </div>
          <p className="text-xs text-gray-500">Per order</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status Breakdown */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Order Status</h2>
          <div className="space-y-3">
            {orderStats?.statusBreakdown && Object.entries(orderStats.statusBreakdown).map(([status, count]: [string, any]) => (
              <div key={status} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge color={getStatusColor(status)}>{status}</Badge>
                </div>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Payment Status */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Payment Status</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Completed</span>
              <span className="font-bold text-green-600">{orderStats?.paymentCompleted || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Pending</span>
              <span className="font-bold text-yellow-600">{orderStats?.paymentPending || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Failed</span>
              <span className="font-bold text-red-600">{orderStats?.paymentFailed || 0}</span>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <div className="pb-3 border-b">
              <p className="text-xs text-gray-600 mb-1">New Customers</p>
              <p className="text-2xl font-bold">{analytics?.newCustomers || 0}</p>
            </div>
            <div className="pb-3 border-b">
              <p className="text-xs text-gray-600 mb-1">Repeat Customers</p>
              <p className="text-2xl font-bold">{analytics?.repeatCustomers || 0}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold">{analytics?.conversionRate ? analytics.conversionRate.toFixed(2) : '0.00'}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Top 5 Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-semibold">Product</th>
                <th className="text-left py-2 font-semibold">Category</th>
                <th className="text-right py-2 font-semibold">Sold</th>
                <th className="text-right py-2 font-semibold">Revenue</th>
                <th className="text-right py-2 font-semibold">Rating</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product: any) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 font-medium">{product.name}</td>
                  <td className="py-3">{product.category}</td>
                  <td className="py-3 text-right">{product.totalSold || 0}</td>
                  <td className="py-3 text-right font-semibold">
                    {formatters.formatPrice(product.revenue || 0)}
                  </td>
                  <td className="py-3 text-right">
                    {product.rating ? `${product.rating.toFixed(1)} ⭐` : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="w-full">View All Orders</Button>
        <Button className="w-full">Manage Promotions</Button>
        <Button className="w-full">View Inventory Alerts</Button>
      </div>

      {/* Loading State */}
      {(analyticsLoading || orderLoading) && (
        <div className="text-center p-4 text-gray-600">
          Loading dashboard data...
        </div>
      )}
    </div>
  );
};
