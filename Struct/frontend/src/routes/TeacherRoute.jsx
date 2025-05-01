import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const TeacherRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || user?.userType !== "teacher") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default TeacherRoute;
