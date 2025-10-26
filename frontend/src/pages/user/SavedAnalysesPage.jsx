import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/user/pages/SaveAnalysesPage.css";
import { getToken } from "../../utils/authUtil";
import axios from "axios";
import NamingModal from "../../components/user/Modal";
import Navbar from "../../components/user/layouts/Navbar";
import notify from "../../components/user/Toast";
import ConfirmationModal from "../../components/user/ConfirmationModal";

function SavedAnalyses() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currData, setCurrData] = useState({
    id: "",
    name: "",
  });

  useEffect(() => {
    // Fetch saved analyses from backend
    fetchSavedAnalyses();
  }, []);

  const fetchSavedAnalyses = async () => {
    axios(`${import.meta.env.VITE_APP_API}api/v1/savedAnalysis`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((response) => {
        setAnalyses(response.data.result);
        console.log(response.data.result);
      })
      .catch((error) => console.log(error));
  };

  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  function actionEdit(id, analysesName) {
    setCurrData({
      ...currData,
      id: id,
      name: analysesName,
    });
    setShowModal(true);
    return;
  }

  function actionDelete(id) {
    // console.log(id);
    setCurrData({
      ...currData,
      id: id,
    });
    setDeleteModal(true);
    return;
  }

  async function onsubmitHandler(result) {
    if (result) fetchSavedAnalyses();
    notify("success", "edit successful");
  }

  async function deleteRecord() {
    if (!currData.id) return;
    axios
      .post(
        `${import.meta.env.VITE_APP_API}api/v1/unsaved`,
        {
          analysesRecordId: currData.id,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        notify("success", "unsaved successful");
        setDeleteModal(false);
        fetchSavedAnalyses();
      })
      .catch((error) => {
        console.log(error);
        notify("error", error.message);
      });
  }

  return (
    <div className="saved-page">
      {deleteModal && (
        <ConfirmationModal
          mode ={"delete"}
          show={true}
          onClose={() => setDeleteModal(false)}
          onConfirm={deleteRecord}
        />
      )}
      {showModal && (
        <NamingModal
          isOpen={true}
          onClose={() => setShowModal(false)}
          currValue={currData}
          alreadySaved={true}
          onSubmit={onsubmitHandler}></NamingModal>
      )}
      <Navbar />
      <main className="saved-main">
        <h1>Your Saved Analyses</h1>
        {analyses.length === 0 ? (
          <p className="empty-msg">No saved analyses yet.</p>
        ) : (
          <div className="accordion-container">
            {analyses.map((item) => (
              <div
                key={item._id}
                className={`accordion-item ${
                  expandedId === item._id ? "expanded" : ""
                }`}>
                <div className="accordion-header">
                  <div className="header-left">
                    <img
                      src={item.uploadedImage.url}
                      alt="Uploaded analysis"
                      className="thumbnail"
                    />
                    <div className="header-info">
                      <h3>{item.name || "Unknown analysis"}</h3>
                      <p className="date">
                        Saved on {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="header-right">
                    <span className="service-badge">{item.typeOfService}</span>
                    <span className="action-btn">
                      <li
                        className="fa fa-edit"
                        onClick={(e) => actionEdit(item._id, item.name)}></li>
                    </span>
                    <span className="action-btn">
                      <li
                        className="fa fa-trash"
                        onClick={(e) => actionDelete(item._id)}></li>
                    </span>
                    <span
                      className={`chevron ${
                        expandedId === item._id ? "rotate" : ""
                      }`}
                      onClick={() => toggleAccordion(item._id)}>
                      ▼
                    </span>
                  </div>
                </div>

                {expandedId === item._id && (
                  <div className="accordion-content">
                    <div className="content-grid">
                      <div className="content-left">
                        <img
                          src={item.uploadedImage.url}
                          alt="Full analysis"
                          className="full-image"
                        />
                      </div>

                      <div className="content-right">
                        {item.typeOfService === "classification" ? (
                          <>
                            <div className="detail-section">
                              <h4>Screw Details</h4>
                              <div className="detail-row">
                                <span className="label">Name:</span>
                                <span className="value">{item.screw.name}</span>
                              </div>
                              <div className="detail-row">
                                <span className="label">Category:</span>
                                <span className="value">
                                  {item.screw.category}
                                </span>
                              </div>
                              <div className="detail-row">
                                <span className="label">Material:</span>
                                <span className="value">
                                  {item.screw.material}
                                </span>
                              </div>
                              <div className="detail-row">
                                <span className="label">Strength:</span>
                                <span className="value">
                                  {item.screw.strength}
                                </span>
                              </div>
                              <div className="detail-row">
                                <span className="label">Available Sizes:</span>
                                <span className="value">
                                  {item.screw.sizes.join(", ")}
                                </span>
                              </div>
                            </div>

                            <div className="detail-section">
                              <h4>Description</h4>
                              <p className="description">
                                {item.screw.description}
                              </p>
                            </div>

                            <div className="detail-section">
                              <h4>User Information</h4>
                              <div className="detail-row">
                                <span className="label">Analyzed by:</span>
                                <span className="value">{item.user.name}</span>
                              </div>
                              <div className="detail-row">
                                <span className="label">Email:</span>
                                <span className="value">{item.user.email}</span>
                              </div>
                            </div>

                            <div className="screw-images">
                              <h4>Reference Images</h4>
                              <div className="images-grid">
                                {item.screw.images.map((img) => (
                                  <img
                                    key={img._id}
                                    src={img.url}
                                    alt="Screw reference"
                                    className="reference-img"
                                  />
                                ))}
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="detail-section">
                              <h4>Analysis Details</h4>
                              <div className="detail-row">
                                <span className="label">Service Type:</span>
                                <span className="value">
                                  Screw Count Analysis
                                </span>
                              </div>
                              <div className="detail-row">
                                <span className="label">Analysis Date:</span>
                                <span className="value">
                                  {formatDate(item.createdAt)}
                                </span>
                              </div>
                            </div>

                            <div className="detail-section">
                              <h4>User Information</h4>
                              <div className="detail-row">
                                <span className="label">Analyzed by:</span>
                                <span className="value">{item.user.name}</span>
                              </div>
                              <div className="detail-row">
                                <span className="label">Email:</span>
                                <span className="value">{item.user.email}</span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default SavedAnalyses;
