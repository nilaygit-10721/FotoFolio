import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchUserProfile,
  followUser,
  unfollowUser,
  resetUserState,
} from "../store/slices/userSlice";
import PhotoGrid from "../components/ui/PhotoGrid";
import BoardGrid from "../components/ui/BoardGrid";
import { Button, Loader, ErrorMessage, Tabs } from "../components/ui/Button";

const UserProfilePage = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, status, followStatus, error } = useSelector(
    (state) => state.user
  );
  const { user: currentUser, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const [activeTab, setActiveTab] = React.useState("photos");

  useEffect(() => {
    dispatch(fetchUserProfile(username));
    return () => {
      dispatch(resetUserState());
    };
  }, [username, dispatch]);

  const handleFollow = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (profile.isFollowing) {
      dispatch(unfollowUser(profile._id));
    } else {
      dispatch(followUser(profile._id));
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <ErrorMessage message={error} />
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!profile) return null;

  const isCurrentUser = currentUser && currentUser._id === profile._id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img
              src={
                profile.avatar ||
                `https://ui-avatars.com/api/?name=${profile.username}`
              }
              alt={profile.username}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{profile.username}</h1>
              {profile.bio && (
                <p className="text-gray-600 mt-2">{profile.bio}</p>
              )}
            </div>

            {!isCurrentUser && (
              <Button
                onClick={handleFollow}
                loading={followStatus === "loading"}
                variant={profile.isFollowing ? "outline" : "primary"}
                className="w-full md:w-auto"
              >
                {profile.isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </div>

          <div className="flex gap-6 mt-6">
            <div className="text-center">
              <div className="font-bold text-lg">
                {profile.stats?.photosCount || 0}
              </div>
              <div className="text-gray-500">Photos</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">
                {profile.stats?.followersCount || 0}
              </div>
              <div className="text-gray-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">
                {profile.stats?.followingCount || 0}
              </div>
              <div className="text-gray-500">Following</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">
                {profile.stats?.boardsCount || 0}
              </div>
              <div className="text-gray-500">Boards</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: "photos", label: "Photos" },
          { id: "boards", label: "Boards" },
          { id: "likes", label: "Likes" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Content */}
      <div className="mt-8">
        {activeTab === "photos" && (
          <PhotoGrid
            photos={profile.photos || []}
            emptyMessage="No photos yet"
          />
        )}

        {activeTab === "boards" && (
          <BoardGrid
            boards={profile.boards || []}
            emptyMessage="No boards yet"
          />
        )}

        {activeTab === "likes" && (
          <PhotoGrid
            photos={profile.likedPhotos || []}
            emptyMessage="No liked photos yet"
          />
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
