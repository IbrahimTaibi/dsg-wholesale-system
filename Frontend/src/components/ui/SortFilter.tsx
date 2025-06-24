import React, { useState } from "react";
import { SortAsc, ChevronDown, X, SlidersHorizontal } from "lucide-react";

interface SortFilterProps {
  onSortChange: (sort: string) => void;
  onFilterChange: (filters: FilterOptions) => void;
  currentSort?: string;
  currentFilters?: FilterOptions;
}

export interface FilterOptions {
  priceRange?: {
    min?: number;
    max?: number;
  };
  inStock?: boolean;
  category?: string;
}

const sortOptions = [
  { value: "createdAt", label: "Newest First", icon: "🆕" },
  { value: "name", label: "Name A-Z", icon: "📝" },
  { value: "price", label: "Price Low to High", icon: "💰" },
  { value: "price_desc", label: "Price High to Low", icon: "💎" },
  { value: "stock", label: "Stock Level", icon: "📦" },
];

export const SortFilter: React.FC<SortFilterProps> = ({
  onSortChange,
  onFilterChange,
  currentSort = "createdAt",
  currentFilters = {},
}) => {
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [localFilters, setLocalFilters] =
    useState<FilterOptions>(currentFilters);

  const handleSortChange = (sort: string) => {
    onSortChange(sort);
    setShowSortMenu(false);
  };

  const handleFilterApply = () => {
    onFilterChange(localFilters);
    setShowFilterMenu(false);
  };

  const handleFilterReset = () => {
    const resetFilters: FilterOptions = {};
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
    setShowFilterMenu(false);
  };

  const getCurrentSortLabel = () => {
    const option = sortOptions.find((opt) => opt.value === currentSort);
    return option ? option.label : "Sort by";
  };

  const hasActiveFilters = Object.keys(currentFilters).length > 0;

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      {/* Enhanced Sort Button */}
      <div className="relative flex-1">
        <button
          onClick={() => setShowSortMenu(!showSortMenu)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <SortAsc className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sort by
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {getCurrentSortLabel()}
              </p>
            </div>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              showSortMenu ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Enhanced Sort Dropdown */}
        {showSortMenu && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-[9999] overflow-hidden">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  currentSort === option.value
                    ? "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}>
                <span className="text-lg">{option.icon}</span>
                <span className="font-medium">{option.label}</span>
                {currentSort === option.value && (
                  <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Filter Button */}
      <div className="relative flex-1">
        <button
          onClick={() => setShowFilterMenu(!showFilterMenu)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md ${
            hasActiveFilters
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/20">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">Filter</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {hasActiveFilters ? "Active filters" : "All filters"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                showFilterMenu ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {/* Enhanced Filter Dropdown */}
        {showFilterMenu && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-[9999] p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Filters
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={handleFilterReset}
                    className="text-sm text-red-500 hover:text-red-600 transition-colors">
                    Clear all
                  </button>
                )}
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Price Range
                </label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Min"
                      value={localFilters.priceRange?.min || ""}
                      onChange={(e) =>
                        setLocalFilters({
                          ...localFilters,
                          priceRange: {
                            ...localFilters.priceRange,
                            min: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Max"
                      value={localFilters.priceRange?.max || ""}
                      onChange={(e) =>
                        setLocalFilters({
                          ...localFilters,
                          priceRange: {
                            ...localFilters.priceRange,
                            max: parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* In Stock Only */}
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={localFilters.inStock || false}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      inStock: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="inStock"
                  className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  In Stock Only
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleFilterApply}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-200">
                  Apply Filters
                </button>
                <button
                  onClick={handleFilterReset}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 text-sm hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={handleFilterReset}
          className="flex items-center gap-2 px-4 py-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30">
          <X className="h-4 w-4" />
          <span className="text-sm font-medium">Clear</span>
        </button>
      )}
    </div>
  );
};
