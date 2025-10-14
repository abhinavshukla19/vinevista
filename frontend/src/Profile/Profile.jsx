import "./Profile.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showError } from "../utils/toast.jsx";
import { FiUser, FiGrid, FiSettings, FiLogOut, FiEdit2, FiShield, FiLock } from 'react-icons/fi';
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
                if (typeof payload === "string") { try { payload = JSON.parse(payload) } catch { } }
                const arrayCandidate = Array.isArray(payload?.data) ? payload?.data[0] : null;
                const userData = payload?.data?.user ?? payload?.user ?? payload?.data ?? arrayCandidate ?? payload;
                setUser(userData ?? null);
            })
            .catch(err => {
                const message = err?.response?.data?.message || err?.message || "Failed to load profile";
                showError(message);
                navigate("/signin")
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

    // compute two gradient stops (stable per-user)
    const bg1 = stringToHslColor(user?.name || "User", 72, 56);
    const bg2 = stringToHslColor(user?.email || "Email", 68, 44);
    return (
        <div className="profile-page-wrapper">
            <div className="aurora-background"></div>
            <div className="profile-dashboard-layout">
                <Sidebar></Sidebar>
                <main className="main-content">
                    <header className="profile-header sticky">
                        <div>
                            <h1 className="header-title">Profile</h1>
                            <p className="header-subtitle">Manage your personal information and account security</p>
                        </div>
                    </header>

                    <section className="fresh-hero" role="region" aria-label="profile header">
                        <div className="fresh-avatar" aria-hidden={isLoading ? "true" : "false"}
                             style={!user?.profilePicUrl ? { background: `linear-gradient(135deg, ${bg1}, ${bg2})` } : undefined}>
                            <div className="avatar-ring" aria-hidden="true"></div>
                            {user?.profilePicUrl ? (
                                <img className="avatar-img" src={user.profilePicUrl} alt={user?.name || "user avatar"}
                                     onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement.style.background = `linear-gradient(135deg, ${bg1}, ${bg2})`; }} />
                            ) : (
                                <div className="avatar-initials">{initials}</div>
                            )}
                        </div>

                        <div className="fresh-main">
                            <h2 className="name">{isLoading ? <span className="skeleton skeleton-title"></span> : user?.name || "User Name"}</h2>
                            <div className="email">{isLoading ? <span className="skeleton skeleton-text"></span> : user?.email || "user@example.com"}</div>

                            <div className="fresh-meta">
                                <div className="status-pill" title="Account status">
                                    <span className="status-dot" aria-hidden="true"></span>
                                    <span>Active</span>
                                </div>
                                <div style={{ color: '#9aa3b2', fontSize: 13 }}>
                                    Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                                </div>
                            </div>
                        </div>

                        <div className="fresh-actions" aria-hidden={false}>
                            <button className="fresh-btn primary" onClick={() => navigate("/edit_profile")}><FiEdit2 /> Edit Profile</button>
                            <button className="fresh-btn" onClick={() => navigate("/change_password")}><FiShield /> Change Password</button>
                        </div>
                    </section>

                    <section className="fresh-grid" aria-label="profile content">
                        <div>
                            <div className="fresh-card">
                                <div className="card-title">Personal Details</div>
                                <div className="details-grid" role="table" aria-label="personal details">
                                    <div className="detail-row"><div className="detail-label">Full Name</div><div className="detail-value">{isLoading ? <span className="skeleton skeleton-text"></span> : (user?.name || "-")}</div></div>
                                    <div className="detail-row"><div className="detail-label">Email Address</div><div className="detail-value">{isLoading ? <span className="skeleton skeleton-text"></span> : (user?.email || "-")}</div></div>
                                    <div className="detail-row"><div className="detail-label">Phone Number</div><div className="detail-value">{isLoading ? <span className="skeleton skeleton-text"></span> : (user?.phonenumber || "-")}</div></div>
                                    <div className="detail-row"><div className="detail-label">Gender</div><div className="detail-value">{isLoading ? <span className="skeleton skeleton-text"></span> : (user?.gender || "-")}</div></div>
                                </div>
                            </div>

                            <div style={{ height: 18 }}></div>

                            <div className="fresh-card" aria-hidden="false">
                                <div className="card-title">Recent Activity</div>
                                <ul className="timeline" aria-live="polite">
                                    <li className="timeline-item"><div className="timeline-dot"></div><div style={{display:'flex', justifyContent:'space-between', width:'100%'}}><div>Logged in yesterday</div><div style={{color:'#9aa3b2'}}>1d</div></div></li>
                                    <li className="timeline-item"><div className="timeline-dot"></div><div style={{display:'flex', justifyContent:'space-between', width:'100%'}}><div>Changed password</div><div style={{color:'#9aa3b2'}}>3 mo</div></div></li>
                                    <li className="timeline-item"><div className="timeline-dot"></div><div style={{display:'flex', justifyContent:'space-between', width:'100%'}}><div>Added 2 products</div><div style={{color:'#9aa3b2'}}>1 wk</div></div></li>
                                </ul>
                            </div>

                            <div className="bottom-fill" aria-hidden="true"></div>
                        </div>

                        <aside>
                            <div className="fresh-card">
                                <div className="card-title">Activity</div>
                                <div className="stat-block">
                                    <div className="stat-pill"><div><div className="stat-value">12</div><div className="stat-label">Products Added</div></div><div style={{color:'#9aa3b2'}}>—</div></div>
                                    <div className="stat-pill"><div><div className="stat-value">Active</div><div className="stat-label">Account Status</div></div><div style={{color:'#9aa3b2'}}>—</div></div>
                                </div>
                            </div>

                            <div style={{height:12}}></div>

                            <div className="fresh-card">
                                <div className="card-title">Account Security</div>
                                <div className="security-row">
                                    <div className="security-icon-wrap"><FiLock /></div>
                                    <div>
                                        <div style={{fontWeight:800}}>Password</div>
                                        <div style={{color:'#9aa3b2', fontSize:13}}>Last changed 3 months ago</div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </section>
                </main>
            </div>
        </div>
    );
};
