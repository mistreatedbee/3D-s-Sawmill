import { useState, useCallback } from 'react';
import { getLocalStorage } from '../utils/helpers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface WishlistItem {
  productId: string;
  addedAt: string;
  notes?: string;
}

export interface Wishlist {
  _id: string;
  userId: string;
  items: WishlistItem[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useWishlist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => getLocalStorage<string | null>('auth_token', null);

  const getWishlist = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/wishlists/${userId}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return { _id: '', userId, items: [], isPublic: false };
        }
        throw new Error('Failed to fetch wishlist');
      }
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addToWishlist = useCallback(async (userId: string, productId: string, notes?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/wishlists/${userId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ productId, notes }),
      });

      if (!response.ok) throw new Error('Failed to add to wishlist');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromWishlist = useCallback(async (userId: string, productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/wishlists/${userId}/items/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) throw new Error('Failed to remove from wishlist');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateWishlistItem = useCallback(async (userId: string, productId: string, notes: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/wishlists/${userId}/items/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) throw new Error('Failed to update wishlist item');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearWishlist = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/wishlists/${userId}/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) throw new Error('Failed to clear wishlist');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleWishlistPublic = useCallback(async (userId: string, isPublic: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/wishlists/${userId}/share`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ isPublic }),
      });

      if (!response.ok) throw new Error('Failed to update wishlist');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPublicWishlist = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/wishlists/public/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch wishlist');
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
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    updateWishlistItem,
    clearWishlist,
    toggleWishlistPublic,
    getPublicWishlist,
  };
};
