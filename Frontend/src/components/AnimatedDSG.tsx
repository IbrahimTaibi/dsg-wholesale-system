import React from "react";

// DSG Logo Component - Static SVG for clean display - Deployment trigger
const AnimatedDSG: React.FC = () => (
  <svg
    viewBox="0 0 180 80"
    width="100%"
    height="auto"
    style={{ maxWidth: 220, minWidth: 120, display: "block" }}
    xmlns="http://www.w3.org/2000/svg">
    <text
      x="10"
      y="60"
      fontFamily="'Segoe UI', Arial, sans-serif"
      fontWeight="bold"
      fontSize="64"
      fill="#fff"
      letterSpacing="8">
      DSG
    </text>
  </svg>
);

export default AnimatedDSG;
