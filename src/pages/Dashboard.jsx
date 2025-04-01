import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your Fotofolio today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          {[
            { title: "Your Boards", value: 12, link: "/boards" },
            { title: "Liked Photos", value: 47, link: "/likes" },
            {
              title: "Followers",
              value: user?.followers?.length || 0,
              link: "/followers",
            },
          ].map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-medium text-gray-500">
                {stat.title}
              </h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </Link>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <Link
              to="/activity"
              className="text-blue-600 hover:text-blue-500 text-sm"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="border-b border-gray-200 pb-4 last:border-0"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600">U</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      User liked your photo
                    </p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex space-x-4">
          <Link
            to="/upload"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Upload Photo
          </Link>
          <Link
            to="/create-board"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Board
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
