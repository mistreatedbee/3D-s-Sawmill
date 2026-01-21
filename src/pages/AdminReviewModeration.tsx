import React, { useState, useEffect } from 'react';
import { useReviews } from '../hooks/useReviews';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { formatters } from '../utils/formatters';
import { authFetch } from '../utils/authFetch';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Review {
  _id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  userEmail: string;
  orderId: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  images: string[];
  helpful: number;
  unhelpful: number;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  createdAt: string;
}

export function AdminReviewModeration() {
  const { createReview, getProductReviews, updateReview, deleteReview, loading, error } = useReviews();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [updatingId, setUpdatingId] = useState('');

  useEffect(() => {
    loadReviews();
  }, [filterStatus]);

  const loadReviews = async () => {
    try {
      const response = await authFetch(`${API_URL}/reviews?status=${filterStatus}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(Array.isArray(data) ? data : data.reviews || []);
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
    }
  };

  const handleApprove = async (reviewId: string) => {
    setUpdatingId(reviewId);
    try {
      const response = await authFetch(`${API_URL}/reviews/${reviewId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'approved' })
      });
      if (response.ok) {
        await loadReviews();
        setShowDetails(false);
      }
    } catch (err) {
      console.error('Error approving review:', err);
    } finally {
      setUpdatingId('');
    }
  };

  const handleReject = async (reviewId: string) => {
    setUpdatingId(reviewId);
    try {
      const response = await authFetch(`${API_URL}/reviews/${reviewId}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'rejected', reason: rejectionReason })
      });
      if (response.ok) {
        await loadReviews();
        setShowDetails(false);
        setRejectionReason('');
      }
    } catch (err) {
      console.error('Error rejecting review:', err);
    } finally {
      setUpdatingId('');
    }
  };

  const getRatingStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Review Moderation</h1>
        <p className="text-gray-600 mt-1">Approve or reject customer reviews</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-800 font-semibold">Error: {error}</p>
        </div>
      )}

      <div className="flex gap-2">
        {['pending', 'approved', 'rejected'].map(status => (
          <Button
            key={status}
            onClick={() => setFilterStatus(status)}
            variant={filterStatus === status ? 'primary' : 'outline'}
            className="capitalize"
          >
            {status}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : reviews.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No reviews to moderate</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reviews.map(review => (
            <Card key={review._id} className="p-4 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{review.title}</h3>
                    <Badge className={getStatusColor(review.status)}>
                      {review.status}
                    </Badge>
                    {review.verified && (
                      <Badge className="bg-blue-100 text-blue-800">
                        ✓ Verified Purchase
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    <strong>{review.userName}</strong> • {review.productName}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-yellow-500">{getRatingStars(review.rating)}</span>
                    <span className="text-sm text-gray-600">({review.rating}/5)</span>
                  </div>

                  <p className="text-gray-700 mb-3">{review.comment}</p>

                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {review.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Review ${idx}`}
                          className="w-16 h-16 rounded border border-gray-200 object-cover"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span>👍 {review.helpful} helpful</span>
                    <span>👎 {review.unhelpful} unhelpful</span>
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => {
                      setSelectedReview(review);
                      setShowDetails(true);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showDetails && selectedReview && (
        <Modal
          isOpen={showDetails}
          onClose={() => {
            setShowDetails(false);
            setRejectionReason('');
          }}
        >
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900">Review Details</h2>

            <Card className="p-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Product</p>
                  <p className="font-semibold text-gray-900">{selectedReview.productName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-semibold text-gray-900">{selectedReview.userName}</p>
                  <p className="text-xs text-gray-600">{selectedReview.userEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-mono text-sm text-gray-900">{selectedReview.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="text-2xl text-yellow-500">
                    {getRatingStars(selectedReview.rating)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gray-50">
              <div>
                <p className="font-bold text-gray-900 mb-2">{selectedReview.title}</p>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedReview.comment}</p>
              </div>
            </Card>

            {selectedReview.images && selectedReview.images.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {selectedReview.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Review ${idx}`}
                    className="w-full rounded border border-gray-200"
                  />
                ))}
              </div>
            )}

            {selectedReview.status === 'pending' && (
              <>
                <Card className="p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason (if applicable)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </Card>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleApprove(selectedReview._id)}
                    disabled={updatingId === selectedReview._id}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {updatingId === selectedReview._id ? 'Approving...' : '✓ Approve'}
                  </Button>
                  <Button
                    onClick={() => handleReject(selectedReview._id)}
                    disabled={updatingId === selectedReview._id}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {updatingId === selectedReview._id ? 'Rejecting...' : '✗ Reject'}
                  </Button>
                </div>
              </>
            )}

            {selectedReview.status === 'rejected' && selectedReview.reason && (
              <Card className="p-4 bg-red-50 border border-red-200">
                <p className="text-sm text-red-800">
                  <strong>Rejection Reason:</strong> {selectedReview.reason}
                </p>
              </Card>
            )}

            <Button
              onClick={() => {
                setShowDetails(false);
                setRejectionReason('');
              }}
              variant="outline"
              className="w-full"
            >
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
