import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import NotFound from "./pages/NotFound";
import Boards from "./pages/Boards";
import CreateBoard from "./pages/CreateBoard";
import Upload from "./pages/Upload";
import UserProfile from "./pages/UserProfile";
import PhotoDetail from "./pages/PhotoDetail";
import AuthWrapper from "./components/AuthWrapper";
import { verifyAuth } from "./store/slices/authSlice";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(verifyAuth());
  }, [dispatch]);
  return (
    <AuthWrapper>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="explore" element={<Explore />} />
          // Add these routes
          <Route path="users/:username" element={<UserProfile />} />
          <Route path="photos/:id" element={<PhotoDetail />} />
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="upload" element={<Upload />} />
            // Add these routes inside the ProtectedRoute component
            <Route path="boards" element={<Boards />} />
            {/* <Route path="boards/:id" element={<BoardDetails />} /> */}
            <Route path="create-board" element={<CreateBoard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthWrapper>
  );
}

export default App;
