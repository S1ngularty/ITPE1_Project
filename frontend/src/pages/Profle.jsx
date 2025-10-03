import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/Profile.css";

import axios from "axios";
import { getToken } from "../utils/authUtil";

function Profile() {
  const navigate = useNavigate();

  // Placeholder user data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function fetchProfile() {
    axios
      .get(`${import.meta.env.VITE_APP_API}api/v1/user`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setFormData(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchProfile();
  }, []);
  //    useEffect(() => {
  //     console.log(formData)
  //   }, [formData]);

  const [message, setMessage] = useState("");

  function inputHandler(field, e) {
    setFormData({ ...formData, [field]: e.target.value });
    setMessage("");
  }

  function handleSaveProfile(e) {
    e.preventDefault();
    axios
      .post(
        `${import.meta.env.VITE_APP_API}api/v1/user`,
        {
          name: formData.name,
          email: formData.email,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => fetchProfile())
      .catch((error) => console.log(error.message));
  }

  function handleSavePassword(e) {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    setMessage("Password updated successfully (placeholder).");
  }

  return (
    <div className="profile-page">
      {/* Main */}
      <main className="profile-main">
        {/* Profile Info Section */}
        <section className="profile-section">
          <h2>Profile Information</h2>
          <p className="section-desc">
            Update your name and email address here. These changes will be used
            across your ScrewMatcher account.
          </p>
          <form onSubmit={handleSaveProfile} className="section-form">
            <label>
              Name
              <input
                type="text"
                value={formData.name}
                onChange={(e) => inputHandler("name", e)}
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={formData.email}
                onChange={(e) => inputHandler("email", e)}
              />
            </label>

            <button type="submit" className="save-btn">
              Save Profile
            </button>
          </form>
        </section>

        {/* Password Section */}
        <section className="profile-section">
          <h2>Password</h2>
          <p className="section-desc">
            Change your password below. Enter a new password and confirm it to
            update.
          </p>
          <form onSubmit={handleSavePassword} className="section-form">
            <label>
              New Password
              <input
                type="password"
                onChange={(e) => inputHandler("password", e)}
                placeholder="Enter new password"
              />
            </label>

            <label>
              Confirm Password
              <input
                type="password"
                onChange={(e) => inputHandler("confirmPassword", e)}
                placeholder="Re-enter new password"
              />
            </label>

            <button type="submit" className="save-btn">
              Update Password
            </button>
          </form>
        </section>

        {message && <div className="profile-message">{message}</div>}
      </main>
    </div>
  );
}

export default Profile;
