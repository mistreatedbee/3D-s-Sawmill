import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '../features/CartDrawer';
export const PublicLayout = () => {
  return <div className="min-h-screen flex flex-col bg-wood-50 dark:bg-gray-950 transition-colors duration-300">
      <Header />
      <CartDrawer />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>;
};