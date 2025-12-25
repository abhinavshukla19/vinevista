import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import './Alert.css';

const AlertContext = createContext();

// Global alert functions that will be set by the provider
let globalAlertFunctions = {
  showSuccess: null,
  showError: null,
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const functionsRef = useRef({});

  const showAlert = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    const alert = { id, message, type, duration };
    
    setAlerts((prev) => [...prev, alert]);

    if (duration > 0) {
      setTimeout(() => {
        removeAlert(id);
      }, duration);
    }

    return id;
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const showSuccess = useCallback((message, duration) => {
    return showAlert(message, 'success', duration);
  }, [showAlert]);

  const showError = useCallback((message, duration) => {
    return showAlert(message, 'error', duration);
  }, [showAlert]);

  // Update global functions and ref
  useEffect(() => {
    functionsRef.current = { showSuccess, showError };
    globalAlertFunctions.showSuccess = showSuccess;
    globalAlertFunctions.showError = showError;
  }, [showSuccess, showError]);

  return (
    <AlertContext.Provider value={{ showAlert, showSuccess, showError, removeAlert }}>
      {children}
      <AlertContainer alerts={alerts} removeAlert={removeAlert} />
    </AlertContext.Provider>
  );
};

// Export global functions for use outside React components
export const getAlertFunctions = () => globalAlertFunctions;

// Export host constant
export const host = "https://vinevista.onrender.com";

// Export functions that use the alert system (for backward compatibility)
export const showSuccess = (message, duration = 4000) => {
  const { showSuccess } = getAlertFunctions();
  if (showSuccess) {
    return showSuccess(message, duration);
  }
  // Fallback to console if alerts aren't initialized yet
  console.log('Success:', message);
};

export const showError = (message, duration = 4000) => {
  const { showError } = getAlertFunctions();
  if (showError) {
    return showError(message, duration);
  }
  // Fallback to console if alerts aren't initialized yet
  console.error('Error:', message);
};

const AlertContainer = ({ alerts, removeAlert }) => {
  return (
    <div className="alert-container">
      {alerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} onClose={() => removeAlert(alert.id)} />
      ))}
    </div>
  );
};

const AlertItem = ({ alert, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`alert-item alert-${alert.type} ${isVisible && !isExiting ? 'alert-visible' : ''} ${isExiting ? 'alert-exiting' : ''}`}
      onClick={handleClose}
    >
      <div className="alert-content">
        <div className="alert-icon">
          {alert.type === 'success' ? (
            <CheckCircle2 size={24} />
          ) : (
            <XCircle size={24} />
          )}
        </div>
        <div className="alert-message">{alert.message}</div>
        <button className="alert-close" onClick={handleClose} aria-label="Close">
          <X size={18} />
        </button>
      </div>
      <div className="alert-progress">
        <div className="alert-progress-bar" style={{ animationDuration: `${alert.duration}ms` }} />
      </div>
    </div>
  );
};

