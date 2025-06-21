import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface CategoryChartProps {
  categorySales: Array<{
    _id: string;
    totalQuantity: number;
    totalRevenue: number;
  }>;
}

const colors = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#EC4899",
  "#6366F1",
];

export const CategoryChart: React.FC<CategoryChartProps> = ({
  categorySales,
}) => {
  const data = {
    labels: categorySales.map((item) => item._id),
    datasets: [
      {
        data: categorySales.map((item) => item.totalRevenue),
        backgroundColor: colors.slice(0, categorySales.length),
        borderColor: colors
          .slice(0, categorySales.length)
          .map((color) => color.replace("0.8", "1")),
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11,
          },
          boxWidth: 12,
          boxHeight: 12,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function (context: {
            label?: string;
            parsed: number;
            dataset: { data: number[] };
          }) {
            const label = context.label || "";
            const value = context.parsed;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0,
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  const totalRevenue = categorySales.reduce(
    (sum, item) => sum + item.totalRevenue,
    0,
  );
  const totalQuantity = categorySales.reduce(
    (sum, item) => sum + item.totalQuantity,
    0,
  );

  return (
    <Box
      sx={{
        height: 380,
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        Category Sales
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Total Revenue: ${totalRevenue.toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Items: {totalQuantity.toLocaleString()}
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Doughnut data={data} options={options} />
      </Box>
    </Box>
  );
};
