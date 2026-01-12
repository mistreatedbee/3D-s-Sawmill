import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface SiteSettings {
  _id?: string;
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroBadgeText: string;
  heroFeatures?: { text: string; icon: string }[];
  heroImage?: string;
  
  // About Section
  aboutTitle: string;
  aboutSubtitle: string;
  aboutDescription: string;
  aboutMission: string;
  aboutVision: string;
  aboutImage?: string;
  
  // Why Choose Us Section
  whyChooseTitle: string;
  whyChooseSubtitle: string;
  whyChooseDescription: string;
  
  // Features
  feature1Title: string;
  feature1Description: string;
  feature2Title: string;
  feature2Description: string;
  feature3Title: string;
  feature3Description: string;
  
  // Contact Information
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  whatsappNumber: string;
  businessHours: string;
  
  // Social Media
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  
  // Footer Content
  footerTagline?: string;
  footerDescription?: string;
  footerCopyrightText?: string;
  
  // Company Information
  companyName?: string;
  companyLogo?: string;
  companyEstablished?: string;
  
  // CTA Section
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  
  // Stats Section
  stat1Value?: string;
  stat1Label?: string;
  stat1Suffix?: string;
  stat2Value?: string;
  stat2Label?: string;
  stat2Suffix?: string;
  stat3Value?: string;
  stat3Label?: string;
  stat3Suffix?: string;
  stat4Value?: string;
  stat4Label?: string;
  stat4Suffix?: string;
  
  // SEO
  metaTitle: string;
  metaDescription: string;
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/site-settings`);
      if (!response.ok) throw new Error('Failed to fetch site settings');
      const data = await response.json();
      setSettings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Failed to fetch site settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (updatedSettings: Partial<SiteSettings>) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/site-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedSettings),
      });

      if (!response.ok) throw new Error('Failed to update site settings');
      const data = await response.json();
      setSettings(data.settings);
      return data;
    } catch (err) {
      console.error('Failed to update site settings:', err);
      throw err;
    }
  };

  const resetSettings = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/site-settings/reset`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to reset site settings');
      const data = await response.json();
      setSettings(data.settings);
      return data;
    } catch (err) {
      console.error('Failed to reset site settings:', err);
      throw err;
    }
  };

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    resetSettings,
    refetch: fetchSettings
  };
};
