// src/pages/Groceries.tsx
import React from "react";
import { ShoppingBasket } from "lucide-react";
import { ProductPageLayout } from "../components";
import { useTranslation } from "react-i18next";

export const Groceries: React.FC = () => {
  const { t } = useTranslation();

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

  return (
    <ProductPageLayout
      category="Groceries"
      icon={ShoppingBasket}
      title={t("groceries")}
      subtitle={t("freshGroceries")}
      theme={theme}
      emoji="🛒"
      emptyMessage="No groceries available"
      emptySearchMessage="We couldn't find any groceries matching your search. Try adjusting your search or filters."
      loadingMessage="Loading fresh groceries..."
      loadMoreText="Load More Groceries"
    />
  );
};
