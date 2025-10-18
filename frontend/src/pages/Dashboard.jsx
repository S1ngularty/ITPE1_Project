import React from "react";
import "../styles/pages/Dashboard.css";
import Navbar from "../components/layouts/Navbar";

const Dashboard = () => {
  // Placeholder data - replace with actual data from backend
  const userData = {
    userName: "John Doe",
    usageStats: {
      totalAnalyses: 24,
      screwsDetected: 156,
      classifications: 89,
      savedResults: 12,
    },
    requestUsage: {
      used: 45,
      limit: 100,
      percentage: 45,
    },
    recentActivity: [
      {
        id: 1,
        type: "upload",
        action: "Uploaded an image for analysis",
        timestamp: "2 hours ago",
        icon: "📤",
      },
      {
        id: 2,
        type: "view",
        action: "Viewed screw classification results",
        timestamp: "1 day ago",
        icon: "👁️",
      },
      {
        id: 3,
        type: "save",
        action: "Saved screw analysis",
        timestamp: "1 day ago",
        icon: "💾",
      },
    ],
    recentAnalyses: [
      {
        id: 1,
        thumbnail: "/api/placeholder/80/60",
        screwCount: 8,
        classification: "Wood Screws",
        date: "2024-01-15",
        title: "Construction Site Analysis",
      },
      {
        id: 2,
        thumbnail: "/api/placeholder/80/60",
        screwCount: 12,
        classification: "Machine Screws",
        date: "2024-01-14",
        title: "Workshop Inventory",
      },
      {
        id: 3,
        thumbnail: "/api/placeholder/80/60",
        screwCount: 5,
        classification: "Drywall Screws",
        date: "2024-01-13",
        title: "Home Repair Project",
      },
    ],
    savedItems: [
      {
        id: 1,
        name: "Wood Screw Analysis",
        screwType: "Phillips Flat Head",
        confidence: "98%",
        date: "2024-01-15",
      },
      {
        id: 2,
        name: "Machine Screw Match",
        screwType: "Hex Head Cap",
        confidence: "95%",
        date: "2024-01-14",
      },
      {
        id: 3,
        name: "Drywall Screw Detection",
        screwType: "Bugle Head",
        confidence: "92%",
        date: "2024-01-12",
      },
    ],
  };

  return (
    <>
    <Navbar/>
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
                    <span className="usage-value">15 days</span>
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
                  <div className="stat-label">Screws Detected</div>
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

            {/* Recent Activity */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Recent Activity</h2>
                <button className="view-all-btn">View All →</button>
              </div>
              <div className="activity-list">
                {userData.recentActivity.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <span className="activity-icon">{activity.icon}</span>
                    <div className="activity-content">
                      <p className="activity-action">{activity.action}</p>
                      <p className="activity-timestamp">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
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
                {userData.recentAnalyses.map((analysis) => (
                  <div key={analysis.id} className="analysis-card">
                    <div className="analysis-thumbnail">
                      <span className="thumbnail-placeholder">📷</span>
                    </div>
                    <div className="analysis-content">
                      <h3 className="analysis-title">{analysis.title}</h3>
                      <div className="analysis-meta">
                        <span className="meta-item">
                          🔩 {analysis.screwCount} screws
                        </span>
                        <span className="meta-item">
                          🏷️ {analysis.classification}
                        </span>
                        <span className="meta-date">
                          {new Date(analysis.date).toLocaleDateString()}
                        </span>
                      </div>
                      <button className="view-details-btn">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Items */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Saved Items</h2>
                <button className="view-all-btn">View All →</button>
              </div>
              <div className="saved-items-list">
                {userData.savedItems.map((item) => (
                  <div key={item.id} className="saved-item">
                    <div className="saved-item-content">
                      <h3 className="saved-item-name">{item.name}</h3>
                      <p className="saved-item-type">{item.screwType}</p>
                      <div className="saved-item-meta">
                        <span className="confidence-badge">
                          {item.confidence} confidence
                        </span>
                        <span className="saved-item-date">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
