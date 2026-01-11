import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { ArrowLeft, ShoppingCart, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface OrderFormData {
  customerName: string;
  customerEmail: string;
  phoneNumber: string;
  deliveryMethod: 'pickup' | 'delivery';
  shippingAddress: string;
  city: string;
  postalCode: string;
  specialInstructions: string;
}

export const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, cartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<'review' | 'details' | 'confirmation'>(
    'review'
  );
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    phoneNumber: '',
    deliveryMethod: 'delivery',
    shippingAddress: '',
    city: '',
    postalCode: '',
    specialInstructions: '',
  });
  const [orderId, setOrderId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (items.length === 0 && currentStep === 'review') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 pb-20">
        <div className="container mx-auto px-4 text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Your cart is empty
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add some products before proceeding to checkout
          </p>
          <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    try {
      // Call API to create order
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          items,
          total: cartTotal,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          phoneNumber: formData.phoneNumber,
          deliveryMethod: formData.deliveryMethod,
          shippingAddress:
            formData.deliveryMethod === 'delivery' ? formData.shippingAddress : 'Pickup',
          city: formData.city,
          postalCode: formData.postalCode,
          specialInstructions: formData.specialInstructions,
          userId: user?.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to create order');

      const order = await response.json();
      setOrderId(order.data.id);
      clearCart();
      setCurrentStep('confirmation');
    } catch (error) {
      alert('Error creating order. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { step: 'review', label: 'Review Cart' },
              { step: 'details', label: 'Delivery Details' },
              { step: 'confirmation', label: 'Confirmation' },
            ].map((s, index, arr) => (
              <React.Fragment key={s.step}>
                <motion.div
                  className={`flex items-center gap-3 ${
                    currentStep === s.step ? 'opacity-100' : 'opacity-50'
                  }`}
                  animate={{
                    scale: currentStep === s.step ? 1.05 : 1,
                  }}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      currentStep === s.step
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="hidden sm:inline text-gray-700 dark:text-gray-300">
                    {s.label}
                  </span>
                </motion.div>
                {index < arr.length - 1 && (
                  <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 mx-2" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step 1: Review Cart */}
        {currentStep === 'review' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Review Your Order</h1>

            <Card>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-4 border-b dark:border-gray-700 last:border-b-0">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.dimensions} • Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">
                        R {(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        R {item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      Total:
                    </span>
                    <span className="text-3xl font-bold text-blue-600">
                      R {cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/products')}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Continue Shopping
              </Button>
              <Button
                onClick={() => setCurrentStep('details')}
                className="flex-1"
              >
                Proceed to Delivery Details
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Delivery Details */}
        {currentStep === 'details' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Delivery Details
            </h1>

            <Card>
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Contact Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      value={formData.customerName}
                      onChange={(e) =>
                        setFormData({ ...formData, customerName: e.target.value })
                      }
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, customerEmail: e.target.value })
                      }
                      required
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, phoneNumber: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Delivery Method */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Delivery Method
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: 'pickup', label: 'Pickup at Sawmill' },
                      { value: 'delivery', label: 'Home Delivery' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            deliveryMethod: option.value as 'pickup' | 'delivery',
                          })
                        }
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.deliveryMethod === option.value
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {option.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                {formData.deliveryMethod === 'delivery' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Shipping Address
                    </h3>
                    <div className="space-y-4">
                      <Input
                        label="Street Address"
                        value={formData.shippingAddress}
                        onChange={(e) =>
                          setFormData({ ...formData, shippingAddress: e.target.value })
                        }
                        required
                      />
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input
                          label="City"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          required
                        />
                        <Input
                          label="Postal Code"
                          value={formData.postalCode}
                          onChange={(e) =>
                            setFormData({ ...formData, postalCode: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Special Instructions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Special Instructions (Optional)
                  </h3>
                  <textarea
                    value={formData.specialInstructions}
                    onChange={(e) =>
                      setFormData({ ...formData, specialInstructions: e.target.value })
                    }
                    placeholder="Any special instructions for delivery or preparation..."
                    className="w-full p-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    rows={4}
                  />
                </div>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('review')}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Back to Cart
              </Button>
              <Button
                onClick={() => setCurrentStep('confirmation')}
                className="flex-1"
              >
                Review Order
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 'confirmation' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Confirm Your Order
            </h1>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Order Summary */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Order Summary
                </h3>
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm text-gray-600 dark:text-gray-400"
                    >
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>R {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t dark:border-gray-700 pt-4">
                  <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                    <span>Total:</span>
                    <span>R {cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </Card>

              {/* Delivery Information */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Delivery Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Name</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formData.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formData.customerEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Phone</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formData.phoneNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Delivery Method</p>
                    <p className="font-semibold text-gray-900 dark:text-white capitalize">
                      {formData.deliveryMethod}
                    </p>
                  </div>
                  {formData.deliveryMethod === 'delivery' && (
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Address</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formData.shippingAddress}, {formData.city} {formData.postalCode}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900">
              <div className="flex gap-3">
                <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-blue-900 dark:text-blue-100">
                    Invoice Will Be Generated
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    After you confirm, you'll receive an invoice via email with all order details.
                    Our team will contact you to confirm the order.
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('details')}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Back
              </Button>
              <Button
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Creating Order...' : 'Confirm & Generate Invoice'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Confirmation Message */}
        {currentStep === 'confirmation' && orderId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <Card className="max-w-md">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Order Confirmed!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Your order has been received successfully.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                  Order ID: <span className="font-mono">{orderId}</span>
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  An invoice and confirmation email have been sent to your email address.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/products')}
                    className="flex-1"
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    onClick={() => navigate(`/order-tracking/${orderId}`)}
                    className="flex-1"
                  >
                    Track Order
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};
