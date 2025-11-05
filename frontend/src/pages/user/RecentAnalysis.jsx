import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/user/pages/recentAnalysis.css";
import { getToken } from "../../utils/authUtil";
import axios from "axios";
import Navbar from "../../components/user/layouts/Navbar";
import notify from "../../components/user/Toast";
import ConfirmationModal from "../../components/user/ConfirmationModal";

function RecentAnalyses() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveModal, setSaveModal] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [saveName, setSaveName] = useState("");

  useEffect(() => {
    fetchRecentAnalyses();
  }, []);

  const fetchRecentAnalyses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API}api/v1/getRecentAnalysis?limit=0`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setAnalyses(response.data.result);
    } catch (error) {
      console.log(error);
      notify("error", "Failed to load recent analyses");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getServiceType = (type) => {
    switch (type) {
      case "classification":
        return "Classification";
      case "count":
        return "Counting";
      default:
        return type;
    }
  };

  const getServiceIcon = (type) => {
    switch (type) {
      case "classification":
        return "🔍";
      case "count":
        return "🔢";
      default:
        return "📊";
    }
  };

  const getServiceColor = (type) => {
    switch (type) {
      case "classification":
        return "#3b82f6";
      case "count":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  // Save Analysis
  const handleSave = (analysis) => {
    setCurrentAnalysis(analysis);
    setSaveName(analysis.name || "");
    setSaveModal(true);
  };

  const confirmSave = async () => {
    if (!currentAnalysis) return;
    
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_API}api/v1/save-analysis`,
        {
          analysisId: currentAnalysis._id,
          name: saveName
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      notify("success", "Analysis saved successfully");
      setSaveModal(false);
      setCurrentAnalysis(null);
      setSaveName("");
      fetchRecentAnalyses(); // Refresh to update save status
    } catch (error) {
      console.log(error);
      notify("error", error.response?.data?.message || "Failed to save analysis");
    }
  };

  // Download PDF
  const downloadPDF = async (analysis) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API}api/v1/download-analysis/${analysis._id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          responseType: 'blob'
        }
      );
      
      // Create blob link and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analysis-${analysis._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      notify("success", "PDF downloaded successfully");
    } catch (error) {
      console.log(error);
      notify("error", "Failed to download PDF");
    }
  };


  if (loading) {
    return (
      <div className="recent-analyses-page">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your analyses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-analyses-page">
      {/* Save Confirmation Modal */}
      {saveModal && (
        <ConfirmationModal
          mode="save"
          show={true}
          onClose={() => {
            setSaveModal(false);
            setCurrentAnalysis(null);
            setSaveName("");
          }}
          onConfirm={confirmSave}
          customContent={
            <div className="save-modal-content">
              <h3>Save Analysis</h3>
              <p>Enter a name for this analysis:</p>
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Analysis name"
                className="save-name-input"
                autoFocus
              />
            </div>
          }
        />
      )}

      <Navbar />
      
      <main className="recent-main">
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">Recent Analyses</h1>
            <p className="page-subtitle">
              Review your recent screw analyses and manage results
            </p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{analyses.length}</span>
              <span className="stat-label">Total Analyses</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {analyses.filter(a => a.saveStatus).length}
              </span>
              <span className="stat-label">Saved</span>
            </div>
          </div>
        </div>

        {analyses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,19H5V5H19V19M17,17H7V7H17V17M15,15H9V9H15V15M11,11H13V13H11V11Z"/>
              </svg>
            </div>
            <h3>No Recent Analyses</h3>
            <p>Start by uploading images to analyze screws</p>
            <button 
              onClick={() => navigate("../upload-page")}
              className="cta-button"
            >
              Upload Image to Analyze
            </button>
          </div>
        ) : (
          <div className="analyses-grid">
            {analyses.map((analysis) => (
              <div key={analysis._id} className="analysis-card">
                <div className="card-header">
                  <div className="image-container">
                    <img
                      src={analysis.uploadedImage.url}
                      alt="Analysis preview"
                      className="analysis-image"
                    />
                    <div 
                      className="service-indicator"
                      style={{ backgroundColor: getServiceColor(analysis.typeOfService) }}
                    >
                      {getServiceIcon(analysis.typeOfService)}
                    </div>
                    {analysis.saveStatus && (
                      <div className="saved-badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                        </svg>
                        Saved
                      </div>
                    )}
                  </div>
                  
                  <div className="card-content">
                    <h3 className="analysis-name">{analysis.name}</h3>
                    
                    <div className="analysis-meta">
                      <div className="meta-item">
                        <span className="meta-label">Service Type</span>
                        <span className="meta-value">
                          {getServiceType(analysis.typeOfService)}
                        </span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Analyzed</span>
                        <span className="meta-value">{formatDate(analysis.createdAt)}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Status</span>
                        <span className={`status-badge ${analysis.saveStatus ? 'saved' : 'unsaved'}`}>
                          {analysis.saveStatus ? 'Saved' : 'Not Saved'}
                        </span>
                      </div>
                    </div>

                    {analysis.screw && analysis.typeOfService === "classification" && (
                      <div className="screw-details">
                        <h4>Identified Screw</h4>
                        <div className="screw-info">
                          <span className="screw-name">{analysis.screw.name}</span>
                          <span className="screw-category">{analysis.screw.category}</span>
                        </div>
                      </div>
                    )}

                    {analysis.typeOfService === "count" && (
                      <div className="counting-results">
                        <h4>Counting Results</h4>
                        <div className="count-info">
                          <span className="count-label">Screws Detected:</span>
                          <span className="count-value">Processing...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    className={`action-btn save-btn ${analysis.saveStatus ? 'saved' : ''}`}
                    onClick={() => handleSave(analysis)}
                    disabled={analysis.saveStatus}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3M19,19H5V5H16.17L19,7.83V19M12,19A2,2 0 0,0 14,17A2,2 0 0,0 12,15A2,2 0 0,0 10,17A2,2 0 0,0 12,19M6,7H15V13H6V7Z"/>
                    </svg>
                    {analysis.saveStatus ? 'Saved' : 'Save'}
                  </button>

                  <button
                    className="action-btn download-btn"
                    onClick={() => downloadPDF(analysis)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"/>
                    </svg>
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default RecentAnalyses;