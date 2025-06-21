import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { alpha } from "@mui/material/styles";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ElementType;
  color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
}) => {
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
          bgcolor: (theme) => {
            const [category, shade] = color.split(".");
            const colorValue = (
              theme.palette as unknown as Record<string, Record<string, string>>
            )[category][shade];
            return alpha(colorValue, 0.1);
          },
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
            bgcolor: (theme) => {
              const [category, shade] = color.split(".");
              const colorValue = (
                theme.palette as unknown as Record<
                  string,
                  Record<string, string>
                >
              )[category][shade];
              return alpha(colorValue, 0.1);
            },
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
