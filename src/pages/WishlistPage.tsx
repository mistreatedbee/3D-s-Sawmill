import React, { useState, useEffect } from 'react';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { formatters } from '../utils/formatters';

interface WishlistItem {
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number;
  productCategory: string;
  addedAt: string;
  notes: string;
}

export function WishlistPage() {
  const { user } = useAuth();
  const { getWishlist, addToWishlist, removeFromWishlist, updateWishlistItem, clearWishlist, toggleWishlistPublic, loading, error } = useWishlist();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  useEffect(() => {
    if (user) {
      loadWishlist();
    }
  }, [user]);

  const loadWishlist = async () => {
    if (!user) return;
    try {
      const data = await getWishlist(user._id);
      setItems(data.items || []);
      setIsPublic(data.isPublic || false);
      if (data.isPublic) {
        setShareLink(`${window.location.origin}/wishlist/public/${user._id}`);
      }
    } catch (err) {
      console.error('Error loading wishlist:', err);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    if (!user) return;
    try {
      await removeFromWishlist(user._id, productId);
      await loadWishlist();
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const handleUpdateNotes = async (productId: string) => {
    if (!user) return;
    try {
      await updateWishlistItem(user._id, productId, editNotes);
      setEditingId(null);
      setEditNotes('');
      await loadWishlist();
    } catch (err) {
      console.error('Error updating notes:', err);
    }
  };

  const handleTogglePublic = async () => {
    if (!user) return;
    try {
      await toggleWishlistPublic(user._id, !isPublic);
      setIsPublic(!isPublic);
      if (!isPublic) {
        setShareLink(`${window.location.origin}/wishlist/public/${user._id}`);
      }
      await loadWishlist();
    } catch (err) {
      console.error('Error toggling public:', err);
    }
  };

  const handleClearWishlist = async () => {
    if (!user) return;
    try {
      await clearWishlist(user._id);
      setItems([]);
      setShowClearConfirm(false);
    } catch (err) {
      console.error('Error clearing wishlist:', err);
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const getItemNotes = (productId: string) => {
    const item = items.find(i => i.productId === productId);
    return item?.notes || '';
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">Please log in to view your wishlist</p>
          <Button className="bg-blue-600 hover:bg-blue-700">Sign In</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-1">{items.length} items saved</p>
        </div>
        {items.length > 0 && (
          <div className="flex gap-2">
            <Button
              onClick={() => setShowShareModal(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              🔗 Share
            </Button>
            <Button
              onClick={() => setShowClearConfirm(true)}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      <Card className="p-4 bg-blue-50 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-blue-900">Wishlist Visibility</p>
            <p className="text-sm text-blue-800">
              {isPublic
                ? 'Your wishlist is public. Anyone with the link can view it.'
                : 'Your wishlist is private. Only you can see it.'}
            </p>
          </div>
          <Button
            onClick={handleTogglePublic}
            variant={isPublic ? 'primary' : 'outline'}
            className={isPublic ? 'bg-blue-600 text-white' : ''}
          >
            {isPublic ? '🔓 Make Private' : '🔒 Make Public'}
          </Button>
        </div>
      </Card>

      {error && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-800 font-semibold">Error: {error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : items.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-2xl mb-2">💝 Your wishlist is empty</p>
          <p className="text-gray-600 mb-4">Start adding products to save them for later</p>
          <Button href="/advanced-search" className="bg-blue-600 hover:bg-blue-700">
            Browse Products
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <Card key={item.productId} className="overflow-hidden hover:shadow-lg transition flex flex-col">
              {/* Product Image */}
              <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23eee" width="200" height="200"/%3E%3Ctext x="100" y="100" dominant-baseline="middle" text-anchor="middle" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
                <Badge className="absolute top-2 right-2 bg-blue-600">
                  {item.productCategory}
                </Badge>
                <div
                  className="absolute top-2 left-2 text-2xl cursor-pointer hover:scale-110 transition"
                  onClick={() => handleRemoveItem(item.productId)}
                  title="Remove from wishlist"
                >
                  ❤️
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
                  {item.productName}
                </h3>

                <p className="text-xl font-bold text-blue-600 mb-3">
                  {formatters.formatPrice(item.productPrice)}
                </p>

                <p className="text-xs text-gray-500 mb-3">
                  Saved {new Date(item.addedAt).toLocaleDateString()}
                </p>

                {editingId === item.productId ? (
                  <div className="space-y-2 mb-3">
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Add notes about why you want this..."
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleUpdateNotes(item.productId)}
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingId(null)}
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {item.notes && (
                      <p className="text-sm text-gray-600 mb-3 p-2 bg-gray-50 rounded italic">
                        "{item.notes}"
                      </p>
                    )}
                    <button
                      onClick={() => {
                        setEditingId(item.productId);
                        setEditNotes(item.notes);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 mb-3"
                    >
                      {item.notes ? '✏️ Edit notes' : '✏️ Add notes'}
                    </button>
                  </>
                )}

                <div className="flex gap-2 mt-auto">
                  <Button
                    href={`/product/${item.productId}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => handleRemoveItem(item.productId)}
                    variant="outline"
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <Modal isOpen={showShareModal} onClose={() => setShowShareModal(false)}>
          <div className="space-y-4 max-w-md">
            <h2 className="text-2xl font-bold text-gray-900">Share Wishlist</h2>

            {!isPublic ? (
              <Card className="p-4 bg-yellow-50 border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  Make your wishlist public to share it with others.
                </p>
              </Card>
            ) : (
              <>
                <p className="text-gray-600">
                  Share your wishlist with friends and family
                </p>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Wishlist Link
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={shareLink}
                      readOnly
                      className="flex-1 bg-gray-50"
                    />
                    <Button
                      onClick={handleCopyShareLink}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {copyFeedback ? '✓ Copied' : 'Copy'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Share via:</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check%20out%20my%20wishlist%20${encodeURIComponent(shareLink)}`, '_blank')}
                      variant="outline"
                      className="flex-1"
                    >
                      Twitter
                    </Button>
                    <Button
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`, '_blank')}
                      variant="outline"
                      className="flex-1"
                    >
                      Facebook
                    </Button>
                  </div>
                </div>
              </>
            )}

            <Button
              onClick={() => setShowShareModal(false)}
              variant="outline"
              className="w-full"
            >
              Close
            </Button>
          </div>
        </Modal>
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <Modal isOpen={showClearConfirm} onClose={() => setShowClearConfirm(false)}>
          <div className="space-y-4 max-w-sm">
            <h2 className="text-2xl font-bold text-gray-900">Clear Wishlist?</h2>
            <p className="text-gray-600">
              Are you sure you want to remove all {items.length} items from your wishlist? This action cannot be undone.
            </p>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                onClick={handleClearWishlist}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Clear All
              </Button>
              <Button
                onClick={() => setShowClearConfirm(false)}
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
