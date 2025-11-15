import "./Registeruser.css"; 
import { useState } from 'react';
import { showError, showSuccess } from '../utils/toast.jsx';
import { Eye, EyeOff, User, Mail, Lock, Phone, Users, Wine } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; 
import { host } from "../utils/toast.jsx";
import axios from 'axios';

export let Registrationpage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (name.trim() === "" || password.trim() === "" || email.trim() === "" || phonenumber.trim() === "" || gender === "") {
            showError('All fields are required');
            return;
        }

        setIsLoading(true);

        try {
            const res = await axios.post(`${host}/register`, {
                email, password, phonenumber, gender, name
            });
            showSuccess(res.data.message || 'Registration successful!');
            setTimeout(() => {
                navigate('/signin');
            }, 1500);
        } catch (error) {
            if (error.response) {
                console.error("Backend Error:", error.response.data.message);
                showError(error.response.data.message);
            } else {
                console.error("Network or other error:", error.message);
                showError("Registration failed. Please try again.");
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            {/* Animated Background */}
            <div className="register-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            {/* Main Content */}
            <div className="register-content">
                {/* Left Side - Branding */}
                <div className="register-branding">
                    <div className="brand-logo">
                        <Wine size={48} />
                    </div>
                    <h1 className="brand-title">Join Vine Vista</h1>
                    <p className="brand-tagline">
                        Create your account and explore our premium collection
                    </p>
                    <div className="brand-features">
                        <div className="feature-item">
                            <div className="feature-icon">✓</div>
                            <span>Exclusive Member Deals</span>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">✓</div>
                            <span>Track Your Orders</span>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">✓</div>
                            <span>Personalized Recommendations</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Register Form */}
                <div className="register-form-section">
                    <div className="register-form-card">
                        <div className="form-header">
                            <h2>Create Account</h2>
                            <p>Start your journey with Vine Vista</p>
                        </div>

                        <form className="register-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <div className="input-wrapper">
                                        <User className="input-icon" size={20} />
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="Enter your full name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <div className="input-wrapper">
                                        <Mail className="input-icon" size={20} />
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <div className="input-wrapper">
                                        <Phone className="input-icon" size={20} />
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phonenumber"
                                            placeholder="Enter phone number"
                                            value={phonenumber}
                                            onChange={(e) => setPhonenumber(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="gender">Gender</label>
                                    <div className="input-wrapper">
                                        <Users className="input-icon" size={20} />
                                        <select
                                            id="gender"
                                            name="gender"
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        >
                                            <option value="" disabled>Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" size={20} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        placeholder="Create a password"
                                        value={password}
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

                            <button 
                                type="submit" 
                                className="btn-register"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="spinner"></div>
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    <span>Create Account</span>
                                )}
                            </button>
                        </form>

                        <div className="form-divider">
                            <span>or</span>
                        </div>

                        <div className="form-footer">
                            <p>
                                Already have an account?{' '}
                                <Link to="/signin" className="signin-link">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};