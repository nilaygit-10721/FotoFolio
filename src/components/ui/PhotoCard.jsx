import React from "react";
import { Link } from "react-router-dom";

const PhotoCard = ({ photo }) => {
  return (
    <div className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
      <Link to={`/photos/${photo.unsplashId}`}>
        <img
          src={photo.imageUrl || "https://via.placeholder.com/300"}
          alt={photo.title || "Untitled photo"}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
          <div>
            <h3 className="text-white font-medium truncate">
              {photo.title || "Untitled"}
            </h3>
            <p className="text-gray-200 text-sm">
              by {photo.photographer || "Unknown"}
            </p>
          </div>
        </div>
      </Link>
      <div className="absolute top-2 right-2">
        <button className="p-2 bg-white/80 rounded-full hover:bg-white transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PhotoCard;
