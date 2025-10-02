import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/Home.css";

function Home() {
  const navigate = useNavigate();
  const userName = "Levi Asher"; // TODO: Replace with actual logged-in user data

  function handleUpload() {
    navigate("../upload-page");
  }

  function handleViewSaved() {
    alert("View saved analyses coming soon!");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  // Placeholder recent analyses
  const recentAnalyses = [
    { id: 1, name: "Image_01.png", result: "3 compatible screws found" },
    { id: 2, name: "Image_02.png", result: "No match found" },
    { id: 3, name: "Image_03.png", result: "5 compatible screws found" },
  ];

  return (
    <div className="home-page">
      <main className="main-content">
        <div className="welcome-section">
          <h1>Welcome to ScrewMatcher, {userName}!</h1>
          <p>
            Upload images to detect screws and holes, and get smart suggestions
            for compatible screws. Manage and review your saved analyses easily.
          </p>
        </div>

        {/* Action Card */}
        <div className="action-card">
          <h2>Get Started</h2>
          <div className="action-buttons">
            <button onClick={handleUpload} className="primary-btn">
              Upload Image
            </button>
            <button onClick={handleViewSaved} className="secondary-btn">
              View Saved Analyses
            </button>
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="recent-section">
          <h3>Recent Analyses</h3>
          <div className="recent-grid">
            {recentAnalyses.map((item) => (
              <div key={item.id} className="recent-card">
                <h4>{item.name}</h4>
                <p>{item.result}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
