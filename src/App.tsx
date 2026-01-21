import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';
// Public Pages
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { Orders } from './pages/Orders';
import { OrderTracking } from './pages/OrderTracking';
import { Checkout } from './pages/Checkout';
import { Contact } from './pages/Contact';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { WishlistPage } from './pages/WishlistPage';
import { AdvancedSearch } from './pages/AdvancedSearch';
import { About } from './pages/About';
// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProducts } from './pages/AdminProducts';
import { AdminOrders } from './pages/AdminOrders';
import { AdminGallery } from './pages/AdminGallery';
import { AdminAnalytics } from './pages/AdminAnalytics';
import { AdminTestimonials } from './pages/AdminTestimonials';
import { AdminPromotions } from './pages/AdminPromotions';
import { AdminReviewModeration } from './pages/AdminReviewModeration';
import { AdminBulkOperations } from './pages/AdminBulkOperations';
import { AdminSpecials } from './pages/AdminSpecials';
import { AdminSiteSettings } from './pages/AdminSiteSettings';
import { VendorInventory } from './pages/VendorInventory';
import { Gallery } from './pages/Gallery';
import { CustomerPortal } from './pages/CustomerPortal';
// Protected Route Component
const ProtectedRoute = ({
  children,
  role
}: {
  children: React.ReactNode;
  role?: 'admin' | 'customer';
}) => {
  const {
    user,
    isLoading
  } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/portal" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return <>{children}</>;
};
export function App() {
  return <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/portal" element={<CustomerPortal />} />
                
                {/* Protected Customer Routes */}
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/order-tracking/:orderId" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                <Route path="/customer-dashboard" element={<ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>} />
                <Route path="/search" element={<AdvancedSearch />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute role="admin">
                    <AdminLayout />
                  </ProtectedRoute>}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="inventory" element={<VendorInventory />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="promotions" element={<AdminPromotions />} />
                <Route path="reviews" element={<AdminReviewModeration />} />
                <Route path="bulk-operations" element={<AdminBulkOperations />} />
                <Route path="specials" element={<AdminSpecials />} />
                <Route path="site-settings" element={<AdminSiteSettings />} />
                <Route path="*" element={<div>Admin Page Not Found</div>} />
              </Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>;
}