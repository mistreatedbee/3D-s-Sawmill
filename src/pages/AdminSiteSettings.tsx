import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useSiteSettings } from '../hooks/useSiteSettings';

export const AdminSiteSettings = () => {
  const { settings, isLoading, updateSettings, resetSettings } = useSiteSettings();
  const [formData, setFormData] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  // Load current frontend content into form fields
  useEffect(() => {
    if (settings) {
      setFormData(settings);
      setHasUnsavedChanges(false);
    }
  }, [settings]);

  // Warn before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Handle tab change - ONLY changes the visible tab, does NOT save
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // No saving happens here - just switches the visible content
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true); // Mark as having unsaved changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await updateSettings(formData);
      setSuccessMessage('Site settings updated successfully! Changes are now live on the website.');
      setHasUnsavedChanges(false); // Clear unsaved changes flag
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setErrorMessage('Failed to update site settings. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    if (window.confirm('Are you sure you want to discard all unsaved changes?')) {
      setFormData(settings); // Reset to original settings
      setHasUnsavedChanges(false);
      setSuccessMessage('Changes discarded. Original content restored.');
      setTimeout(() => setSuccessMessage(''), 3000);
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

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading current website content...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-300">
            No content found. Please run the seed script to initialize default content.
          </p>
        </div>
      </div>
    );
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hero Image URL
              </label>
              <Input
                value={formData.heroImage || ''}
                onChange={(e) => handleChange('heroImage', e.target.value)}
                placeholder="/logo.jpeg or https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter the path or URL to your hero image. You can upload images via the Gallery page.
              </p>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                About Image URL (optional)
              </label>
              <Input
                value={formData.aboutImage || ''}
                onChange={(e) => handleChange('aboutImage', e.target.value)}
                placeholder="https://example.com/about-image.jpg"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter the URL to an image for the About section
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'whychoose',
      label: 'Why Choose Us',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Why Choose Us Section</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Section Subtitle
              </label>
              <Input
                value={formData.whyChooseSubtitle || ''}
                onChange={(e) => handleChange('whyChooseSubtitle', e.target.value)}
                placeholder="Our Advantages"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Section Title
              </label>
              <Input
                value={formData.whyChooseTitle || ''}
                onChange={(e) => handleChange('whyChooseTitle', e.target.value)}
                placeholder="Why Choose 3D'S SAWMILL?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Section Description
              </label>
              <textarea
                value={formData.whyChooseDescription || ''}
                onChange={(e) => handleChange('whyChooseDescription', e.target.value)}
                placeholder="We combine traditional craftsmanship with cutting-edge technology..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                rows={3}
              />
            </div>

            <div className="border-t dark:border-gray-600 pt-4 mt-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Feature 1</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Feature Title
                  </label>
                  <Input
                    value={formData.feature1Title || ''}
                    onChange={(e) => handleChange('feature1Title', e.target.value)}
                    placeholder="Sustainable Sourcing"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Feature Description
                  </label>
                  <textarea
                    value={formData.feature1Description || ''}
                    onChange={(e) => handleChange('feature1Description', e.target.value)}
                    placeholder="All our timber comes from certified sustainable forests..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="border-t dark:border-gray-600 pt-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Feature 2</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Feature Title
                  </label>
                  <Input
                    value={formData.feature2Title || ''}
                    onChange={(e) => handleChange('feature2Title', e.target.value)}
                    placeholder="Precision Milling"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Feature Description
                  </label>
                  <textarea
                    value={formData.feature2Description || ''}
                    onChange={(e) => handleChange('feature2Description', e.target.value)}
                    placeholder="State-of-the-art equipment ensures exact dimensions..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="border-t dark:border-gray-600 pt-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Feature 3</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Feature Title
                  </label>
                  <Input
                    value={formData.feature3Title || ''}
                    onChange={(e) => handleChange('feature3Title', e.target.value)}
                    placeholder="Nationwide Delivery"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Feature Description
                  </label>
                  <textarea
                    value={formData.feature3Description || ''}
                    onChange={(e) => handleChange('feature3Description', e.target.value)}
                    placeholder="Reliable logistics network delivering to your construction site..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    rows={3}
                  />
                </div>
              </div>
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
    },
    {
      id: 'footer',
      label: 'Footer Content',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Footer Section Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Footer Tagline
              </label>
              <Input
                value={formData.footerTagline || ''}
                onChange={(e) => handleChange('footerTagline', e.target.value)}
                placeholder="For all structural and industrial timber"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Footer Description
              </label>
              <textarea
                value={formData.footerDescription || ''}
                onChange={(e) => handleChange('footerDescription', e.target.value)}
                placeholder="Your trusted partner for premium timber solutions..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Copyright Text
              </label>
              <Input
                value={formData.footerCopyrightText || ''}
                onChange={(e) => handleChange('footerCopyrightText', e.target.value)}
                placeholder="Specializing in structural and industrial timber since 1990"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'company',
      label: 'Company Info',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Company Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Name
              </label>
              <Input
                value={formData.companyName || ''}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="3D'S SAWMILL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Logo URL
              </label>
              <Input
                value={formData.companyLogo || ''}
                onChange={(e) => handleChange('companyLogo', e.target.value)}
                placeholder="/logo.jpeg"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter the path to your company logo image
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Year Established
              </label>
              <Input
                value={formData.companyEstablished || ''}
                onChange={(e) => handleChange('companyEstablished', e.target.value)}
                placeholder="1990"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'cta',
      label: 'CTA Section',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Call-to-Action Section</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CTA Title
              </label>
              <Input
                value={formData.ctaTitle || ''}
                onChange={(e) => handleChange('ctaTitle', e.target.value)}
                placeholder="Ready to Start Your Project?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CTA Description
              </label>
              <textarea
                value={formData.ctaDescription || ''}
                onChange={(e) => handleChange('ctaDescription', e.target.value)}
                placeholder="Get a custom quote for your specific timber requirements..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CTA Button Text
              </label>
              <Input
                value={formData.ctaButtonText || ''}
                onChange={(e) => handleChange('ctaButtonText', e.target.value)}
                placeholder="Request Custom Quote"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'stats',
      label: 'Stats Section',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Statistics Section</h3>
          
          <div className="space-y-6">
            <div className="border-t dark:border-gray-600 pt-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Stat 1</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Value
                  </label>
                  <Input
                    value={formData.stat1Value || ''}
                    onChange={(e) => handleChange('stat1Value', e.target.value)}
                    placeholder="30+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Label
                  </label>
                  <Input
                    value={formData.stat1Label || ''}
                    onChange={(e) => handleChange('stat1Label', e.target.value)}
                    placeholder="Years Experience"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Suffix
                  </label>
                  <Input
                    value={formData.stat1Suffix || ''}
                    onChange={(e) => handleChange('stat1Suffix', e.target.value)}
                    placeholder="Since 1990"
                  />
                </div>
              </div>
            </div>

            <div className="border-t dark:border-gray-600 pt-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Stat 2</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Value
                  </label>
                  <Input
                    value={formData.stat2Value || ''}
                    onChange={(e) => handleChange('stat2Value', e.target.value)}
                    placeholder="100%"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Label
                  </label>
                  <Input
                    value={formData.stat2Label || ''}
                    onChange={(e) => handleChange('stat2Label', e.target.value)}
                    placeholder="Quality Guarantee"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Suffix
                  </label>
                  <Input
                    value={formData.stat2Suffix || ''}
                    onChange={(e) => handleChange('stat2Suffix', e.target.value)}
                    placeholder="Premium Timber"
                  />
                </div>
              </div>
            </div>

            <div className="border-t dark:border-gray-600 pt-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Stat 3</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Value
                  </label>
                  <Input
                    value={formData.stat3Value || ''}
                    onChange={(e) => handleChange('stat3Value', e.target.value)}
                    placeholder="24/7"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Label
                  </label>
                  <Input
                    value={formData.stat3Label || ''}
                    onChange={(e) => handleChange('stat3Label', e.target.value)}
                    placeholder="Support"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Suffix
                  </label>
                  <Input
                    value={formData.stat3Suffix || ''}
                    onChange={(e) => handleChange('stat3Suffix', e.target.value)}
                    placeholder="Always Available"
                  />
                </div>
              </div>
            </div>

            <div className="border-t dark:border-gray-600 pt-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Stat 4</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Value
                  </label>
                  <Input
                    value={formData.stat4Value || ''}
                    onChange={(e) => handleChange('stat4Value', e.target.value)}
                    placeholder="500+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Label
                  </label>
                  <Input
                    value={formData.stat4Label || ''}
                    onChange={(e) => handleChange('stat4Label', e.target.value)}
                    placeholder="Projects"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Suffix
                  </label>
                  <Input
                    value={formData.stat4Suffix || ''}
                    onChange={(e) => handleChange('stat4Suffix', e.target.value)}
                    placeholder="Completed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'seo',
      label: 'SEO & Metadata',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SEO & Metadata Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meta Title
              </label>
              <Input
                value={formData.metaTitle || ''}
                onChange={(e) => handleChange('metaTitle', e.target.value)}
                placeholder="3D'S SAWMILL - Premium Timber Solutions"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Recommended length: 50-60 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meta Description
              </label>
              <textarea
                value={formData.metaDescription || ''}
                onChange={(e) => handleChange('metaDescription', e.target.value)}
                placeholder="South Africa's trusted timber supplier..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                rows={3}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Recommended length: 150-160 characters
              </p>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Site Settings - Content Management System</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage all website content including hero section, about section, features, footer, CTA, stats, and more
          </p>
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              💡 <strong>How it works:</strong> Fields are pre-filled with current website content. Edit freely, then click "Save Changes" to update the live website.
            </p>
          </div>
          {hasUnsavedChanges && (
            <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                ⚠️ <strong>You have unsaved changes.</strong> Click "Save Changes" to update the website, or "Discard Changes" to cancel.
              </p>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          {hasUnsavedChanges && (
            <Button
              variant="outline"
              onClick={handleDiscardChanges}
              className="border-amber-600 text-amber-700 hover:bg-amber-50"
            >
              Discard Changes
            </Button>
          )}
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
          {/* Tab Navigation - Clicking ONLY changes tab, does NOT save */}
          <div className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 mb-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content - Shows the active tab's content */}
          <div className="mt-6">
            {tabs.find(tab => tab.id === activeTab)?.content}
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {hasUnsavedChanges ? (
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  ● Unsaved changes
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ All changes saved
                </span>
              )}
            </div>
            <div className="flex gap-3">
              {hasUnsavedChanges && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDiscardChanges}
                  disabled={isSaving}
                >
                  Discard Changes
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSaving || !hasUnsavedChanges}
                leftIcon={<Save className="h-4 w-4" />}
                className={hasUnsavedChanges ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};
