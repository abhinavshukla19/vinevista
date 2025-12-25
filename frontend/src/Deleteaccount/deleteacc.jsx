// DeleteAccount.jsx
import React, { useEffect, useRef, useState } from "react";
import "./deleteacc.css";
import { Sidebar } from "../Sidebar/sidebar.jsx";
import { useNavigate } from "react-router-dom";
import { host , showError , showSuccess } from "../components/Alert-box/Alert";
import axios from "axios";

export const DeleteAccount = () => {
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const overlayRef = useRef(null);
  const firstInputRef = useRef(null);
  const confirmInputRef = useRef(null);

  useEffect(() => {
    if (firstInputRef.current) firstInputRef.current.focus();
  }, []);

  useEffect(() => {
    if (showConfirm && confirmInputRef.current) {
      confirmInputRef.current.focus();
    }
  }, [showConfirm]);

  const token = localStorage.getItem("token");

  const openConfirm = (e) => {
    e.preventDefault();
    setError("");
    if (!password.trim()) {
      setError("Please enter your password to proceed.");
      return;
    }
    setShowConfirm(true);
  };

  const closeConfirm = () => {
    setShowConfirm(false);
    setConfirmText("");
    setError("");
  };

  const handleDelete = async () => {
    setError("");
    if (confirmText.trim() !== "DELETE") {
      setError('Type "DELETE" in the confirmation box to proceed.');
      return;
    }
    if (!token) {
      setError("You are not authenticated. Please sign in again.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${host}/delete-account`,
        { password },
        { headers: { token, Authorization: `Bearer ${token}` } }
      );

      showSuccess(res?.data?.message || "Account deleted successfully.");
      localStorage.removeItem("token");
      navigate("/signin");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to delete account. Try again.";
      showError(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && showConfirm) {
        closeConfirm();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showConfirm]);

  return (
    <div className="profile-page-wrapper">
      <div className="profile-dashboard-layout">
        <Sidebar />
        <main className="main-content delete-page-main" aria-live="polite">
          <header className="profile-header">
            <div>
              <h1 className="header-title">DELETE ACCOUNT</h1>
              <p className="header-subtitle">Permanently remove your account and all data</p>
            </div>
          </header>

          <section
            className="delete-account-card"
            role="region"
            aria-label="delete account"
          >
            <div className="warning-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>

            <h2 className="card-title">Danger Zone</h2>
            <p className="warning-text">
              This action <strong>cannot</strong> be undone. All your data, including your wine collection, orders, and account information will be permanently deleted.
            </p>

            {error && (
              <div className="error-alert" role="alert" aria-live="assertive">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={openConfirm} className="delete-form" noValidate>
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Confirm your password
                </label>
                <input
                  id="password"
                  ref={firstInputRef}
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="form-input"
                  aria-required="true"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setPassword("");
                    setError("");
                  }}
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="btn-danger"
                  disabled={loading}
                  aria-disabled={loading}
                >
                  {loading ? "Processing..." : "Delete my account"}
                </button>
              </div>
            </form>
          </section>

          {showConfirm && (
            <div
              className="confirm-overlay"
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
              ref={overlayRef}
              onMouseDown={(e) => {
                if (e.target === overlayRef.current) closeConfirm();
              }}
            >
              <div className="confirm-modal" role="document">
                <button
                  className="modal-close"
                  aria-label="Close confirmation"
                  onClick={closeConfirm}
                >
                  ×
                </button>

                <div className="modal-header">
                  <div className="modal-icon-danger">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  </div>
                  <h3 id="confirm-title">Confirm deletion</h3>
                  <p className="modal-description">
                    Type <strong>DELETE</strong> below to confirm you want to permanently remove your account and all associated data.
                  </p>
                </div>

                <input
                  ref={confirmInputRef}
                  className="modal-input"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder='Type "DELETE" here'
                  aria-label='Type DELETE to confirm deletion'
                />

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={closeConfirm}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-confirm-danger"
                    onClick={handleDelete}
                    disabled={loading}
                    aria-disabled={loading}
                  >
                    {loading ? "Deleting..." : "Confirm delete"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DeleteAccount;