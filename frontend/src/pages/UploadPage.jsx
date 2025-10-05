import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/pages/UploadPage.css";

function UploadPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [mode, setMode] = useState("classify"); // "classify" | "count"

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
    formData.append("image", selectedFile); // must match backend multer field
    formData.append("mode", mode); // tell backend which function to use

    try {
      console.log(mode)
      const res = await axios.post(
        `${import.meta.env.VITE_APP_API}api/v1/${mode}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
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
                  <>
                    {/* Screw Name Classification */}
                    <div className="result-card primary">
                      <div className="card-icon">🏷️</div>
                      <div className="card-content">
                        <h4>Screw Type</h4>
                        <p className="result-value">
                          {results.classificationData?.predicted_classes?.[0] || "Unknown"}
                        </p>
                        {results.classificationData?.predictions && (
                          <>
                            <div className="confidence-bar">
                              <div className="confidence-fill" style={{
                                width: `${(Object.values(results.classificationData.predictions)[0]?.confidence || 0) * 100}%`
                              }}></div>
                            </div>
                            <p className="confidence-text">
                              Confidence: {((Object.values(results.classificationData.predictions)[0]?.confidence || 0) * 100).toFixed(1)}%
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Screw Head Type */}
                    <div className="result-card secondary">
                      <div className="card-icon">🔩</div>
                      <div className="card-content">
                        <h4>Screw Head Type</h4>
                        <p className="result-value">
                          {results.screw_head_classification?.predicted_classes?.[0] || "Not detected"}
                        </p>
                        {results.screw_head_classification?.predictions && (
                          <>
                            <div className="confidence-bar">
                              <div className="confidence-fill" style={{
                                width: `${(Object.values(results.screw_head_classification.predictions)[0]?.confidence || 0) * 100}%`
                              }}></div>
                            </div>
                            <p className="confidence-text">
                              Confidence: {((Object.values(results.screw_head_classification.predictions)[0]?.confidence || 0) * 100).toFixed(1)}%
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Dimensions */}
                    <div className="result-card tertiary">
                      <div className="card-icon">📐</div>
                      <div className="card-content">
                        <h4>Image Dimensions</h4>
                        <div className="dimensions-grid">
                          <div className="dimension-item">
                            <span className="dimension-label">Width</span>
                            <span className="dimension-value">
                              {results.classificationData?.image?.width || 0}px
                            </span>
                          </div>
                          <div className="dimension-item">
                            <span className="dimension-label">Height</span>
                            <span className="dimension-value">
                              {results.classificationData?.image?.height || 0}px
                            </span>
                          </div>
                          <div className="dimension-item full-width">
                            <span className="dimension-label">Processing Time</span>
                            <span className="dimension-value">
                              {((results.classificationData?.time || 0) + (results.screw_head_classification?.time || 0)).toFixed(2)}s
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* All Predictions */}
                    <div className="result-card tertiary">
                      <div className="card-icon">📊</div>
                      <div className="card-content">
                        <h4>All Predictions</h4>
                        <div className="predictions-list">
                          <div className="prediction-category">
                            <h5>Screw Types:</h5>
                            {results.classificationData?.predictions && Object.entries(results.classificationData.predictions).map(([name, data]) => (
                              <div key={name} className="prediction-item">
                                <span className="prediction-name">{name}</span>
                                <span className="prediction-confidence">
                                  {(data.confidence * 100).toFixed(1)}%
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="prediction-category">
                            <h5>Head Types:</h5>
                            {results.screw_head_classification?.predictions && Object.entries(results.screw_head_classification.predictions).map(([name, data]) => (
                              <div key={name} className="prediction-item">
                                <span className="prediction-name">{name}</span>
                                <span className="prediction-confidence">
                                  {(data.confidence * 100).toFixed(1)}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
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
                  <button className="reanalyze-btn">↻</button>
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