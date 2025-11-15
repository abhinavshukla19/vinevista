// DeleteAccount.jsx
import React, { useEffect, useRef, useState } from "react";
import "./deleteacc.css";
import { Sidebar } from "../Sidebar/sidebar.jsx"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import { host, showError, showSuccess } from "../utils/toast.jsx";
import axios from "axios";

export const DeleteAccount = () => {
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const overlayRef = useRef(null);
  const firstInputRef = useRef(null); // for focusing password input
  const confirmInputRef = useRef(null); // for focusing confirm input

  useEffect(() => {
    if (firstInputRef.current) firstInputRef.current.focus();
  }, []);

  useEffect(() => {
    // focus confirm input when modal opens
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

      // Good UX: show success, clear token, navigate
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

  // keyboard escape to close confirm modal
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
          <header className="profile-header sticky">
            <div>
              <h1 className="header-title">Delete account</h1>
              <p className="header-subtitle">Permanently remove your account and all data</p>
            </div>
          </header>

          <section
            className="fresh-card delete-account-root"
            role="region"
            aria-label="delete account"
          >
            <p className="muted-note">
              This action <strong>cannot</strong> be undone. Please enter your password to continue.
            </p>

            {error ? (
              <div className="error" role="alert" aria-live="assertive">
                {error}
              </div>
            ) : null}

            <form onSubmit={openConfirm} className="delete-form" noValidate>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                ref={firstInputRef}
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="input"
                aria-required="true"
              />

              <div className="form-cta">
                <button
                  type="submit"
                  className="btn-danger"
                  disabled={loading}
                  aria-disabled={loading}
                >
                  {loading ? "Processing..." : "Delete my account"}
                </button>
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
              </div>
            </form>
          </section>

          {/* Confirmation Modal */}
          {showConfirm && (
            <div
              className="confirm-overlay"
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
              ref={overlayRef}
              onMouseDown={(e) => {
                // clicking on overlay closes modal
                if (e.target === overlayRef.current) closeConfirm();
              }}
            >
              <div className="confirm-card" role="document">
                <button
                  className="close-x"
                  aria-label="Close confirmation"
                  onClick={closeConfirm}
                >
                  ×
                </button>

                <h3 id="confirm-title">Confirm deletion</h3>
                <p className="muted-note">
                  Type <strong>DELETE</strong> to confirm you want to permanently remove your
                  account.
                </p>

                <input
                  ref={confirmInputRef}
                  className="input confirm-input"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder='Type "DELETE" here'
                  aria-label='Type DELETE to confirm deletion'
                />

                <div className="confirm-actions">
                  <button type="button" className="btn-outline" onClick={closeConfirm}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-danger"
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
