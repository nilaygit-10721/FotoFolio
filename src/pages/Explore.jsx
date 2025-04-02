import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import PhotoCard from "../components/ui/PhotoCard";
import { searchPhotos } from "../store/slices/photoSlice";
import SearchFilters from "../components/explore/SearchFilters";
import EmptyState from "../components/ui/EmptyState";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";

const Explore = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { photos, status, error, hasMore, totalResults } = useSelector(
    (state) => state.photos
  );

  const [searchParams, setSearchParams] = useState({
    query: "cars",
    sortBy: "popular",
    orientation: "all",
    color: "any",
    page: 1,
  });

  // Debounced search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((params) => {
      if (!params.query.trim()) return;
      dispatch(searchPhotos(params));
    }, 500),
    [dispatch]
  );

  useEffect(() => {
    debouncedSearch(searchParams);
    return () => debouncedSearch.cancel();
  }, [searchParams, debouncedSearch]);

  const handleSearchChange = (e) => {
    setSearchParams((prev) => ({
      ...prev,
      query: e.target.value,
      page: 1,
    }));
  };

  const handleFilterChange = (filterName, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [filterName]: value,
      page: 1,
    }));
  };

  const loadMorePhotos = () => {
    if (hasMore) {
      setSearchParams((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  // In Explore.jsx
  const handlePhotoClick = (photo) => {
    // Ensure we have a valid ID before navigating
    const photoId = photo?.unsplashId || photo?._id;
    console.log(photoId);

    if (!photoId) {
      console.error("No valid ID found in photo object:", photo);
      return;
    }

    navigate(`/photos/${photoId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Discover Amazing Photos
          </h1>

          <div className="flex flex-col space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                placeholder="Search for photos..."
                value={searchParams.query}
                onChange={handleSearchChange}
              />
            </div>

            <SearchFilters
              filters={searchParams}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>

        {/* Results Info */}
        {photos.length > 0 && (
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {photos.length} of {totalResults} results
            </p>
            <div className="flex items-center space-x-2">
              <label
                htmlFor="sort-by"
                className="text-sm font-medium text-gray-700"
              >
                Sort by:
              </label>
              <select
                id="sort-by"
                className="block pl-3 pr-8 py-1 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={searchParams.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              >
                <option value="popular">Popular</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        )}

        {/* Content Area */}
        {status === "loading" && searchParams.page === 1 ? (
          <LoadingSkeleton count={12} />
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading photos
                </h3>
                <p className="text-sm text-red-700 mt-1">{error.message}</p>
              </div>
            </div>
          </div>
        ) : photos.length === 0 ? (
          <EmptyState
            title="No photos found"
            description="Try adjusting your search or filters to find what you're looking for."
            icon={
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />
        ) : (
          <InfiniteScroll
            dataLength={photos.length}
            next={loadMorePhotos}
            hasMore={hasMore}
            loader={<LoadingSkeleton count={4} />}
            endMessage={
              <p className="text-center text-gray-500 mt-4">
                You've seen all {totalResults} photos
              </p>
            }
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {photos.map((photo) => (
              <PhotoCard
                key={`${photo.unsplashId || photo._id}-${photo.createdAt}`}
                photo={photo}
                onClick={() => handlePhotoClick(photo)}
              />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default Explore;
