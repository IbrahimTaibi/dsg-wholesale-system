import { useState, useEffect } from "react";
import { useProducts } from "./useProducts";
import { mapApiProductToProduct, Product } from "../types";
import useDebounce from "./useDebounce";

interface UseSearchSuggestionsOptions {
  query: string;
  limit?: number;
  minQueryLength?: number;
  debounceMs?: number;
}

export const useSearchSuggestions = ({
  query,
  limit = 5,
  minQueryLength = 2,
  debounceMs = 300,
}: UseSearchSuggestionsOptions) => {
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Debounce the search query
  const debouncedQuery = useDebounce(query, debounceMs);

  // Fetch suggestions when debounced query changes
  const {
    products: apiProducts,
    loading,
    error,
  } = useProducts({
    search:
      debouncedQuery && debouncedQuery.length >= minQueryLength
        ? debouncedQuery
        : undefined,
    limit,
    sort: "createdAt",
  });

  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length >= minQueryLength) {
      const mappedProducts = apiProducts.map(mapApiProductToProduct);
      setSuggestions(mappedProducts);
      setIsVisible(true);
    } else {
      setSuggestions([]);
      setIsVisible(false);
    }
  }, [debouncedQuery, apiProducts, minQueryLength]);

  const hideSuggestions = () => {
    setIsVisible(false);
  };

  const showSuggestions = () => {
    if (suggestions.length > 0) {
      setIsVisible(true);
    }
  };

  return {
    suggestions,
    isVisible,
    loading,
    error,
    hideSuggestions,
    showSuggestions,
  };
};
