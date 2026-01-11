import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatters } from '../utils/formatters';

export const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById, loading, error } = useOrders();
  const [order, setOrder] = useState<any>(null);
  const [expandedTimeline, setExpandedTimeline] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      if (orderId) {
        const data = await getOrderById(orderId);
        setOrder(data);
      }
    } catch (err) {
      console.error('Failed to load order:', err);
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

  const getStatusEmoji = (status: string) => {
    const emojis: { [key: string]: string } = {
      pending: '📋',
      confirmed: '✅',
      processing: '⚙️',
      packed: '📦',
      shipped: '🚚',
      out_for_delivery: '🚗',
      delivered: '🎉',
      cancelled: '❌',
      refunded: '💰',
    };
    return emojis[status] || '📍';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="p-8 text-center">
          <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
          <Button onClick={loadOrder}>Try Again</Button>
        </Card>
      </div>
    );
  }

  const allStatuses = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
  const currentStatusIndex = allStatuses.indexOf(order.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{order.orderNumber}</h1>
            <p className="text-blue-100">Ordered on {formatters.formatDate(order.createdAt)}</p>
          </div>
          <Badge color={getStatusColor(order.status)} className="text-lg px-4 py-2">
            {getStatusLabel(order.status)}
          </Badge>
        </div>
      </Card>

      {/* Progress Timeline */}
      <Card className="p-8">
        <h2 className="text-xl font-bold mb-8">Order Progress</h2>
        
        <div className="space-y-4">
          {allStatuses.map((status, index) => {
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = status === order.status;
            const statusHistory = order.statusHistory?.find((h: any) => h.status === status);
            
            return (
              <div key={status} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                    isCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isCurrent ? '→' : getStatusEmoji(status)}
                  </div>
                  {index < allStatuses.length - 1 && (
                    <div className={`w-1 h-12 ${isCompleted ? 'bg-green-300' : 'bg-gray-200'}`}></div>
                  )}
                </div>
                
                <div className="flex-1 pb-4">
                  <p className={`font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                    {getStatusLabel(status)}
                  </p>
                  {statusHistory && (
                    <p className="text-sm text-gray-600">
                      {formatters.formatDate(statusHistory.timestamp)}
                      {statusHistory.notes && ` • ${statusHistory.notes}`}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tracking Information */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Tracking Information</h2>
          <div className="space-y-4">
            {order.trackingNumber && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                <p className="text-lg font-mono font-bold">{order.trackingNumber}</p>
              </div>
            )}
            {order.estimatedDelivery && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
                <p className="text-lg font-bold">{formatters.formatDate(order.estimatedDelivery)}</p>
              </div>
            )}
            {order.actualDelivery && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Delivered On</p>
                <p className="text-lg font-bold text-green-600">{formatters.formatDate(order.actualDelivery)}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Shipping Address */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
          <div className="space-y-1 text-sm">
            <p className="font-semibold">{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </Card>
      </div>

      {/* Order Items */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center pb-4 border-b last:border-b-0">
              <div className="flex-1">
                <p className="font-bold">{item.name}</p>
                {item.specifications && (
                  <p className="text-sm text-gray-600">
                    {Object.entries(item.specifications).map(([key, val]) => `${key}: ${val}`).join(' • ')}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-bold">{item.quantity}x</p>
                <p className="text-sm text-gray-600">{formatters.formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Order Summary */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatters.formatPrice(order.subtotal)}</span>
          </div>
          {order.discountAmount && (
            <div className="flex justify-between text-green-600">
              <span>Discount:</span>
              <span>-{formatters.formatPrice(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>{formatters.formatPrice(order.tax)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>{formatters.formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total:</span>
            <span>{formatters.formatPrice(order.total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Payment Status:</span>
            <Badge color={order.paymentStatus === 'completed' ? 'green' : 'yellow'}>
              {order.paymentStatus}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Customer Notes */}
      {order.customerNotes && (
        <Card className="p-6 bg-blue-50">
          <h2 className="text-lg font-bold mb-2">Your Notes</h2>
          <p className="text-gray-700">{order.customerNotes}</p>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        {['pending', 'confirmed', 'processing'].includes(order.status) && (
          <Button variant="outline" className="text-red-600">Cancel Order</Button>
        )}
        {order.status === 'delivered' && (
          <Button>Leave a Review</Button>
        )}
        <Button variant="outline">Download Invoice</Button>
      </div>
    </div>
  );
};
