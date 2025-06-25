import React from "react";
import { SearchBar, SortFilter } from "./index";
import { FilterOptions } from "./ui/SortFilter";

interface SearchSortFilterProps {
  onSearchChange: (query: string) => void;
  onSortChange: (sort: string) => void;
  onFilterChange: (filters: FilterOptions) => void;
  currentSort: string;
  currentFilters: FilterOptions;
  filterBadgeTheme: string;
}

export const SearchSortFilter: React.FC<SearchSortFilterProps> = ({
  onSearchChange,
  onSortChange,
  onFilterChange,
  currentSort,
  currentFilters,
  filterBadgeTheme,
}) => {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 mb-8 relative z-20">
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Search Products
          </label>
          <SearchBar onSearch={onSearchChange} />
        </div>

        {/* Sort and Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Sort & Filter
            </label>
            <SortFilter
              onSortChange={onSortChange}
              onFilterChange={onFilterChange}
              currentSort={currentSort}
              currentFilters={currentFilters}
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {(currentFilters.priceRange?.min ||
          currentFilters.priceRange?.max ||
          currentFilters.inStock) && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Active filters:
            </span>
            {currentFilters.priceRange?.min && (
              <span
                className={`px-3 py-1 ${filterBadgeTheme} rounded-full text-sm`}>
                Min: ${currentFilters.priceRange.min}
              </span>
            )}
            {currentFilters.priceRange?.max && (
              <span
                className={`px-3 py-1 ${filterBadgeTheme} rounded-full text-sm`}>
                Max: ${currentFilters.priceRange.max}
              </span>
            )}
            {currentFilters.inStock && (
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                In Stock Only
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
