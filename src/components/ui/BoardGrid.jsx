import React from "react";
import { Link } from "react-router-dom";
import EmptyState from "./EmptyState";

const BoardGrid = ({ boards, emptyMessage = "No boards to display" }) => {
  if (!boards || boards.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {boards.map((board) => (
        <Link
          to={`/boards/${board._id}`}
          key={board._id}
          className="group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="relative aspect-[4/3] bg-gray-100">
            {board.coverPhoto ? (
              <img
                src={board.coverPhoto.imageUrl || board.coverPhoto.thumbUrl}
                alt={board.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                <div className="text-4xl text-gray-400">
                  {board.title.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
          </div>
          <div className="p-4">
            <h3 className="font-medium text-gray-900 truncate">
              {board.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1 truncate">
              {board.description || "No description"}
            </p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <span>{board.photosCount || 0} photos</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BoardGrid;
