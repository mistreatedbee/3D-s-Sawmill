import React, { useState, useEffect } from 'react';
import { AlertCircle, Trash2, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { useAdminGallery } from '../hooks/useAdminAPI';
import { getLocalStorage } from '../utils/helpers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const GALLERY_CATEGORIES = ['finished-work', 'tools-equipment', 'workspace', 'projects'];

export const AdminGallery = () => {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    imageUrl: '',
    description: '',
    category: 'finished-work',
  });
  const { addImage, deleteImage, loading } = useAdminGallery();

  const getToken = () => getLocalStorage<string | null>('auth_token', null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/gallery`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch gallery');
      const data = await response.json();
      setImages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch gallery');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl.trim()) {
      setError('Image URL is required');
      return;
    }

    try {
      const newImage = await addImage(
        formData.imageUrl,
        formData.description,
        formData.category
      );
      setImages([...images, newImage]);
      setFormData({ imageUrl: '', description: '', category: 'finished-work' });
      setShowForm(false);
      setSuccessMessage('Image added successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add image');
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Delete this image?')) return;

    try {
      await deleteImage(imageId);
      setImages(images.filter(img => img._id !== imageId));
      setSuccessMessage('Image deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
    }
  };

  if (isLoading) return <div className="p-8">Loading gallery...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gallery Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Total Images: {images.length}
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Image
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

      {/* Add Image Form */}
      {showForm && (
        <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add New Image</h2>
          <form onSubmit={handleAddImage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Image URL
              </label>
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <Select
                options={GALLERY_CATEGORIES.map(cat => ({
                  label: cat.replace('-', ' '),
                  value: cat
                }))}
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description (Optional)
              </label>
              <Input
                placeholder="Brief description of the image"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Image'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowForm(false);
                  setFormData({ imageUrl: '', description: '', category: 'finished-work' });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Image Grid */}
      {images.length === 0 ? (
        <Card className="p-12 text-center text-gray-600 dark:text-gray-400">
          <p>No images in gallery yet. Add one to get started!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map(image => (
            <Card key={image._id} className="overflow-hidden hover:shadow-lg transition">
              <div className="relative aspect-square bg-gray-200 dark:bg-gray-700 overflow-hidden group">
                <img
                  src={image.imageUrl}
                  alt={image.description}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Image+Error';
                  }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteImage(image._id)}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-xs font-medium rounded">
                    {image.category.replace('-', ' ')}
                  </span>
                </div>
                {image.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {image.description}
                  </p>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {new Date(image.uploadedAt).toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
