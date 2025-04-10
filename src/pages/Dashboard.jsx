import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserStats } from "../store/slices/dashboardslice";
import { getMyActivity } from "../store/slices/activitySlice";
import PhotoGrid from "../components/ui/PhotoGrid";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import TimeAgo from "react-timeago";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    stats = {
      boardsCount: 0,
      photosCount: 0,
      followersCount: 0,
    },
    recentPhotos = [],
    loading,
    error,
  } = useSelector((state) => state.dashboard);

  // Get activities from the activity slice
  const { myActivity } = useSelector((state) => state.activity);
  const { items: activities, status: activityStatus } = myActivity;

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserStats(user._id));
      dispatch(getMyActivity()); // Fetch activities
    }
  }, [dispatch, user?._id]);

  if (loading || activityStatus === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md p-4 bg-white rounded-lg shadow">
          <div className="text-red-600">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Activity message generator
  const getActivityMessage = (activity) => {
    switch (activity.type) {
      case "create_board":
        return (
          <>
            You created board{" "}
            <span className="font-semibold">{activity.board?.title}</span>
          </>
        );
      case "like":
        return "You liked a photo";
      case "upload":
        return "You uploaded a photo";
      default:
        return `You performed an action: ${activity.type}`;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.username}
            </h1>
            <p className="mt-2 text-gray-600">
              Here's what's happening with your Fotofolio today
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link
              to="/upload"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Upload Photo
            </Link>
            <Link
              to="/create-board"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Create Board
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "Your Boards",
              value: stats?.boardsCount || 0,
              link: "/boards",
              icon: (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                  />
                </svg>
              ),
            },
            {
              title: "Your Photos",
              value: stats?.photosCount || 0,
              link: "/photos",
              icon: (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              ),
            },
            {
              title: "Followers",
              value: stats?.followersCount || 0,
              link: "/followers",
              icon: (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ),
            },
          ].map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition flex items-start"
            >
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mr-4">
                {stat.icon}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-500">
                  {stat.title}
                </h3>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Photos Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Your Recent Photos
            </h2>
            <Link
              to="/photos"
              className="text-blue-600 hover:text-blue-500 text-sm"
            >
              View all
            </Link>
          </div>
          {recentPhotos?.length > 0 ? (
            <PhotoGrid photos={recentPhotos} />
          ) : (
            <EmptyState
              message="You haven't uploaded any photos yet"
              actionText="Upload First Photo"
              actionLink="/upload"
            />
          )}
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white p-6 rounded-lg shadow mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <Link
              to="/activity"
              className="text-blue-600 hover:text-blue-500 text-sm"
            >
              View all activity
            </Link>
          </div>

          {activities?.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity._id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {activity.type === "create_board" ? (
                        <svg
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm text-gray-800">
                        {getActivityMessage(activity)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        <TimeAgo date={activity.createdAt} />
                      </p>
                      {activity.board && (
                        <Link
                          to={`/boards/${activity.board._id}`}
                          className="mt-2 inline-block text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          View Board
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              message="No recent activity yet"
              actionText="Upload your first photo"
              actionLink="/upload"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
