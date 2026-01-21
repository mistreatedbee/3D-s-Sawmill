import { useState, useCallback } from 'react';
import { getLocalStorage } from '../utils/helpers';
import { authFetch } from '../utils/authFetch';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAdminOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => getLocalStorage<string | null>('auth_token', null);

  const getAllOrders = useCallback(async (page = 1, limit = 20, status?: string) => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_URL}/orders?page=${page}&limit=${limit}`;
      if (status) url += `&status=${status}`;

      const response = await authFetch(url);

      if (!response.ok) throw new Error('Failed to fetch orders');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, status: string, notes?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes }),
      });

      if (!response.ok) throw new Error('Failed to update order status');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePaymentStatus = useCallback(async (orderId: string, paymentStatus: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch(`${API_URL}/orders/${orderId}/payment-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentStatus }),
      });

      if (!response.ok) throw new Error('Failed to update payment status');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderFinancials = useCallback(async (
    orderId: string,
    payload: {
      items?: Array<{ productId: string; quantity: number; unitPrice: number }>;
      shippingCost?: number;
      tax?: number;
      discount?: number;
      adminNotes?: string;
    }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch(`${API_URL}/orders/${orderId}/financials`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to update order totals');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrderStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch(`${API_URL}/orders/stats/overview`);

      if (!response.ok) throw new Error('Failed to fetch order stats');
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
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
    updateOrderFinancials,
    getOrderStats,
  };
};
