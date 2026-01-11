import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Image, Settings, LogOut, BoxIcon, BarChart3, MessageSquare, Tag, Star, Database, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
export const AdminLayout = () => {
  const {
    logout
  } = useAuth();
  const location = useLocation();
  const menuItems = [{
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/admin/dashboard'
  }, {
    icon: Settings,
    label: 'Site Settings',
    path: '/admin/site-settings',
    badge: 'Edit Content'
  }, {
    icon: Package,
    label: 'Products',
    path: '/admin/products'
  }, {
    icon: BoxIcon,
    label: 'Inventory',
    path: '/admin/inventory'
  }, {
    icon: Image,
    label: 'Gallery',
    path: '/admin/gallery'
  }, {
    icon: MessageSquare,
    label: 'Testimonials',
    path: '/admin/testimonials'
  }, {
    icon: ShoppingCart,
    label: 'Orders',
    path: '/admin/orders'
  }, {
    icon: BarChart3,
    label: 'Analytics',
    path: '/admin/analytics'
  }, {
    icon: Tag,
    label: 'Promotions',
    path: '/admin/promotions'
  }, {
    icon: Star,
    label: 'Reviews',
    path: '/admin/reviews'
  }, {
    icon: Sparkles,
    label: 'Specials',
    path: '/admin/specials'
  }, {
    icon: Database,
    label: 'Bulk Operations',
    path: '/admin/bulk-operations'
  }];
  return <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed inset-y-0 left-0 z-30 hidden lg:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.jpeg" 
              alt="3D Sawmill Logo" 
              className="w-10 h-10 object-cover rounded-lg shadow-md"
            />
            <div className="flex flex-col">
              <span className="font-bold text-base text-gray-900 dark:text-white leading-tight">
                3D Sawmill
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Admin Panel
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map(item => <Link key={item.path} to={item.path} className={cn('flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors', location.pathname === item.path ? 'bg-wood-50 text-wood-900 dark:bg-wood-900/20 dark:text-wood-300' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50')}>
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>)}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={logout} leftIcon={<LogOut className="h-4 w-4" />}>
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-8">
        <Outlet />
      </main>
    </div>;
};