import React from "react";
import { Droplets } from "lucide-react";
import { ProductPageLayout } from "../components";
import { useTranslation } from "react-i18next";
import { useCategories } from "../hooks";

export const WaterBeverages: React.FC = () => {
  const { t } = useTranslation();
  const { getCategoryByName, loading: categoriesLoading } = useCategories();

  const category = getCategoryByName("Water & Beverages");
  const categoryId = category?._id;

  const theme = {
    background:
      "bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
    headerGradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
    titleGradient: "bg-gradient-to-r from-blue-600 to-cyan-600",
    filterBadge:
      "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    loadingColor: "text-blue-500",
    loadButtonGradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
    loadButtonHover: "hover:from-blue-600 hover:to-cyan-600",
  };

  // Show loading if categories are still loading
  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
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
      category="Water & Beverages"
      icon={Droplets}
      title={t("waterBeverages")}
      subtitle={t("freshPure")}
      theme={theme}
      emoji="💧"
      emptyMessage="No water & beverages available"
      emptySearchMessage="We couldn't find any water & beverages matching your search. Try adjusting your search or filters."
      loadingMessage="Loading refreshing beverages..."
      loadMoreText="Load More Beverages"
    />
  );
};
