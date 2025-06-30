import React from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";

export default function Welcome() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // ✅ Check if logged in

  return (
    <div className="welcome-container">
      <div className="welcome-blur-bg"></div>
      <div className="welcome-card">
        <h1 className="welcome-title">Welcome to <span>DocSpot 🩺</span></h1>
        <p className="welcome-subtitle">
          Your gateway to effortless doctor appointments — smart, fast & secure.
        </p>

        <div className="welcome-buttons">
          <button onClick={() => navigate("/login")} className="btn login-btn">
            Login
          </button>
          <button onClick={() => navigate("/register")} className="btn register-btn">
            Register
          </button>

          {/* ✅ Show only if token exists */}
          {token && (
            <button
              onClick={() => navigate("/my-appointments")}
              className="btn appointments-btn"
            >
              📅 My Appointments
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
