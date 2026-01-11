import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { useSiteSettings } from '../hooks/useSiteSettings';

export const AdminSiteSettings = () => {
  const { settings, isLoading, updateSettings, resetSettings } = useSiteSettings();
  const [formData, setFormData] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await updateSettings(formData);
      setSuccessMessage('Site settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setErrorMessage('Failed to update site settings');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      try {
        await resetSettings();
        setSuccessMessage('Settings reset to defaults successfully!');
        setTimeout(() => setSuccessMessage(''), 5000);
      } catch (err) {
        setErrorMessage('Failed to reset settings');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    }
  };

  if (isLoading || !formData) {
    return <div className="p-8">Loading settings...</div>;
  }

  const tabs = [
    {
      id: 'hero',
      label: 'Hero Section',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hero Section Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hero Title
              </label>
              <Input
                value={formData.heroTitle || ''}
                onChange={(e) => handleChange('heroTitle', e.target.value)}
                placeholder="3D'S SAWMILL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hero Subtitle
              </label>
              <Input
                value={formData.heroSubtitle || ''}
                onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                placeholder="Premium Structural & Industrial Timber"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hero Description
              </label>
              <textarea
                value={formData.heroDescription || ''}
                onChange={(e) => handleChange('heroDescription', e.target.value)}
                placeholder="Delivering superior timber solutions..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hero Badge Text
              </label>
              <Input
                value={formData.heroBadgeText || ''}
                onChange={(e) => handleChange('heroBadgeText', e.target.value)}
                placeholder="Nationwide Delivery Available"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'about',
      label: 'About Section',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">About Section Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                About Title
              </label>
              <Input
                value={formData.aboutTitle || ''}
                onChange={(e) => handleChange('aboutTitle', e.target.value)}
                placeholder="About 3D'S SAWMILL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                About Subtitle
              </label>
              <Input
                value={formData.aboutSubtitle || ''}
                onChange={(e) => handleChange('aboutSubtitle', e.target.value)}
                placeholder="For all structural and industrial timber"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                About Description
              </label>
              <textarea
                value={formData.aboutDescription || ''}
                onChange={(e) => handleChange('aboutDescription', e.target.value)}
                placeholder="We're here to help you find the perfect timber solution..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mission Statement
              </label>
              <textarea
                value={formData.aboutMission || ''}
                onChange={(e) => handleChange('aboutMission', e.target.value)}
                placeholder="Our mission is to provide high-quality timber products..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Vision Statement
              </label>
              <textarea
                value={formData.aboutVision || ''}
                onChange={(e) => handleChange('aboutVision', e.target.value)}
                placeholder="To be South Africa's leading timber supplier..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                rows={3}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'contact',
      label: 'Contact Info',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <Input
                value={formData.contactPhone || ''}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                placeholder="072 504 9184"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                value={formData.contactEmail || ''}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                placeholder="bruwer.danie@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Physical Address
              </label>
              <Input
                value={formData.contactAddress || ''}
                onChange={(e) => handleChange('contactAddress', e.target.value)}
                placeholder="Bergvliet, Cape Town, South Africa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                WhatsApp Number (with country code)
              </label>
              <Input
                value={formData.whatsappNumber || ''}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                placeholder="27725049184"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Hours
              </label>
              <textarea
                value={formData.businessHours || ''}
                onChange={(e) => handleChange('businessHours', e.target.value)}
                placeholder="Monday - Friday: 7:00 AM - 5:00 PM&#10;Saturday: 8:00 AM - 1:00 PM&#10;Sunday: Closed"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Facebook URL (optional)
              </label>
              <Input
                value={formData.facebookUrl || ''}
                onChange={(e) => handleChange('facebookUrl', e.target.value)}
                placeholder="https://facebook.com/your-page"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Instagram URL (optional)
              </label>
              <Input
                value={formData.instagramUrl || ''}
                onChange={(e) => handleChange('instagramUrl', e.target.value)}
                placeholder="https://instagram.com/your-profile"
              />
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Site Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Edit your website content, hero section, about section, and contact information
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            leftIcon={<RotateCcw className="h-4 w-4" />}
          >
            Reset to Defaults
          </Button>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          <Tabs tabs={tabs} />

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t dark:border-gray-700">
            <Button
              type="submit"
              disabled={isSaving}
              leftIcon={<Save className="h-4 w-4" />}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};
