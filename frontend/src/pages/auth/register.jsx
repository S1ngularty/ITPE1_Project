import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/pages/auth/register.css";

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
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Create an Account</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => inputHandler("name", e)}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => inputHandler("email", e)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => inputHandler("password", e)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => inputHandler("confirmPassword", e)}
          required
        />

        {error && <div className="form-error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Sign Up"}
        </button>

        <p className="form-footer">
          Already have an account?{" "}
          <a href="/login" className="form-link">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}

export default Register;
