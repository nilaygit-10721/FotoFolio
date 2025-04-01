import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  fetchUserProfile,
  followUser,
  unfollowUser,
} from "../store/slices/userSlice";
import PhotoCard from "../components/ui/PhotoCard";
import BoardCard from "../components/BoardCard";

const UserProfile = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { profile, status, error } = useSelector((state) => state.user);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("photos");

  useEffect(() => {
    dispatch(fetchUserProfile(username));
  }, [dispatch, username]);

  const handleFollow = () => {
    if (profile.isFollowing) {
      dispatch(unfollowUser(profile._id));
    } else {
      dispatch(followUser(profile._id));
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md">
          <p className="text-sm text-red-700">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const isCurrentUser = currentUser && currentUser._id === profile._id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-6">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                    {profile.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.username}
              </h1>
              {profile.bio && (
                <p className="mt-1 text-gray-600">{profile.bio}</p>
              )}
              <div className="mt-3 flex space-x-5">
                <span className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">
                    {profile.followersCount}
                  </span>{" "}
                  Followers
                </span>
                <span className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">
                    {profile.followingCount}
                  </span>{" "}
                  Following
                </span>
                <span className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">
                    {profile.photosCount}
                  </span>{" "}
                  Photos
                </span>
              </div>
            </div>
            {!isCurrentUser && (
              <div className="flex-shrink-0">
                <button
                  onClick={handleFollow}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    profile.isFollowing
                      ? "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {profile.isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("photos")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "photos"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveTab("boards")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "boards"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Boards
            </button>
            <button
              onClick={() => setActiveTab("likes")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "likes"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Likes
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "photos" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {profile.photos.length > 0 ? (
              profile.photos.map((photo) => (
                <PhotoCard key={photo._id} photo={photo} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">
                  {isCurrentUser
                    ? "You haven't uploaded any photos yet"
                    : "This user hasn't uploaded any photos yet"}
                </p>
                {isCurrentUser && (
                  <Link
                    to="/upload"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Upload Photos
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "boards" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {profile.boards.length > 0 ? (
              profile.boards.map((board) => (
                <BoardCard key={board._id} board={board} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">
                  {isCurrentUser
                    ? "You haven't created any boards yet"
                    : "This user hasn't created any boards yet"}
                </p>
                {isCurrentUser && (
                  <Link
                    to="/create-board"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Create Board
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "likes" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {profile.likedPhotos.length > 0 ? (
              profile.likedPhotos.map((photo) => (
                <PhotoCard key={photo._id} photo={photo} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">
                  {isCurrentUser
                    ? "You haven't liked any photos yet"
                    : "This user hasn't liked any photos yet"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
