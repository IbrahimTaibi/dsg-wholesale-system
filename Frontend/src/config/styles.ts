// Component-specific styles and gradients
export const componentStyles = {
  // UserHome Banner Styles
  userHomeBanner: {
    background:
      "linear-gradient(135deg, #ff6b6b 0%, #ff5757 50%, #ff4444 100%)",
    backgroundImage:
      "linear-gradient(135deg, #ff6b6b 0%, #ff5757 50%, #ff4444 100%)",
    WebkitBackgroundImage:
      "linear-gradient(135deg, #ff6b6b 0%, #ff5757 50%, #ff4444 100%)",
    MozBackgroundImage:
      "linear-gradient(135deg, #ff6b6b 0%, #ff5757 50%, #ff4444 100%)",
    msBackgroundImage:
      "linear-gradient(135deg, #ff6b6b 0%, #ff5757 50%, #ff4444 100%)",
    color: "white",
    borderRadius: 3,
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(255, 107, 107, 0.3)",
    textAlign: "center" as const,
    padding: { xs: 3, md: 5 },
    marginBottom: 6,
  },

  // Alternative gradient options
  gradients: {
    primary: "linear-gradient(135deg, #ff6b6b 0%, #ff5757 50%, #ff4444 100%)",
    secondary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    success: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    warning: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    error: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  },

  // Banner text styles
  bannerText: {
    title: {
      fontWeight: 800,
      letterSpacing: 1,
      marginBottom: 1,
    },
    subtitle: {
      opacity: 0.9,
    },
  },
};

// Export individual styles for easy import
export const { userHomeBanner, gradients, bannerText } = componentStyles;
