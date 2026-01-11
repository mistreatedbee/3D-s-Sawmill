import { useState, useCallback } from 'react';
import { getLocalStorage } from '../utils/helpers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const advancedSearch = useCallback(async (params: {
    search?: string;
    category?: string;
    woodType?: string;
    color?: string;
    priceMin?: number;
    priceMax?: number;
    minRating?: number;
    tags?: string[];
    featured?: boolean;
    inStock?: boolean;
    sortBy?: string;
    limit?: number;
    page?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);
      if (params.woodType) queryParams.append('woodType', params.woodType);
      if (params.color) queryParams.append('color', params.color);
      if (params.priceMin) queryParams.append('priceMin', params.priceMin.toString());
      if (params.priceMax) queryParams.append('priceMax', params.priceMax.toString());
      if (params.minRating) queryParams.append('minRating', params.minRating.toString());
      if (params.tags?.length) queryParams.append('tags', params.tags.join(','));
      if (params.featured) queryParams.append('featured', 'true');
      if (params.inStock !== undefined) queryParams.append('inStock', params.inStock.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.page) queryParams.append('page', params.page.toString());

      const response = await fetch(`${API_URL}/search/advanced?${queryParams}`);
      if (!response.ok) throw new Error('Search failed');
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

  const getFilterOptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/search/filters`);
      if (!response.ok) throw new Error('Failed to fetch filter options');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSimilarProducts = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/search/similar/${productId}`);
      if (!response.ok) throw new Error('Failed to fetch similar products');
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

  const getSearchSuggestions = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/search/suggestions?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const data = await response.json();
      return data.suggestions || data;
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
    advancedSearch,
    getFilterOptions,
    getSimilarProducts,
    getSearchSuggestions,
  };
};
