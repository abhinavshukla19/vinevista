import "./signin.css";
import { useState } from 'react';
import { showError, showSuccess } from '../utils/toast.jsx';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { FiMail, FiLock } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import { host } from "../utils/toast.jsx";

export let Signinpage = () => {
    const [showpassword, setshowpassword] = useState(false);
    const [password, setpassword] = useState("");
    const [email, setemail] = useState("");
    const navigate = useNavigate();

    const Handlesubmit = async (e) => {
        e.preventDefault();
        if (password.trim() === "" || email.trim() === "") {
            showError('All fields are required');
            return;
        }
        try {
            const res = await axios.post(`${host}/signin`, { email, password });
            const data = res?.data;
            if (!data || data.success === false || !data.token) {
                showError(data?.message || 'Invalid email or password');
                return;
            }
            localStorage.setItem("token", data.token);
            showSuccess(data?.message || 'Login successful');
            navigate('/Dashboard');
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || 'Network error';
            showError(message);
        }
    };

    return (
        <div className='signin-main-container'>
            <div className="stars"></div>
            <div className="stars"></div>
            <div className="stars"></div>
            <div className="meteor"></div>
            <div className="meteor"></div>
            <div className="meteor"></div>
            
            {/* New "Glassmorphism" Form Wrapper */}
            <div className='signin-form-wrapper'>
                <div className='signin-header'>
                    <h2>Welcome Back</h2>
                    <p>Enter your credentials to access your account</p>
                </div>

                <form className='signin-form' onSubmit={Handlesubmit}>
                    <div className='input-group'>
                        <FiMail className="input-icon" />
                        <input
                            type='email'
                            id='email'
                            name='email'
                            value={email}
                            placeholder='Email'
                            onChange={(e) => { setemail(e.target.value) }}
                            required
                        />
                    </div>
                    <div className='input-group'>
                        <FiLock className="input-icon" />
                        <input
                            type={showpassword ? "text" : "password"}
                            id='password'
                            name='password'
                            value={password}
                            placeholder='Password'
                            onChange={(e) => { setpassword(e.target.value) }}
                            required
                        />
                        <div className="password-toggle-icon" onClick={() => setshowpassword(!showpassword)}>
                            {showpassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                        </div>
                    </div>
                    <div className="signin-options">
                        <label>
                            <input type="checkbox" />
                            Remember me
                        </label>
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>
                    <button type='submit' className="signin-button">Sign In</button>
                </form>

                <div className="signup-link">
                    <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
                </div>
            </div>
        </div>
    );
}