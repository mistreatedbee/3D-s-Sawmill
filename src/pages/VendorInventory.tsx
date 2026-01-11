import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { formatters } from '../utils/formatters';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface InventoryItem {
  _id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  category: string;
  image: string;
  lastRestocked: string;
  reorderLevel: number;
}

export function VendorInventory() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [newQuantity, setNewQuantity] = useState('');

  useEffect(() => {
    loadInventory();
  }, [filterCategory, filterStock]);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      // Fetch products and map to inventory format
      const response = await fetch(
        `${API_URL}/products`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      if (response.ok) {
        const products = await response.json();
        // Map products to inventory format
        const inventoryData = products.map((product: any) => ({
          _id: product._id,
          name: product.name,
          sku: product.sku || product._id.slice(-8).toUpperCase(),
          quantity: product.stock || 0,
          price: product.price,
          category: product.category,
          image: product.images?.[0]?.url || product.image || '/placeholder.jpg',
          lastRestocked: product.updatedAt,
          reorderLevel: 10
        }));
        
        // Apply filters
        let filtered = inventoryData;
        if (filterCategory !== 'all') {
          filtered = filtered.filter((item: InventoryItem) => item.category === filterCategory);
        }
        if (filterStock === 'low') {
          filtered = filtered.filter((item: InventoryItem) => item.quantity < item.reorderLevel);
        } else if (filterStock === 'out') {
          filtered = filtered.filter((item: InventoryItem) => item.quantity === 0);
        }
        
        setInventory(filtered);
      }
    } catch (err) {
      console.error('Error loading inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (itemId: string, quantity: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      // Update product stock
      const response = await fetch(
        `${API_URL}/products/${itemId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ stock: quantity })
        }
      );
      if (response.ok) {
        await loadInventory();
        setShowForm(false);
        setSelectedItem(null);
        setNewQuantity('');
      }
    } catch (err) {
      console.error('Error updating inventory:', err);
    }
  };

  const getLowStockItems = () => {
    return inventory.filter(item => item.quantity <= item.reorderLevel);
  };

  const getTotalValue = () => {
    return inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) return 'Out of Stock';
    if (item.quantity <= item.reorderLevel) return 'Low Stock';
    return 'In Stock';
  };

  const getStockColor = (item: InventoryItem) => {
    if (item.quantity === 0) return 'bg-red-100 text-red-800';
    if (item.quantity <= item.reorderLevel) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">Please log in as a vendor to access inventory</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Manage your product stock levels</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Total Items</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{inventory.length}</p>
        </Card>

        <Card className="p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Total Value</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {formatters.formatPrice(getTotalValue())}
          </p>
        </Card>

        <Card className="p-4 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Low Stock</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {getLowStockItems().length}
          </p>
        </Card>

        <Card className="p-4 border-l-4 border-red-500">
          <p className="text-sm text-gray-600">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {inventory.filter(i => i.quantity === 0).length}
          </p>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {getLowStockItems().length > 0 && (
        <Card className="p-4 bg-yellow-50 border border-yellow-200">
          <h3 className="font-bold text-yellow-900 mb-2">⚠️ Low Stock Alert</h3>
          <p className="text-sm text-yellow-800">
            {getLowStockItems().length} items are below reorder level
          </p>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <Select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="flex-1"
        >
          <option value="all">All Categories</option>
          <option value="plywood">Plywood</option>
          <option value="hardwood">Hardwood</option>
          <option value="softwood">Softwood</option>
        </Select>

        <Select
          value={filterStock}
          onChange={(e) => setFilterStock(e.target.value)}
          className="flex-1"
        >
          <option value="all">All Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </Select>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : inventory.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No items in inventory</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">SKU</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Quantity</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Price</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Restocked</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {inventory.map((item, idx) => (
                  <tr key={item._id} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-900">{item.sku}</td>
                    <td className="text-center py-3 px-4 font-bold text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="text-right py-3 px-4 font-medium text-gray-900">
                      {formatters.formatPrice(item.price)}
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge className={getStockColor(item)}>
                        {getStockStatus(item)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">
                      {new Date(item.lastRestocked).toLocaleDateString()}
                    </td>
                    <td className="text-center py-3 px-4">
                      <Button
                        onClick={() => {
                          setSelectedItem(item);
                          setNewQuantity(item.quantity.toString());
                          setShowForm(true);
                        }}
                        size="sm"
                        variant="outline"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Edit Quantity Modal */}
      {showForm && selectedItem && (
        <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
          <div className="space-y-4 max-w-md">
            <h2 className="text-2xl font-bold text-gray-900">Update Stock</h2>

            <Card className="p-4 bg-gray-50">
              <p className="text-sm text-gray-600">Product</p>
              <p className="font-bold text-gray-900">{selectedItem.name}</p>
              <p className="text-xs text-gray-500 mt-1">Current: {selectedItem.quantity} units</p>
            </Card>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Quantity
              </label>
              <Input
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  handleUpdateStock(selectedItem._id, parseInt(newQuantity));
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Update
              </Button>
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
