import React, { useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPhotoById, resetPhotoState } from "../store/slices/photoSlice";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";

const PhotoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Select photo data from Redux store
  const { currentPhoto } = useSelector((state) => state.photos);
  const { status, error, photo } = currentPhoto;
  const photoData = photo;

  console.log("this data ", photoData);

  // Fetch photo details
  useEffect(() => {
    if (!id) {
      navigate("/explore");
      return;
    }
    dispatch(fetchPhotoById(id));
    return () => dispatch(resetPhotoState());
  }, [id, dispatch, navigate]);

  // Handle download with proper URL from photoData
  const handleDownload = useCallback(() => {
    if (photoData?.downloadUrl) {
      window.open(photoData.downloadUrl, "_blank");
    } else if (photoData?.imageUrl) {
      const link = document.createElement("a");
      link.href = photoData.imageUrl;
      link.download = `photo-${id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [photoData, id]);

  // Render states
  if (status === "loading") return <LoadingPhotoDetail />;
  if (error) return <ErrorPhotoDetail error={error} />;
  if (!photoData) return <NoPhotoFound />;

  return (
    <PhotoDetailView
      photo={photoData}
      onBack={() => navigate(-1)}
      onDownload={handleDownload}
      onTagClick={(tag) => navigate(`/explore?query=${tag}`)}
    />
  );
};

// Sub-components
const LoadingPhotoDetail = () => (
  <div className="max-w-6xl mx-auto px-4 py-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-gray-100 rounded-lg overflow-hidden">
        <LoadingSkeleton className="w-full h-[70vh]" />
      </div>
      <div className="space-y-6">
        <LoadingSkeleton className="h-8 w-3/4" />
        <div className="flex items-center gap-3">
          <LoadingSkeleton className="h-10 w-10 rounded-full" />
          <LoadingSkeleton className="h-4 w-32" />
        </div>
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-2/3" />
        <div className="flex flex-wrap gap-2">
          {[...Array(5)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-6 w-16" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ErrorPhotoDetail = ({ error }) => {
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <ErrorIcon />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading photo
            </h3>
            <p className="text-sm text-red-700 mt-1">{error.message}</p>
            <button
              onClick={() => navigate("/explore")}
              className="mt-2 px-4 py-1 bg-red-100 text-red-800 rounded text-sm"
            >
              Back to Explore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NoPhotoFound = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <WarningIcon />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Photo not found
            </h3>
            <button
              onClick={() => navigate("/explore")}
              className="mt-2 px-4 py-1 bg-yellow-100 text-yellow-800 rounded text-sm"
            >
              Back to Explore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PhotoDetailView = ({ photo, onBack, onDownload, onTagClick }) => (
  <div className="max-w-6xl mx-auto px-4 py-8">
    <BackButton onClick={onBack} />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <PhotoImage
        src={photo.imageUrl}
        alt={photo.description}
        fallbackSrc="/placeholder-image.jpg"
      />

      <div className="space-y-6">
        <PhotographerInfo
          name={photo.photographer}
          avatar={photo.photographerImage || photo.thumbUrl}
          date={photo.createdAt}
        />

        {photo.description && (
          <p className="text-gray-700 whitespace-pre-line">
            {photo.description}
          </p>
        )}

        {photo.tags?.length > 0 && (
          <TagList tags={photo.tags} onTagClick={onTagClick} />
        )}

        <PhotoActions
          likes={photo.likes?.length || 0}
          onDownload={onDownload}
        />
      </div>
    </div>
  </div>
);

// Smaller reusable components
const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 mr-1"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
        clipRule="evenodd"
      />
    </svg>
    Back
  </button>
);

const PhotoImage = ({ src, alt, fallbackSrc }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <img
      src={src}
      alt={alt || "Photo"}
      className="w-full h-auto max-h-[80vh] object-contain"
      onError={(e) => {
        e.target.src = fallbackSrc;
        e.target.className = "w-full h-auto max-h-[80vh] object-cover";
      }}
    />
  </div>
);

const PhotographerInfo = ({ name, avatar, date }) => (
  <div className="flex items-center gap-4">
    <img
      className="h-12 w-12 rounded-full object-cover"
      src={avatar || "/default-avatar.jpg"}
      alt={name}
    />
    <div>
      <p className="font-medium text-gray-900">{name}</p>
      {date && (
        <p className="text-sm text-gray-500">
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}
    </div>
  </div>
);

const TagList = ({ tags, onTagClick }) => (
  <div className="flex flex-wrap gap-2">
    {tags.map((tag) => (
      <button
        key={tag}
        onClick={() => onTagClick(tag)}
        className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-800 transition"
      >
        #{tag}
      </button>
    ))}
  </div>
);

const PhotoActions = ({ likes, onDownload }) => (
  <div className="pt-4 border-t border-gray-200">
    <div className="flex items-center gap-4">
      <button className="flex items-center text-gray-700 hover:text-red-500 transition">
        <LikeIcon />
        {likes} likes
      </button>
      <button
        onClick={onDownload}
        className="flex items-center text-gray-700 hover:text-blue-500 transition"
      >
        <DownloadIcon />
        Download
      </button>
    </div>
  </div>
);

// Icon components
const ErrorIcon = () => (
  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      clipRule="evenodd"
    />
  </svg>
);

const WarningIcon = () => (
  <svg
    className="h-5 w-5 text-yellow-500"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const LikeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-1"
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
);

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

export default PhotoDetail;
