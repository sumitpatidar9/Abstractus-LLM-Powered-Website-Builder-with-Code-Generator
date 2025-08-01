// src/components/NavBar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

const NavBar = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // Calls logout() from context, which handles API + cleanup
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 32px",
        backgroundColor: "#0d0d0d",
        borderBottom: "1px solid #333",
        color: "#e0e0e0",
        fontFamily: "Inter, sans-serif",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "1.3em" }}>
        <span style={{ color: "#00FFFF" }}>Abstractus</span>
      </div>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        {!isLoggedIn ? (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/signup" style={linkStyle}>Sign Up</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
            <Link to="/chat" style={linkStyle}>Chat</Link>
            <button onClick={handleLogout} style={logoutButtonStyle}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const linkStyle = {
  textDecoration: "none",
  color: "#e0e0e0",
  fontWeight: "600",
  transition: "color 0.3s",
};

const logoutButtonStyle = {
  backgroundColor: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "6px 16px",
  fontWeight: "600",
  cursor: "pointer",
};

export { NavBar };
