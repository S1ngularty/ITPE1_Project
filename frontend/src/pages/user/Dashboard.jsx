import React, { useState, useEffect } from "react";
import "../../styles/user/pages/Dashboard.css";
import Navbar from "../../components/user/layouts/Navbar";
import { getToken } from "../../utils/authUtil";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_APP_API}api/v1/getDashboard`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();

      if (data.success) {
        console.log(data)
        setUserData(transformApiData(data.result));
      } else {
        throw new Error("API returned unsuccessful response");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const transformApiData = (result) => {
    const { activity, requestUsage } = result;
    const allActivities = [...activity.isSave, ...activity.notSave];

    // Sort by createdAt date (most recent first)
    const sortedActivities = allActivities.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Calculate usage stats
    const totalAnalyses = allActivities.length;
    const classifications = allActivities.filter(
      (item) => item.typeOfService === "classification"
    ).length;
    const countServices = allActivities.filter(
      (item) => item.typeOfService === "count"
    ).length;
    const savedResults = activity.isSave.length;

    // Transform recent activity for display
    const recentActivity = sortedActivities.slice(0, 3).map((item) => ({
      id: item._id,
      type: item.saveStatus ? "save" : "upload",
      action: item.saveStatus
        ? `Saved ${item.typeOfService} analysis`
        : `Uploaded image for ${item.typeOfService}`,
      timestamp: getTimeAgo(item.createdAt),
      icon: item.saveStatus ? "💾" : "📤",
    }));

    // Transform recent analyses (saved items with classification)
    const recentAnalyses = activity.isSave
      .filter((item) => item.typeOfService === "classification")
      .slice(0, 3)
      .map((item) => ({
        id: item._id,
        thumbnail: item.uploadedImage.url,
        screwId: item.screw,
        classification: "Classification Result",
        date: item.createdAt.split("T")[0],
        title: `Analysis ${item.name}`,
      }));

    // Transform saved items
    const savedItems = activity.isSave.slice(0, 3).map((item) => ({
      id: item._id,
      name: `${
        item.typeOfService.charAt(0).toUpperCase() + item.typeOfService.slice(1)
      } Analysis`,
      screwType: item.screw ? "Classification" : "Count Detection",
      confidence: "N/A",
      date: item.createdAt.split("T")[0],
      imageUrl: item.uploadedImage.url,
    }));

    // Request usage calculation (assuming limit of 100)
    const requestLimit = 100;
    const percentage = Math.round((requestUsage / requestLimit) * 100);

    return {
      userName: "User",
      usageStats: {
        totalAnalyses,
        screwsDetected: countServices,
        classifications,
        savedResults,
      },
      requestUsage: {
        used: requestUsage,
        limit: requestLimit,
        percentage,
      },
      recentActivity,
      recentAnalyses,
      savedItems,
    };
  };

  const daysRemainingBeforeReset = () => {
    const date = new Date();
    return Math.abs(date.getDate() - 30);
  };
  daysRemainingBeforeReset();

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return past.toLocaleDateString();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard-page">
          <div className="loading-container">
            <p>Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="dashboard-page">
          <div className="error-container">
            <p>Error loading dashboard: {error}</p>
            <button onClick={fetchDashboardData}>Retry</button>
          </div>
        </div>
      </>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-page">
        <div className="dashboard-grid">
          {/* Left Column */}
          <div className="dashboard-column">
            {/* Request Usage */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Request Usage</h2>
                <span className="card-subtitle">Monthly Limit</span>
              </div>
              <div className="usage-container">
                <div className="circular-progress">
                  <div className="progress-ring">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      {/* Background circle */}
                      <circle
                        cx="70"
                        cy="70"
                        r="60"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="70"
                        cy="70"
                        r="60"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="376.99"
                        strokeDashoffset={
                          376.99 * (1 - userData.requestUsage.percentage / 100)
                        }
                        transform="rotate(-90 70 70)"
                      />
                    </svg>
                  </div>
                  <div className="progress-content">
                    <div className="progress-number">
                      {userData.requestUsage.used}
                    </div>
                    <div className="progress-label">Used</div>
                    <div className="progress-limit">
                      of {userData.requestUsage.limit}
                    </div>
                  </div>
                </div>
                <div className="usage-stats">
                  <div className="usage-stat">
                    <span className="usage-label">Remaining</span>
                    <span className="usage-value">
                      {userData.requestUsage.limit - userData.requestUsage.used}
                    </span>
                  </div>
                  <div className="usage-stat">
                    <span className="usage-label">Percentage</span>
                    <span className="usage-value">
                      {userData.requestUsage.percentage}%
                    </span>
                  </div>
                  <div className="usage-stat">
                    <span className="usage-label">Resets in</span>
                    <span className="usage-value">
                      {daysRemainingBeforeReset()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Summary */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Usage Summary</h2>
                <span className="card-subtitle">All Time</span>
              </div>
              <div className="stats-grid">
                <div className="stat-card stat-card-blue">
                  <div className="stat-number">
                    {userData.usageStats.totalAnalyses}
                  </div>
                  <div className="stat-label">Total Analyses</div>
                </div>
                <div className="stat-card stat-card-green">
                  <div className="stat-number">
                    {userData.usageStats.screwsDetected}
                  </div>
                  <div className="stat-label">Count Services</div>
                </div>
                <div className="stat-card stat-card-orange">
                  <div className="stat-number">
                    {userData.usageStats.classifications}
                  </div>
                  <div className="stat-label">Classifications</div>
                </div>
                <div className="stat-card stat-card-purple">
                  <div className="stat-number">
                    {userData.usageStats.savedResults}
                  </div>
                  <div className="stat-label">Saved Results</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="dashboard-column">
            {/* Recent Analyses Preview */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Recent Analyses</h2>
                <button className="view-all-btn">View All →</button>
              </div>
              <div className="analyses-list">
                {userData.recentAnalyses.length > 0 ? (
                  userData.recentAnalyses.map((analysis) => (
                    <div key={analysis.id} className="analysis-card">
                      <div className="analysis-thumbnail">
                        <img
                          src={analysis.thumbnail}
                          alt={analysis.title}
                          style={{
                            width: "80px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      </div>
                      <div className="analysis-content">
                        <h3 className="analysis-title">{analysis.title}</h3>
                        <div className="analysis-meta">
                          <span className="meta-item">
                            🏷️ {analysis.classification}
                          </span>
                          <span className="meta-date">
                            {new Date(analysis.date).toLocaleDateString()}
                          </span>
                        </div>
                        <button className="view-details-btn">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No recent analyses</p>
                )}
              </div>
            </div>

            {/* Saved Items */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Saved Items</h2>
                <button
                  className="view-all-btn"
                  onClick={() => navigate("/save-analyses")}>
                  View All →
                </button>
              </div>
              <div className="saved-items-list">
                {userData.savedItems.length > 0 ? (
                  userData.savedItems.map((item) => (
                    <div key={item.id} className="saved-item">
                      <div className="saved-item-content">
                        <h3 className="saved-item-name">{item.name}</h3>
                        <p className="saved-item-type">{item.screwType}</p>
                        <div className="saved-item-meta">
                          <span className="saved-item-date">
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No saved items</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
