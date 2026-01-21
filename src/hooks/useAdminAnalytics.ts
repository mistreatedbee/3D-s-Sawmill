import { useState, useCallback } from 'react';
import { getLocalStorage } from '../utils/helpers';
import { authFetch } from '../utils/authFetch';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAdminAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => getLocalStorage<string | null>('auth_token', null);

  const getAnalytics = useCallback(async (startDate?: string, endDate?: string) => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_URL}/analytics`;
      if (startDate) url += `?startDate=${startDate}`;
      if (endDate) url += `${startDate ? '&' : '?'}endDate=${endDate}`;

      const response = await authFetch(url);

      if (!response.ok) throw new Error('Failed to fetch analytics');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDailyAnalytics = useCallback(async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch(`${API_URL}/analytics/daily?date=${date}`);

      if (!response.ok) throw new Error('Failed to fetch daily analytics');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTopProducts = useCallback(async (limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch(`${API_URL}/analytics/top-products?limit=${limit}`);

      if (!response.ok) throw new Error('Failed to fetch top products');
      const data = await response.json();
      return data.products || data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRevenueChart = useCallback(async (days = 30) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch(`${API_URL}/analytics/revenue-chart?days=${days}`);

      if (!response.ok) throw new Error('Failed to fetch revenue chart');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCategoryAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch(`${API_URL}/analytics/categories`);

      if (!response.ok) throw new Error('Failed to fetch category analytics');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPaymentMethodAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch(`${API_URL}/analytics/payment-methods`);

      if (!response.ok) throw new Error('Failed to fetch payment analytics');
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
    getAnalytics,
    getDailyAnalytics,
    getTopProducts,
    getRevenueChart,
    getCategoryAnalytics,
    getPaymentMethodAnalytics,
  };
};
