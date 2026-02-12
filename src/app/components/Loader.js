import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-dark-700 z-50">
      <div className="text-center">
        {/* Spinner using CSS variables for primary color */}
        <div
          className="relative inline-flex items-center justify-center mb-6"
          style={{ width: "80px", height: "80px" }}
        >
          {/* Outer glow ring */}
          <div
            className="absolute inset-0 rounded-full opacity-30"
            style={{
              boxShadow:
                "0 0 20px 10px hsl(var(--accent-hue), var(--accent-saturation), var(--accent-lightness))",
            }}
          ></div>

          {/* Main spinner using CSS variables for primary color */}
          <div
            className="animate-spin rounded-full border-4 border-transparent"
            style={{
              borderTop:
                "4px solid hsl(var(--accent-hue), var(--accent-saturation), var(--accent-lightness))",
              width: "60px",
              height: "60px",
            }}
          ></div>

          {/* Center dot using CSS variables for primary color */}
          <div
            className="absolute rounded-full"
            style={{
              width: "12px",
              height: "12px",
              backgroundColor:
                "hsl(var(--accent-hue), var(--accent-saturation), var(--accent-lightness))",
            }}
          ></div>
        </div>

        <p
          className="text-xl font-medium"
          style={{
            color:
              "hsl(var(--accent-hue), var(--accent-saturation), var(--accent-lightness))",
          }}
        >
          Загрузка данных...
        </p>
      </div>
    </div>
  );
};

export default Loader;
