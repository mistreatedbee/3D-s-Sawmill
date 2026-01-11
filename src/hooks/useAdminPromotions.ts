import { useState, useCallback } from 'react';
import { getLocalStorage } from '../utils/helpers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Promotion {
  _id?: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscount?: number;
  minimumOrderValue?: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usagePerCustomer?: number;
  active: boolean;
}

export const useAdminPromotions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => getLocalStorage<string | null>('auth_token', null);

  const createPromotion = useCallback(async (promotion: Omit<Promotion, '_id'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/promotions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(promotion),
      });

      if (!response.ok) throw new Error('Failed to create promotion');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllPromotions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/promotions`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch promotions');
      const data = await response.json();
      return data.promotions || data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPromotion = useCallback(async (promotionId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/promotions/${promotionId}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch promotion');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePromotion = useCallback(async (promotionId: string, promotion: Partial<Promotion>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/promotions/${promotionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(promotion),
      });

      if (!response.ok) throw new Error('Failed to update promotion');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePromotion = useCallback(async (promotionId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/promotions/${promotionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete promotion');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createPromotion,
    getAllPromotions,
    getPromotion,
    updatePromotion,
    deletePromotion,
  };
};
