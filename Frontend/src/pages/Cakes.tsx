// src/pages/Cakes.tsx
import React from "react";
import { Cake } from "lucide-react";
import { ProductPageLayout } from "../components";
import { useTranslation } from "react-i18next";
import { useCategories } from "../hooks";

export const Cakes: React.FC = () => {
  const { t } = useTranslation();
  const { getCategoryByName, loading: categoriesLoading } = useCategories();

  const category = getCategoryByName("Mini Cakes");
  const categoryId = category?._id;

  const theme = {
    background:
      "bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
    headerGradient: "bg-gradient-to-r from-pink-500 to-purple-500",
    titleGradient: "bg-gradient-to-r from-pink-600 to-purple-600",
    filterBadge:
      "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300",
    loadingColor: "text-pink-500",
    loadButtonGradient: "bg-gradient-to-r from-pink-500 to-purple-500",
    loadButtonHover: "hover:from-pink-600 hover:to-purple-600",
  };

  // Show loading if categories are still loading
  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
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
      category="Mini Cakes"
      icon={Cake}
      title={t("cakes")}
      subtitle={t("deliciousCakes")}
      theme={theme}
      emoji="🎂"
      emptyMessage="No cakes available"
      emptySearchMessage="We couldn't find any cakes matching your search. Try adjusting your search or filters."
      loadingMessage="Loading delicious cakes..."
      loadMoreText="Load More Cakes"
    />
  );
};
