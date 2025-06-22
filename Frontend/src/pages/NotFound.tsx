// src/pages/NotFound.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="p-6 pt-20 min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="text-8xl mb-4">😵</div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          {t("pageNotFound")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {t("pageNotFoundDescription")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            {t("goBack")}
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300">
            <Home className="h-4 w-4" />
            {t("goHome")}
          </button>
        </div>
      </div>
    </div>
  );
};
