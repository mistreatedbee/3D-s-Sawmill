import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
interface ProductCardProps {
  product: Product;
}
export const ProductCard = ({
  product
}: ProductCardProps) => {
  const {
    addToCart
  } = useCart();
  const getImageUrl = (img: any) => {
    return typeof img === 'string' ? img : img.url;
  };
  const getDimensionString = () => {
    const dims = product.dimensions as any;
    if (typeof dims === 'string') return dims;
    const parts = [];
    if (dims.length) parts.push(dims.length);
    if (dims.width) parts.push(dims.width);
    if (dims.height) parts.push(dims.height);
    return parts.join(' x ') + ' ' + (dims.unit || 'mm');
  };

  return <Card hoverEffect className="group relative flex flex-col h-full bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-900">
        <img src={getImageUrl(product.images[0])} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button variant="glass" size="sm" onClick={() => addToCart(product)} leftIcon={<ShoppingCart className="h-4 w-4" />}>
            Add
          </Button>
          <Button variant="glass" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        {product.stock < 10 && product.stock > 0 && <Badge variant="warning" className="absolute top-2 right-2">
            Low Stock
          </Badge>}
        {product.stock === 0 && <Badge variant="error" className="absolute top-2 right-2">
            Out of Stock
          </Badge>}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs text-wood-600 dark:text-wood-400 font-medium mb-1 uppercase tracking-wider">
          {product.category}
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {product.name}
        </h3>
        {(product as any).productType && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Type: {(product as any).productType}
          </div>
        )}
        {(product as any).woodType && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Wood: {(product as any).woodType} · Color: {(product as any).color}
          </div>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(product.price)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {getDimensionString()}
          </span>
        </div>
      </div>
    </Card>;
};