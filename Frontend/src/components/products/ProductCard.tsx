import React from "react";
import type { ProductCardProps } from "../../types";

export const ProductCard: React.FC<ProductCardProps> = ({
  icon: IconComponent,
  title,
  description,
  gradient,
  count,
}) => {
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-102 cursor-pointer border border-gray-100 dark:border-gray-700">
      <div
        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
        <IconComponent className="text-white" size={24} />
      </div>
      <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1.5">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-xs mb-2.5 line-clamp-2">
        {description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {count} items
        </span>
        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
      </div>
    </div>
  );
};
