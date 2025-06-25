// src/pages/Juices.tsx
import React from "react";
import { GlassWater } from "lucide-react";
import { ProductPageLayout } from "../components";
import { useTranslation } from "react-i18next";

export const Juices: React.FC = () => {
  const { t } = useTranslation();

  const theme = {
    background:
      "bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
    headerGradient: "bg-gradient-to-r from-orange-500 to-yellow-500",
    titleGradient: "bg-gradient-to-r from-orange-600 to-yellow-600",
    filterBadge:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
    loadingColor: "text-orange-500",
    loadButtonGradient: "bg-gradient-to-r from-orange-500 to-yellow-500",
    loadButtonHover: "hover:from-orange-600 hover:to-yellow-600",
  };

  return (
    <ProductPageLayout
      category="Juices"
      icon={GlassWater}
      title={t("premiumJuices")}
      subtitle={t("natural100")}
      theme={theme}
      emoji="🧃"
      emptyMessage="No juices available"
      emptySearchMessage="We couldn't find any juices matching your search. Try adjusting your search or filters."
      loadingMessage="Loading refreshing juices..."
      loadMoreText="Load More Juices"
    />
  );
};
