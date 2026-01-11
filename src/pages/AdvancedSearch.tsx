import React, { useEffect, useState } from 'react';
import { useSearch } from '../hooks/useSearch';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatters } from '../utils/formatters';

interface FilterState {
  search: string;
  category?: string;
  woodType?: string;
  color?: string;
  priceMin?: number;
  priceMax?: number;
  minRating?: number;
  tags?: string[];
  inStock?: boolean;
  sortBy?: string;
}

export const AdvancedSearch = () => {
  const { advancedSearch, getFilterOptions, loading, error } = useSearch();
  const [filters, setFilters] = useState<FilterState>({ search: '' });
  const [products, setProducts] = useState<any[]>([]);
  const [filterOptions, setFilterOptions] = useState<any>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    if (filters.search || Object.keys(filters).length > 1) {
      executeSearch();
    }
  }, [filters, page]);

  const loadFilterOptions = async () => {
    try {
      const options = await getFilterOptions();
      setFilterOptions(options);
    } catch (err) {
      console.error('Failed to load filter options:', err);
    }
  };

  const executeSearch = async () => {
    try {
      const results = await advancedSearch({ ...filters, page, limit: 12 });
      setProducts(results);
      setTotalResults(results.length);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters({ search: '' });
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h1 className="text-3xl font-bold mb-2">Advanced Product Search</h1>
        <p className="text-blue-100">Find exactly what you're looking for</p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-4">
            <h2 className="text-lg font-bold mb-4">Filters</h2>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Search</label>
              <Input
                placeholder="Product name..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Category */}
            {filterOptions?.categories && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                >
                  <option value="">All Categories</option>
                  {filterOptions.categories.map((cat: string) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Wood Type */}
            {filterOptions?.woodTypes && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Wood Type</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={filters.woodType || ''}
                  onChange={(e) => handleFilterChange('woodType', e.target.value || undefined)}
                >
                  <option value="">All Types</option>
                  {filterOptions.woodTypes.map((type: string) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Color */}
            {filterOptions?.colors && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Color</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={filters.color || ''}
                  onChange={(e) => handleFilterChange('color', e.target.value || undefined)}
                >
                  <option value="">All Colors</option>
                  {filterOptions.colors.map((color: string) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Price Range */}
            {filterOptions?.priceRange && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Price Range</label>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder={`Min (${filterOptions.priceRange.min})`}
                    value={filters.priceMin || ''}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value ? Number(e.target.value) : undefined)}
                  />
                  <Input
                    type="number"
                    placeholder={`Max (${filterOptions.priceRange.max})`}
                    value={filters.priceMax || ''}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>
            )}

            {/* Rating */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Minimum Rating</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={filters.minRating || ''}
                onChange={(e) => handleFilterChange('minRating', e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">All Ratings</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Stars</option>
              </select>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.inStock || false}
                  onChange={(e) => handleFilterChange('inStock', e.target.checked ? true : undefined)}
                />
                <span className="text-sm font-semibold">In Stock Only</span>
              </label>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Sort By</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={filters.sortBy || ''}
                onChange={(e) => handleFilterChange('sortBy', e.target.value || undefined)}
              >
                <option value="">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="bestselling">Bestselling</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button onClick={executeSearch} className="flex-1">Search</Button>
              <Button onClick={handleReset} variant="outline" className="flex-1">Reset</Button>
            </div>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="mb-4">
            <p className="text-gray-600">
              {loading ? 'Searching...' : `${totalResults} products found`}
            </p>
          </div>

          {error && (
            <Card className="p-6 text-center text-red-600 mb-6">
              {error}
            </Card>
          )}

          {products.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-600 mb-4">No products found</p>
              <Button onClick={handleReset} variant="outline">Clear Filters</Button>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <Card key={product._id} className="overflow-hidden hover:shadow-lg transition">
                    {product.images?.[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-bold mb-2 truncate">{product.name}</h3>
                      
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {product.category && (
                          <Badge color="blue">{product.category}</Badge>
                        )}
                        {product.woodType && (
                          <Badge color="green">{product.woodType}</Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      {product.rating && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm">{product.rating.toFixed(1)} ({product.reviewCount} reviews)</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-bold text-blue-600">
                            {formatters.formatPrice(product.price)}
                          </p>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <p className="text-sm text-gray-500 line-through">
                              {formatters.formatPrice(product.originalPrice)}
                            </p>
                          )}
                        </div>
                        <Button size="sm">View Details</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalResults > 12 && (
                <div className="mt-8 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.ceil(totalResults / 12) }).map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`px-3 py-2 rounded-lg ${
                          page === i + 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= Math.ceil(totalResults / 12)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
