import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { Link } from 'react-router-dom';
export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    items,
    removeFromCart,
    updateQuantity,
    cartTotal
  } = useCart();

  const getImageUrl = (img: any) => (typeof img === 'string' ? img : img?.url);

  return <AnimatePresence>
      {isCartOpen && <>
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <motion.div initial={{
        x: '100%'
      }} animate={{
        x: 0
      }} exit={{
        x: '100%'
      }} transition={{
        type: 'spring',
        damping: 25,
        stiffness: 200
      }} className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-wood-600" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Your Cart
                </h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsCartOpen(false)} className="h-8 w-8 p-0 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Your cart is empty
                  </p>
                  <Button variant="outline" onClick={() => setIsCartOpen(false)}>
                    Continue Shopping
                  </Button>
                </div> : items.map(item => <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <img src={getImageUrl(item.images[0])} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {formatCurrency(item.price)}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                            -
                          </button>
                          <span className="px-2 text-sm font-medium text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                            +
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-600 p-1">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>)}
            </div>

            {items.length > 0 && <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total
                  </span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(cartTotal)}
                  </span>
                </div>
                <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
                  <Button className="w-full" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Checkout
                  </Button>
                </Link>
              </div>}
          </motion.div>
        </>}
    </AnimatePresence>;
};