import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/Home.css";
import Navbar from "../components/layouts/Navbar";

import useHome from "../hooks/useHome";

function Home() {
  const {screws,name,error,search }= useHome()

  const navigate = useNavigate();

  function handleUpload() {
    navigate("../upload-page");
  }

  function handleViewSaved() {
    navigate("../save-analyses");
  }

  return (
    <div className="home-page">
      <Navbar searchKeyword={search} />
      <main className="main-content">
        <div className="welcome-section">
          <h1>Welcome to ScrewIT, {name}!</h1>
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

        {/* Discover more */}
        <div className="recent-section">
          <h3>Discover more screws!</h3>
          <div className="recent-grid">
            {screws ? (
              screws.map((screw) => (
                <div key={screw._id} className="screw-card">
                  <div className="screw-image">
                    {/* Add image if available, otherwise use placeholder */}
                    <img
                      src={screw.images[0].url || "/placeholder-screw.png"}
                      alt={screw.name}
                      onError={(e) => {
                        e.target.src = "/placeholder-screw.png";
                      }}
                    />
                  </div>
                  <div className="screw-info">
                    <h4 className="screw-name">{screw.name}</h4>
                    <p className="screw-category">
                      <strong>Category:</strong> {screw.category}
                    </p>
                    <p className="screw-material">
                      <strong>Material:</strong> {screw.material}
                    </p>
                    <div className="screw-sizes">
                      <strong>Sizes:</strong>
                      <div className="size-tags">
                        {screw.sizes.map((size, index) => (
                          <span key={index} className="size-tag">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                    {screw.price && (
                      <p className="screw-price">
                        <strong>Price:</strong> ${screw.price}
                      </p>
                    )}
                    {screw.description && (
                      <p className="screw-description">
                        {screw.description.length > 100
                          ? `${screw.description.substring(0, 100)}...`
                          : screw.description}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-screws-found">
                <h1>No screws found</h1>
                <p>Try adjusting your search or browse our categories</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
