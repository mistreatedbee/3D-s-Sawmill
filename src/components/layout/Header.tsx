import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, User, Sun, Moon, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { cn } from '../../utils/cn';
export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    theme,
    toggleTheme
  } = useTheme();
  const {
    user,
    logout
  } = useAuth();
  const {
    itemCount,
    setIsCartOpen
  } = useCart();
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navLinks = [{
    name: 'Home',
    path: '/'
  }, {
    name: 'About',
    path: '/about'
  }, {
    name: 'Products',
    path: '/products'
  }, {
    name: 'Gallery',
    path: '/gallery'
  }, {
    name: 'Contact',
    path: '/contact'
  }];
  return <header className={cn('fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b', isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-gray-200 dark:border-gray-800 py-3' : 'bg-transparent border-transparent py-5')}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 z-50">
          <img 
            src="/logo.jpeg" 
            alt="3D Sawmill Logo" 
            className="w-12 h-12 object-cover rounded-lg shadow-lg"
          />
          <span className={cn('font-bold text-xl tracking-tight hidden sm:block', isScrolled ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white')}>
            3D Sawmill
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => <Link key={link.path} to={link.path} className={cn('text-sm font-medium transition-colors hover:text-wood-600 dark:hover:text-wood-400', location.pathname === link.path ? 'text-wood-800 dark:text-wood-400' : 'text-gray-600 dark:text-gray-300')}>
              {link.name}
            </Link>)}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={toggleTheme} className="rounded-full w-10 h-10 p-0">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" size="sm" onClick={() => setIsCartOpen(true)} className="relative rounded-full w-10 h-10 p-0">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && <span className="absolute top-0 right-0 h-4 w-4 bg-wood-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                {itemCount}
              </span>}
          </Button>

          {user ? <div className="hidden md:flex items-center gap-3">
              <Link to="/orders">
                <Button variant="outline" size="sm">
                  Orders
                </Button>
              </Link>
              <Link to={user.role === 'admin' ? '/admin/dashboard' : '/portal'}>
                <Button variant="outline" size="sm">
                  {user.role === 'admin' ? 'Dashboard' : 'Portal'}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div> : <Link to="/portal" className="hidden md:block">
              <Button variant="primary" size="sm">
                Login
              </Button>
            </Link>}

          {/* Mobile Menu Toggle */}
          <Button variant="ghost" size="sm" className="md:hidden z-50" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -20
      }} className="fixed inset-0 z-40 bg-white dark:bg-gray-900 pt-24 px-4 md:hidden">
            <nav className="flex flex-col gap-6 text-center">
              {navLinks.map(link => <Link key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium text-gray-900 dark:text-white">
                  {link.name}
                </Link>)}
              <div className="h-px bg-gray-200 dark:bg-gray-800 my-2" />
              {user ? <>
                  <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-wood-600">
                    Orders
                  </Link>
                  <Link to={user.role === 'admin' ? '/admin/dashboard' : '/portal'} onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-wood-600">
                    {user.role === 'admin' ? 'Admin Dashboard' : 'My Portal'}
                  </Link>
                  <button onClick={() => {
              logout();
              setIsMobileMenuOpen(false);
            }} className="text-xl font-medium text-red-500">
                    Logout
                  </button>
                </> : <Link to="/portal" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-wood-600">
                  Login / Sign Up
                </Link>}
            </nav>
          </motion.div>}
      </AnimatePresence>
    </header>;
};