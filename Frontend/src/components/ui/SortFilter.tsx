import React, { useState } from "react";
import { Filter, SortAsc, ChevronDown, X } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  { value: "createdAt", label: "Newest First" },
  { value: "name", label: "Name A-Z" },
  { value: "price", label: "Price Low to High" },
  { value: "price_desc", label: "Price High to Low" },
  { value: "stock", label: "Stock Level" },
];

export const SortFilter: React.FC<SortFilterProps> = ({
  onSortChange,
  onFilterChange,
  currentSort = "createdAt",
  currentFilters = {},
}) => {
  const { t } = useTranslation();
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
    <div className="flex gap-3 relative">
      {/* Sort Button */}
      <div className="relative">
        <button
          onClick={() => setShowSortMenu(!showSortMenu)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          <SortAsc className="h-4 w-4" />
          <span className="text-sm">{getCurrentSortLabel()}</span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {/* Sort Dropdown */}
        {showSortMenu && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  currentSort === option.value
                    ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                    : ""
                }`}>
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Button */}
      <div className="relative">
        <button
          onClick={() => setShowFilterMenu(!showFilterMenu)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            hasActiveFilters
              ? "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
              : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}>
          <Filter className="h-4 w-4" />
          <span className="text-sm">{t("filter")}</span>
          {hasActiveFilters && (
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          )}
        </button>

        {/* Filter Dropdown */}
        {showFilterMenu && (
          <div className="absolute top-full right-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 p-4">
            <div className="space-y-4">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price Range
                </label>
                <div className="flex gap-2">
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
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
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
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* In Stock Only */}
              <div className="flex items-center">
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
                  className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="inStock"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  In Stock Only
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleFilterApply}
                  className="flex-1 px-3 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors">
                  Apply
                </button>
                <button
                  onClick={handleFilterReset}
                  className="px-3 py-2 text-gray-600 dark:text-gray-400 text-sm hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={handleFilterReset}
          className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
          <X className="h-4 w-4" />
          Clear
        </button>
      )}
    </div>
  );
};
