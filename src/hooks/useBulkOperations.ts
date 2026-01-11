import { useState } from 'react';
import { getLocalStorage } from '../utils/helpers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface BulkProductData {
  products: Array<{
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    dimensions?: { length: string; width: string; height: string };
    images?: string[];
    featured?: boolean;
    available?: boolean;
  }>;
}

export interface BulkOrderData {
  orderIds: string[];
  status: string;
}

export interface Special {
  _id?: string;
  name: string;
  description: string;
  productIds: string[];
  discount: number; // percentage (0-100)
  discountType: 'percentage' | 'fixed'; // percentage or fixed amount
  startDate: string;
  endDate: string;
  active: boolean;
  featured?: boolean;
  image?: string;
}

export interface PromotionalPage {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  hero: {
    title: string;
    subtitle: string;
    image: string;
    buttonText?: string;
    buttonLink?: string;
  };
  sections: Array<{
    id: string;
    type: 'text' | 'products' | 'gallery' | 'testimonials' | 'banner' | 'features';
    title?: string;
    content?: string;
    productIds?: string[];
    images?: string[];
    backgroundColor?: string;
  }>;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  active: boolean;
  createdAt?: string;
}

export const useBulkProducts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState(0);

  const getToken = () => getLocalStorage<string | null>('auth_token', null);

  const createBulkProducts = async (bulkData: BulkProductData) => {
    setLoading(true);
    setError(null);
    setSuccessCount(0);
    try {
      const response = await fetch(`${API_URL}/products/bulk/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(bulkData),
      });

      if (!response.ok) throw new Error('Failed to create bulk products');
      const data = await response.json();
      setSuccessCount(data.created || bulkData.products.length);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBulkProducts = async (updates: Array<{ id: string; data: any }>) => {
    setLoading(true);
    setError(null);
    setSuccessCount(0);
    try {
      const response = await fetch(`${API_URL}/products/bulk/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) throw new Error('Failed to update bulk products');
      const data = await response.json();
      setSuccessCount(data.updated || updates.length);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createBulkProducts, updateBulkProducts, loading, error, successCount };
};

export const useBulkOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState(0);

  const getToken = () => getLocalStorage<string | null>('auth_token', null);

  const updateBulkOrderStatus = async (bulkData: BulkOrderData) => {
    setLoading(true);
    setError(null);
    setSuccessCount(0);
    try {
      const response = await fetch(`${API_URL}/orders/bulk/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(bulkData),
      });

      if (!response.ok) throw new Error('Failed to update bulk orders');
      const data = await response.json();
      setSuccessCount(data.updated || bulkData.orderIds.length);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateBulkOrderStatus, loading, error, successCount };
};

export const useSpecials = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => getLocalStorage<string | null>('auth_token', null);

  const createSpecial = async (specialData: Special) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/specials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(specialData),
      });

      if (!response.ok) throw new Error('Failed to create special');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSpecial = async (specialId: string, specialData: Special) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/specials/${specialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(specialData),
      });

      if (!response.ok) throw new Error('Failed to update special');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSpecial = async (specialId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/specials/${specialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete special');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createSpecial, updateSpecial, deleteSpecial, loading, error };
};

export const usePromotionalPages = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => getLocalStorage<string | null>('auth_token', null);

  const createPage = async (pageData: PromotionalPage) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/promotional-pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(pageData),
      });

      if (!response.ok) throw new Error('Failed to create promotional page');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePage = async (pageId: string, pageData: PromotionalPage) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/promotional-pages/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(pageData),
      });

      if (!response.ok) throw new Error('Failed to update promotional page');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async (pageId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/promotional-pages/${pageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete promotional page');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createPage, updatePage, deletePage, loading, error };
};
