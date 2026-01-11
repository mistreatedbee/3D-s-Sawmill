import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
interface Tab {
  id: string;
  label: string;
}
interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}
export const Tabs = ({
  tabs,
  activeTab,
  onChange,
  className
}: TabsProps) => {
  return <div className={cn('flex space-x-1 rounded-xl bg-wood-100/50 dark:bg-gray-800/50 p-1', className)}>
      {tabs.map(tab => <button key={tab.id} onClick={() => onChange(tab.id)} className={cn('relative flex-1 rounded-lg px-3 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2', activeTab === tab.id ? 'text-wood-900 dark:text-white' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200')}>
          {activeTab === tab.id && <motion.div layoutId="active-tab" className="absolute inset-0 bg-white dark:bg-gray-700 shadow-sm rounded-lg" transition={{
        type: 'spring',
        bounce: 0.2,
        duration: 0.6
      }} />}
          <span className="relative z-10">{tab.label}</span>
        </button>)}
    </div>;
};