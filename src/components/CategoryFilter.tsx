import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelect,
}) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
      {categories.map((category) => (
        <motion.button
          key={category}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(category)}
          className={cn(
            "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap",
            selectedCategory === category
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
              : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
          )}
        >
          {category}
        </motion.button>
      ))}
    </div>
  );
};
