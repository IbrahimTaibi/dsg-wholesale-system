// src/pages/Groceries.tsx
import React from "react";
import { ShoppingCart } from "lucide-react";
import { ProductPageLayout } from "../components";
import { useTranslation } from "react-i18next";
import { useCategories } from "../hooks";

export const Groceries: React.FC = () => {
  const { t } = useTranslation();
  const { getCategoryByName, loading: categoriesLoading } = useCategories();

  const category = getCategoryByName("Groceries");
  const categoryId = category?._id;

  const theme = {
    background:
      "bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
    headerGradient: "bg-gradient-to-r from-purple-500 to-indigo-500",
    titleGradient: "bg-gradient-to-r from-purple-600 to-indigo-600",
    filterBadge:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
    loadingColor: "text-purple-500",
    loadButtonGradient: "bg-gradient-to-r from-purple-500 to-indigo-500",
    loadButtonHover: "hover:from-purple-600 hover:to-indigo-600",
  };

  // Show loading if categories are still loading
  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading categories...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProductPageLayout
      categoryId={categoryId}
      category="Groceries"
      icon={ShoppingCart}
      title={t("groceries")}
      subtitle={t("dailyEssentials")}
      theme={theme}
      emoji="🛒"
      emptyMessage="No groceries available"
      emptySearchMessage="We couldn't find any groceries matching your search. Try adjusting your search or filters."
      loadingMessage="Loading daily essentials..."
      loadMoreText="Load More Groceries"
    />
  );
};
