import React from "react";
import { Link } from "react-router-dom";

const CommentList = ({ comments }) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment._id} className="flex space-x-3">
          <div className="flex-shrink-0">
            <Link to={`/users/${comment.user.username}`}>
              <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                {comment.user.avatar ? (
                  <img
                    src={comment.user.avatar}
                    alt={comment.user.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                    {comment.user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </Link>
          </div>
          <div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <Link
                to={`/users/${comment.user.username}`}
                className="font-medium text-gray-900 hover:text-blue-600"
              >
                {comment.user.username}
              </Link>
              <p className="text-gray-700">{comment.content}</p>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
