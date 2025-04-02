import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (username, { rejectWithValue, getState }) => {
    try {
      const response = await api.get(`/search/users/${username}`);
      const currentUserId = getState().auth.user?._id;

      // Transform API response to match frontend needs
      return {
        ...response.data.data, // Access the nested data property
        isFollowing: response.data.data.followers?.some(
          (follower) =>
            follower._id === currentUserId || follower === currentUserId
        ),
        stats: {
          photosCount: response.data.data.stats?.photosCount || 0,
          boardsCount: response.data.data.stats?.boardsCount || 0,
          followersCount:
            response.data.data.stats?.followersCount ||
            response.data.data.followers?.length ||
            0,
          followingCount:
            response.data.data.stats?.followingCount ||
            response.data.data.following?.length ||
            0,
        },
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "User not found");
    }
  }
);

export const followUser = createAsyncThunk(
  "user/follow",
  async (userId, { rejectWithValue, getState }) => {
    try {
      await api.post(`/users/${userId}/follow`);
      return {
        userId,
        currentUserId: getState().auth.user._id,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to follow user"
      );
    }
  }
);

export const unfollowUser = createAsyncThunk(
  "user/unfollow",
  async (userId, { rejectWithValue, getState }) => {
    try {
      await api.delete(`/users/${userId}/follow`);
      return {
        userId,
        currentUserId: getState().auth.user._id,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to unfollow user"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    status: "idle",
    followStatus: "idle",
    error: null,
  },
  reducers: {
    resetUserState: (state) => {
      state.profile = null;
      state.status = "idle";
      state.followStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Profile fetching
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Follow user
      .addCase(followUser.pending, (state) => {
        state.followStatus = "loading";
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.followStatus = "succeeded";
        if (state.profile) {
          state.profile.isFollowing = true;
          state.profile.followersCount += 1;
          // Add current user to followers array
          if (
            !state.profile.followers.some(
              (f) => f._id === action.payload.currentUserId
            )
          ) {
            state.profile.followers.push(action.payload.currentUserId);
          }
        }
      })
      .addCase(followUser.rejected, (state, action) => {
        state.followStatus = "failed";
        state.error = action.payload;
      })

      // Unfollow user
      .addCase(unfollowUser.pending, (state) => {
        state.followStatus = "loading";
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.followStatus = "succeeded";
        if (state.profile) {
          state.profile.isFollowing = false;
          state.profile.followersCount -= 1;
          // Remove current user from followers array
          state.profile.followers = state.profile.followers.filter(
            (f) => f._id !== action.payload.currentUserId
          );
        }
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.followStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;
