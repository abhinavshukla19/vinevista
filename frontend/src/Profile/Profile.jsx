import "./Profile.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showError } from "../utils/toast.jsx";
import { User, Mail, Phone, Calendar, Edit2, Lock, Activity, Shield, Award, Clock } from 'lucide-react';
import { Sidebar } from "../Sidebar/sidebar.jsx";
import { host } from "../utils/toast.jsx";

export let Profile = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            showError("You are not signed in");
            navigate("/signin");
            return;
        }
        axios.post(`${host}/user_profile`, {}, { headers: { token: token } })
            .then(res => {
                let payload = res?.data;
                if (typeof payload === "string") { 
                    try { payload = JSON.parse(payload) } catch { } 
                }
                const arrayCandidate = Array.isArray(payload?.data) ? payload?.data[0] : null;
                const userData = payload?.data?.user ?? payload?.user ?? payload?.data ?? arrayCandidate ?? payload;
                setUser(userData ?? null);
            })
            .catch(err => {
                const message = err?.response?.data?.message || err?.message || "Failed to load profile";
                showError(message);
                navigate("/signin");
            })
            .finally(() => setIsLoading(false));
    }, [navigate]);

    const initials = ((user?.name || "").trim().split(" ").filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join("")) || "?";

    function stringToHslColor(str, s = 65, l = 55) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash;
        }
        const h = Math.abs(hash) % 360;
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    const bg1 = stringToHslColor(user?.name || "User", 72, 56);
    const bg2 = stringToHslColor(user?.email || "Email", 68, 44);

    const formatJoinDate = (date) => {
        if (!date) return '—';
        return new Date(date).toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        });
    };

    if (isLoading) {
        return (
            <div className="profile-layout">
                <Sidebar />
                <div className="profile-loading">
                    <Activity className="loading-icon" />
                    <h2>Loading Profile...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-layout">
            <Sidebar />
            
            <main className="profile-container">
                {/* Header */}
                <header className="profile-header">
                    <div className="header-content">
                        <h1>My Profile</h1>
                        <p>Manage your personal information and account settings</p>
                    </div>
                </header>

                {/* Profile Hero Section */}
                <section className="profile-hero">
                    <div className="hero-background"></div>
                    
                    <div className="profile-card-main">
                        <div className="avatar-section">
                            <div 
                                className="avatar-container"
                                style={!user?.profilePicUrl ? { 
                                    background: `linear-gradient(135deg, ${bg1}, ${bg2})` 
                                } : undefined}
                            >
                                <div className="avatar-ring"></div>
                                {user?.profilePicUrl ? (
                                    <img 
                                        className="avatar-image" 
                                        src={user.profilePicUrl} 
                                        alt={user?.name || "user avatar"}
                                        onError={(e) => { 
                                            e.currentTarget.style.display = "none"; 
                                            e.currentTarget.parentElement.style.background = `linear-gradient(135deg, ${bg1}, ${bg2})`; 
                                        }} 
                                    />
                                ) : (
                                    <div className="avatar-initials">{initials}</div>
                                )}
                            </div>
                            
                            <div className="user-info">
                                <h2 className="user-name">{user?.name || "User Name"}</h2>
                                <p className="user-email">{user?.email || "user@example.com"}</p>
                                
                                <div className="user-meta">
                                    <div className="status-badge active">
                                        <span className="status-dot"></span>
                                        <span>Active Account</span>
                                    </div>
                                    <div className="join-date">
                                        <Calendar size={16} />
                                        <span>Joined {formatJoinDate(user?.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button 
                                className="btn-primary" 
                                onClick={() => navigate("/edit_profile")}
                            >
                                <Edit2 size={18} />
                                <span>Edit Profile</span>
                            </button>
                            <button 
                                className="btn-secondary" 
                                onClick={() => navigate("/change_password")}
                            >
                                <Lock size={18} />
                                <span>Change Password</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Content Grid */}
                <div className="profile-grid">
                    {/* Left Column */}
                    <div className="grid-main">
                        {/* Personal Details Card */}
                        <div className="info-card">
                            <div className="card-header">
                                <User size={20} />
                                <h3>Personal Information</h3>
                            </div>
                            <div className="card-body">
                                <div className="info-row">
                                    <div className="info-item">
                                        <div className="info-icon">
                                            <User size={18} />
                                        </div>
                                        <div className="info-content">
                                            <span className="info-label">Full Name</span>
                                            <span className="info-value">{user?.name || "—"}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="info-item">
                                        <div className="info-icon">
                                            <Mail size={18} />
                                        </div>
                                        <div className="info-content">
                                            <span className="info-label">Email Address</span>
                                            <span className="info-value">{user?.email || "—"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="info-row">
                                    <div className="info-item">
                                        <div className="info-icon">
                                            <Phone size={18} />
                                        </div>
                                        <div className="info-content">
                                            <span className="info-label">Phone Number</span>
                                            <span className="info-value">{user?.phonenumber || "—"}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="info-item">
                                        <div className="info-icon">
                                            <User size={18} />
                                        </div>
                                        <div className="info-content">
                                            <span className="info-label">Gender</span>
                                            <span className="info-value">{user?.gender || "—"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Activity Timeline Card */}
                        <div className="info-card">
                            <div className="card-header">
                                <Clock size={20} />
                                <h3>Recent Activity</h3>
                            </div>
                            <div className="card-body">
                                <div className="timeline">
                                    <div className="timeline-item">
                                        <div className="timeline-marker"></div>
                                        <div className="timeline-content">
                                            <span className="timeline-text">Profile updated</span>
                                            <span className="timeline-time">2 days ago</span>
                                        </div>
                                    </div>
                                    <div className="timeline-item">
                                        <div className="timeline-marker"></div>
                                        <div className="timeline-content">
                                            <span className="timeline-text">Password changed</span>
                                            <span className="timeline-time">3 months ago</span>
                                        </div>
                                    </div>
                                    <div className="timeline-item">
                                        <div className="timeline-marker"></div>
                                        <div className="timeline-content">
                                            <span className="timeline-text">Account created</span>
                                            <span className="timeline-time">{formatJoinDate(user?.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="grid-sidebar">
                        {/* Stats Card */}
                        <div className="info-card stats-card">
                            <div className="card-header">
                                <Activity size={20} />
                                <h3>Account Stats</h3>
                            </div>
                            <div className="card-body">
                                <div className="stat-item">
                                    <div className="stat-icon">
                                        <Award size={24} />
                                    </div>
                                    <div className="stat-content">
                                        <span className="stat-value">Active</span>
                                        <span className="stat-label">Account Status</span>
                                    </div>
                                </div>
                                <div className="stat-divider"></div>
                                <div className="stat-item">
                                    <div className="stat-icon">
                                        <Calendar size={24} />
                                    </div>
                                    <div className="stat-content">
                                        <span className="stat-value">
                                            {user?.createdAt ? new Date(user.createdAt).getFullYear() : '—'}
                                        </span>
                                        <span className="stat-label">Member Since</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Card */}
                        <div className="info-card security-card">
                            <div className="card-header">
                                <Shield size={20} />
                                <h3>Account Security</h3>
                            </div>
                            <div className="card-body">
                                <div className="security-item">
                                    <div className="security-icon">
                                        <Lock size={20} />
                                    </div>
                                    <div className="security-content">
                                        <span className="security-title">Password</span>
                                        <span className="security-desc">Last changed 3 months ago</span>
                                    </div>
                                </div>
                                <button 
                                    className="security-btn"
                                    onClick={() => navigate("/change_password")}
                                >
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};