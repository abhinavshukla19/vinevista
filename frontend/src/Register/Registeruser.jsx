import "./Registeruser.css"; 
import { useState } from 'react';
import { host, showError , showSuccess } from "../components/Alert-box/Alert";
import { Eye, EyeOff, User, Mail, Lock, Phone, Users, Wine, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export let Registrationpage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [touched, setTouched] = useState({});
    const navigate = useNavigate();

    // Validation functions
    const validateName = (name) => {
        if (!name.trim()) return { valid: false, message: 'Name is required' };
        if (name.trim().length < 2) return { valid: false, message: 'Name must be at least 2 characters' };
        if (/\d/.test(name)) return { valid: false, message: 'Name cannot contain numbers' };
        if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) return { valid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
        return { valid: true, message: '' };
    };

    const validatePhoneNumber = (phone) => {
        if (!phone) return { valid: false, message: 'Phone number is required' };
        const numericOnly = phone.replace(/\D/g, '');
        if (numericOnly.length !== 10) return { valid: false, message: 'Phone number must be exactly 10 digits' };
        return { valid: true, message: '' };
    };

    const validateEmail = (email) => {
        if (!email) return { valid: false, message: 'Email is required' };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { valid: false, message: 'Please enter a valid email address' };
        }
        const parts = email.split('@');
        if (parts.length !== 2) return { valid: false, message: 'Invalid email format' };
        const domain = parts[1];
        if (!domain.includes('.') || domain.split('.')[domain.split('.').length - 1].length < 2) {
            return { valid: false, message: 'Email must have a valid domain (e.g., .com, .org)' };
        }
        return { valid: true, message: '' };
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        if (strength <= 2) return { strength, label: 'Weak', color: '#dc143c' };
        if (strength <= 4) return { strength, label: 'Medium', color: '#ffa500' };
        return { strength, label: 'Strong', color: '#00ff00' };
    };

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

    // Get validation states
    const nameValidation = touched.name ? validateName(name) : { valid: null, message: '' };
    const emailValidation = touched.email ? validateEmail(email) : { valid: null, message: '' };
    const phoneValidation = touched.phonenumber ? validatePhoneNumber(phonenumber) : { valid: null, message: '' };
    const passwordValidation = touched.password ? validatePassword(password) : { valid: null, message: '' };
    const confirmPasswordValidation = touched.confirmPassword ? validateConfirmPassword(confirmPassword, password) : { valid: null, message: '' };
    const passwordStrength = getPasswordStrength(password);

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        const numericValue = value.replace(/\D/g, '');
        if (numericValue.length <= 10) {
            setPhonenumber(numericValue);
        }
        setTouched(prev => ({ ...prev, phonenumber: true }));
    };

    const handleFieldBlur = (fieldName) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Mark all fields as touched
        setTouched({
            name: true,
            email: true,
            phonenumber: true,
            password: true,
            confirmPassword: true,
            gender: true
        });

        // Validate all fields
        const nameVal = validateName(name);
        const emailVal = validateEmail(email);
        const phoneVal = validatePhoneNumber(phonenumber);
        const passwordVal = validatePassword(password);
        const confirmPasswordVal = validateConfirmPassword(confirmPassword, password);

        if (!nameVal.valid || !emailVal.valid || !phoneVal.valid || !passwordVal.valid || !confirmPasswordVal.valid || !gender) {
            if (!gender) {
                showError('Please select your gender');
            } else if (!nameVal.valid) {
                showError(nameVal.message);
            } else if (!emailVal.valid) {
                showError(emailVal.message);
            } else if (!phoneVal.valid) {
                showError(phoneVal.message);
            } else if (!passwordVal.valid) {
                showError(passwordVal.message);
            } else if (!confirmPasswordVal.valid) {
                showError(confirmPasswordVal.message);
            }
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
                                    <div className={`input-wrapper ${nameValidation.valid === true ? 'valid' : nameValidation.valid === false ? 'invalid' : ''}`}>
                                        <User className="input-icon" size={20} />
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="Enter your full name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            onBlur={() => handleFieldBlur('name')}
                                            required
                                            disabled={isLoading}
                                        />
                                        {nameValidation.valid === true && <CheckCircle2 className="validation-icon valid-icon" size={18} />}
                                        {nameValidation.valid === false && <XCircle className="validation-icon invalid-icon" size={18} />}
                                    </div>
                                    {nameValidation.valid === false && (
                                        <span className="error-message" role="alert">{nameValidation.message}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <div className={`input-wrapper ${emailValidation.valid === true ? 'valid' : emailValidation.valid === false ? 'invalid' : ''}`}>
                                        <Mail className="input-icon" size={20} />
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onBlur={() => handleFieldBlur('email')}
                                            required
                                            disabled={isLoading}
                                        />
                                        {emailValidation.valid === true && <CheckCircle2 className="validation-icon valid-icon" size={18} />}
                                        {emailValidation.valid === false && <XCircle className="validation-icon invalid-icon" size={18} />}
                                    </div>
                                    {emailValidation.valid === false && (
                                        <span className="error-message" role="alert">{emailValidation.message}</span>
                                    )}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <div className={`input-wrapper ${phoneValidation.valid === true ? 'valid' : phoneValidation.valid === false ? 'invalid' : ''}`}>
                                        <Phone className="input-icon" size={20} />
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phonenumber"
                                            placeholder="Enter 10-digit phone number"
                                            value={phonenumber}
                                            onChange={handlePhoneChange}
                                            onBlur={() => handleFieldBlur('phonenumber')}
                                            maxLength={10}
                                            required
                                            disabled={isLoading}
                                        />
                                         {phoneValidation.valid === true && <CheckCircle2 className="validation-icon valid-icon" size={18} />}
                                        {phoneValidation.valid === false && <XCircle className="validation-icon invalid-icon" size={18} />}
                                        {phonenumber && (
                                            <span className="char-counter">{phonenumber.length}/10</span>
                                        )}
                                    </div>
                                    {phoneValidation.valid === false && (
                                        <span className="error-message" role="alert">{phoneValidation.message}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="gender">Gender</label>
                                    <div className={`input-wrapper ${touched.gender && !gender ? 'invalid' : gender ? 'valid' : ''}`}>
                                        <Users className="input-icon" size={20} />
                                        <select
                                            id="gender"
                                            name="gender"
                                            value={gender}
                                            onChange={(e) => {
                                                setGender(e.target.value);
                                                setTouched(prev => ({ ...prev, gender: true }));
                                            }}
                                            onBlur={() => handleFieldBlur('gender')}
                                            required
                                            disabled={isLoading}
                                        >
                                            <option value="" disabled>Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                        {gender && <CheckCircle2 className="validation-icon valid-icon" size={18} />}
                                        {touched.gender && !gender && <XCircle className="validation-icon invalid-icon" size={18} />}
                                    </div>
                                    {touched.gender && !gender && (
                                        <span className="error-message" role="alert">Please select your gender</span>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className={`input-wrapper ${passwordValidation.valid === true ? 'valid' : passwordValidation.valid === false ? 'invalid' : ''}`}>
                                    <Lock className="input-icon" size={20} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setTouched(prev => ({ ...prev, password: true }));
                                        }}
                                        onBlur={() => handleFieldBlur('password')}
                                        required
                                        disabled={isLoading}
                                    />
                                    {passwordValidation.valid === true && <CheckCircle2 className="validation-icon valid-icon" size={18} />}
                                    {passwordValidation.valid === false && <XCircle className="validation-icon invalid-icon" size={18} />}
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex="-1"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {password && (
                                    <div className="password-strength">
                                        <div className="strength-bar">
                                            <div 
                                                className="strength-fill" 
                                                style={{ 
                                                    width: `${(passwordStrength.strength / 6) * 100}%`,
                                                    backgroundColor: passwordStrength.color
                                                }}
                                            ></div>
                                        </div>
                                        <span className="strength-label" style={{ color: passwordStrength.color }}>
                                            {passwordStrength.label || 'Enter password'}
                                        </span>
                                    </div>
                                )}
                                {passwordValidation.valid === false && (
                                    <span className="error-message" role="alert">{passwordValidation.message}</span>
                                )}
                                {password && passwordValidation.valid !== false && (
                                    <div className="password-requirements">
                                        <div className={`req-item ${password.length >= 8 ? 'met' : ''}`}>
                                            <CheckCircle2 size={14} />
                                            <span>At least 8 characters</span>
                                        </div>
                                        <div className={`req-item ${/[A-Z]/.test(password) ? 'met' : ''}`}>
                                            <CheckCircle2 size={14} />
                                            <span>One uppercase letter</span>
                                        </div>
                                        <div className={`req-item ${/[a-z]/.test(password) ? 'met' : ''}`}>
                                            <CheckCircle2 size={14} />
                                            <span>One lowercase letter</span>
                                        </div>
                                        <div className={`req-item ${/\d/.test(password) ? 'met' : ''}`}>
                                            <CheckCircle2 size={14} />
                                            <span>One number</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className={`input-wrapper ${confirmPasswordValidation.valid === true ? 'valid' : confirmPasswordValidation.valid === false ? 'invalid' : ''}`}>
                                    <Lock className="input-icon" size={20} />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            setTouched(prev => ({ ...prev, confirmPassword: true }));
                                        }}
                                        onBlur={() => handleFieldBlur('confirmPassword')}
                                        required
                                        disabled={isLoading}
                                    />
                                    {confirmPasswordValidation.valid === true && <CheckCircle2 className="validation-icon valid-icon" size={18} />}
                                    {confirmPasswordValidation.valid === false && <XCircle className="validation-icon invalid-icon" size={18} />}
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        tabIndex="-1"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {confirmPasswordValidation.valid === false && (
                                    <span className="error-message" role="alert">{confirmPasswordValidation.message}</span>
                                )}
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