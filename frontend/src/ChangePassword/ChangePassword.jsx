import { useState } from 'react';
import { host, showError, showSuccess } from '../components/Alert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./changepassword.css"
import { FiLock, FiCheckCircle, FiXCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { Sidebar } from '../Sidebar/sidebar.jsx';

export const ChangePassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [touched, setTouched] = useState({});
    const navigate = useNavigate();

    // Password strength calculation
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '', percentage: 0 };
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        if (strength <= 2) return { strength, label: 'Weak', color: '#dc143c', percentage: 33 };
        if (strength <= 4) return { strength, label: 'Medium', color: '#ffa500', percentage: 66 };
        return { strength, label: 'Strong', color: '#00c853', percentage: 100 };
    };

    // Validation functions
    const validatePassword = (password) => {
        if (!password) return { valid: false, message: 'Password is required' };
        if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters' };
        if (!/[A-Z]/.test(password)) return { valid: false, message: 'Password must contain at least one uppercase letter' };
        if (!/[a-z]/.test(password)) return { valid: false, message: 'Password must contain at least one lowercase letter' };
        if (!/\d/.test(password)) return { valid: false, message: 'Password must contain at least one number' };
        return { valid: true, message: '' };
    };

    const validateConfirmPassword = (confirmPassword, password) => {
        if (!confirmPassword) return { valid: false, message: 'Please confirm your password' };
        if (confirmPassword !== password) return { valid: false, message: 'Passwords do not match' };
        return { valid: true, message: '' };
    };

    const passwordValidation = touched.password ? validatePassword(password) : { valid: null, message: '' };
    const confirmPasswordValidation = touched.confirmPassword ? validateConfirmPassword(confirmPassword, password) : { valid: null, message: '' };
    const passwordStrength = getPasswordStrength(password);
    const passwordsMatch = password !== '' && confirmPassword !== '' && password === confirmPassword;
    const isFormValid = passwordValidation.valid && confirmPasswordValidation.valid && passwordsMatch;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            showError('Please fix the errors before submitting');
            return;
        }
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                showError("You are not signed in");
                navigate("/signin");
                return;
            }
            const res = await axios.post(`${host}/change_password`, { password }, { headers: { token: token } });
            showSuccess(res.data.message);
            setPassword('');
            setConfirmPassword('');
            setTouched({});
            navigate("/profile")
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Failed to update password";
            showError(message);
        }
    };

    const passwordRequirements = [
        { met: password.length >= 8, text: 'At least 8 characters' },
        { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
        { met: /[a-z]/.test(password), text: 'One lowercase letter' },
        { met: /\d/.test(password), text: 'One number' },
        { met: /[^a-zA-Z\d]/.test(password), text: 'One special character' }
    ];

    return (
        <div className="profile-dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <header className="dashboard-header">
                    <div className="header-content">
                        <h1 className="dashboard-title">Change Password</h1>
                        <p className="dashboard-subtitle">Update your password to keep your account secure</p>
                        <div className="header-divider"></div>
                    </div>
                </header>

                <div className="change-password-wrapper">
                    <div className="change-password-card">
                        <form onSubmit={handleSubmit} className="change-password-form">
                            <div className="form-group">
                                <label htmlFor="new-password" className="form-label">
                                    New Password
                                </label>
                                <div className={`input-wrapper ${passwordValidation.valid === true ? 'valid' : passwordValidation.valid === false ? 'invalid' : ''}`}>
                                    <FiLock className="input-icon" />
                                    <input
                                        id="new-password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setTouched(prev => ({ ...prev, password: true }));
                                        }}
                                        onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                                        placeholder="Enter new password"
                                        className="form-input"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                    {passwordValidation.valid !== null && (
                                        <span className="validation-icon">
                                            {passwordValidation.valid ? <FiCheckCircle className="valid-icon" /> : <FiXCircle className="invalid-icon" />}
                                        </span>
                                    )}
                                </div>
                                {passwordValidation.valid === false && (
                                    <span className="error-message">{passwordValidation.message}</span>
                                )}
                                
                                {password && (
                                    <div className="password-strength-indicator">
                                        <div className="strength-bar-container">
                                            <div 
                                                className="strength-bar" 
                                                style={{ 
                                                    width: `${passwordStrength.percentage}%`,
                                                    backgroundColor: passwordStrength.color
                                                }}
                                            ></div>
                                        </div>
                                        {passwordStrength.label && (
                                            <span className="strength-label" style={{ color: passwordStrength.color }}>
                                                {passwordStrength.label}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {password && (
                                    <div className="password-requirements">
                                        {passwordRequirements.map((req, index) => (
                                            <div key={index} className={`requirement-item ${req.met ? 'met' : ''}`}>
                                                {req.met ? <FiCheckCircle className="requirement-icon" /> : <FiXCircle className="requirement-icon" />}
                                                <span>{req.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirm-password" className="form-label">
                                    Confirm New Password
                                </label>
                                <div className={`input-wrapper ${confirmPasswordValidation.valid === true ? 'valid' : confirmPasswordValidation.valid === false ? 'invalid' : ''}`}>
                                    <FiLock className="input-icon" />
                                    <input
                                        id="confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            setTouched(prev => ({ ...prev, confirmPassword: true }));
                                        }}
                                        onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
                                        placeholder="Confirm new password"
                                        className="form-input"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                    {confirmPasswordValidation.valid !== null && (
                                        <span className="validation-icon">
                                            {confirmPasswordValidation.valid ? <FiCheckCircle className="valid-icon" /> : <FiXCircle className="invalid-icon" />}
                                        </span>
                                    )}
                                </div>
                                {confirmPasswordValidation.valid === false && (
                                    <span className="error-message">{confirmPasswordValidation.message}</span>
                                )}
                                
                                {confirmPassword && passwordsMatch && (
                                    <div className="password-match-status match">
                                        <FiCheckCircle />
                                        <span>Passwords match</span>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={!isFormValid}
                            >
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}