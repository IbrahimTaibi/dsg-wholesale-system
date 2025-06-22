import React, { useState } from "react";
import { Droplets, Loader2 } from "lucide-react";
import { SearchBar, SortFilter } from "../components";
import { ProductItem } from "../components/products/ProductItem";
import { useProducts } from "../hooks";
import { mapApiProductToProduct } from "../types";
import { useTranslation } from "react-i18next";
import { FilterOptions } from "../components/ui/SortFilter";

export const WaterBeverages: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [filters, setFilters] = useState<FilterOptions>({});
  const { t } = useTranslation();

  const {
    products: apiProducts,
    loading,
    error,
  } = useProducts({
    category: "water",
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
    <div className="p-4 sm:p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
            <Droplets className="h-6 w-6 text-gray-700 dark:text-gray-200" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t("waterAndBeverages")}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {t("freshAndPure")} - {filteredProducts.length}{" "}
              {t("productsAvailable")}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md w-full">
              <SearchBar onSearch={setSearchQuery} />
            </div>
            <SortFilter
              onSortChange={setSortBy}
              onFilterChange={setFilters}
              currentSort={sortBy}
              currentFilters={filters}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery
                    ? `No products found for "${searchQuery}"`
                    : "No products available"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
