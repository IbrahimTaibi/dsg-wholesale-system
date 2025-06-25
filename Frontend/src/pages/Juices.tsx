// src/pages/Juices.tsx
import React from "react";
import { Package2 } from "lucide-react";
import { ProductPageLayout } from "../components";
import { useTranslation } from "react-i18next";
import { useCategories } from "../hooks";

export const Juices: React.FC = () => {
  const { t } = useTranslation();
  const { getCategoryByName, loading: categoriesLoading } = useCategories();

  const category = getCategoryByName("Juices");
  const categoryId = category?._id;

  const theme = {
    background:
      "bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
    headerGradient: "bg-gradient-to-r from-green-500 to-emerald-500",
    titleGradient: "bg-gradient-to-r from-green-600 to-emerald-600",
    filterBadge:
      "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    loadingColor: "text-green-500",
    loadButtonGradient: "bg-gradient-to-r from-green-500 to-emerald-500",
    loadButtonHover: "hover:from-green-600 hover:to-emerald-600",
  };

  // Show loading if categories are still loading
  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
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
      category="Juices"
      icon={Package2}
      title={t("juices")}
      subtitle={t("premiumJuices")}
      theme={theme}
      emoji="🍊"
      emptyMessage="No juices available"
      emptySearchMessage="We couldn't find any juices matching your search. Try adjusting your search or filters."
      loadingMessage="Loading premium juices..."
      loadMoreText="Load More Juices"
    />
  );
};
