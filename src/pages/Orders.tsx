import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useOrders, Order as ApiOrder } from '../hooks/useOrders';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Package, Calendar, MapPin, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getUserOrders, loading } = useOrders();

  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      const data = await getUserOrders(user.id);
      setOrders(Array.isArray(data) ? data : []);
    };
    if (user) load();
  }, [user, getUserOrders]);

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return ['pending', 'quoted', 'invoiced', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery'].includes(order.status);
    if (filter === 'completed') return ['completed', 'delivered', 'cancelled', 'refunded'].includes(order.status);
    return true;
  });

  const getStatusColor = (status: string) => {
    if (['pending'].includes(status)) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
    if (['quoted', 'invoiced', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery'].includes(status)) {
      return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
    }
    if (['completed', 'delivered'].includes(status)) return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    if (['cancelled', 'refunded'].includes(status)) return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
    return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Sign In Required</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please sign in to view your orders</p>
          <Button onClick={() => navigate('/portal')}>Sign In</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 pb-20">
        <div className="container mx-auto px-4 text-center">
          <Package className="h-12 w-12 mx-auto text-gray-300 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 pb-20">
        <div className="container mx-auto px-4 text-center">
          <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Orders Yet</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't submitted any requests yet. Start shopping now!</p>
          <Button onClick={() => navigate('/products')}>Shop Now</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Your Orders</h1>
          <div className="flex gap-2 mb-8">
            {[
              { value: 'all', label: 'All' },
              { value: 'pending', label: 'Active' },
              { value: 'completed', label: 'Completed' },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value as any)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === f.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order, index) => {
            const street = order.shippingAddress?.street || '';
            const city = order.shippingAddress?.city || '';
            const province = (order.shippingAddress as any)?.province || (order.shippingAddress as any)?.state || '';
            const postalCode = (order.shippingAddress as any)?.postalCode || (order.shippingAddress as any)?.zip || (order.shippingAddress as any)?.zipCode || '';

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {order.orderNumber}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status.replaceAll('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.createdAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Items ({order.items.length})
                        </p>
                        <div className="space-y-1">
                          {order.items.slice(0, 2).map((item, idx2) => (
                            <p key={idx2} className="text-sm text-gray-700 dark:text-gray-300">
                              {(item as any).productId?.name || item.name || (item as any).productName || 'Product'} x {item.quantity}
                            </p>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">+{order.items.length - 2} more</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">
                            {order.deliveryMethod === 'delivery' ? 'Home Delivery' : 'Pickup'}
                          </p>
                          {order.deliveryMethod === 'delivery' && (
                            <p className="text-xs">
                              {street}{street && (city || province || postalCode) ? ', ' : ''}{city}{city && (province || postalCode) ? ', ' : ''}{province} {postalCode}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between">
                      <div className="text-right mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
                        <p className="text-2xl font-bold text-blue-600">
                          R {(order.total || 0).toFixed(2)}
                        </p>
                        {order.requestType && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {order.requestType === 'quote' ? 'Quote request' : 'Invoice request'}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => navigate(`/order-tracking/${order._id}`)}
                          variant="outline"
                          className="flex-1"
                          leftIcon={<Eye className="h-4 w-4" />}
                        >
                          Track
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <Card className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">No orders found in this category</p>
            <Button onClick={() => navigate('/products')}>Browse Products</Button>
          </Card>
        )}
      </div>
    </div>
  );
};
