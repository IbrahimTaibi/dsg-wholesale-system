import React from "react";

const AnimatedDSG: React.FC = () => (
  <svg
    viewBox="0 0 180 80"
    width="100%"
    height="auto"
    style={{ maxWidth: 220, minWidth: 120, display: "block" }}
    xmlns="http://www.w3.org/2000/svg">
    <style>{`
      .dsg-group {
        animation: float 3s ease-in-out infinite;
      }
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      .dsg-letter {
        font-family: 'Segoe UI', Arial, sans-serif;
        font-weight: 900;
        font-size: 64px;
        fill: #fff;
        filter: drop-shadow(0 2px 12px #0005);
        paint-order: stroke fill;
        stroke: #fff;
        stroke-width: 1.5px;
      }
    `}</style>
    <g className="dsg-group">
      {/* D */}
      <text
        x="18"
        y="62"
        className="dsg-letter"
        style={{ letterSpacing: "-8px" }}>
        D
      </text>
      {/* S overlaps/interlocks with D */}
      <text
        x="60"
        y="62"
        className="dsg-letter"
        style={{ letterSpacing: "-10px" }}>
        S
      </text>
      {/* G overlaps/interlocks with S */}
      <text
        x="102"
        y="62"
        className="dsg-letter"
        style={{ letterSpacing: "-8px" }}>
        G
      </text>
    </g>
  </svg>
);

export default AnimatedDSG;
