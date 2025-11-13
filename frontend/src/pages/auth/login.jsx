import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import notify from "../../components/user/Toast";
import "../../styles/user/pages/auth/login.css";

function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function authenticate() {
    setLoading(true);
    setError("");

    axios
      .post(`${import.meta.env.VITE_APP_API}api/v1/login`, credentials)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }
        notify("success", "Login successfully");
        if(response.data.role ==='admin') return navigate('/admin/dashboard')
        navigate("/home");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Login failed. Please try again.");
        notify("error", "Invalid input, please check your username or password");
      })
      .finally(() => setLoading(false));
  }

  function inputHandler(field, e) {
    setCredentials({ ...credentials, [field]: e.target.value });
    if (error) setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    authenticate();
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Form */}
        <div className="login-form-section">
          <div className="form-header">
            <h1 className="login-title">SCREW<span className="login-title-accent">IT</span></h1>
            <p className="login-subtitle">Screw Classification & Counting System</p>
          </div>

          <div className="form-container">
            <h2 className="form-title">Sign in</h2>
            
            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <label className="input-label">Your Name</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={credentials.email}
                  onChange={(e) => inputHandler("email", e)}
                  className="login-input"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => inputHandler("password", e)}
                  className="login-input"
                  required
                />
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                
                <a href="/recovery-password" className="forgot-password-link">
                  Forgot password?
                </a>
              </div>

              {error && <div className="login-error">{error}</div>}

              <button 
                type="submit" 
                className="login-button" 
                disabled={loading}
              >
                {loading ? (
                  <span className="button-loading">
                    <span className="spinner"></span>
                    SIGNING IN...
                  </span>
                ) : (
                  "LOG IN"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Create Account */}
        <div className="login-side-section">
          <div className="side-content">
            <h2 className="side-title">Create an account</h2>
            <p className="side-description">
              Join our screw classification system to efficiently manage and count your inventory with advanced AI technology.
            </p>
            <a href="/register" className="create-account-button">
              SIGN UP
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;