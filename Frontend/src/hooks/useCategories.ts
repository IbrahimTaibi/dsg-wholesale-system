import { useQuery } from "@tanstack/react-query";
import { apiService, Category } from "../config/api";

export const useCategories = () => {
  const {
    data: categories = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      const result = await apiService.getAllCategories();
      return result;
    },
  });

  // Helper function to get category by name
  const getCategoryByName = (name: string): Category | undefined => {
    return categories.find((cat) => cat.name === name);
  };

  // Helper function to get category by ID
  const getCategoryById = (id: string): Category | undefined => {
    return categories.find((cat) => cat._id === id);
  };

  return {
    categories,
    loading,
    error: error ? error.message : null,
    refetch,
    getCategoryByName,
    getCategoryById,
  };
};
