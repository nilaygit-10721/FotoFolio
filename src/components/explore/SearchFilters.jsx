import React from "react";

const SearchFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Orientation Filter */}
      <div>
        <label
          htmlFor="orientation"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Orientation
        </label>
        <select
          id="orientation"
          className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={filters.orientation}
          onChange={(e) => onFilterChange("orientation", e.target.value)}
        >
          <option value="all">All Orientations</option>
          <option value="landscape">Landscape</option>
          <option value="portrait">Portrait</option>
          <option value="square">Square</option>
        </select>
      </div>

      {/* Color Filter */}
      <div>
        <label
          htmlFor="color"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Color
        </label>
        <select
          id="color"
          className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={filters.color}
          onChange={(e) => onFilterChange("color", e.target.value)}
        >
          <option value="any">Any Color</option>
          <option value="black_and_white">Black & White</option>
          <option value="black">Black</option>
          <option value="white">White</option>
          <option value="yellow">Yellow</option>
          <option value="orange">Orange</option>
          <option value="red">Red</option>
          <option value="purple">Purple</option>
          <option value="magenta">Magenta</option>
          <option value="green">Green</option>
          <option value="teal">Teal</option>
          <option value="blue">Blue</option>
        </select>
      </div>

      {/* Extra Filter Placeholder */}
      <div>
        <label
          htmlFor="extra-filter"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Content Type
        </label>
        <select
          id="extra-filter"
          className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={filters.contentType || "all"}
          onChange={(e) => onFilterChange("contentType", e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="photo">Photos Only</option>
          <option value="illustration">Illustrations</option>
          <option value="vector">Vector Art</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilters;
