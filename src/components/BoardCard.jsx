import React from "react";
import { Link } from "react-router-dom";

const BoardCard = ({ board }) => {
  return (
    <Link to={`/boards/${board._id}`} className="group">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 relative">
        {board.coverPhoto ? (
          <img
            src={board.coverPhoto.imageUrl}
            alt={board.title}
            className="h-full w-full object-cover group-hover:opacity-75 transition"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400">
            No cover photo
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
          <div>
            <h3 className="text-white font-medium">{board.title}</h3>
            <p className="text-gray-200 text-sm">
              {board.photos?.length || 0} photos
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BoardCard;
