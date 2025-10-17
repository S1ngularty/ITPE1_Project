import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/Home.css";
import Navbar from "../components/layouts/Navbar";
import { getToken } from "../utils/authUtil";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const userName = "Levi Asher"; // TODO: Replace with actual logged-in user data
  const [screws,setScrews] =useState([])
  function handleUpload() {
    navigate("../upload-page");
  }

  function handleViewSaved() {
    navigate("../save-analyses");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  function fetchScrews(){
     axios(`${import.meta.env.VITE_APP_API}api/v1/screw?keyword=`,{
        headers:{
            Authorization: `Bearer ${getToken()}`
        }
        }).then(response=>{
            console.log(response.data)
            setScrews(response.data.result)
        }).catch(error=>{
            console.log(error)
        })
  }

  useEffect(()=>{
        fetchScrews()
  },[])

  // Placeholder recent analyses
  const recentAnalyses = [
    { id: 1, name: "Image_01.png", result: "3 compatible screws found" },
    { id: 2, name: "Image_02.png", result: "No match found" },
    { id: 3, name: "Image_03.png", result: "5 compatible screws found" },
  ];

  return (
    <div className="home-page">
      {/* <Navbar /> */}
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

        {/* Discover more */}
        <div className="recent-section">
          <h3>Discover more screws!</h3>
          <div className="recent-grid">
            {screws.map((screw) => (
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
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
