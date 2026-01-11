import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Trash2, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAdminTestimonials } from '../hooks/useAdminAPI';
import { getLocalStorage } from '../utils/helpers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const { verifyTestimonial, deleteTestimonial, loading } = useAdminTestimonials();

  const getToken = () => getLocalStorage<string | null>('auth_token', null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/testimonials`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch testimonials');
      const data = await response.json();
      setTestimonials(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch testimonials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (testimonialId: string) => {
    try {
      const updated = await verifyTestimonial(testimonialId);
      setTestimonials(testimonials.map(t => t._id === testimonialId ? updated : t));
      setSuccessMessage('Testimonial verified');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify testimonial');
    }
  };

  const handleDelete = async (testimonialId: string) => {
    if (!confirm('Delete this testimonial?')) return;

    try {
      await deleteTestimonial(testimonialId);
      setTestimonials(testimonials.filter(t => t._id !== testimonialId));
      setSuccessMessage('Testimonial deleted');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete testimonial');
    }
  };

  const filteredTestimonials = testimonials.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'verified') return t.verified;
    if (filter === 'pending') return !t.verified;
    return true;
  });

  if (isLoading) return <div className="p-8">Loading testimonials...</div>;

  const verifiedCount = testimonials.filter(t => t.verified).length;
  const pendingCount = testimonials.filter(t => !t.verified).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Testimonials Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Total: {testimonials.length} | Verified: {verifiedCount} | Pending: {pendingCount}
        </p>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {successMessage}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All ({testimonials.length})
        </Button>
        <Button
          variant={filter === 'verified' ? 'default' : 'outline'}
          onClick={() => setFilter('verified')}
        >
          Verified ({verifiedCount})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
        >
          Pending ({pendingCount})
        </Button>
      </div>

      {/* Testimonials List */}
      {filteredTestimonials.length === 0 ? (
        <Card className="p-12 text-center text-gray-600 dark:text-gray-400">
          <p>No testimonials found.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTestimonials.map(testimonial => (
            <Card key={testimonial._id} className="p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      {testimonial.customerName}
                    </h3>
                    {testimonial.verified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs font-medium rounded">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs font-medium rounded">
                        <AlertCircle className="h-3 w-3" />
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {testimonial.review}
                  </p>

                  {/* Meta Info */}
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <div>
                      <span className="font-medium">Email:</span> {testimonial.customerEmail}
                    </div>
                    <div>
                      <span className="font-medium">Submitted:</span> {new Date(testimonial.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4 flex-shrink-0">
                  {!testimonial.verified && (
                    <Button
                      size="sm"
                      onClick={() => handleVerify(testimonial._id)}
                      disabled={loading}
                      className="gap-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Verify
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(testimonial._id)}
                    disabled={loading}
                    className="gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
