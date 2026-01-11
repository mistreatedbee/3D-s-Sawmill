import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAnalytics } from '../hooks/useAdminAnalytics';
import { useAdminOrders } from '../hooks/useAdminOrders';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatters } from '../utils/formatters';
import { Home, Package, Image, MessageSquare, Settings, Edit, ArrowRight } from 'lucide-react';

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

      {/* Content Management Section */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Edit className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Content Management</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Edit website content, products, gallery, and more</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Site Settings Card */}
          <Card 
            className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-blue-100 dark:border-blue-900 hover:border-blue-300 dark:hover:border-blue-700 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800"
            onClick={() => navigate('/admin/site-settings')}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Settings className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Site Settings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Edit hero, about, features, contact info
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full mt-2"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Edit Content
              </Button>
            </div>
          </Card>

          {/* Products Card */}
          <Card 
            className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-emerald-100 dark:border-emerald-900 hover:border-emerald-300 dark:hover:border-emerald-700 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-gray-800"
            onClick={() => navigate('/admin/products')}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <Package className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Products</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Add, edit, delete timber products
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full mt-2"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Manage Products
              </Button>
            </div>
          </Card>

          {/* Gallery Card */}
          <Card 
            className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-purple-100 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800"
            onClick={() => navigate('/admin/gallery')}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <Image className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Gallery</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Add, delete gallery images
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full mt-2"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Manage Gallery
              </Button>
            </div>
          </Card>

          {/* Testimonials Card */}
          <Card 
            className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-amber-100 dark:border-amber-900 hover:border-amber-300 dark:hover:border-amber-700 bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-gray-800"
            onClick={() => navigate('/admin/testimonials')}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <MessageSquare className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Testimonials</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage customer testimonials
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full mt-2"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Manage Testimonials
              </Button>
            </div>
          </Card>
        </div>

        {/* Info Banner */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Edit className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">All Website Content is Editable</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use <span className="font-semibold text-blue-600">Site Settings</span> to edit hero section, why choose us features, about section, and contact information. 
                Changes appear immediately on the customer-facing website.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="w-full" onClick={() => navigate('/admin/orders')}>View All Orders</Button>
        <Button className="w-full" onClick={() => navigate('/admin/promotions')}>Manage Promotions</Button>
        <Button className="w-full" onClick={() => navigate('/admin/analytics')}>View Analytics</Button>
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
