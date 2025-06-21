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
    queryFn: () => apiService.getProducts(options),
  });

  return {
    products: data?.products || [],
    pagination: data?.pagination || null,
    loading,
    error: error ? error.message : null,
    refetch,
  };
};
