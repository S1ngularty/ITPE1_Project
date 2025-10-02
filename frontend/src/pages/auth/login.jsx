import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
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
        navigate("/home");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Login failed. Please try again.");
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
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>ScrewSort</h1>
        <p style={styles.subtitle}>Sign in to your account</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email address"
            value={credentials.email}
            onChange={(e) => inputHandler("email", e)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => inputHandler("password", e)}
            style={styles.input}
            required
          />

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={styles.linkText}>
          Don’t have an account? <a href="/register" style={styles.link}>Sign up</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6", // light gray background
    padding: "1rem",
  },
  container: {
    width: "100%",
    maxWidth: "380px",
    padding: "2rem",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)", // soft shadow
    textAlign: "center",
  },
  title: {
    margin: "0 0 0.25rem",
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    margin: "0 0 1.5rem",
    fontSize: "0.95rem",
    color: "#6b7280",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "border 0.2s",
  },
  button: {
    padding: "0.75rem",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  error: {
    color: "#dc2626",
    fontSize: "14px",
    textAlign: "center",
  },
  linkText: {
    marginTop: "1rem",
    fontSize: "14px",
    color: "#374151",
  },
  link: {
    color: "#2563eb",
    fontWeight: "500",
    textDecoration: "none",
  },
};

// Simple hover effects (inline injection)
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    input:focus {
      border-color: #2563eb !important;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
    }
    button:hover:not(:disabled) {
      background: #1e40af;
    }
    a:hover {
      text-decoration: underline;
    }
  `;
  document.head.appendChild(style);
}

export default Login;
