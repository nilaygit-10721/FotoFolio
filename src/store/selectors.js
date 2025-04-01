// src/store/selectors.js
import { createSelector } from "@reduxjs/toolkit";

export const selectCurrentPhoto = createSelector(
  (state) => state.photos.currentPhoto,
  (currentPhoto) => ({
    photo: currentPhoto?.photo || null,
    status: currentPhoto?.status || "idle",
    error: currentPhoto?.error || null,
  })
);
