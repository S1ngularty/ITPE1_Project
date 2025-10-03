import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/pages/UploadPage.css";

function UploadPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

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

    const formData = new FormData();
    formData.append("image", selectedFile); // must match backend multer field

    try {
      const res = await axios.post(`${import.meta.env.VITE_APP_API}api/v1/analyze`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data;

      // Convert backend JSON into cards
    setResults([
  { id: 1, type: "Screw Length", detail: `${data.screw_length_px} px` },
  { id: 2, type: "Screw Width", detail: `${data.screw_width_px} px` },
]);
    } catch (err) {
      console.error("Error analyzing image:", err);
      alert("Failed to analyze image. Check backend and Python service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="upload-page">
      {/* Main Content */}
      <main className="upload-main">
        <div className="upload-section">
          <h1>Upload an Image for Analysis</h1>

          {/* Upload area */}
          <label className="upload-box">
            <span>Drag & drop your file here or click to select</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
          </label>

          {/* Preview */}
          {preview && (
            <div className="preview">
              <h2>Preview:</h2>
              <img src={preview} alt="Preview" />
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="analyze-btn"
          >
            {loading ? "Analyzing..." : "Upload & Analyze"}
          </button>

          {/* Results */}
          {results.length > 0 && (
            <div className="results">
              <h2>Analysis Results</h2>
              <div className="results-grid">
                {results.map((res) => (
                  <div key={res.id} className="result-card">
                    <h3>{res.type}</h3>
                    <p>{res.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="upload-sidebar">
          <h3>Recent Uploads</h3>
          <ul>
            {history.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </aside>
      </main>
    </div>
  );
}

export default UploadPage;
