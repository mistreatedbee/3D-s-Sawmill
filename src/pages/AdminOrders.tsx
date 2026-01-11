import React, { useState, useEffect } from 'react';
import { useAdminOrders } from '../hooks/useAdminOrders';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { formatters } from '../utils/formatters';

interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  status: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  total: number;
  tax: number;
  shipping: number;
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
}

interface ExpandedOrder {
  [key: string]: boolean;
}

export function AdminOrders() {
  const { getAllOrders, updateOrderStatus, updatePaymentStatus, getOrderStats, loading, error } = useAdminOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPayment, setFilterPayment] = useState<string>('');
  const [expandedOrders, setExpandedOrders] = useState<ExpandedOrder>({});
  const [statusUpdates, setStatusUpdates] = useState<{ [key: string]: string }>({});
  const [paymentUpdates, setPaymentUpdates] = useState<{ [key: string]: string }>({});
  const [noteInput, setNoteInput] = useState<{ [key: string]: string }>({});
  const [updatingId, setUpdatingId] = useState<string>('');

  const limit = 10;

  useEffect(() => {
    loadData();
  }, [currentPage, filterStatus, filterPayment]);

  const loadData = async () => {
    try {
      const status = filterStatus || undefined;
      const data = await getAllOrders(currentPage, limit, status);
      setOrders(data);
      const statsData = await getOrderStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error loading orders:', err);
    }
  };

  const handleExpandOrder = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const notes = noteInput[orderId] || '';
      await updateOrderStatus(orderId, newStatus, notes);
      setStatusUpdates({ ...statusUpdates, [orderId]: '' });
      setNoteInput({ ...noteInput, [orderId]: '' });
      await loadData();
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingId('');
    }
  };

  const handlePaymentChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await updatePaymentStatus(orderId, newStatus);
      setPaymentUpdates({ ...paymentUpdates, [orderId]: '' });
      await loadData();
    } catch (err) {
      console.error('Error updating payment:', err);
    } finally {
      setUpdatingId('');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-indigo-100 text-indigo-800',
      'packed': 'bg-purple-100 text-purple-800',
      'shipped': 'bg-cyan-100 text-cyan-800',
      'out_for_delivery': 'bg-orange-100 text-orange-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'refunded': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'refunded': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getToken = () => getLocalStorage<string | null>('auth_token', null);


  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-800 font-semibold">Error loading orders: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">Manage all customer orders and track fulfillment</p>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stats.totalOrders || 0}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {stats.statusBreakdown?.pending || 0}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Processing</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {stats.statusBreakdown?.processing || 0}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Delivered</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {stats.statusBreakdown?.delivered || 0}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Payment Pending</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">
              {stats.paymentPending || 0}
            </p>
          </Card>
        </div>
      )}

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <Select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </Select>
          <Select
            value={filterPayment}
            onChange={(e) => {
              setFilterPayment(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1"
          >
            <option value="">All Payment Status</option>
            <option value="pending">Payment Pending</option>
            <option value="completed">Payment Completed</option>
            <option value="failed">Payment Failed</option>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition" onClick={() => handleExpandOrder(order._id)}>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div>
                      <p className="text-sm text-gray-600">Order #</p>
                      <p className="font-bold text-gray-900">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-bold text-gray-900">{formatters.formatPrice(order.total)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment</p>
                      <Badge className={getPaymentColor(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Items</p>
                      <p className="font-bold text-gray-900">{order.items.length}</p>
                    </div>
                  </div>
                </div>

                {expandedOrders[order._id] && (
                  <div className="p-4 bg-white border-t border-gray-200 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                        <p className="text-sm text-gray-600">
                          {order.shippingAddress.street}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                          {order.shippingAddress.country}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Tracking Info</h3>
                        {order.trackingNumber && (
                          <p className="text-sm text-gray-600">
                            Tracking: <span className="font-mono font-bold">{order.trackingNumber}</span>
                          </p>
                        )}
                        {order.estimatedDelivery && (
                          <p className="text-sm text-gray-600">
                            Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Order Items</h3>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-2">Product</th>
                            <th className="text-center py-2 px-2">Qty</th>
                            <th className="text-right py-2 px-2">Price</th>
                            <th className="text-right py-2 px-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, idx) => (
                            <tr key={idx} className="border-b border-gray-100">
                              <td className="py-2 px-2 text-gray-900">{item.productName}</td>
                              <td className="text-center py-2 px-2 text-gray-600">{item.quantity}</td>
                              <td className="text-right py-2 px-2 text-gray-600">{formatters.formatPrice(item.price)}</td>
                              <td className="text-right py-2 px-2 font-medium text-gray-900">
                                {formatters.formatPrice(item.price * item.quantity)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium text-gray-900">{formatters.formatPrice(order.total - order.tax - order.shipping)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium text-gray-900">{formatters.formatPrice(order.tax)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium text-gray-900">{formatters.formatPrice(order.shipping)}</span>
                      </div>
                      <div className="flex justify-between text-lg border-t border-gray-200 pt-2">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-bold text-gray-900">{formatters.formatPrice(order.total)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Update Status</label>
                        <div className="flex gap-2">
                          <Select
                            value={statusUpdates[order._id] || order.status}
                            onChange={(e) => setStatusUpdates({ ...statusUpdates, [order._id]: e.target.value })}
                            className="flex-1"
                          >
                            <option value={order.status}>{order.status}</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="packed">Packed</option>
                            <option value="shipped">Shipped</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </Select>
                          <Button
                            onClick={() => handleStatusChange(order._id, statusUpdates[order._id] || order.status)}
                            disabled={updatingId === order._id || statusUpdates[order._id] === order.status}
                            className="px-4"
                          >
                            {updatingId === order._id ? 'Updating...' : 'Update'}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                        <div className="flex gap-2">
                          <Select
                            value={paymentUpdates[order._id] || order.paymentStatus}
                            onChange={(e) => setPaymentUpdates({ ...paymentUpdates, [order._id]: e.target.value })}
                            className="flex-1"
                          >
                            <option value={order.paymentStatus}>{order.paymentStatus}</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                          </Select>
                          <Button
                            onClick={() => handlePaymentChange(order._id, paymentUpdates[order._id] || order.paymentStatus)}
                            disabled={updatingId === order._id || paymentUpdates[order._id] === order.paymentStatus}
                            className="px-4"
                          >
                            {updatingId === order._id ? 'Updating...' : 'Update'}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                      <Input
                        type="text"
                        placeholder="Add notes about this order..."
                        value={noteInput[order._id] || ''}
                        onChange={(e) => setNoteInput({ ...noteInput, [order._id]: e.target.value })}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-gray-600">
            Page <span className="font-bold">{currentPage}</span>
          </span>
          <Button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={orders.length < limit}
            variant="outline"
          >
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
}
