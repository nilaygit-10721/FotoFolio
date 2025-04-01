import React from "react";

const CommentForm = ({ value, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="mb-6">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-gray-200"></div>
        </div>
        <div className="flex-1">
          <textarea
            rows={3}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Add a comment..."
            value={value}
            onChange={onChange}
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={!value.trim()}
              className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                !value.trim() ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              Post Comment
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
