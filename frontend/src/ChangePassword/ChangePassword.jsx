import { useState } from 'react';
import { host, showError, showSuccess } from '../utils/toast.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./changepassword.css"
import { FiLock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { Sidebar } from '../Sidebar/sidebar.jsx';

export const ChangePassword=()=>{
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const passwordsMatch = password !== '' && confirmPassword !== '' && password === confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || !confirmPassword) {
            showError('Both fields are required');
            return;
        }
        if (password !== confirmPassword) {
            showError('Passwords do not match');
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
            navigate("/profile")
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Failed to update password";
            showError(message);
        }
    };

    return (
        <div className="profile-page-wrapper">
            <div className="aurora-background"></div>
            <div className="profile-dashboard-layout">
                <Sidebar></Sidebar>

                <main className="main-content">
                    <header className="profile-header">
                        <div>
                            <h1 className="header-title">Security</h1>
                            <p className="header-subtitle">Update your password to keep your account secure.</p>
                        </div>
                    </header>

                    <div className="widget-card">
                        <h3 className="card-title">Change Password</h3>
                        <form onSubmit={handleSubmit} className="change-password-form">
                            <div className="input-group-stacked">
                                <label htmlFor="new-password">New Password</label>
                                <div className="input-wrapper">
                                    <FiLock />
                                    <input
                                        id="new-password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="input-group-stacked">
                                <label htmlFor="confirm-password">Confirm New Password</label>
                                <div className="input-wrapper">
                                    <FiLock />
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        required
                                    />
                                </div>
                            </div>

                            {confirmPassword && (
                                <div className={`password-match-status ${passwordsMatch ? 'match' : 'no-match'}`}>
                                    {passwordsMatch ? <FiCheckCircle /> : <FiXCircle />}
                                    <span>{passwordsMatch ? 'Passwords match' : 'Passwords do not match'}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="action-btn primary"
                                disabled={!passwordsMatch}
                            >
                                Update Password
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}