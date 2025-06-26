import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { alpha } from "@mui/material/styles";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ElementType;
  color: string; // Can be hex or palette string
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
}) => {
  // Helper to get background color (supports hex or palette)
  const getBgColor = (theme: any) => {
    if (color.startsWith("#")) {
      return alpha(color, 0.1);
    }
    // palette string, e.g. "primary.main"
    const [category, shade] = color.split(".");
    const colorValue =
      (theme.palette as unknown as Record<string, Record<string, string>>)[
        category
      ]?.[shade] || color;
    return alpha(colorValue, 0.1);
  };

  return (
    <Paper
      sx={{
        p: 3,
        textAlign: "center",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 3,
        },
      }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 60,
          height: 60,
          borderRadius: "50%",
          bgcolor: (theme) => getBgColor(theme),
          color: color,
          mx: "auto",
          mb: 2,
        }}>
        <Icon size={28} />
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {title}
      </Typography>
      {change && (
        <Typography
          variant="caption"
          sx={{
            color: color,
            fontWeight: 600,
            bgcolor: (theme) => getBgColor(theme),
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
          }}>
          {change}
        </Typography>
      )}
    </Paper>
  );
};
