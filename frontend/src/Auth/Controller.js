
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignUp } from "./SignUp";
import { Login } from "./Login";
import { useAuth } from "../Auth/AuthContext";
import { Chat } from "../Components/Chat";
import { Dashboard } from "../Components/Dashboard";
import { NavBar } from "../Components/NavBar";

const Controller = () => {
  const { isLoggedIn, authLoading } = useAuth();

  const ProtectedRoute = ({ children }) => {
    if (authLoading) {
      return (
        <div className="loading-container">
          <div className="loading-text">Checking authentication...</div>
        </div>
      );
    }

    return isLoggedIn ? children : <Navigate to="/login" replace />;
  };

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:sessionId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* Root Redirect */}
        <Route
          path="/"
          element={
            authLoading ? (
              <div className="loading-container">
                <div className="loading-text">Loading...</div>
              </div>
            ) : isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export { Controller };
