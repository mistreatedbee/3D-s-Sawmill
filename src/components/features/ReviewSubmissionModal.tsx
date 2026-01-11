import React, { useState } from 'react';
import { useReviews } from '../../hooks/useReviews';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface ReviewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  orderId: string;
  userId: string;
  onSuccess?: () => void;
}

export function ReviewSubmissionModal({
  isOpen,
  onClose,
  productId,
  productName,
  orderId,
  userId,
  onSuccess
}: ReviewSubmissionModalProps) {
  const { createReview, loading, error } = useReviews();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleAddImage = () => {
    if (imageInput.trim() && images.length < 5) {
      setImages([...images, imageInput]);
      setImageInput('');
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await createReview({
        productId,
        userId,
        orderId,
        rating,
        title,
        comment,
        images
      });
      alert('Review submitted! It will be published after moderation.');
      resetForm();
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(5);
    setTitle('');
    setComment('');
    setImages([]);
    setImageInput('');
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-2xl space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Write a Review: {productName}
        </h2>

        {error && (
          <div className="p-3 bg-red-50 text-red-800 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Rating *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="text-4xl transition"
                >
                  {star <= (hoveredRating || rating) ? '★' : '☆'}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Review Title *
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Great quality and fast shipping"
              maxLength={100}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {title.length}/100
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your honest opinion about this product..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              maxLength={1000}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/1000
            </p>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Add Photos (Optional)
            </label>
            <p className="text-xs text-gray-600 mb-3">
              Add up to 5 images. Paste image URLs or drag and drop.
            </p>

            <div className="flex gap-2 mb-3">
              <Input
                type="text"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="Paste image URL..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImage();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddImage}
                disabled={images.length >= 5 || !imageInput.trim()}
                variant="outline"
              >
                Add
              </Button>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img}
                      alt={`Review ${idx}`}
                      className="w-full h-24 rounded border border-gray-200 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23eee" width="100" height="100"/%3E%3Ctext x="50" y="50" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="12"%3EInvalid URL%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2">
              {images.length}/5 images added
            </p>
          </div>

          {/* Verified Purchase */}
          <Card className="p-3 bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">✓ Verified Purchase</Badge>
              <span className="text-sm text-blue-800">
                You verified purchase of this item
              </span>
            </div>
          </Card>

          {/* Info */}
          <Card className="p-3 bg-gray-50">
            <p className="text-xs text-gray-700">
              <strong>📝 Note:</strong> Your review will be published after our moderation team approves it. This typically takes 24-48 hours.
            </p>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="submit"
              disabled={submitting || !title.trim() || !comment.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? 'Submitting...' : '✓ Submit Review'}
            </Button>
            <Button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
