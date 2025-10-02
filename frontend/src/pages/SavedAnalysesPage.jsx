import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/SaveAnalysesPage.css";

function SavedAnalyses() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);

  useEffect(() => {
    // TODO: Replace with backend fetch call
    // Placeholder saved analyses data
    setAnalyses([
      {
        id: 1,
        image: "screw_01.png",
        date: "2025-09-20",
        result: "3 screws detected, 2 holes",
      },
      {
        id: 2,
        image: "hole_02.jpg",
        date: "2025-09-25",
        result: "1 hole detected, 1 compatible screw",
      },
      {
        id: 3,
        image: "part_03.png",
        date: "2025-09-28",
        result: "5 screws detected, suggestions found",
      },
    ]);
  }, []);

  return (
    <div className="saved-page">
      {/* Main */}
      <main className="saved-main">
        <h1>Your Saved Analyses</h1>

        {analyses.length === 0 ? (
          <p className="empty-msg">No saved analyses yet.</p>
        ) : (
          <div className="saved-grid">
            {analyses.map((item) => (
              <div key={item.id} className="saved-card">
                <img src={`/images/${item.image}`} alt={item.image} />
                <div className="card-body">
                  <h3>{item.image}</h3>
                  <p className="date">Saved on {item.date}</p>
                  <p className="result">{item.result}</p>
                  <button className="view-btn">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default SavedAnalyses;
