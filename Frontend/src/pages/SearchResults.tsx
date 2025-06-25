import React, { useEffect } from "react";
import { Loader2, Search } from "lucide-react";
import ProductDisplayCard from "../components/products/ProductDisplayCard";
import { useProducts } from "../hooks";
import { mapApiProductToProduct, Product } from "../types";
import { useUI } from "../contexts/UIContext";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../hooks";

export const SearchResults: React.FC = () => {
  const { searchQuery, setSearchQuery } = useUI();
  const navigate = useNavigate();

  // Use debounced search query to prevent excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Use the debounced search query from UI context
  const {
    products: apiProducts,
    loading,
    error,
    pagination,
  } = useProducts({
    search: debouncedSearchQuery || undefined,
    limit: 20,
    sort: "createdAt",
  });

  // Map API products to frontend products
  const products = apiProducts.map(mapApiProductToProduct);

  // Clear search when component unmounts
  useEffect(() => {
    return () => {
      // Don't clear search query on unmount to preserve search state
    };
  }, []);

  const handleProductClick = (product: Product) => {
    // Navigate to the appropriate category page for the product
    const categoryRoutes: { [key: string]: string } = {
      "Water & Beverages": "/water",
      Juices: "/juices",
      Cakes: "/cakes",
      Chips: "/chips",
      Groceries: "/groceries",
    };

    const route = categoryRoutes[product.category];
    if (route) {
      navigate(route);
    }
  };

  const theme = {
    background:
      "bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
    loadingColor: "text-blue-500",
  };

  return (
    <div className={`min-h-screen ${theme.background}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
              <Search className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Search Results
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {searchQuery
                  ? `Searching for "${searchQuery}"`
                  : "All products"}{" "}
                • {products.length} products found
              </p>
            </div>
          </div>
        </div>

        {/* Search Query Display */}
        {searchQuery && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  Search query:{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    "{searchQuery}"
                  </span>
                </span>
              </div>
              <button
                onClick={() => setSearchQuery("")}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2
                className={`h-12 w-12 animate-spin ${theme.loadingColor} mx-auto mb-4`}
              />
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                Searching products...
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

        {/* Results */}
        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-12 text-center">
                <div className="text-8xl mb-6">🔍</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {searchQuery ? "No products found" : "No products available"}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  {searchQuery
                    ? `We couldn't find any products matching "${searchQuery}". Try adjusting your search terms or browse our categories.`
                    : "There are currently no products available. Please check back later."}
                </p>
                {searchQuery && (
                  <div className="mt-6">
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
                      Clear Search
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Results Summary */}
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 dark:text-gray-300">
                    Showing{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {products.length}
                    </span>{" "}
                    products
                    {searchQuery && (
                      <>
                        {" "}
                        matching{" "}
                        <span className="font-semibold">"{searchQuery}"</span>
                      </>
                    )}
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
                  {products.map((product: Product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product)}>
                      <ProductDisplayCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {pagination && pagination.pages > 1 && (
                  <div className="text-center pt-8">
                    <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      Load More Results
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
