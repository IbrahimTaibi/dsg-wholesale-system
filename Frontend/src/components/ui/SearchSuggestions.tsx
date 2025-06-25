import React from "react";
import { Product } from "../../types";
import { useNavigate } from "react-router-dom";

interface SearchSuggestionsProps {
  suggestions: Product[];
  visible: boolean;
  onSelectSuggestion: (product: Product) => void;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  visible,
  onSelectSuggestion,
}) => {
  const navigate = useNavigate();

  if (!visible || suggestions.length === 0) {
    return null;
  }

  const handleProductClick = (product: Product) => {
    onSelectSuggestion(product);

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

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
      <div className="p-2">
        {suggestions.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product)}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group">
            {/* Product Image */}
            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-600">
              {product.photo ? (
                <img
                  src={product.photo}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {product.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="flex-shrink-0 text-right">
              <div className="font-bold text-lg text-gray-900 dark:text-white">
                ${product.price.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show more results link */}
      {suggestions.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-3">
          <button
            onClick={() => navigate("/search-results")}
            className="w-full text-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
            View all {suggestions.length}+ results
          </button>
        </div>
      )}
    </div>
  );
};
