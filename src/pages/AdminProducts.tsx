import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, AlertCircle, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { useInventory } from '../hooks/useInventory';
import { useAdminProducts } from '../hooks/useAdminAPI';
import { formatCurrency } from '../utils/formatters';
import { Product, ProductCategory } from '../types';

const CATEGORIES: ProductCategory[] = ['Plywood', '4x4 Timber', 'Boards', 'Doors', 'Window Frames', 'Pillars', 'Custom Cuts', 'Other'];
const WOOD_TYPES = ['Pine', 'Meranti', 'Kiaat', 'Yellowwood', 'Stinkwood', 'Teak', 'Mahogany', 'Oak', 'Softwood', 'Hardwood', 'Engineered Wood', 'MDF', 'Plywood', 'Composite', 'Laminate', 'Other'];
const DIMENSION_UNITS = ['mm', 'cm', 'm', 'inches', 'feet'];
const WEIGHT_UNITS = ['kg', 'lbs', 'g'];
const PRODUCT_TYPES = ['Standard Panel', 'Engineered Board', 'Solid Wood', 'Laminated', 'Veneered', 'Custom Cut', 'Pre-finished', 'Structural', 'Decorative', 'Other'];
const COLORS = ['Natural', 'Dark Brown', 'Light Oak', 'Walnut', 'Mahogany Red', 'Golden', 'Ash', 'Beige', 'Grey', 'White', 'Black', 'Custom'];
const FINISHES = ['Unfinished', 'Sanded', 'Varnished', 'Painted', 'Oil-finished', 'Lacquered', 'Stained', 'Custom'];

const DEFAULT_FORM_DATA = {
  name: '',
  description: '',
  category: 'Plywood' as ProductCategory,
  productType: '',
  woodType: 'Pine',
  color: '',
  price: 0,
  stock: 0,
  dimensions: { length: 0, width: 0, height: 0, unit: 'mm' },
  weight: { value: 0, unit: 'kg' },
  images: [] as any[],
  featured: false,
  isAvailable: true,
  bulkPricing: [] as any[],
  specifications: { material: '', finish: '', moisture: '', gradeOrQuality: '', additionalSpecs: '' },
  tags: [] as string[],
  minimumOrderQuantity: 1,
  leadTime: { value: 1, unit: 'days' },
};

type FormData = typeof DEFAULT_FORM_DATA & { id?: string };

interface BulkPricingItem {
  minQuantity: number;
  maxQuantity?: number;
  discountPrice: number;
  discountPercentage?: number;
}

export const AdminProducts = () => {
  const { products, isLoading: inventoryLoading, refetch } = useInventory();
  const { createProduct, updateProduct, deleteProduct, loading, error } = useAdminProducts();

  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [newTag, setNewTag] = useState('');
  const [bulkPricingForm, setBulkPricingForm] = useState<BulkPricingItem>({ minQuantity: 0, discountPrice: 0 });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleDimensionChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      dimensions: { ...prev.dimensions, [field]: field === 'unit' ? value : parseFloat(value) }
    }));
  };

  const handleWeightChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      weight: { ...prev.weight, [field]: field === 'unit' ? value : parseFloat(value) }
    }));
  };

  const handleLeadTimeChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      leadTime: { ...prev.leadTime, [field]: field === 'unit' ? value : parseFloat(value) }
    }));
  };

  const handleSpecificationChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: { ...prev.specifications, [field]: value }
    }));
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, { url: imageUrl, alt: '', isPrimary: prev.images.length === 0 }]
      }));
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleAddBulkPricing = () => {
    if (bulkPricingForm.minQuantity > 0 && bulkPricingForm.discountPrice > 0) {
      setFormData(prev => ({
        ...prev,
        bulkPricing: [...prev.bulkPricing, bulkPricingForm]
      }));
      setBulkPricingForm({ minQuantity: 0, discountPrice: 0 });
    }
  };

  const handleRemoveBulkPricing = (index: number) => {
    setFormData(prev => ({
      ...prev,
      bulkPricing: prev.bulkPricing.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    try {
      if (isEditing && formData.id) {
        await updateProduct(formData.id, formData);
        setSuccessMessage('Product updated successfully!');
      } else {
        await createProduct(formData);
        setSuccessMessage('Product created successfully!');
      }
      
      setFormData(DEFAULT_FORM_DATA);
      setShowForm(false);
      setIsEditing(false);
      
      // Refetch products to update the list
      await refetch();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save product';
      setErrorMessage(errorMsg);
      console.error('Error saving product:', err);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleEdit = (product: Product) => {
    const productData = product as any;
    
    setFormData({
      ...DEFAULT_FORM_DATA,
      ...product,
      id: productData._id || product.id,
      // Ensure nested objects have proper structure
      dimensions: productData.dimensions || DEFAULT_FORM_DATA.dimensions,
      weight: productData.weight || DEFAULT_FORM_DATA.weight,
      leadTime: productData.leadTime || DEFAULT_FORM_DATA.leadTime,
      specifications: productData.specifications || DEFAULT_FORM_DATA.specifications,
      images: Array.isArray(productData.images) ? productData.images : [],
      tags: Array.isArray(productData.tags) ? productData.tags : [],
      bulkPricing: Array.isArray(productData.bulkPricing) ? productData.bulkPricing : [],
    } as any);
    
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (!productId) {
      setErrorMessage('Product ID is missing');
      console.error('Product ID is undefined');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this product?')) {
      setErrorMessage('');
      
      try {
        await deleteProduct(productId);
        setSuccessMessage('Product deleted successfully!');
        
        // Refetch products to update the list
        await refetch();
        
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to delete product';
        setErrorMessage(errorMsg);
        console.error('Error deleting product:', err);
        setTimeout(() => setErrorMessage(''), 5000);
      }
    }
  };

  const handleCancel = () => {
    setFormData(DEFAULT_FORM_DATA);
    setShowForm(false);
    setIsEditing(false);
  };

  if (inventoryLoading) return <div className="p-8">Loading products...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Product Management</h1>
        <Button 
          variant="primary" 
          onClick={() => {
            setFormData(DEFAULT_FORM_DATA);
            setIsEditing(false);
            setShowForm(true);
          }}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Product
        </Button>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {successMessage}
        </div>
      )}
      {(error || errorMessage) && (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {errorMessage || error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <Card className="p-6 bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white sticky top-0 bg-white dark:bg-gray-800">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <Select
                  options={PRODUCT_TYPES.map(t => ({ label: t, value: t }))}
                  value={formData.productType}
                  onChange={(e) => handleInputChange({ ...e, name: 'productType' } as any)}
                  label="Product Type"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Category & Classification */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Category & Material</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  options={CATEGORIES.map(c => ({ label: c, value: c }))}
                  value={formData.category}
                  onChange={(e) => handleInputChange({ ...e, name: 'category' } as any)}
                  label="Product Category"
                />
                <Select
                  options={WOOD_TYPES.map(w => ({ label: w, value: w }))}
                  value={formData.woodType}
                  onChange={(e) => handleInputChange({ ...e, name: 'woodType' } as any)}
                  label="Wood Type"
                />
                <Select
                  options={COLORS.map(c => ({ label: c, value: c }))}
                  value={formData.color}
                  onChange={(e) => handleInputChange({ ...e, name: 'color' } as any)}
                  label="Color"
                />
              </div>
            </div>

            {/* Dimensions */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dimensions (Length x Width x Height)</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Input
                  label="Length"
                  type="number"
                  value={formData.dimensions.length}
                  onChange={(e) => handleDimensionChange('length', e.target.value)}
                  step="0.1"
                  required
                />
                <Input
                  label="Width"
                  type="number"
                  value={formData.dimensions.width}
                  onChange={(e) => handleDimensionChange('width', e.target.value)}
                  step="0.1"
                />
                <Input
                  label="Height"
                  type="number"
                  value={formData.dimensions.height}
                  onChange={(e) => handleDimensionChange('height', e.target.value)}
                  step="0.1"
                />
                <Select
                  options={DIMENSION_UNITS.map(u => ({ label: u, value: u }))}
                  value={formData.dimensions.unit}
                  onChange={(e) => handleDimensionChange('unit', e.target.value)}
                  label="Unit"
                />
                <div className="flex items-end">
                  <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded w-full text-center">
                    {formData.dimensions.length && formData.dimensions.width && formData.dimensions.height 
                      ? `${formData.dimensions.length} × ${formData.dimensions.width} × ${formData.dimensions.height} ${formData.dimensions.unit}`
                      : 'Dimensions preview'}
                  </div>
                </div>
              </div>
            </div>

            {/* Weight */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weight</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Weight Value"
                  type="number"
                  value={formData.weight.value}
                  onChange={(e) => handleWeightChange('value', e.target.value)}
                  step="0.1"
                  required
                />
                <Select
                  options={WEIGHT_UNITS.map(u => ({ label: u, value: u }))}
                  value={formData.weight.unit}
                  onChange={(e) => handleWeightChange('unit', e.target.value)}
                  label="Weight Unit"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pricing & Availability</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Base Price (R)"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
                <Input
                  label="Minimum Order Quantity"
                  type="number"
                  name="minimumOrderQuantity"
                  value={formData.minimumOrderQuantity}
                  onChange={handleInputChange}
                  min="1"
                />
                <Input
                  label="Stock on Hand"
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Bulk Pricing */}
            <div className="space-y-4 border-t pt-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bulk Order Pricing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Set tiered pricing for bulk orders to incentivize larger purchases</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  label="Min Quantity"
                  type="number"
                  value={bulkPricingForm.minQuantity}
                  onChange={(e) => setBulkPricingForm({ ...bulkPricingForm, minQuantity: parseFloat(e.target.value) })}
                  min="0"
                />
                <Input
                  label="Max Quantity (optional)"
                  type="number"
                  value={bulkPricingForm.maxQuantity || ''}
                  onChange={(e) => setBulkPricingForm({ ...bulkPricingForm, maxQuantity: parseFloat(e.target.value) || undefined })}
                  placeholder="Leave empty for unlimited"
                />
                <Input
                  label="Bulk Price (R)"
                  type="number"
                  value={bulkPricingForm.discountPrice}
                  onChange={(e) => setBulkPricingForm({ ...bulkPricingForm, discountPrice: parseFloat(e.target.value) })}
                  step="0.01"
                />
                <div className="flex gap-2 items-end">
                  <Button 
                    variant="outline" 
                    onClick={handleAddBulkPricing} 
                    type="button"
                    className="w-full"
                  >
                    Add Tier
                  </Button>
                </div>
              </div>

              {formData.bulkPricing.length > 0 && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Current Bulk Pricing Tiers</h4>
                  <div className="space-y-2">
                    {formData.bulkPricing.map((bp, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          <strong>Qty:</strong> {bp.minQuantity}{bp.maxQuantity ? ` - ${bp.maxQuantity}` : '+'} units → 
                          <strong> R{(bp.discountPrice || 0).toFixed(2)}</strong>
                          {bp.discountPercentage && <span> ({bp.discountPercentage}% off)</span>}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBulkPricing(idx)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Specifications & Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  options={FINISHES.map(f => ({ label: f, value: f }))}
                  value={formData.specifications.finish || ''}
                  onChange={(e) => handleSpecificationChange('finish', e.target.value)}
                  label="Finish Type"
                />
                <Input
                  label="Material Specification"
                  value={formData.specifications.material}
                  onChange={(e) => handleSpecificationChange('material', e.target.value)}
                  placeholder="e.g., 100% Pine, 12mm Thick"
                />
                <Input
                  label="Moisture Content (%)"
                  type="number"
                  value={formData.specifications.moisture}
                  onChange={(e) => handleSpecificationChange('moisture', e.target.value)}
                  placeholder="e.g., 12, 15"
                  step="0.1"
                />
                <Input
                  label="Grade/Quality"
                  value={formData.specifications.gradeOrQuality}
                  onChange={(e) => handleSpecificationChange('gradeOrQuality', e.target.value)}
                  placeholder="e.g., Grade A, Premium, Commercial"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Specifications
                </label>
                <textarea
                  value={formData.specifications.additionalSpecs}
                  onChange={(e) => handleSpecificationChange('additionalSpecs', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Add any other important specifications, certifications, or details about this product"
                />
              </div>
            </div>

            {/* Lead Time */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Lead Time</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Lead Time Value"
                  type="number"
                  value={formData.leadTime.value}
                  onChange={(e) => handleLeadTimeChange('value', e.target.value)}
                  min="1"
                />
                <Select
                  options={[
                    { label: 'Days', value: 'days' },
                    { label: 'Weeks', value: 'weeks' }
                  ]}
                  value={formData.leadTime.unit}
                  onChange={(e) => handleLeadTimeChange('unit', e.target.value)}
                  label="Unit"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tags & Categories</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Add tags to help customers find this product</p>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Add a tag (e.g., 'durable', 'eco-friendly', 'bestseller')"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTag();
                      e.preventDefault();
                    }
                  }}
                />
                <Button variant="outline" onClick={handleAddTag} type="button">
                  Add Tag
                </Button>
              </div>
              {formData.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <div 
                      key={tag} 
                      className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-blue-300 dark:border-blue-700"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No tags added. Tags help with product discovery.</p>
              )}
            </div>

            {/* Images */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Images</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Add multiple images to showcase your product from different angles</p>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Paste image URL here"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddImage();
                      e.preventDefault();
                    }
                  }}
                />
                <Button variant="outline" onClick={handleAddImage} type="button">
                  Add Image
                </Button>
              </div>
              {formData.images.length > 0 ? (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Images ({formData.images.length}) - First image will be the primary product image
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img 
                          src={img.url || img} 
                          alt={`Product ${idx + 1}`} 
                          className="h-24 w-24 object-cover rounded border-2 border-gray-200 dark:border-gray-600" 
                          onError={(e) => {
                            (e.target as any).src = 'https://via.placeholder.com/100?text=Invalid';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center rounded transition-opacity gap-1">
                          {idx === 0 && (
                            <span className="text-xs text-white bg-green-600 px-2 py-1 rounded">Primary</span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="text-white text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">No images added yet. Add images to showcase your product.</p>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="space-y-4 border-t pt-4 bg-purple-50 dark:bg-purple-900/20 p-4 rounded">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Status</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Featured Product</strong>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Show on homepage and feature section</p>
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Available for Sale</strong>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Make this product visible to customers</p>
                  </span>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-2 justify-end border-t pt-4">
              <Button variant="outline" onClick={handleCancel} type="button">
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Products List */}
      <div className="grid gap-4">
        {products.map((product: any) => (
          <Card key={product._id || product.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4 flex-1">
                {product.images && product.images.length > 0 && (
                  <img
                    src={product.images[0].url || product.images[0]}
                    alt={product.name}
                    className="h-24 w-24 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{product.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{product.productType}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-gray-700 dark:text-gray-300"><strong>Wood:</strong> {product.woodType}</span>
                    <span className="text-gray-700 dark:text-gray-300"><strong>Color:</strong> {product.color}</span>
                    <span className="text-gray-700 dark:text-gray-300"><strong>Stock:</strong> {product.stock}</span>
                  </div>
                  <div className="mt-2 text-lg font-bold text-blue-600">
                    {formatCurrency(product.price)}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(product)}
                  leftIcon={<Edit2 className="h-4 w-4" />}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(product._id || product.id)}
                  leftIcon={<Trash2 className="h-4 w-4" />}
                  className="text-red-600"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
