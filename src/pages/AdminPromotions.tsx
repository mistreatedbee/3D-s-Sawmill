import React, { useState, useEffect } from 'react';
import { useAdminPromotions } from '../hooks/useAdminPromotions';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { formatters } from '../utils/formatters';

interface Promotion {
  _id?: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscount?: number;
  minimumOrderValue: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usagePerCustomer?: number;
  active: boolean;
}

export function AdminPromotions() {
  const { createPromotion, getAllPromotions, getPromotion, updatePromotion, deletePromotion, loading, error } = useAdminPromotions();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterActive, setFilterActive] = useState('all');

  const [formData, setFormData] = useState<Promotion>({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    maxDiscount: 0,
    minimumOrderValue: 0,
    applicableProducts: [],
    applicableCategories: [],
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: 100,
    usagePerCustomer: 1,
    active: true
  });

  useEffect(() => {
    loadPromotions();
  }, [filterActive]);

  const loadPromotions = async () => {
    try {
      const data = await getAllPromotions();
      const filtered = data.filter(p => {
        if (filterActive === 'active') return p.active;
        if (filterActive === 'inactive') return !p.active;
        return true;
      });
      setPromotions(filtered);
    } catch (err) {
      console.error('Error loading promotions:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEditing && selectedPromotion?._id) {
        await updatePromotion(selectedPromotion._id, formData);
      } else {
        await createPromotion(formData);
      }
      await loadPromotions();
      setShowForm(false);
      setIsEditing(false);
      resetForm();
    } catch (err) {
      console.error('Error saving promotion:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setFormData(promotion);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this promotion?')) {
      try {
        await deletePromotion(id);
        await loadPromotions();
        setShowDetails(false);
      } catch (err) {
        console.error('Error deleting promotion:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      maxDiscount: 0,
      minimumOrderValue: 0,
      applicableProducts: [],
      applicableCategories: [],
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usageLimit: 100,
      usagePerCustomer: 1,
      active: true
    });
    setIsEditing(false);
    setSelectedPromotion(null);
  };

  const getDiscountDisplay = (promotion: Promotion) => {
    if (promotion.discountType === 'percentage') {
      return `${promotion.discountValue}%`;
    }
    return formatters.formatPrice(promotion.discountValue);
  };

  const isPromotionExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
  };

  const isPromotionActive = (promotion: Promotion) => {
    const now = new Date();
    const validFrom = new Date(promotion.validFrom);
    const validUntil = new Date(promotion.validUntil);
    return promotion.active && now >= validFrom && now <= validUntil;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promotion Management</h1>
          <p className="text-gray-600 mt-1">Create and manage promotional codes</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          + New Promotion
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-800 font-semibold">Error: {error}</p>
        </div>
      )}

      <div className="flex gap-2">
        {['all', 'active', 'inactive'].map(status => (
          <Button
            key={status}
            onClick={() => setFilterActive(status)}
            variant={filterActive === status ? 'primary' : 'outline'}
            className="capitalize"
          >
            {status}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : promotions.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No promotions found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {promotions.map(promotion => (
            <Card
              key={promotion._id}
              className="p-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => {
                setSelectedPromotion(promotion);
                setShowDetails(true);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg text-gray-900 font-mono">
                      {promotion.code}
                    </h3>
                    {isPromotionActive(promotion) && (
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    )}
                    {isPromotionExpired(promotion.validUntil) && (
                      <Badge className="bg-gray-100 text-gray-800">
                        Expired
                      </Badge>
                    )}
                    {!promotion.active && (
                      <Badge className="bg-red-100 text-red-800">
                        Inactive
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-600">Discount</p>
                      <p className="font-bold text-lg text-gray-900">
                        {getDiscountDisplay(promotion)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Min. Order</p>
                      <p className="font-bold text-gray-900">
                        {formatters.formatPrice(promotion.minimumOrderValue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Valid Until</p>
                      <p className="font-medium text-gray-900">
                        {new Date(promotion.validUntil).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Usage Limit</p>
                      <p className="font-medium text-gray-900">
                        {promotion.usageLimit || '∞'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(promotion);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      promotion._id && handleDelete(promotion._id);
                    }}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showForm && (
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            resetForm();
          }}
        >
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {isEditing ? 'Edit Promotion' : 'New Promotion'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promotion Code *
                  </label>
                  <Input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., SUMMER20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Type *
                  </label>
                  <Select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Value *
                  </label>
                  <Input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                    placeholder={formData.discountType === 'percentage' ? '20' : '100'}
                    step={formData.discountType === 'percentage' ? '1' : '0.01'}
                    required
                  />
                </div>

                {formData.discountType === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Discount (optional)
                    </label>
                    <Input
                      type="number"
                      value={formData.maxDiscount || ''}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: parseFloat(e.target.value) })}
                      placeholder="e.g., 500"
                      step="0.01"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Order Value *
                  </label>
                  <Input
                    type="number"
                    value={formData.minimumOrderValue}
                    onChange={(e) => setFormData({ ...formData, minimumOrderValue: parseFloat(e.target.value) })}
                    placeholder="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usage Limit (optional)
                  </label>
                  <Input
                    type="number"
                    value={formData.usageLimit || ''}
                    onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) || undefined })}
                    placeholder="Leave empty for unlimited"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valid From *
                  </label>
                  <Input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valid Until *
                  </label>
                  <Input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Per Customer Usage Limit (optional)
                  </label>
                  <Input
                    type="number"
                    value={formData.usagePerCustomer || ''}
                    onChange={(e) => setFormData({ ...formData, usagePerCustomer: parseInt(e.target.value) || undefined })}
                    placeholder="e.g., 1"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="active" className="text-sm text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {submitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {showDetails && selectedPromotion && (
        <Modal
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
        >
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900">Promotion Details</h2>

            <Card className="p-4 bg-gray-50">
              <div className="font-mono text-2xl font-bold text-gray-900 mb-4">
                {selectedPromotion.code}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Discount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {getDiscountDisplay(selectedPromotion)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Discount Type</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {selectedPromotion.discountType}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Minimum Order Value</p>
                  <p className="font-medium text-gray-900">
                    {formatters.formatPrice(selectedPromotion.minimumOrderValue)}
                  </p>
                </div>
                {selectedPromotion.maxDiscount && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Maximum Discount</p>
                    <p className="font-medium text-gray-900">
                      {formatters.formatPrice(selectedPromotion.maxDiscount)}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Valid From</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedPromotion.validFrom).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Valid Until</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedPromotion.validUntil).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Usage Limit</p>
                  <p className="font-medium text-gray-900">
                    {selectedPromotion.usageLimit || 'Unlimited'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Per Customer Limit</p>
                  <p className="font-medium text-gray-900">
                    {selectedPromotion.usagePerCustomer || 'Unlimited'}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <div className="flex gap-2">
                  {isPromotionActive(selectedPromotion) && (
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  )}
                  {isPromotionExpired(selectedPromotion.validUntil) && (
                    <Badge className="bg-gray-100 text-gray-800">Expired</Badge>
                  )}
                  {!selectedPromotion.active && (
                    <Badge className="bg-red-100 text-red-800">Inactive</Badge>
                  )}
                </div>
              </div>
            </Card>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                onClick={() => handleEdit(selectedPromotion)}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Edit
              </Button>
              <Button
                onClick={() => {
                  if (selectedPromotion._id) {
                    handleDelete(selectedPromotion._id);
                  }
                }}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
              <Button
                onClick={() => setShowDetails(false)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
