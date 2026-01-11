import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
  images: string[];
  inStock: boolean;
  specifications: {
    material?: string;
    dimensions?: string;
    weight?: string;
    color?: string;
    warranty?: string;
  };
  reviews_list?: Array<{
    userId: string;
    userName: string;
    rating: number;
    title: string;
    comment: string;
    verified: boolean;
  }>;
}

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  onAddToCart?: (quantity: number) => void;
}

export function ProductDetailsModal({
  isOpen,
  onClose,
  productId,
  onAddToCart
}: ProductDetailsModalProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (isOpen && productId) {
      loadProduct();
    }
  }, [isOpen, productId]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/products/${productId}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        setSelectedImage(0);
      }
    } catch (err) {
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity
      });
      alert('Added to cart!');
      onAddToCart?.(quantity);
      onClose();
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user || !product) return;
    try {
      if (isWishlisted) {
        await removeFromWishlist(user._id, product._id);
      } else {
        await addToWishlist(user._id, product._id);
      }
      setIsWishlisted(!isWishlisted);
    } catch (err) {
      console.error('Error updating wishlist:', err);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : product ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden h-96">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23eee" width="400" height="400"/%3E%3C/svg%3E';
                }}
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <p className="text-white text-2xl font-bold">Out of Stock</p>
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 rounded border-2 overflow-hidden ${
                      selectedImage === idx ? 'border-blue-500' : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                <button
                  onClick={handleToggleWishlist}
                  className="text-2xl hover:scale-110 transition"
                  title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {isWishlisted ? '❤️' : '🤍'}
                </button>
              </div>
              <Badge className="bg-blue-100 text-blue-800">{product.category}</Badge>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <span className="text-2xl text-yellow-500">
                {'★'.repeat(Math.round(product.rating || 0)) + '☆'.repeat(5 - Math.round(product.rating || 0))}
              </span>
              <span className="text-gray-600">
                {(product.rating || 0).toFixed(1)} ({product.reviews || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold text-blue-600">
              {formatCurrency(product.price)}
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>

            {/* Specifications */}
            {Object.keys(product.specifications).length > 0 && (
              <Card className="p-4 bg-gray-50">
                <h3 className="font-bold text-gray-900 mb-3">Specifications</h3>
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    value && (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="font-medium text-gray-900">{value}</span>
                      </div>
                    )
                  ))}
                </div>
              </Card>
            )}

            {/* Reviews Preview */}
            {product.reviews_list && product.reviews_list.length > 0 && (
              <Card className="p-4 bg-blue-50 border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-3">Recent Reviews</h3>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {product.reviews_list.slice(0, 2).map((review, idx) => (
                    <div key={idx} className="text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{review.userName}</span>
                        <span className="text-yellow-500">
                          {'★'.repeat(review.rating)}
                        </span>
                      </div>
                      <p className="text-gray-700 italic">"{review.comment.slice(0, 100)}..."</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Add to Cart */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    −
                  </button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock || addingToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3"
              >
                {addingToCart ? 'Adding...' : '🛒 Add to Cart'}
              </Button>

              <Button
                onClick={onClose}
                variant="outline"
                className="w-full"
              >
                Close
              </Button>

              <p className="text-xs text-center text-gray-500 pt-2">
                {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">Product not found</p>
        </div>
      )}
    </Modal>
  );
}
