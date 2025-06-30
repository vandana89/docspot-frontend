import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css"; // Make sure this path is correct

export default function Register() {
  const [role, setRole] = useState("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        email,
        password,
        role,
        ...(role === "doctor" && {
          specialization,
          experience,
          location,
        }),
      };

      await axios.post("http://localhost:5000/api/auth/register", payload);
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert("❌ Registration failed! Check details or try again.");
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register for DocSpot 🩺</h2>

        <div className="role-buttons">
          {["patient", "doctor", "admin"].map((r) => (
            <button
              key={r}
              className={`role-button ${role === r ? "active" : ""}`}
              onClick={() => setRole(r)}
              type="button"
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="register-input"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            className="register-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="register-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {role === "doctor" && (
            <>
              <input
                type="text"
                className="register-input"
                placeholder="Specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />

              <input
                type="number"
                className="register-input"
                placeholder="Experience (Years)"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />

              <input
                type="text"
                className="register-input"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </>
          )}

          <button type="submit" className="register-btn">
            Create Account
          </button>
        </form>

        <p className="switch-login">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login here</span>
        </p>
      </div>
    </div>
  );
}
