import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyAuth } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, status } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(verifyAuth());
    }
  }, [dispatch]);

  if (status === "loading") {
    return <div>Checking authentication...</div>; // Or your custom loader
  }

  return children;
};

export default AuthWrapper;
