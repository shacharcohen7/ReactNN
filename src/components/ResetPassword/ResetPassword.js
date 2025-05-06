import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const email = searchParams.get('email'); // ✅ Get email from URL
    const [showLoginButton, setShowLoginButton] = useState(false);



    const [passwordVisible, setPasswordVisible] = useState(false);
    const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(prev => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setShowLoginButton(false);
    
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/auth/reset-new-password`,
                {
                    email,
                    password,
                    confirm_password: confirmPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
    
            console.log("✅ Full backend response:", response);
    
            if (response.data.status) {
                setMessage(response.data.message || 'הסיסמה אופסה בהצלחה!');
                setShowLoginButton(true);
            } else {
                setMessage(response.data.message || 'שגיאה באיפוס הסיסמה');
            }
    
        } catch (error) {
            const msg = error?.response?.data?.message;
            setMessage(msg || 'שגיאה בשרת. נסה שוב מאוחר יותר.');
            console.error("❌ Reset password error:", error);
        }
    };
    
    
    
    return (
        <div className="welcome-page">
            <div className="background-logo">
                <div className="image-layer"></div>
                <div className="content">
                    <h1 className="welcome-title">איפוס סיסמה</h1>
                    <div className="login-container">
                        <div className="input-group">
                            <form className="login-form" onSubmit={handleSubmit}>
                                <div className="password-input-container">
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        placeholder="סיסמה חדשה"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setShowPasswordTooltip(true)}
                                        onBlur={() => setShowPasswordTooltip(false)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="eye-button"
                                        onClick={togglePasswordVisibility}
                                        aria-label={passwordVisible ? "Hide password" : "Show password"}
                                    >
                                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                    {showPasswordTooltip && (
                                        <div className="password-tooltip">
                                            <p>דרישות הסיסמה:</p>
                                            <ul>
                                                <li>לפחות 8 תווים ולא יותר מ-20 תווים</li>
                                                <li>אות גדולה אחת לפחות באנגלית</li>
                                                <li>אות קטנה אחת לפחות באנגלית</li>
                                                <li>ספרה אחת לפחות</li>
                                                <li>תו מיוחד אחד לפחות: <code>!@$%^&*()[]{}+</code></li>
                                                <li>יש לכלול אותיות רק באנגלית</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                                <div className="password-input-container">
                                    <input
                                        type="password"
                                        placeholder="אימות סיסמה"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="submit-button">אפס סיסמה</button>
                            </form>
                        </div>
                        {message && (
                            <div className="response-message">
                                <p>{message}</p>
                                {showLoginButton && (
                                    <button
                                        className="to-login-button"
                                        onClick={() => navigate('/login')}
                                    >
                                        לעמוד ההתחברות
                                    </button>
                                )}
                            </div>
                        )}


                    </div>
                </div>
            </div>
        </div>
    );    
};

export default ResetPassword;
