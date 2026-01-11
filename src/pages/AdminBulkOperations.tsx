import React, { useState } from 'react';
import { AlertCircle, Upload, FileDown, Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { useBulkProducts, useBulkOrders, BulkProductData, BulkOrderData } from '../hooks/useBulkOperations';
import { getLocalStorage } from '../utils/helpers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const CATEGORIES = ['saws', 'tools', 'accessories', 'safety', 'wood'];
const ORDER_STATUSES = ['pending', 'processing', 'ready', 'delivered', 'cancelled'];

export const AdminBulkOperations = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bulk Operations</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage multiple products and orders efficiently
        </p>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {successMessage}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Tab Buttons */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'products' ? 'default' : 'outline'}
          onClick={() => setActiveTab('products')}
        >
          Bulk Products
        </Button>
        <Button
          variant={activeTab === 'orders' ? 'default' : 'outline'}
          onClick={() => setActiveTab('orders')}
        >
          Bulk Orders
        </Button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <BulkProductsSection
          onSuccess={setSuccessMessage}
          onError={setError}
        />
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <BulkOrdersSection
          onSuccess={setSuccessMessage}
          onError={setError}
        />
      )}
    </div>
  );
};

const BulkProductsSection = ({ onSuccess, onError }: any) => {
  const { createBulkProducts, updateBulkProducts, loading, successCount } = useBulkProducts();
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'saws',
    price: '',
    stock: '',
  });

  const handleAddProduct = () => {
    if (!formData.name || !formData.price || !formData.stock) {
      onError('Please fill in all required fields');
      return;
    }

    setProducts([
      ...products,
      {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      },
    ]);

    setFormData({
      name: '',
      description: '',
      category: 'saws',
      price: '',
      stock: '',
    });
  };

  const handleRemoveProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (products.length === 0) {
      onError('Add at least one product');
      return;
    }

    try {
      const bulkData: BulkProductData = { products };
      await createBulkProducts(bulkData);
      onSuccess(`Successfully created ${products.length} products`);
      setProducts([]);
      setShowForm(false);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to create products');
    }
  };

  const handleDownloadTemplate = () => {
    const template = [
      {
        name: 'Example Product',
        description: 'Product description',
        category: 'saws',
        price: 299.99,
        stock: 10,
        featured: false,
        available: true,
      },
    ];
    const csv = [
      'name,description,category,price,stock,featured,available',
      ...template.map(p => `"${p.name}","${p.description}",${p.category},${p.price},${p.stock},${p.featured},${p.available}`)
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products_template.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Template Download */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Bulk Import</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Download CSV template for bulk import</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="gap-2">
            <FileDown className="h-4 w-4" />
            Download Template
          </Button>
        </div>
      </Card>

      {/* Add Product Form */}
      {showForm && (
        <Card className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add Product</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <Input
              placeholder="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
            />
            <Input
              placeholder="Stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
            />
            <Select
              options={CATEGORIES.map(c => ({ label: c, value: c }))}
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            />
            <Input
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="md:col-span-2"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={handleAddProduct}>Add to List</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      {/* Products List */}
      {products.length > 0 ? (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Products to Create ({products.length})
            </h3>
            <Button
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? 'Creating...' : 'Create All'}
            </Button>
          </div>
          <div className="space-y-2">
            {products.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    R {product.price} · Stock: {product.stock} · {product.category}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveProduct(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="p-12 text-center text-gray-600 dark:text-gray-400">
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="mx-auto gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Products Manually
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};

const BulkOrdersSection = ({ onSuccess, onError }: any) => {
  const { updateBulkOrderStatus, loading, successCount } = useBulkOrders();
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [newStatus, setNewStatus] = useState('processing');
  const [orders, setOrders] = useState<any[]>([]);

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = getLocalStorage('auth_token');
      const response = await fetch(`${API_URL}/orders/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to fetch orders');
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(o => o._id));
    }
  };

  const handleUpdateStatus = async () => {
    if (selectedOrders.length === 0) {
      onError('Select at least one order');
      return;
    }

    try {
      const bulkData: BulkOrderData = {
        orderIds: selectedOrders,
        status: newStatus,
      };
      await updateBulkOrderStatus(bulkData);
      onSuccess(`Successfully updated ${selectedOrders.length} orders to ${newStatus}`);
      setSelectedOrders([]);
      fetchOrders();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to update orders');
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Update Section */}
      <Card className="p-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Bulk Update Status</h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Status
            </label>
            <Select
              options={ORDER_STATUSES.map(s => ({ label: s, value: s }))}
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            />
          </div>
          <Button
            disabled={loading || selectedOrders.length === 0}
            onClick={handleUpdateStatus}
            className="gap-2"
          >
            Update {selectedOrders.length} Orders
          </Button>
        </div>
      </Card>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="w-full text-sm text-gray-900 dark:text-gray-100">
          <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === orders.length && orders.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map(order => (
              <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order._id)}
                    onChange={() => handleSelectOrder(order._id)}
                  />
                </td>
                <td className="px-4 py-3 font-mono text-xs">{order._id?.substring(0, 8)}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{order.customerName}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{order.customerEmail}</div>
                </td>
                <td className="px-4 py-3 text-right font-bold">R {order.total.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 capitalize">
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <Card className="p-12 text-center text-gray-600 dark:text-gray-400">
          <p>No orders found</p>
        </Card>
      )}
    </div>
  );
};
