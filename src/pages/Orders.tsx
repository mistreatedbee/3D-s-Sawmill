import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Package, Calendar, MapPin, Eye, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled';
  date: string;
  deliveryMethod: 'pickup' | 'delivery';
  shippingAddress?: string;
  invoiceUrl?: string;
}

export const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'delivered'>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch orders');

        const data = await response.json();
        setOrders(data.data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return ['pending', 'processing'].includes(order.status);
    if (filter === 'delivered') return ['delivered', 'ready'].includes(order.status);
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'processing':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'ready':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      case 'delivered':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Sign In Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in to view your orders
          </p>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Orders Yet
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't placed any orders yet. Start shopping now!
          </p>
          <Button onClick={() => navigate('/products')}>Shop Now</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Your Orders
          </h1>

          {/* Filters */}
          <div className="flex gap-2 mb-8">
            {[
              { value: 'all', label: 'All Orders' },
              { value: 'pending', label: 'Pending' },
              { value: 'delivered', label: 'Completed' },
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

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div>
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.date).toLocaleDateString('en-ZA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>

                    {/* Items Summary */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Items ({order.items.length})
                      </p>
                      <div className="space-y-1">
                        {order.items.slice(0, 2).map((item) => (
                          <p
                            key={item.id}
                            className="text-sm text-gray-700 dark:text-gray-300"
                          >
                            {item.name} x {item.quantity}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            +{order.items.length - 2} more item(s)
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">
                          {order.deliveryMethod === 'delivery'
                            ? 'Home Delivery'
                            : 'Pickup at Sawmill'}
                        </p>
                        {order.deliveryMethod === 'delivery' && order.shippingAddress && (
                          <p className="text-xs">{order.shippingAddress}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="flex flex-col justify-between">
                    {/* Total */}
                    <div className="text-right mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Order Total
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        R {(order.total || 0).toFixed(2)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => navigate(`/order-tracking/${order.id}`)}
                        variant="outline"
                        className="flex-1"
                        leftIcon={<Eye className="h-4 w-4" />}
                      >
                        Track Order
                      </Button>
                      {order.invoiceUrl && (
                        <a
                          href={order.invoiceUrl}
                          download
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <Card className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No orders found in this category
            </p>
            <Button onClick={() => navigate('/products')}>Place an Order</Button>
          </Card>
        )}
      </div>
    </div>
  );
};
