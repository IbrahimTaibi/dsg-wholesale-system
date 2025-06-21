import { useQuery } from "@tanstack/react-query";
import { apiService, Product } from "../config/api";

interface UseProductsOptions {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface ApiProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const { category, search, page, limit } = options;

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<ApiProductsResponse, Error>({
    queryKey: ["products", { category, search, page, limit }],
    queryFn: async () => {
      console.log("Fetching products with options:", options);
      const result = await apiService.getProducts(options);
      console.log("Products API response:", result);
      return result;
    },
  });

  return {
    products: data?.products || [],
    pagination: data?.pagination || null,
    loading,
    error: error ? error.message : null,
    refetch,
  };
};
