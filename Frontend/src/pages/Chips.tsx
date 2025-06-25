// src/pages/Chips.tsx
import React from "react";
import { Package2 } from "lucide-react";
import { ProductPageLayout } from "../components";
import { useTranslation } from "react-i18next";
import { useCategories } from "../hooks";

export const Chips: React.FC = () => {
  const { t } = useTranslation();
  const { getCategoryByName, loading: categoriesLoading } = useCategories();

  const category = getCategoryByName("Chips");
  const categoryId = category?._id;

  const theme = {
    background:
      "bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
    headerGradient: "bg-gradient-to-r from-yellow-500 to-orange-500",
    titleGradient: "bg-gradient-to-r from-yellow-600 to-orange-600",
    filterBadge:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
    loadingColor: "text-yellow-500",
    loadButtonGradient: "bg-gradient-to-r from-yellow-500 to-orange-500",
    loadButtonHover: "hover:from-yellow-600 hover:to-orange-600",
  };

  // Show loading if categories are still loading
  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
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
      category="Chips"
      icon={Package2}
      title={t("chips")}
      subtitle={t("crunchyChips")}
      theme={theme}
      emoji="🥨"
      emptyMessage="No chips available"
      emptySearchMessage="We couldn't find any chips matching your search. Try adjusting your search or filters."
      loadingMessage="Loading crunchy chips..."
      loadMoreText="Load More Chips"
    />
  );
};
