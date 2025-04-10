// store/slices/activitySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const getMyActivity = createAsyncThunk(
  "activity/getMyActivity",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/activity/me");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const initialState = {
  myActivity: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMyActivity.pending, (state) => {
        state.myActivity.status = "loading";
      })
      .addCase(getMyActivity.fulfilled, (state, action) => {
        state.myActivity.status = "succeeded";
        state.myActivity.items = action.payload.data;
      })
      .addCase(getMyActivity.rejected, (state, action) => {
        state.myActivity.status = "failed";
        state.myActivity.error = action.payload;
      });
  },
});

export default activitySlice.reducer;
