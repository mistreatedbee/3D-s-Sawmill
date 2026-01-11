import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { formatters } from '../utils/formatters';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface VendorOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered';
  createdAt: string;
  trackingNumber?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
}

export function VendorOrdersList() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrders, setExpandedOrders] = useState<{ [key: string]: boolean }>({});
  const [statusUpdates, setStatusUpdates] = useState<{ [key: string]: string }>({});
  const [updatingId, setUpdatingId] = useState('');

  const limit = 10;

  useEffect(() => {
    loadOrders();
  }, [currentPage, filterStatus]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const status = filterStatus || undefined;
      const response = await fetch(
        `${API_URL}/vendor/orders?page=${currentPage}&limit=${limit}&status=${status || ''}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `${API_URL}/vendor/orders/${orderId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: newStatus })
        }
      );
      if (response.ok) {
        await loadOrders();
        setStatusUpdates({ ...statusUpdates, [orderId]: '' });
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingId('');
    }
  };

  const handleExpandOrder = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-indigo-100 text-indigo-800',
      'packed': 'bg-purple-100 text-purple-800',
      'shipped': 'bg-cyan-100 text-cyan-800',
      'delivered': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredOrders = orders.filter(order =>
    order.orderNumber.includes(searchTerm) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">Please log in as a vendor to access orders</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Order Fulfillment</h1>
        <p className="text-gray-600 mt-1">Manage and track customer orders</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
        </Card>

        <Card className="p-4 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {orders.filter(o => o.status === 'pending').length}
          </p>
        </Card>

        <Card className="p-4 border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">In Transit</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {orders.filter(o => ['processing', 'packed', 'shipped'].includes(o.status)).length}
          </p>
        </Card>

        <Card className="p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Delivered</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {orders.filter(o => o.status === 'delivered').length}
          </p>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex gap-4">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by order #, customer name, or email..."
          className="flex-1"
        />
        <Select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="w-48"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="packed">Packed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </Select>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No orders found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <Card
              key={order._id}
              className="p-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => handleExpandOrder(order._id)}
            >
              {/* Order Header */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div>
                  <p className="text-sm text-gray-600">Order #</p>
                  <p className="font-bold text-gray-900">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium text-gray-900">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-bold text-blue-600">{formatters.formatPrice(order.total)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Order Details */}
              {expandedOrders[order._id] && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Customer Details</h4>
                      <p className="text-sm text-gray-700">{order.customerEmail}</p>
                      <p className="text-sm text-gray-700 mt-2">
                        {order.shippingAddress.street}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                        {order.shippingAddress.country}
                      </p>
                    </div>

                    {order.trackingNumber && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Tracking</h4>
                        <p className="text-sm font-mono font-bold text-gray-900">
                          {order.trackingNumber}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm border-b border-gray-100 pb-2 last:border-0">
                          <div>
                            <p className="text-gray-900">{item.productName}</p>
                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium text-gray-900">
                            {formatters.formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">
                        {formatters.formatPrice(order.total * 0.9)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-bold text-gray-900">
                        {formatters.formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  {order.status !== 'delivered' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Update Status
                      </label>
                      <div className="flex gap-2">
                        <Select
                          value={statusUpdates[order._id] || order.status}
                          onChange={(e) => setStatusUpdates({ ...statusUpdates, [order._id]: e.target.value })}
                          className="flex-1"
                        >
                          <option value={order.status}>{order.status}</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="packed">Packed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </Select>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(order._id, statusUpdates[order._id] || order.status);
                          }}
                          disabled={updatingId === order._id || statusUpdates[order._id] === order.status}
                          className="px-4 bg-blue-600 hover:bg-blue-700"
                        >
                          {updatingId === order._id ? 'Updating...' : 'Update'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredOrders.length > 0 && (
        <div className="flex justify-between items-center">
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
      )}
    </div>
  );
}
