import React, { useState, useEffect } from 'react';
import { AlertCircle, Plus, Edit2, Trash2, Eye, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { usePromotionalPages, PromotionalPage } from '../hooks/useBulkOperations';
import { getLocalStorage } from '../utils/helpers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AdminPromotionalPages = () => {
  const [pages, setPages] = useState<PromotionalPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<PromotionalPage | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const { createPage, updatePage, deletePage, loading } = usePromotionalPages();

  const getToken = () => getLocalStorage('auth_token');

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      const response = await fetch(`${API_URL}/promotional-pages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setPages(await response.json());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePage = async (formData: PromotionalPage) => {
    try {
      if (editingPage?._id) {
        const updated = await updatePage(editingPage._id, formData);
        setPages(pages.map(p => p._id === editingPage._id ? updated : p));
        setSuccessMessage('Page updated successfully');
      } else {
        const created = await createPage(formData);
        setPages([...pages, created]);
        setSuccessMessage('Page created successfully');
      }
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowForm(false);
      setEditingPage(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save page');
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Delete this promotional page?')) return;

    try {
      await deletePage(pageId);
      setPages(pages.filter(p => p._id !== pageId));
      setSuccessMessage('Page deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete page');
    }
  };

  if (isLoading) return <div className="p-8">Loading pages...</div>;

  const activeCount = pages.filter(p => p.active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Promotional Pages</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Total Pages: {pages.length} | Active: {activeCount}
          </p>
        </div>
        <Button 
          onClick={() => {
            setEditingPage(null);
            setShowForm(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Page
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
        <PromotionalPageForm
          page={editingPage}
          onSave={handleSavePage}
          onCancel={() => {
            setShowForm(false);
            setEditingPage(null);
          }}
          isLoading={loading}
        />
      )}

      {/* Pages List */}
      {pages.length === 0 ? (
        <Card className="p-12 text-center text-gray-600 dark:text-gray-400">
          <p>No promotional pages created yet. Create one to get started!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {pages.map(page => (
            <Card key={page._id} className="p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{page.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      page.active
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300'
                    }`}>
                      {page.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-3">{page.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-sm">
                      <div className="text-gray-600 dark:text-gray-400">URL Slug</div>
                      <div className="font-mono text-sm text-gray-900 dark:text-white">/{page.slug}</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-600 dark:text-gray-400">Sections</div>
                      <div className="font-bold text-gray-900 dark:text-white">{page.sections.length}</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-600 dark:text-gray-400">Created</div>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(page.createdAt!).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Section Preview */}
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Sections: </span>
                    {page.sections.map(s => s.type).join(', ')}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => {
                      setEditingPage(page);
                      setShowForm(true);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-blue-600 dark:text-blue-400"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePage(page._id!)}
                    className="gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const PromotionalPageForm = ({ page, onSave, onCancel, isLoading }: any) => {
  const [formData, setFormData] = useState<PromotionalPage>(
    page || {
      title: '',
      slug: '',
      description: '',
      content: '',
      hero: {
        title: '',
        subtitle: '',
        image: '',
        buttonText: 'Shop Now',
        buttonLink: '/products',
      },
      sections: [],
      seo: {
        metaTitle: '',
        metaDescription: '',
        keywords: [],
      },
      active: true,
    }
  );

  const [newSection, setNewSection] = useState({
    type: 'text' as const,
    title: '',
    content: '',
  });

  const handleAddSection = () => {
    if (!newSection.title) {
      alert('Section title is required');
      return;
    }

    setFormData(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: Date.now().toString(),
          type: newSection.type,
          title: newSection.title,
          content: newSection.content,
        },
      ],
    }));

    setNewSection({
      type: 'text',
      title: '',
      content: '',
    });
  };

  const handleRemoveSection = (sectionId: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId),
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  return (
    <Modal isOpen={true} onClose={onCancel}>
      <div className="max-h-[90vh] overflow-y-auto max-w-2xl">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white sticky top-0 bg-white dark:bg-gray-900 pb-2">
          {page ? 'Edit Page' : 'Create Promotional Page'}
        </h2>

        <div className="space-y-4">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Page Title
            </label>
            <Input
              placeholder="e.g., Summer Sale 2024"
              value={formData.title}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  title: e.target.value,
                  slug: generateSlug(e.target.value)
                });
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL Slug
            </label>
            <Input
              placeholder="e.g., summer-sale-2024"
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <Input
              placeholder="Brief description of the page"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Hero Section */}
          <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
            <h3 className="font-bold mb-3 text-gray-900 dark:text-white">Hero Section</h3>
            <div className="space-y-3">
              <Input
                placeholder="Hero Title"
                value={formData.hero.title}
                onChange={(e) => setFormData({
                  ...formData,
                  hero: {...formData.hero, title: e.target.value}
                })}
              />
              <Input
                placeholder="Hero Subtitle"
                value={formData.hero.subtitle}
                onChange={(e) => setFormData({
                  ...formData,
                  hero: {...formData.hero, subtitle: e.target.value}
                })}
              />
              <Input
                placeholder="Hero Image URL"
                value={formData.hero.image}
                onChange={(e) => setFormData({
                  ...formData,
                  hero: {...formData.hero, image: e.target.value}
                })}
              />
              <Input
                placeholder="Button Text"
                value={formData.hero.buttonText}
                onChange={(e) => setFormData({
                  ...formData,
                  hero: {...formData.hero, buttonText: e.target.value}
                })}
              />
            </div>
          </Card>

          {/* Sections */}
          <Card className="p-4 bg-purple-50 dark:bg-purple-900/20">
            <h3 className="font-bold mb-3 text-gray-900 dark:text-white">Page Sections</h3>
            
            {/* Add Section Form */}
            <div className="space-y-3 mb-4 pb-4 border-b border-purple-200 dark:border-purple-800">
              <select
                value={newSection.type}
                onChange={(e) => setNewSection({...newSection, type: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="text">Text</option>
                <option value="products">Products</option>
                <option value="gallery">Gallery</option>
                <option value="testimonials">Testimonials</option>
                <option value="banner">Banner</option>
                <option value="features">Features</option>
              </select>
              <Input
                placeholder="Section Title"
                value={newSection.title}
                onChange={(e) => setNewSection({...newSection, title: e.target.value})}
              />
              <textarea
                placeholder="Section Content"
                value={newSection.content}
                onChange={(e) => setNewSection({...newSection, content: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
              />
              <Button
                onClick={handleAddSection}
                size="sm"
                className="w-full gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Section
              </Button>
            </div>

            {/* Sections List */}
            {formData.sections.length > 0 && (
              <div className="space-y-2">
                {formData.sections.map(section => (
                  <div key={section.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700/50 rounded">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{section.title}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{section.type}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSection(section.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* SEO */}
          <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20">
            <h3 className="font-bold mb-3 text-gray-900 dark:text-white">SEO</h3>
            <div className="space-y-3">
              <Input
                placeholder="Meta Title"
                value={formData.seo.metaTitle}
                onChange={(e) => setFormData({
                  ...formData,
                  seo: {...formData.seo, metaTitle: e.target.value}
                })}
              />
              <Input
                placeholder="Meta Description"
                value={formData.seo.metaDescription}
                onChange={(e) => setFormData({
                  ...formData,
                  seo: {...formData.seo, metaDescription: e.target.value}
                })}
              />
            </div>
          </Card>

          {/* Active Status */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({...formData, active: e.target.checked})}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Publish Page
            </span>
          </label>

          {/* Buttons */}
          <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-900">
            <Button
              onClick={() => onSave(formData)}
              disabled={isLoading || !formData.title || !formData.slug}
              className="gap-1 flex-1"
            >
              <Zap className="h-4 w-4" />
              {page ? 'Update Page' : 'Create Page'}
            </Button>
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
