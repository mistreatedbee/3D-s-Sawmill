import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
interface TooltipProps {
  content: string;
  children: React.ReactNode;
}
export const Tooltip = ({
  content,
  children
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  return <div className="relative inline-block" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}
      <AnimatePresence>
        {isVisible && <motion.div initial={{
        opacity: 0,
        y: 5
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: 5
      }} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded shadow-lg whitespace-nowrap z-50">
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
          </motion.div>}
      </AnimatePresence>
    </div>;
};