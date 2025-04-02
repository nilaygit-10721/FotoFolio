// src/components/ui/Button.jsx
import React from "react";

// Button component
export const Button = ({
  children,
  loading,
  variant = "primary",
  ...props
}) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${
        loading ? "opacity-70" : ""
      }`}
      disabled={loading}
      {...props}
    >
      {loading ? "Processing..." : children}
    </button>
  );
};

// Loader component
export const Loader = ({ size = "md" }) => {
  const sizes = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={`animate-spin rounded-full ${sizes[size]} border-t-2 border-b-2 border-blue-500`}
    ></div>
  );
};

// ErrorMessage component
export const ErrorMessage = ({ message }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md">
    <p className="text-sm text-red-700">{message}</p>
  </div>
);

// Tabs component
export const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
