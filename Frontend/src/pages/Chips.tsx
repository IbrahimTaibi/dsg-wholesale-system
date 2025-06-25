// src/pages/Chips.tsx
import React from "react";
import { Package } from "lucide-react";
import { ProductPageLayout } from "../components";
import { useTranslation } from "react-i18next";

export const Chips: React.FC = () => {
  const { t } = useTranslation();

  const theme = {
    background:
      "bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
    headerGradient: "bg-gradient-to-r from-red-500 to-orange-500",
    titleGradient: "bg-gradient-to-r from-red-600 to-orange-600",
    filterBadge: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    loadingColor: "text-red-500",
    loadButtonGradient: "bg-gradient-to-r from-red-500 to-orange-500",
    loadButtonHover: "hover:from-red-600 hover:to-orange-600",
  };

  return (
    <ProductPageLayout
      category="Chips"
      icon={Package}
      title={t("chips")}
      subtitle={t("crispySnacks")}
      theme={theme}
      emoji="🥨"
      emptyMessage="No chips available"
      emptySearchMessage="We couldn't find any chips matching your search. Try adjusting your search or filters."
      loadingMessage="Loading crispy chips..."
      loadMoreText="Load More Chips"
    />
  );
};
