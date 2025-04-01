import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import photoReducer from "./slices/photoSlice";
import boardReducer from "./slices/boardSlice";
import userReducer from "./slices/userSlice";
import commentReducer from "./slices/commentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    photos: photoReducer,
    boards: boardReducer,
    user: userReducer,
    comments: commentReducer,
  },
});
