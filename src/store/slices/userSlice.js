import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (username, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${username}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const followUser = createAsyncThunk(
  "user/follow",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/users/${userId}/follow`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const unfollowUser = createAsyncThunk(
  "user/unfollow",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/users/${userId}/follow`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.isFollowing = true;
          state.profile.followersCount += 1;
        }
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.isFollowing = false;
          state.profile.followersCount -= 1;
        }
      });
  },
});

export default userSlice.reducer;
