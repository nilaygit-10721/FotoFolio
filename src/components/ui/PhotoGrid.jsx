import React from "react";
import { Link } from "react-router-dom";
import EmptyState from "./EmptyState";

const PhotoGrid = ({ photos, emptyMessage = "No photos to display" }) => {
  if (!photos || photos.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <Link
          to={`/photos/${photo._id}`}
          key={photo._id}
          className="group relative block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="aspect-square bg-gray-100">
            <img
              src={photo.imageUrl || photo.thumbUrl}
              alt={photo.title || "Untitled photo"}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end p-3">
            <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="font-medium truncate">
                {photo.title || "Untitled"}
              </h3>
              {photo.likesCount && (
                <div className="flex items-center mt-1 text-sm">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {photo.likesCount}
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PhotoGrid;
