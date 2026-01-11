import React, { useState, useEffect } from 'react';
import { AlertCircle, Plus, Edit2, Trash2, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { useSpecials, Special } from '../hooks/useBulkOperations';
import { getLocalStorage } from '../utils/helpers';
import { formatCurrency } from '../utils/formatters';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AdminSpecials = () => {
  const [specials, setSpecials] = useState<Special[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSpecial, setEditingSpecial] = useState<Special | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const { createSpecial, updateSpecial, deleteSpecial, loading } = useSpecials();

  const getToken = () => getLocalStorage('auth_token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      
      // Fetch specials
      const specialsRes = await fetch(`${API_URL}/specials`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch products
      const productsRes = await fetch(`${API_URL}/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (specialsRes.ok) setSpecials(await specialsRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSpecial = async (formData: any) => {
    try {
      if (editingSpecial?._id) {
        const updated = await updateSpecial(editingSpecial._id, formData);
        setSpecials(specials.map(s => s._id === editingSpecial._id ? updated : s));
        setSuccessMessage('Special updated successfully');
      } else {
        const created = await createSpecial(formData);
        setSpecials([...specials, created]);
        setSuccessMessage('Special created successfully');
      }
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowForm(false);
      setEditingSpecial(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save special');
    }
  };

  const handleDeleteSpecial = async (specialId: string) => {
    if (!confirm('Delete this special?')) return;

    try {
      await deleteSpecial(specialId);
      setSpecials(specials.filter(s => s._id !== specialId));
      setSuccessMessage('Special deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete special');
    }
  };

  if (isLoading) return <div className="p-8">Loading specials...</div>;

  const activeCount = specials.filter(s => s.active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Specials & Discounts</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Total Specials: {specials.length} | Active: {activeCount}
          </p>
        </div>
        <Button 
          onClick={() => {
            setEditingSpecial(null);
            setShowForm(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Special
        </Button>
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

      {/* Form Modal */}
      {showForm && (
        <SpecialForm
          special={editingSpecial}
          products={products}
          onSave={handleSaveSpecial}
          onCancel={() => {
            setShowForm(false);
            setEditingSpecial(null);
          }}
          isLoading={loading}
        />
      )}

      {/* Specials Grid */}
      {specials.length === 0 ? (
        <Card className="p-12 text-center text-gray-600 dark:text-gray-400">
          <p>No specials created yet. Create one to get started!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specials.map(special => (
            <Card key={special._id} className="p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{special.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{special.description}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  special.active
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300'
                }`}>
                  {special.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Discount Display */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-lg mb-4">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {special.discountType === 'percentage' ? `${special.discount}%` : formatCurrency(special.discount)} OFF
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {special.discountType === 'percentage' ? 'Percentage' : 'Fixed Amount'} Discount
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(special.startDate).toLocaleDateString()}</span>
                  <span>→</span>
                  <span>{new Date(special.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Products */}
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Applied to {special.productIds.length} product(s)
                </div>
                <div className="flex flex-wrap gap-1">
                  {special.productIds.slice(0, 3).map(productId => {
                    const product = products.find(p => p._id === productId);
                    return (
                      <span key={productId} className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded text-gray-700 dark:text-gray-300">
                        {product?.name || 'Unknown'}
                      </span>
                    );
                  })}
                  {special.productIds.length > 3 && (
                    <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded text-gray-700 dark:text-gray-300">
                      +{special.productIds.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingSpecial(special);
                    setShowForm(true);
                  }}
                  className="gap-1 flex-1"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteSpecial(special._id!)}
                  className="gap-1 flex-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const SpecialForm = ({ special, products, onSave, onCancel, isLoading }: any) => {
  const [formData, setFormData] = useState<Special>(
    special || {
      name: '',
      description: '',
      productIds: [],
      discount: 0,
      discountType: 'percentage',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      active: true,
    }
  );

  const handleToggleProduct = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter(id => id !== productId)
        : [...prev.productIds, productId]
    }));
  };

  return (
    <Modal isOpen={true} onClose={onCancel}>
      <div className="max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {special ? 'Edit Special' : 'Create Special'}
        </h2>

        <div className="space-y-4">
          {/* Name & Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <Input
              placeholder="Special name (e.g., Summer Sale)"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <Input
              placeholder="Description (e.g., Summer clearance on all saws)"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Discount Type
              </label>
              <Select
                options={[
                  { label: 'Percentage (%)', value: 'percentage' },
                  { label: 'Fixed Amount ($)', value: 'fixed' },
                ]}
                value={formData.discountType}
                onChange={(e) => setFormData({...formData, discountType: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Discount Value
              </label>
              <Input
                type="number"
                placeholder="e.g., 20 or 100"
                value={formData.discount}
                onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value)})}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              />
            </div>
          </div>

          {/* Active Status */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({...formData, active: e.target.checked})}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
            </label>
          </div>

          {/* Products Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Products ({formData.productIds.length} selected)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
              {products.map(product => (
                <label key={product._id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.productIds.includes(product._id)}
                    onChange={() => handleToggleProduct(product._id)}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{product.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={() => onSave(formData)}
              disabled={isLoading || !formData.name || !formData.discount || formData.productIds.length === 0}
            >
              {special ? 'Update Special' : 'Create Special'}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
