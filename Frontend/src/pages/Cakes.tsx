// src/pages/Cakes.tsx
import React, { useState } from "react";
import { Cookie, Filter, SortAsc, Loader2 } from "lucide-react";
import { SearchBar } from "../components";
import { ProductItem } from "../components/products/ProductItem";
import { useProducts } from "../hooks";
import { mapApiProductToProduct, Product } from "../types";

export const Cakes: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    products: apiProducts,
    loading,
    error,
    pagination,
  } = useProducts({
    category: "mini-cakes",
    search: searchQuery || undefined,
    limit: 20,
  });

  // Map API products to frontend products
  const products = apiProducts.map(mapApiProductToProduct);

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
            <Cookie className="h-6 w-6 text-gray-700 dark:text-gray-200" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Mini Cakes
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Sweet Delights - {pagination?.total || 0} Products Available
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md w-full">
              <SearchBar onSearch={setSearchQuery} />
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Filter className="h-4 w-4" />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <SortAsc className="h-4 w-4" />
                Sort
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-gray-600 dark:text-gray-300">
                Loading products...
              </span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <div className="text-red-600 dark:text-red-400 mb-2">
              <span className="font-medium">Error loading products:</span>{" "}
              {error}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                <div className="text-6xl mb-4">🧁</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  No Products Found
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {searchQuery
                    ? `No mini cakes found matching "${searchQuery}"`
                    : "No mini cakes available at the moment."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 sm:gap-6">
                {products.map((product: Product) => (
                  <ProductItem key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Load More */}
        {!loading && !error && pagination && pagination.pages > 1 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Load More Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
