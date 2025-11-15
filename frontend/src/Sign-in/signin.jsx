import "./signin.css";
import { useState } from 'react';
import { showError, showSuccess } from '../utils/toast.jsx';
import { Eye, EyeOff, Mail, Lock, Wine } from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import { host } from "../utils/toast.jsx";

export let Signinpage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password.trim() === "" || email.trim() === "") {
            showError('All fields are required');
            return;
        }

        setIsLoading(true);

        try {
            const res = await axios.post(`${host}/signin`, { email, password });
            const data = res?.data;
            
            if (!data || data.success === false || !data.token) {
                showError(data?.message || 'Invalid email or password');
                setIsLoading(false);
                return;
            }
            
            localStorage.setItem("token", data.token);
            showSuccess(data?.message || 'Login successful');
            navigate('/Dashboard');
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || 'Network error';
            showError(message);
            setIsLoading(false);
        }
    };

    return (
        <div className='signin-container'>
            {/* Animated Background */}
            <div className="signin-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            {/* Main Content */}
            <div className='signin-content'>
                {/* Left Side - Branding */}
                <div className='signin-branding'>
                    <div className='brand-logo'>
                        <Wine size={48} />
                    </div>
                    <h1 className='brand-title'>Vine Vista</h1>
                    <p className='brand-tagline'>
                        Premium wines and spirits delivered to your doorstep
                    </p>
                    <div className='brand-features'>
                        <div className='feature-item'>
                            <div className='feature-icon'>✓</div>
                            <span>Curated Collection</span>
                        </div>
                        <div className='feature-item'>
                            <div className='feature-icon'>✓</div>
                            <span>Fast Delivery</span>
                        </div>
                        <div className='feature-item'>
                            <div className='feature-icon'>✓</div>
                            <span>Secure Payments</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Sign In Form */}
                <div className='signin-form-section'>
                    <div className='signin-form-card'>
                        <div className='form-header'>
                            <h2>Welcome Back</h2>
                            <p>Sign in to continue to your account</p>
                        </div>

                        <form className='signin-form' onSubmit={handleSubmit}>
                            <div className='form-group'>
                                <label htmlFor='email'>Email Address</label>
                                <div className='input-wrapper'>
                                    <Mail className="input-icon" size={20} />
                                    <input
                                        type='email'
                                        id='email'
                                        name='email'
                                        value={email}
                                        placeholder='Enter your email'
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className='form-group'>
                                <label htmlFor='password'>Password</label>
                                <div className='input-wrapper'>
                                    <Lock className="input-icon" size={20} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id='password'
                                        name='password'
                                        value={password}
                                        placeholder='Enter your password'
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex="-1"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-options">
                                <label className="checkbox-label">
                                    <input type="checkbox" />
                                    <span>Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="forgot-link">
                                    Forgot Password?
                                </Link>
                            </div>

                            <button 
                                type='submit' 
                                className="btn-signin"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="spinner"></div>
                                        <span>Signing In...</span>
                                    </>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </button>
                        </form>

                        <div className="form-divider">
                            <span>or</span>
                        </div>

                        <div className="form-footer">
                            <p>
                                Don't have an account?{' '}
                                <Link to="/register" className="signup-link">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};