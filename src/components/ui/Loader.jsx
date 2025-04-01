// src/components/ui/Loader.jsx
import React from "react";
import PropTypes from "prop-types";

const Loader = ({
  size = "md",
  color = "blue",
  fullPage = false,
  className = "",
}) => {
  // Size options
  const sizes = {
    xs: "h-4 w-4 border-2",
    sm: "h-6 w-6 border-2",
    md: "h-8 w-8 border-[3px]",
    lg: "h-12 w-12 border-4",
  };

  // Color options
  const colors = {
    blue: "border-t-blue-500 border-b-blue-500",
    gray: "border-t-gray-500 border-b-gray-500",
    white: "border-t-white border-b-white",
    red: "border-t-red-500 border-b-red-500",
    green: "border-t-green-500 border-b-green-500",
  };

  // Base spinner class
  const spinnerClass = `animate-spin rounded-full border-transparent ${sizes[size]} ${colors[color]} ${className}`;

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
        <div className={spinnerClass}></div>
      </div>
    );
  }

  return <div className={spinnerClass}></div>;
};

Loader.propTypes = {
  size: PropTypes.oneOf(["xs", "sm", "md", "lg"]),
  color: PropTypes.oneOf(["blue", "gray", "white", "red", "green"]),
  fullPage: PropTypes.bool,
  className: PropTypes.string,
};

export default Loader;
