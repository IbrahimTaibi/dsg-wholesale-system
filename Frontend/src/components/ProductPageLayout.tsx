import React, { useState } from "react";
import { Loader2, LucideIcon } from "lucide-react";
import { SearchSortFilter } from "./index";
import { ProductItem } from "./products/ProductItem";
import { useProducts } from "../hooks";
import { mapApiProductToProduct, Product } from "../types";
import { useTranslation } from "react-i18next";
import { FilterOptions } from "./ui/SortFilter";

interface ProductPageLayoutProps {
  category: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  theme: {
    background: string;
    headerGradient: string;
    titleGradient: string;
    filterBadge: string;
    loadingColor: string;
    loadButtonGradient: string;
    loadButtonHover: string;
  };
  emoji: string;
  emptyMessage: string;
  emptySearchMessage: string;
  loadingMessage: string;
  loadMoreText: string;
}

export const ProductPageLayout: React.FC<ProductPageLayoutProps> = ({
  category,
  icon: Icon,
  title,
  subtitle,
  theme,
  emoji,
  emptyMessage,
  emptySearchMessage,
  loadingMessage,
  loadMoreText,
}) => {
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
    category,
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
    <div className={`min-h-screen ${theme.background}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`p-4 ${theme.headerGradient} rounded-2xl shadow-lg`}>
              <Icon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1
                className={`text-3xl sm:text-4xl font-bold ${theme.titleGradient} bg-clip-text text-transparent`}>
                {title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {subtitle} • {filteredProducts.length} {t("productsAvailable")}
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters Section */}
        <SearchSortFilter
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          onFilterChange={setFilters}
          currentSort={sortBy}
          currentFilters={filters}
          filterBadgeTheme={theme.filterBadge}
          searchValue={searchQuery}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2
                className={`h-12 w-12 animate-spin ${theme.loadingColor} mx-auto mb-4`}
              />
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                {loadingMessage}
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
                <div className="text-8xl mb-6">{emoji}</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {searchQuery
                    ? `No ${category.toLowerCase()} found`
                    : emptyMessage}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  {searchQuery ? emptySearchMessage : emptyMessage}
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
                    {category.toLowerCase()}
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
                    <button
                      className={`px-8 py-4 ${theme.loadButtonGradient} text-white rounded-xl ${theme.loadButtonHover} transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}>
                      {loadMoreText}
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
