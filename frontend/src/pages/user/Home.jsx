import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/user/pages/Home.css";
import Navbar from "../../components/user/layouts/Navbar";
import ModalPreview from "../../components/user/PreviewModal";
import useHome from "../../hooks/user/useHome";

function Home() {
  const {
    screws,
    name,
    error,
    search,
    selectedScrew,
    setSelectedScrew,
    cbFilter,
  } = useHome();
  const navigate = useNavigate();

  function handleUpload() {
    navigate("../upload-page");
  }

  function handleViewSaved() {
    navigate("../save-analyses");
  }

  console.log(screws)
  return (
    <div className="home-page">
      <Navbar searchKeyword={search} applyResult={cbFilter} />
      {selectedScrew && (
        <ModalPreview
          id={selectedScrew}
          isOpen={true}
          onClose={() => setSelectedScrew("")}
        />
      )}

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Welcome to <span className="brand-accent">ScrewIT</span>, {name}
                !
              </h1>
              <p className="hero-subtitle">
                Advanced screw classification and counting system. Upload images
                to automatically identify, classify, and count screws with
                precision and ease.
              </p>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{screws?.length || 0}</span>
                <span className="stat-label">Screw Types</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">Trained Model</span>
                <span className="stat-label">Object Classification</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="actions-section">
          <div className="container">
            <h2 className="section-title">Quick Actions</h2>
            <div className="action-cards">
              <div className="action-card primary-action">
                <div className="action-icon">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.74L20.71,20L19.29,21.41L13.03,15.14C11.88,16.1 10.4,16.69 8.79,16.69A6.5,6.5 0 0,1 2.29,10.19A6.5,6.5 0 0,1 8.79,3M8.79,5A4.5,4.5 0 0,0 4.29,9.5A4.5,4.5 0 0,0 8.79,14A4.5,4.5 0 0,0 13.29,9.5A4.5,4.5 0 0,0 8.79,5Z" />
                  </svg>
                </div>
                <h3>Upload & Analyze</h3>
                <p>
                  Upload screw images for automatic classification and counting
                </p>
                <button
                  onClick={handleUpload}
                  className="action-btn primary-btn">
                  Upload Image
                </button>
              </div>

              <div className="action-card secondary-action">
                <div className="action-icon">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
                <h3>Saved Analyses</h3>
                <p>Access your previously analyzed screw data and results</p>
                <button
                  onClick={handleViewSaved}
                  className="action-btn secondary-btn">
                  View Saved
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Screw Catalog */}
        <section className="catalog-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Screw Catalog</h2>
              <p className="section-subtitle">
                Browse our comprehensive collection of screw types and
                specifications
              </p>
            </div>

            {screws && screws.length > 0 ? (
              <div className="screw-grid">
                {screws.map((screw) => (
                  <div
                    key={screw._id}
                    className="screw-card"
                    onClick={() => setSelectedScrew(screw._id)}>
                    <div className="card-header">
                      <div className="screw-image">
                        <img
                          src={screw.images[0]?.url || "/placeholder-screw.png"}
                          alt={screw.name}
                          onError={(e) => {
                            e.target.src = "/placeholder-screw.png";
                          }}
                        />
                      </div>
                      <div className="screw-badge">{screw.category}</div>
                    </div>

                    <div className="card-body">
                      <h3 className="screw-name">{screw.name}</h3>
                      <p className="screw-material">{screw.material}</p>

                      <div className="screw-specs">
                        <div className="spec-item">
                          <span className="spec-label">Sizes:</span>
                          <div className="size-tags">
                            {screw.sizes && screw.sizes.slice(0, 3).map((size, index) => (
                              <span key={index} className="size-tag">
                                {size}
                              </span>
                            ))}
                            {screw.sizes && screw.sizes.length > 3 && (
                              <span className="size-tag-more">
                                +{screw.sizes.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {screw.description && (
                        <p className="screw-description">
                          {screw.description.length > 80
                            ? `${screw.description.substring(0, 80)}...`
                            : screw.description}
                        </p>
                      )}
                    </div>

                    <div className="card-footer">
                      {screw.price && (
                        <div className="screw-price">${screw.price}</div>
                      )}
                      <button className="view-details-btn">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,10.5A1.5,1.5 0 0,1 13.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,12A1.5,1.5 0 0,1 12,10.5M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5A1.5,1.5 0 0,1 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5Z" />
                  </svg>
                </div>
                <h3>No Screws Found</h3>
                <p>
                  Try adjusting your search criteria or browse different
                  categories
                </p>
                <button
                  className="reset-search-btn"
                  onClick={() => cbFilter("")}>
                  Reset Search
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
