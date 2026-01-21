import { useState } from 'react';
import { getLocalStorage } from '../utils/helpers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAdminProducts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => getLocalStorage<string | null>('auth_token', null);

  const getProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/products/admin/all`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error('Failed to create product');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId: string, productData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error('Failed to update product');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete product');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getProducts, createProduct, updateProduct, deleteProduct, loading, error };
};

export const useAdminOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => getLocalStorage<string | null>('auth_token', null);

  const updateOrderStatus = async (orderId: string, status: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status }),
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
  };

  return { updateOrderStatus, loading, error };
};

export const useAdminGallery = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => getLocalStorage<string | null>('auth_token', null);

  const addImage = async (imageData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/gallery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(imageData),
      });

      if (!response.ok) throw new Error('Failed to add image');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (imageId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/gallery/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete image');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addImage, deleteImage, loading, error };
};

export const useAdminTestimonials = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => getLocalStorage<string | null>('auth_token', null);

  const verifyTestimonial = async (testimonialId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/testimonials/${testimonialId}/verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) throw new Error('Failed to verify testimonial');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTestimonial = async (testimonialId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/testimonials/${testimonialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete testimonial');
      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { verifyTestimonial, deleteTestimonial, loading, error };
};
