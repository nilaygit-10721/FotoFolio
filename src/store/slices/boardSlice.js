import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const fetchUserBoards = createAsyncThunk(
  "boards/fetchUserBoards",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/boards/user/${userId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createBoard = createAsyncThunk(
  "boards/create",
  async (boardData, { rejectWithValue }) => {
    try {
      const response = await api.post("/boards", boardData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const fetchBoardById = createAsyncThunk(
  "boards/fetchById",
  async (boardId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/boards/${boardId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateBoard = createAsyncThunk(
  "boards/update",
  async ({ id, ...boardData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/boards/${id}`, boardData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteBoard = createAsyncThunk(
  "boards/delete",
  async (boardId, { rejectWithValue }) => {
    try {
      await api.delete(`/boards/${boardId}`);
      return boardId;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addPhotoToBoard = createAsyncThunk(
  "boards/addPhoto",
  async ({ boardId, photoId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/boards/${boardId}/photos`, { photoId });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const removePhotoFromBoard = createAsyncThunk(
  "boards/removePhoto",
  async ({ boardId, photoId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/boards/${boardId}/photos/${photoId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const boardSlice = createSlice({
  name: "boards",
  initialState: {
    boards: [],
    board: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBoards.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserBoards.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.boards = action.payload;
      })
      .addCase(fetchUserBoards.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createBoard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.boards.push(action.payload);
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchBoardById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBoardById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.board = action.payload;
      })
      .addCase(fetchBoardById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateBoard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.board = action.payload;
        // Also update in boards array if it exists
        if (state.boards) {
          state.boards = state.boards.map((board) =>
            board._id === action.payload._id ? action.payload : board
          );
        }
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Remove from boards array if it exists
        if (state.boards) {
          state.boards = state.boards.filter(
            (board) => board._id !== action.payload
          );
        }
      })
      .addCase(addPhotoToBoard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.board = action.payload;
      })
      .addCase(removePhotoFromBoard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.board = action.payload;
      });
  },
});

export default boardSlice.reducer;
