import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { ProductCard } from '../components/features/ProductCard';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useInventory } from '../hooks/useInventory';
import { ProductCategory } from '../types';
const CATEGORIES: ProductCategory[] = ['Plywood', '4x4 Timber', 'Boards', 'Doors', 'Window Frames', 'Pillars', 'Custom Cuts'];
export const Products = () => {
  const {
    products,
    isLoading
  } = useInventory();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [sort, setSort] = useState('name');
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).filter(p => category === 'all' || p.category === category).sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    return a.name.localeCompare(b.name);
  });
  return <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Our Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse our extensive catalog of high-quality timber.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel p-6 rounded-xl mb-12 space-y-4 md:space-y-0 md:flex gap-4">
        <div className="flex-1">
          <Input placeholder="Search products..." icon={<Search className="h-4 w-4" />} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="w-full md:w-48">
          <Select options={[{
          label: 'All Categories',
          value: 'all'
        }, ...CATEGORIES.map(c => ({
          label: c,
          value: c
        }))]} value={category} onChange={e => setCategory(e.target.value)} />
        </div>
        <div className="w-full md:w-48">
          <Select options={[{
          label: 'Name (A-Z)',
          value: 'name'
        }, {
          label: 'Price (Low-High)',
          value: 'price-asc'
        }, {
          label: 'Price (High-Low)',
          value: 'price-desc'
        }]} value={sort} onChange={e => setSort(e.target.value)} />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? <div className="text-center py-20">Loading products...</div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => <motion.div key={product.id} initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} layout>
              <ProductCard product={product} />
            </motion.div>)}
        </div>}

      {filteredProducts.length === 0 && !isLoading && <div className="text-center py-20 text-gray-500">
          No products found matching your criteria.
        </div>}
    </div>;
};