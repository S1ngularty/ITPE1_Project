import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/user/pages/auth/register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function inputHandler(field, e) {
    setFormData({ ...formData, [field]: e.target.value });
    if (error) setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    axios
      .post(`${import.meta.env.VITE_APP_API}api/v1/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Registration failed. Try again.");
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Left Side - Create Account */}
        <div className="register-side-section">
          <div className="side-content">
            <h2 className="side-title">Welcome Back</h2>
            <p className="side-description">
              Already have an account? Sign in to access your screw classification dashboard and continue managing your inventory.
            </p>
            <a href="/login" className="login-button">
              SIGN IN
            </a>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="register-form-section">
          <div className="form-header">
            <h1 className="register-title">SCREW<span className="register-title-accent">IT</span></h1>
            <p className="register-subtitle">Screw Classification & Counting System</p>
          </div>

          <div className="form-container">
            <h2 className="form-title">Create an account</h2>
            
            <form onSubmit={handleSubmit} className="register-form">
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => inputHandler("name", e)}
                  className="register-input"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => inputHandler("email", e)}
                  className="register-input"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => inputHandler("password", e)}
                  className="register-input"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => inputHandler("confirmPassword", e)}
                  className="register-input"
                  required
                />
              </div>

              {error && <div className="register-error">{error}</div>}

              <button 
                type="submit" 
                className="register-button" 
                disabled={loading}
              >
                {loading ? (
                  <span className="button-loading">
                    <span className="spinner"></span>
                    CREATING ACCOUNT...
                  </span>
                ) : (
                  "SIGN UP"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;