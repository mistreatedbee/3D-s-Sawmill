import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../hooks/useOrders';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { formatters } from '../utils/formatters';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const { getUserOrders, loading, error } = useOrders();
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (user?._id) {
      loadOrders();
    }
  }, [user?._id, filter]);

  const loadOrders = async () => {
    try {
      if (user?._id) {
        const data = await getUserOrders(user._id, filter === 'all' ? undefined : filter);
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      pending: 'yellow',
      confirmed: 'blue',
      processing: 'blue',
      packed: 'blue',
      shipped: 'purple',
      out_for_delivery: 'purple',
      delivered: 'green',
      cancelled: 'red',
      refunded: 'gray',
    };
    return statusColors[status] || 'gray';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      processing: 'Processing',
      packed: 'Packed',
      shipped: 'Shipped',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      refunded: 'Refunded',
    };
    return labels[status] || status;
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your dashboard.</p>
          <Link to="/portal">
            <Button>Sign In</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="p-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
        <p className="text-blue-100">Manage your orders and track your shipments</p>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-2">Total Orders</div>
          <div className="text-3xl font-bold">{orders.length}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-2">Pending</div>
          <div className="text-3xl font-bold text-yellow-600">
            {orders.filter(o => o.status === 'pending').length}
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-2">Shipped</div>
          <div className="text-3xl font-bold text-purple-600">
            {orders.filter(o => ['shipped', 'out_for_delivery'].includes(o.status)).length}
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-2">Delivered</div>
          <div className="text-3xl font-bold text-green-600">
            {orders.filter(o => o.status === 'delivered').length}
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <Card className="p-8 text-center text-gray-600">Loading orders...</Card>
        ) : error ? (
          <Card className="p-8 text-center text-red-600">{error}</Card>
        ) : orders.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600 mb-4">No orders yet</p>
            <Link to="/products">
              <Button>Start Shopping</Button>
            </Link>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order._id} className="p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold">{order.orderNumber}</h3>
                  <p className="text-sm text-gray-600">
                    Ordered on {formatters.formatDate(order.createdAt)}
                  </p>
                </div>
                <Badge color={getStatusColor(order.status)}>
                  {getStatusLabel(order.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b">
                <div>
                  <p className="text-xs text-gray-600">Total</p>
                  <p className="font-bold">{formatters.formatPrice(order.total)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Items</p>
                  <p className="font-bold">{order.items.length}</p>
                </div>
                {order.trackingNumber && (
                  <div>
                    <p className="text-xs text-gray-600">Tracking</p>
                    <p className="font-bold font-mono text-sm">{order.trackingNumber}</p>
                  </div>
                )}
                {order.estimatedDelivery && (
                  <div>
                    <p className="text-xs text-gray-600">Est. Delivery</p>
                    <p className="font-bold">{formatters.formatDate(order.estimatedDelivery)}</p>
                  </div>
                )}
              </div>

              {/* Status Timeline */}
              {order.statusHistory && order.statusHistory.length > 0 && (
                <div className="mb-4 pb-4 border-b">
                  <p className="text-xs font-bold text-gray-700 mb-2">Status History</p>
                  <div className="flex flex-col gap-2">
                    {order.statusHistory.slice(0, 2).map((history: any, idx: number) => (
                      <div key={idx} className="text-xs text-gray-600">
                        <span className="font-semibold">{getStatusLabel(history.status)}</span>
                        <span className="text-gray-500"> • {formatters.formatDate(history.timestamp)}</span>
                      </div>
                    ))}
                    {order.statusHistory.length > 2 && (
                      <p className="text-xs text-blue-600 cursor-pointer hover:underline">
                        View all {order.statusHistory.length} updates
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Link to={`/order-tracking/${order._id}`} className="flex-1">
                  <Button className="w-full" variant="outline">View Details</Button>
                </Link>
                {['pending', 'confirmed', 'processing'].includes(order.status) && (
                  <Button variant="outline" className="text-red-600">Cancel Order</Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
