import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const navigate = useNavigate();
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');

        try {
            const response = await axiosInstance.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });

            if (response.data.success) {
                setMessage(response.data.message || 'מייל אימות נשלח לאימייל שסיפקת.');
                setShowCodeInput(true); // 👈 Show code input on success
            } else {
                setMessage(response.data.message || 'כתובת אימייל לא נמצאה במערכת.');
            }
        } catch (error) {
            const backendMessage = error?.response?.data?.message;
            setMessage(backendMessage || 'שגיאה בשליחת הבקשה. נסו שוב מאוחר יותר.');
            console.error('Forgot password error:', error);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post(`${API_BASE_URL}/api/auth/verify-reset-code`, {
                email,
                code: verificationCode
            });

            if (response.data.success && response.data.token) {
                // Navigate to password reset page with token
                navigate(`/reset-password?token=${response.data.token}&email=${encodeURIComponent(email)}`);

            } else {
                setMessage(response.data.message || 'קוד אימות שגוי');
            }
        } catch (error) {
            const backendMessage = error?.response?.data?.message;
            setMessage(backendMessage || 'שגיאה באימות הקוד.');
            console.error('Code verification error:', error);
        }
    };

    return (
        <div className="forgot-password-container">
            <h2>שכחתי סיסמה</h2>
            <p>אנא מלאו את האימייל איתו נרשמתם למערכת, מייל אימות ישלח לאימייל זה.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="הכנס כתובת אימייל"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">שליחה</button>
            </form>

            {showCodeInput && (
                <form onSubmit={handleVerifyCode} className="verify-code-form">
                    <p>הכנס את קוד האימות שקיבלת במייל:</p>
                    <input
                        type="text"
                        maxLength={6}
                        placeholder="קוד אימות"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                    />
                    <button type="submit">אמת קוד</button>
                </form>
            )}

            {message && <p className="response-message">{message}</p>}
            <button className="back-button" onClick={() => navigate('/login')}>חזור</button>
        </div>
    );
};

export default ForgotPassword;
