// src/pages/Chips.tsx
import React, { useState } from "react";
import { Package, Loader2 } from "lucide-react";
import { SearchBar, SortFilter } from "../components";
import { ProductItem } from "../components/products/ProductItem";
import { useProducts } from "../hooks";
import { mapApiProductToProduct, Product } from "../types";
import { useTranslation } from "react-i18next";
import { FilterOptions } from "../components/ui/SortFilter";

export const Chips: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [filters, setFilters] = useState<FilterOptions>({});
  const { t } = useTranslation();

  const {
    products: apiProducts,
    loading,
    error,
    pagination,
  } = useProducts({
    category: "Chips",
    search: searchQuery || undefined,
    limit: 20,
    sort: sortBy,
  });

  // Map API products to frontend products
  const products = apiProducts.map(mapApiProductToProduct);

  // Apply client-side filtering for price range and stock
  const filteredProducts = products.filter((product) => {
    if (filters.priceRange?.min && product.price < filters.priceRange.min) {
      return false;
    }
    if (filters.priceRange?.max && product.price > filters.priceRange.max) {
      return false;
    }
    if (filters.inStock && product.stock <= 0) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl shadow-lg">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                {t("chips")}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {t("crispySnacks")} • {filteredProducts.length}{" "}
                {t("productsAvailable")}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 mb-8 relative z-40">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Search Products
              </label>
              <SearchBar onSearch={setSearchQuery} />
            </div>

            {/* Sort and Filter Controls */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Sort & Filter
                </label>
                <SortFilter
                  onSortChange={setSortBy}
                  onFilterChange={setFilters}
                  currentSort={sortBy}
                  currentFilters={filters}
                />
              </div>
            </div>

            {/* Active Filters Display */}
            {(filters.priceRange?.min ||
              filters.priceRange?.max ||
              filters.inStock) && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Active filters:
                </span>
                {filters.priceRange?.min && (
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm">
                    Min: ${filters.priceRange.min}
                  </span>
                )}
                {filters.priceRange?.max && (
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm">
                    Max: ${filters.priceRange.max}
                  </span>
                )}
                {filters.inStock && (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                    In Stock Only
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-red-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                Loading crispy chips...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
            <div className="text-red-600 dark:text-red-400 mb-4">
              <span className="font-semibold text-lg">
                Oops! Something went wrong
              </span>
            </div>
            <p className="text-red-500 dark:text-red-300 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium">
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {filteredProducts.length === 0 ? (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-12 text-center">
                <div className="text-8xl mb-6">🥨</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {searchQuery ? "No chips found" : "No chips available"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  {searchQuery
                    ? `We couldn't find any chips matching "${searchQuery}". Try adjusting your search or filters.`
                    : "Check back soon for crispy snacks!"}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Results Summary */}
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 dark:text-gray-300">
                    Showing{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {filteredProducts.length}
                    </span>{" "}
                    chips
                  </p>
                  {pagination && pagination.pages > 1 && (
                    <p className="text-gray-600 dark:text-gray-300">
                      Page{" "}
                      <span className="font-semibold">{pagination.page}</span>{" "}
                      of{" "}
                      <span className="font-semibold">{pagination.pages}</span>
                    </p>
                  )}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {filteredProducts.map((product: Product) => (
                    <ProductItem key={product.id} product={product} />
                  ))}
                </div>

                {/* Load More Button */}
                {pagination && pagination.pages > 1 && (
                  <div className="text-center pt-8">
                    <button className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      Load More Chips
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
