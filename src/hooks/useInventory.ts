import { useState, useEffect } from 'react';
import { Product } from '../types';
import { getLocalStorage, setLocalStorage } from '../utils/helpers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const useInventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        // Map MongoDB _id to id for frontend compatibility
        const productsWithId = data.map((p: any) => ({
          ...p,
          id: p._id || p.id
        }));
        setProducts(productsWithId);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Failed to fetch products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);
  const updateProduct = async (updatedProduct: Product) => {
    try {
      const token = getLocalStorage<string | null>('auth_token', null);
      const response = await fetch(`${API_URL}/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) throw new Error('Failed to update product');
      const data = await response.json();
      setProducts(products.map(p => p.id === data.id ? data : p));
    } catch (err) {
      console.error('Failed to update product:', err);
      throw err;
    }
  };

  const addProduct = async (newProduct: Product) => {
    try {
      const token = getLocalStorage<string | null>('auth_token', null);
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) throw new Error('Failed to add product');
      const data = await response.json();
      setProducts([...products, data]);
    } catch (err) {
      console.error('Failed to add product:', err);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const token = getLocalStorage<string | null>('auth_token', null);
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete product');
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete product:', err);
      throw err;
    }
  };
  return {
    products,
    isLoading,
    error,
    updateProduct,
    addProduct,
    deleteProduct
  };
};