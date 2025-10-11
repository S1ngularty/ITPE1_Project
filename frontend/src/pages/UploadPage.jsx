import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/pages/UploadPage.css";
import {getToken } from "../utils/authUtil"

function UploadPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [mode, setMode] = useState("classify");
  const [loadingSave,setLoadingSave] = useState(false)

  // Dummy history (static for now, later can come from DB)
  const history = [
    { id: 1, name: "screw_01.png" },
    { id: 2, name: "hole_02.jpg" },
    { id: 3, name: "part_03.png" },
  ];

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleAnalyze() {
    if (!selectedFile) {
      alert("Please upload an image first!");
      return;
    }
    setLoading(true);
    setResults(null);

    const formData = new FormData();
    formData.append("image", selectedFile); 
    formData.append("mode", mode); 
    try {
      console.log(mode)
      const res = await axios.post(
        `${import.meta.env.VITE_APP_API}api/v1/${mode}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" ,
            Authorization:`Bearer ${getToken()}`
          },
        }
      );

      const data = res.data;
      console.log(data);

      if (mode === "classify") {
        setResults(data);
      } else if (mode === "count") {
        setResults({
          type: "Screw Count",
          count: `${data.predictions?.length || 0} screws detected`,
        });
      }
    } catch (err) {
      console.error(
        "Error analyzing image:",
        err.response?.data || err.message
      );
      alert("Failed to analyze image. Check backend and Python service.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(){
    console.log(results.result._id)
    axios.post( `${import.meta.env.VITE_APP_API}api/v1/saveActivity`,{screw_id:results.result._id},{
      headers:{
        "Content-Type" : "multipart/form-data",
        Authorization: `Bearer ${getToken()}` 
      }
    }).then(response=>setLoading(true)).catch(error=>console.log(error))
  }

  // Helper function to render screw details from the result data
  const renderScrewDetails = (resultData) => {
    if (!resultData?.success || !resultData.result) {
      return (
        <div className="result-card error">
          <div className="card-icon">❌</div>
          <div className="card-content">
            <h4>No Data Available</h4>
            <p>Could not retrieve screw details from the analysis.</p>
          </div>
        </div>
      );
    }

    const screw = resultData.result;

    return (
      <>
        {/* Screw Name & Category */}
        <div className="result-card primary">
          <div className="card-icon">🏷️</div>
          <div className="card-content">
            <h4>Screw Identification</h4>
            <div className="screw-basic-info">
              <div className="screw-name">{screw.name || "Unknown Screw"}</div>
              <div className="screw-category">{screw.category || "No category"}</div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="result-card secondary">
          <div className="card-icon">📋</div>
          <div className="card-content">
            <h4>Specifications</h4>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">Sizes</span>
                <span className="spec-value">
                  {screw.sizes?.join(", ") || "Not specified"}
                </span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Material </span>
                <span className="spec-value">{screw.material || "Not specified"}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Strength</span>
                <span className="spec-value">{screw.strength || "Not specified"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="result-card tertiary">
          <div className="card-icon">📝</div>
          <div className="card-content">
            <h4>Description</h4>
            <p className="description-text">
              {screw.description || "No description available."}
            </p>
            {screw.usage && (
              <>
                <h5>Usage:</h5>
                <p className="usage-text">{screw.usage}</p>
              </>
            )}
          </div>
        </div>

        {/* Images */}
        {screw.images && screw.images.length > 0 && (
          <div className="result-card tertiary">
            <div className="card-icon">🖼️</div>
            <div className="card-content">
              <h4>Reference Images</h4>
              <div className="images-grid">
                {screw.images.map((image, index) => (
                  <div key={image._id || index} className="image-item">
                    <img src={image.url} alt={`${screw.name} reference ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Additional Technical Details */}
        <div className="result-card tertiary">
          <div className="card-icon">🔧</div>
          <div className="card-content">
            <h4>Technical Details</h4>
            <div className="technical-details">
              <div className="detail-item">
                <span className="detail-label">ID</span>
                <span className="detail-value">{screw._id || "N/A"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Database Version</span>
                <span className="detail-value">{screw.__v || "0"}</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="upload-page">
      {/* Main Content - Horizontal Layout */}
      <main className="upload-main-horizontal">
        
        {/* Left Section - Image Upload */}
        <section className="upload-section">
          <div className="section-card">
            <h2>Upload Image</h2>
            
            {/* Upload area */}
            <label className="upload-box">
              <div className="upload-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <span className="upload-text">Drag & drop your file here</span>
              <span className="upload-subtext">or click to browse files</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                hidden
              />
            </label>

            {/* Preview */}
            {preview && (
              <div className="preview-section">
                <h3>Image Preview</h3>
                <div className="preview-container">
                  <img src={preview} alt="Preview" />
                </div>
              </div>
            )}

            {/* Mode Selection */}
            <div className="mode-selection">
              <h3>Analysis Mode</h3>
              <div className="mode-buttons">
                <button
                  className={`mode-btn ${mode === "classify" ? "active" : ""}`}
                  onClick={() => setMode("classify")}
                >
                  <span className="mode-icon">🔍</span>
                  <span className="mode-text">
                    <strong>Classification</strong>
                    <small>Identify screw types</small>
                  </span>
                </button>
                <button
                  className={`mode-btn ${mode === "count" ? "active" : ""}`}
                  onClick={() => setMode("count")}
                >
                  <span className="mode-icon">🔢</span>
                  <span className="mode-text">
                    <strong>Counting</strong>
                    <small>Count screws</small>
                  </span>
                </button>
              </div>
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading || !selectedFile}
              className="analyze-btn"
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="btn-icon">📊</span>
                  Upload & Analyze
                </>
              )}
            </button>
          </div>
        </section>

        {/* Center Section - Results */}
        <section className="results-section">
          <div className="section-card">
            <div className="section-header">
              <h2>Analysis Results</h2>
              {results && (
                <div className="results-badge">
                  {mode === "classify" ? "classification" : "counting"}
                </div>
              )}
            </div>

            {loading && (
              <div className="loader">
                <div className="spinner"></div>
                <p>Processing your image...</p>
              </div>
            )}

            {results && !loading && (
              <div className="results-content">
                {mode === "classify" ? (
                  renderScrewDetails(results)
                ) : (
                  <div className="result-card primary">
                    <div className="card-icon">🔢</div>
                    <div className="card-content">
                      <h4>Screw Count</h4>
                      <p className="result-count">
                        {results.count || "0 screws detected"}
                      </p>
                      <p className="result-description">
                        Total number of screws identified in the image
                      </p>
                    </div>
                  </div>
                )}
                 <button
                  onClick={handleSave}
                  disabled={loadingSave}
                  className="save-btn"
                >
                  {loadingSave ? "Saving..." : "💾 Save Result"}
                </button>
              </div>
            )}

            {!results && !loading && (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <h3>No Results Yet</h3>
                <p>Upload an image and click "Analyze" to see results here</p>
              </div>
            )}
          </div>
        </section>

        {/* Right Section - Recent Uploads */}
        <section className="sidebar-section">
          <div className="section-card">
            <h2>Recent Uploads</h2>
            <div className="history-list">
              {history.map((item) => (
                <div key={item.id} className="history-item">
                  <span className="file-icon">📄</span>
                  <span className="file-name">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card">
            <h2>Analysis Tips</h2>
            <ul className="tips-list">
              <li>Use clear, well-lit images</li>
              <li>Ensure screws are visible</li>
              <li>Good contrast helps counting</li>
              <li>Supported: JPG, PNG, WebP</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default UploadPage;