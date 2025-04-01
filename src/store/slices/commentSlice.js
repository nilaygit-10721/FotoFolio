import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const fetchComments = createAsyncThunk(
  "comments/fetch",
  async (photoId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/photos/${photoId}/comments`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addComment = createAsyncThunk(
  "comments/add",
  async ({ photoId, content }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/photos/${photoId}/comments`, {
        content,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
      });
  },
});

export default commentSlice.reducer;
