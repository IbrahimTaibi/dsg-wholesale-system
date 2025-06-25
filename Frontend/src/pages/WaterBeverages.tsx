import React from "react";
import { Droplets } from "lucide-react";
import { ProductPageLayout } from "../components";
import { useTranslation } from "react-i18next";

export const WaterBeverages: React.FC = () => {
  const { t } = useTranslation();

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

  return (
    <ProductPageLayout
      category="Water & Beverages"
      icon={Droplets}
      title={t("waterAndBeverages")}
      subtitle={t("freshAndPure")}
      theme={theme}
      emoji="💧"
      emptyMessage="No beverages available"
      emptySearchMessage="We couldn't find any beverages matching your search. Try adjusting your search or filters."
      loadingMessage="Loading refreshing beverages..."
      loadMoreText="Load More Beverages"
    />
  );
};
