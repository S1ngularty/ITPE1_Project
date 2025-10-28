import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/user/pages/UploadPage.css";
import { toast } from "react-toastify";
import { getToken } from "../../utils/authUtil";
import notify from "../../components/user/Toast";
import Navbar from "../../components/user/layouts/Navbar";
import NamingModal from "../../components/user/Modal";

function UploadPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [mode, setMode] = useState("classify");
  const [loadingSave, setLoadingSave] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saveData, setSaveData] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [uploadMethod, setUploadMethod] = useState("file");
  const [cameraError, setCameraError] = useState("");
  const [cameraLoading, setCameraLoading] = useState(false);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);

  const history = [
    { id: 1, name: "screw_01.png" },
    { id: 2, name: "hole_02.jpg" },
    { id: 3, name: "part_03.png" },
  ];

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        stopCamera();
      }
    };
  }, []);

  // Start camera automatically when uploadMethod changes to 'camera'
  useEffect(() => {
    if (uploadMethod === 'camera' && !cameraActive && !cameraLoading) {
      startCamera();
    }
  }, [uploadMethod, cameraActive, cameraLoading]);

  const startCamera = async () => {
    console.log("🎥 [START] Starting camera...");
    
    try {
      setCameraError("");
      setCameraLoading(true);
      
      // Stop any existing stream first
      if (streamRef.current) {
        console.log("⚠️ Stopping existing stream");
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      console.log("📋 Camera constraints:", constraints);
      
      console.log("🔍 Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("✓ Camera access granted! Stream:", stream);
      
      streamRef.current = stream;
      console.log("✓ Stream saved to ref");
      
      // Wait for video element to be available in DOM
      let videoElement = videoRef.current;
      if (!videoElement) {
        console.log("⏳ Waiting for video element to be available...");
        // Wait for React to render the video element
        await new Promise(resolve => setTimeout(resolve, 100));
        videoElement = videoRef.current;
      }
      
      if (!videoElement) {
        throw new Error("Video element not found in DOM");
      }
      
      console.log("✓ Video element found:", videoElement);
      
      videoElement.srcObject = stream;
      console.log("✓ Stream assigned to video element");
      
      // Wait for video to be ready
      await new Promise((resolve, reject) => {
        videoElement.onloadedmetadata = () => {
          console.log("✓ Video metadata loaded");
          console.log("📐 Video dimensions:", {
            width: videoElement.videoWidth,
            height: videoElement.videoHeight
          });
          resolve();
        };
        
        videoElement.onerror = (e) => {
          console.error("❌ Video element error:", e);
          reject(new Error("Video stream error"));
        };
        
        // Timeout fallback
        setTimeout(() => {
          if (videoElement.readyState >= videoElement.HAVE_METADATA) {
            resolve();
          }
        }, 3000);
      });
      
      // Play the video
      await videoElement.play();
      console.log("✓ Video playing successfully!");
      
      setCameraActive(true);
      setCameraLoading(false);
      
      // Reset file selection when switching to camera
      setSelectedFile(null);
      setPreview(null);
      console.log("✓ File selection cleared");
      
      console.log("🎉 Camera started successfully!");
      
    } catch (err) {
      console.error("❌ [ERROR] Camera startup failed:", err);
      console.error("Error name:", err.name);
      console.error("Error message:", err.message);
      
      let errorMessage = "Cannot access camera. ";
      
      if (err.name === 'NotAllowedError') {
        errorMessage += "Please allow camera permissions.";
      } else if (err.name === 'NotFoundError') {
        errorMessage += "No camera found on this device.";
      } else if (err.name === 'NotReadableError') {
        errorMessage += "Camera is already in use by another application.";
      } else {
        errorMessage += "Please check permissions and try again.";
      }
      
      setCameraError(errorMessage);
      notify("error", errorMessage);
      setUploadMethod("file");
      setCameraActive(false);
      setCameraLoading(false);
    }
  };

  const stopCamera = () => {
    console.log("🛑 Stopping camera...");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log(`Stopping track: ${track.kind}`);
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setCameraLoading(false);
    setCameraError("");
  };

  const captureImage = () => {
    console.log("📸 Capturing image...");

    if (!videoRef.current || !canvasRef.current) {
      notify("error", "Camera not ready. Please try again.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Check if video is actually playing and has data
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      notify("error", "Video not ready. Please wait a moment and try again.");
      return;
    }
    
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    console.log("📐 Capture dimensions:", { width: canvas.width, height: canvas.height });

    // Check for valid dimensions
    if (canvas.width === 0 || canvas.height === 0) {
      notify("error", "Invalid video dimensions. Please restart the camera.");
      return;
    }

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    console.log("✓ Image drawn to canvas");

    // Convert canvas to blob and create file
    canvas.toBlob((blob) => {
      if (!blob) {
        notify("error", "Failed to capture image. Please try again.");
        return;
      }
      
      console.log("✓ Blob created, size:", blob.size);
      
      const file = new File([blob], `capture-${Date.now()}.jpg`, { 
        type: 'image/jpeg' 
      });
      
      setSelectedFile(file);
      setPreview(canvas.toDataURL('image/jpeg'));
      
      // Stop camera after capture
      stopCamera();
      setUploadMethod("file");
      
      notify("success", "Image captured successfully!");
    }, 'image/jpeg', 0.95);
  };

  const cancelCamera = () => {
    console.log("❌ Cancelling camera...");
    stopCamera();
    setUploadMethod("file");
  };

  // Rest of your functions remain the same...
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setUploadMethod("file");
      
      // Stop camera if active
      if (cameraActive) {
        stopCamera();
      }
    }
  }

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setUploadMethod("file");
      
      if (cameraActive) {
        stopCamera();
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

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
      console.log(mode);
      const res = await axios.post(
        `${import.meta.env.VITE_APP_API}api/v1/${mode}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = res.data;
      console.log(data);
      setSaveData(data.storeRecent._id.toString());
      if (mode === "classify") {
        setResults(data);
      } else if (mode === "count") {
        setResults({
          type: "Screw Count",
          count: `${data.predictions || 0} screws detected`,
        });
      }
    } catch (err) {
      console.error(
        "Error analyzing image:",
        err.response?.data || err.message
      );
      notify(
        "error",
        "Failed to analyze image. Something went wrong, Please try again later"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(name) {
    console.log(saveData);
    setLoadingSave(true);
    const data = { activityID: saveData, name };
    console.log(data);
    axios
      .post(`${import.meta.env.VITE_APP_API}api/v1/saveActivity`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((response) => {
        setLoadingSave(false);
        setShowModal(false);
        notify("success", "analysis is saved successfully");
      })
      .catch((error) => {
        notify("error", error.message);
        setLoading(false);
        console.log(error.message);
      });
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
              <div className="screw-category">
                {screw.category || "No category"}
              </div>
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
                <span className="spec-value">
                  {screw.material || "Not specified"}
                </span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Strength</span>
                <span className="spec-value">
                  {screw.strength || "Not specified"}
                </span>
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
                    <img
                      src={image.url}
                      alt={`${screw.name} reference ${index + 1}`}
                    />
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
      <Navbar />
      {showModal && (
        <NamingModal
          isOpen={true}
          onClose={() => setShowModal(false)}
          currValue={`Analysis-${Date.now()}`}
          onSubmit={handleSave}
          alreadySaved={false}></NamingModal>
      )}
      
      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {/* Main Content - Horizontal Layout */}
      <main className="upload-main-horizontal">
        {/* Left Section - Image Upload */}
        <section className="upload-section">
          <div className="section-card">
            <h2>Upload Image</h2>

            {/* Upload Method Selection */}
            <div className="upload-method-selection">
              <button
                className={`method-btn ${uploadMethod === 'file' ? 'active' : ''}`}
                onClick={() => {
                  setUploadMethod('file');
                  if (cameraActive) stopCamera();
                }}
              >
                📁 File Upload
              </button>
              <button
                className={`method-btn ${uploadMethod === 'camera' ? 'active' : ''}`}
                onClick={() => setUploadMethod('camera')}
                disabled={cameraLoading}
              >
                {cameraLoading ? "🔄 Starting..." : "📷 Use Camera"}
              </button>
            </div>

            {/* Camera Error Display */}
            {cameraError && (
              <div className="camera-error-message">
                <p>❌ {cameraError}</p>
              </div>
            )}

            {/* File Upload Area */}
            {uploadMethod === 'file' && (
              <label 
                className="upload-box"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="upload-icon">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
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
            )}

            {/* Camera Capture Area - ALWAYS RENDER VIDEO ELEMENT WHEN IN CAMERA MODE */}
            {uploadMethod === 'camera' && (
              <div className="camera-section">
                {/* Always render the video element, but control visibility */}
                <div className="camera-preview" style={{ 
                  display: cameraActive ? 'block' : 'none',
                  position: 'relative'
                }}>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline
                    muted
                    className="camera-video"
                    style={{ 
                      width: '100%', 
                      height: 'auto',
                      backgroundColor: '#000',
                      display: 'block',
                      borderRadius: '8px'
                    }}
                  />
                  <div className="camera-status">
                    Camera active - Point at screws and capture when ready
                  </div>
                </div>

                {/* Show loading or placeholder when camera is not active */}
                {!cameraActive && (
                  <div className="camera-placeholder">
                    {cameraLoading ? (
                      <>
                        <div className="camera-loading">🔄</div>
                        <p>Starting camera...</p>
                      </>
                    ) : (
                      <>
                        <div className="camera-icon">📷</div>
                        <p>Click "Use Camera" to start</p>
                      </>
                    )}
                  </div>
                )}

                {/* Camera controls - only show when camera is active */}
                {cameraActive && (
                  <div className="camera-controls">
                    <button 
                      onClick={captureImage}
                      className="capture-btn"
                    >
                      📸 Capture Image
                    </button>
                    <button 
                      onClick={cancelCamera}
                      className="cancel-btn"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

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
                  onClick={() => setMode("classify")}>
                  <span className="mode-icon">🔍</span>
                  <span className="mode-text">
                    <strong>Classification</strong>
                    <small>Identify screw types</small>
                  </span>
                </button>
                <button
                  className={`mode-btn ${mode === "count" ? "active" : ""}`}
                  onClick={() => setMode("count")}>
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
              className="analyze-btn">
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
                  onClick={() => setShowModal(true)}
                  disabled={loadingSave}
                  className="save-btn">
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