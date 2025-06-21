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
    <div className="group bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-102 cursor-pointer border border-gray-100 dark:border-gray-700 min-h-[140px]">
      <div
        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
        <IconComponent className="text-white" size={20} />
      </div>
      <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-1 line-clamp-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-xs mb-2 line-clamp-2 leading-relaxed">
        {description}
      </p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {count} items
        </span>
        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
      </div>
    </div>
  );
};
