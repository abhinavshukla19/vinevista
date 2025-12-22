import "./Profile.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showError, host } from "../components/Alert";
import { User, Mail, Phone, Calendar, Edit2, Lock, Activity, Shield, Award, Clock } from 'lucide-react';
import { Sidebar } from "../Sidebar/sidebar.jsx";

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
                {/* Page Header */}
                <header className="profile-header">
                    <h1>My Profile</h1>
                    <p>Manage your personal information and account settings</p>
                </header>

                {/* Profile Header Section */}
                <section className="profile-header-section">
                    <div className="profile-header-content">
                        <div className="profile-avatar">
                            {user?.profilePicUrl ? (
                                <img 
                                    className="avatar-image" 
                                    src={user.profilePicUrl} 
                                    alt={user?.name || "user avatar"}
                                    onError={(e) => { 
                                        e.currentTarget.style.display = "none"; 
                                    }} 
                                />
                            ) : (
                                <div className="avatar-initials">{initials}</div>
                            )}
                        </div>
                        
                        <div className="profile-info">
                            <h2 className="profile-name">{user?.name || "User Name"}</h2>
                            <p className="profile-email">{user?.email || "user@example.com"}</p>
                            <div className="profile-status">
                                <span className="status-dot"></span>
                                <span>Active Account</span>
                            </div>
                        </div>

                        <div className="profile-actions">
                            <button 
                                className="btn-edit" 
                                onClick={() => navigate("/edit_profile")}
                            >
                                <Edit2 size={18} />
                                <span>Edit Profile</span>
                            </button>
                            <button 
                                className="btn-password" 
                                onClick={() => navigate("/change_password")}
                            >
                                <Lock size={18} />
                                <span>Change Password</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Content Sections */}
                <div className="profile-content">
                    {/* Main Content */}
                    <div className="profile-main">
                        {/* Personal Information Section */}
                        <section className="profile-section">
                            <h3 className="section-title">Personal Information</h3>
                            <div className="info-grid">
                                <div className="info-field">
                                    <span className="field-label">Full Name</span>
                                    <span className="field-value">{user?.name || "—"}</span>
                                </div>
                                <div className="info-field">
                                    <span className="field-label">Email Address</span>
                                    <span className="field-value">{user?.email || "—"}</span>
                                </div>
                                <div className="info-field">
                                    <span className="field-label">Phone Number</span>
                                    <span className="field-value">{user?.phonenumber || "—"}</span>
                                </div>
                                <div className="info-field">
                                    <span className="field-label">Gender</span>
                                    <span className="field-value">{user?.gender || "—"}</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Content */}
                    <div className="profile-sidebar">
                        {/* Account Stats */}
                        <section className="profile-section">
                            <h3 className="section-title">Account</h3>
                            <div className="stats-list">
                                <div className="stat-row">
                                    <span className="stat-label">Status</span>
                                    <span className="stat-value">Active</span>
                                </div>
                                <div className="stat-row">
                                    <span className="stat-label">Member Since</span>
                                    <span className="stat-value">
                                        {user?.created_at ? new Date(user.created_at).getFullYear() : '—'}
                                    </span>
                                </div>
                                <div className="stat-row">
                                    <span className="stat-label">Joined</span>
                                    <span className="stat-value">{formatJoinDate(user?.created_at)}</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};