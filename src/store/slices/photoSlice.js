import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const searchPhotos = createAsyncThunk(
  "photos/search",
  async (
    { query, sortBy = "popular", page = 1, perPage = 12 },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get("/photos/search", {
        params: { query, sortBy, page, perPage },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const uploadPhoto = createAsyncThunk(
  "photos/upload",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/photos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchPhotoById = createAsyncThunk(
  "photos/fetchById",
  async (photoId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/photos/${photoId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const likePhoto = createAsyncThunk(
  "photos/like",
  async (photoId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/photos/${photoId}/like`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const unlikePhoto = createAsyncThunk(
  "photos/unlike",
  async (photoId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/photos/${photoId}/like`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  photos: [],
  currentPhoto: {
    photo: null,
    status: "idle",
    error: null,
  },
  status: "idle",
  error: null,
  currentQuery: "",
};

const photoSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {
    resetPhotoState: () => initialState,
    clearPhotoError: (state) => {
      state.error = null;
      state.currentPhoto.error = null;
    },
    resetUploadStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search photos reducers
      .addCase(searchPhotos.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchPhotos.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Check if the response has data property that contains the array
        state.photos = action.payload.data || [];
        state.currentQuery = action.meta.arg.query;
      })
      .addCase(searchPhotos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Upload photo reducers
      .addCase(uploadPhoto.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        state.status = "succeeded";
        // If the upload returns a photo, we can add it to our photos array
        if (action.payload.success && action.payload.data) {
          state.photos = [action.payload.data, ...state.photos];
        }
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch photo by ID reducers
      .addCase(fetchPhotoById.pending, (state) => {
        state.currentPhoto.status = "loading";
        state.currentPhoto.error = null;
      })
      .addCase(fetchPhotoById.fulfilled, (state, action) => {
        state.currentPhoto.status = "succeeded";
        // Store the photo data from the success response
        state.currentPhoto.photo = action.payload.success
          ? action.payload.data
          : null;
        state.currentPhoto.error = null;
      })
      .addCase(fetchPhotoById.rejected, (state, action) => {
        state.currentPhoto.status = "failed";
        state.currentPhoto.error = action.payload;
        state.currentPhoto.photo = null;
      })

      // Like photo reducers
      .addCase(likePhoto.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          const updatedPhoto = action.payload.data;

          // Update currentPhoto if it's the same photo
          if (
            state.currentPhoto.photo &&
            state.currentPhoto.photo._id === updatedPhoto._id
          ) {
            state.currentPhoto.photo = updatedPhoto;
          }

          // Update the photo in the photos array
          const photoIndex = state.photos.findIndex(
            (p) => p._id === updatedPhoto._id
          );
          if (photoIndex !== -1) {
            state.photos[photoIndex] = updatedPhoto;
          }
        }
      })

      // Unlike photo reducers
      .addCase(unlikePhoto.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          const updatedPhoto = action.payload.data;

          // Update currentPhoto if it's the same photo
          if (
            state.currentPhoto.photo &&
            state.currentPhoto.photo._id === updatedPhoto._id
          ) {
            state.currentPhoto.photo = updatedPhoto;
          }

          // Update the photo in the photos array
          const photoIndex = state.photos.findIndex(
            (p) => p._id === updatedPhoto._id
          );
          if (photoIndex !== -1) {
            state.photos[photoIndex] = updatedPhoto;
          }
        }
      });
  },
});

export const { resetPhotoState, clearPhotoError, resetUploadStatus } =
  photoSlice.actions;
export default photoSlice.reducer;
