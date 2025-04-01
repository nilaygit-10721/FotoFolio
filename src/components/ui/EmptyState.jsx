import React from "react";

const EmptyState = ({ title, description, icon, action }) => {
  return (
    <div className="text-center bg-white py-12 px-6 rounded-lg shadow-sm">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-50 text-gray-400">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
