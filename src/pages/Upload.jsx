import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { uploadPhoto, resetUploadStatus } from "../store/slices/photoSlice";

const Upload = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.photos);
  const { user } = useSelector((state) => state.auth);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [sourceType, setSourceType] = useState("user_upload"); // 'user_upload' or 'unsplash'
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    photographer: "",
    photographerUrl: "",
    unsplashId: "",
    imageUrl: "",
    thumbUrl: "",
  });

  // Reset upload status when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetUploadStatus());
    };
  }, [dispatch]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select an image file (JPEG, PNG, GIF)");
      return;
    }

    // Validate file size (10MB max)
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10MB");
      return;
    }

    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSourceTypeChange = (type) => {
    setSourceType(type);
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (sourceType === "user_upload" && !file) {
      alert("Please select a photo to upload");
      return;
    }

    if (sourceType === "unsplash" && !formData.imageUrl) {
      alert("Please provide an image URL for Unsplash photo");
      return;
    }

    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    const photoData = new FormData();
    photoData.append("sourceType", sourceType);
    photoData.append("title", formData.title);
    photoData.append("description", formData.description);
    photoData.append("tags", JSON.stringify(tagsArray));

    if (sourceType === "user_upload") {
      photoData.append("image", file);
    } else {
      // For Unsplash photos
      photoData.append("imageUrl", formData.imageUrl);
      photoData.append("thumbUrl", formData.thumbUrl || formData.imageUrl);
      photoData.append("photographer", formData.photographer);
      photoData.append("photographerUrl", formData.photographerUrl);
      photoData.append(
        "unsplashId",
        formData.unsplashId || Date.now().toString()
      );
    }

    dispatch(uploadPhoto(photoData)).then((action) => {
      if (action.type.endsWith("fulfilled")) {
        navigate("/dashboard");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {sourceType === "user_upload"
              ? "Upload Photo"
              : "Add Unsplash Photo"}
          </h1>

          {/* Source Type Toggle */}
          <div className="flex mb-6">
            <button
              type="button"
              onClick={() => handleSourceTypeChange("user_upload")}
              className={`flex-1 py-2 px-4 border ${
                sourceType === "user_upload"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              Upload Your Photo
            </button>
            <button
              type="button"
              onClick={() => handleSourceTypeChange("unsplash")}
              className={`flex-1 py-2 px-4 border ${
                sourceType === "unsplash"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              Add From Unsplash
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
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
                  <p className="text-sm text-red-700">
                    {typeof error === "string"
                      ? error
                      : error.message || "An error occurred"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {sourceType === "user_upload" ? (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="mx-auto h-48 w-full object-cover rounded-md"
                      />
                    ) : (
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>
                          {preview ? "Change photo" : "Upload a photo"}
                        </span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleFileChange}
                          required={sourceType === "user_upload"}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                <div>
                  <label
                    htmlFor="imageUrl"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    id="imageUrl"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    required
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label
                    htmlFor="thumbUrl"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Thumbnail URL (optional)
                  </label>
                  <input
                    type="url"
                    name="thumbUrl"
                    id="thumbUrl"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.thumbUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/thumb.jpg"
                  />
                </div>
                <div>
                  <label
                    htmlFor="photographer"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Photographer Name
                  </label>
                  <input
                    type="text"
                    name="photographer"
                    id="photographer"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.photographer}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="photographerUrl"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Photographer Profile URL
                  </label>
                  <input
                    type="url"
                    name="photographerUrl"
                    id="photographerUrl"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.photographerUrl}
                    onChange={handleChange}
                    required
                    placeholder="https://unsplash.com/@username"
                  />
                </div>
                <div>
                  <label
                    htmlFor="unsplashId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Unsplash ID (optional)
                  </label>
                  <input
                    type="text"
                    name="unsplashId"
                    id="unsplashId"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.unsplashId}
                    onChange={handleChange}
                    placeholder="Leave blank to auto-generate"
                  />
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  id="tags"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="nature, landscape, sunset"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  status === "loading" ||
                  (sourceType === "user_upload" && !file) ||
                  (sourceType === "unsplash" && !formData.imageUrl)
                }
                className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                  status === "loading"
                    ? "bg-blue-400"
                    : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {status === "loading" ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </>
                ) : sourceType === "user_upload" ? (
                  "Upload Photo"
                ) : (
                  "Add Photo"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
