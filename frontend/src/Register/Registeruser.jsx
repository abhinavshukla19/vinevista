import "./Registeruser.css"; 
import { useState } from 'react';
import { showError, showSuccess } from '../utils/toast.jsx';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import { FiUser, FiMail, FiLock, FiPhone, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom'; 
import { host } from "../utils/toast.jsx";
import axios from 'axios';

export let Registrationpage = () => {
    const [showpassword, setshowpassword] = useState(false);
    const [password, setpassword] = useState("");
    const [name, setname] = useState("");
    const [gender, setgender] = useState("");
    const [phonenumber, setphonenumber] = useState("");
    const [email, setemail] = useState("");
    

    const Handlesubmit = async (e) => {
        e.preventDefault();
        if (name.trim() === "" || password.trim() === "" || email.trim() === "" || phonenumber.trim() === "" || gender === "") {
            showError('All fields are required');
            return;
        }
        try {
            const res = await axios.post(`${host}/register`, {
                email, password, phonenumber, gender, name
            });
            showSuccess(res.data.message);
        } catch (error) {
            if (error.response) {
                console.error("Backend Error:", error.response.data.message);
                showError(error.response.data.message);
            } else {
                console.error("Network or other error:", error.message);
                showError("Registration failed. Please try again.");
            }
        }
    };

    return (
        <div className="login-page-container">
            <div className="login-form-wrapper">
                <div className="login-header">
                    <h2>Create Account</h2>
                    <p>Start your journey with us today</p>
                </div>
                <form onSubmit={Handlesubmit} className="login-form">
                    <div className="input-group">
                        <FiUser className="input-icon" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => { setname(e.target.value) }}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <FiMail className="input-icon" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => { setemail(e.target.value) }}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <FiLock className="input-icon" />
                        <input
                            type={showpassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => { setpassword(e.target.value) }}
                            required
                        />
                        <div className="password-toggle-icon" onClick={() => setshowpassword(!showpassword)}>
                            {showpassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                        </div>
                    </div>
                    <div className="input-group">
                        <FiPhone className="input-icon" />
                        <input
                            type="tel"
                            name="phonenumber"
                            placeholder="Phone Number"
                            value={phonenumber}
                            onChange={(e) => { setphonenumber(e.target.value) }}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <FiUsers className="input-icon" />
                        <select
                            name="gender"
                            value={gender}
                            onChange={(e) => { setgender(e.target.value) }}
                            required
                        >
                            <option value="" disabled>Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <button type="submit" className="login-button">Register</button>
                </form>
                <div className="signup-link">
                    <p>Already have an account? <Link to="/signin">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
}