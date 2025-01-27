import { FaEye, FaEyeSlash } from 'react-icons/fa'; // עין פתוחה וסגורה


import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUpDetails.css';
//import axios from 'axios'; // Import Axios for HTTP requests
import { UserContext } from '../../../context/UserContext'; // Import UserContext
import axiosInstance from '../../../utils/axiosInstance';


function SignUpDetails() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext); // Access setUser from UserContext
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    

    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPasswordTooltip] = useState(false);
    const [showFirstNameTooltip, setShowFirstNameTooltip] = useState(false);
    const [showLastNameTooltip, setShowLastNameTooltip] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [showPasswordRules, setShowPasswordRules] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        

        try {
            const response = await axiosInstance.post(`${API_BASE_URL}/api/register`, {
                email: formData.email,
                password: formData.password,
                password_confirm: formData.confirmPassword,
                first_name: formData.firstName,
                last_name: formData.lastName,
            });

            if (response.data.success) {
                const { firstName, lastName, email } = formData;
                const returnedPassword = response.data.password; // Extract password from response



                // Debug log to verify data being saved
                console.log('Saving to localStorage:', { firstName, lastName, email });

                // Update localStorage
                localStorage.setItem('email', email);
                localStorage.setItem('first_name', firstName);
                localStorage.setItem('last_name', lastName);
                localStorage.setItem("password", returnedPassword);


                // Update UserContext
                setUser({ firstName, lastName });

                setMessage('ההרשמה בוצעה בהצלחה!');
                navigate('/signupcode');
            } else {
                setMessage(response.data.message || 'הרשמה נכשלה. בדוק את הפרטים שלך.');
            }
        } catch (error) {
            console.error('Registration error:', error.response || error.message);
            setMessage(error.response?.data?.message || 'שגיאה במהלך ההרשמה.');
        }

        setIsSubmitting(false);
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    return (
        <div className="welcome-page">
            <div className="background-logo">
                <div className="image-layer"></div>
                <div className="content">
                    <h1 className="welcome-title">הרשמה</h1>
                    <div className="login-container">
                        <p className="instruction">נא להזין את הפרטים הבאים:</p>
                        <form className="login-form" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <div className="input-container">
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="שם פרטי"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        onMouseEnter={() => setShowFirstNameTooltip(true)}
                                        onMouseLeave={() => setShowFirstNameTooltip(false)}
                                        required
                                    />
                                    {showFirstNameTooltip && (
                                        <div className="tooltip">עברית בלבד</div>
                                    )}
                                </div>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="שם משפחה"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        onMouseEnter={() => setShowLastNameTooltip(true)}
                                        onMouseLeave={() => setShowLastNameTooltip(false)}
                                        required
                                    />
                                    {showLastNameTooltip && (
                                        <div className="tooltip">עברית בלבד</div>
                                    )}
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="מייל אוניברסיטאי"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                               <div className="password-input-container">
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    name="password"
                                    placeholder="סיסמה"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setShowPasswordRules(true)}
                                    onBlur={() => setShowPasswordRules(false)}
                                    required
                                />
                                <button

                                    type="button"
                                    className="eye-button"
                                    onClick={togglePasswordVisibility}
                                    aria-label={passwordVisible ? "Hide password" : "Show password"}
                                >
                                {passwordVisible ? <FaEyeSlash /> : <FaEye />} {/* שינוי עין פתוחה/סגורה */}
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
                            <div className="password-input-container" style={{ position: 'relative' }}>
                            <input
                                type={confirmPasswordVisible ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="אימות סיסמה"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required

                            />
                            <button
                                type="button"
                                className="eye-button"
                                onClick={toggleConfirmPasswordVisibility}
                                aria-label={passwordVisible ? "Hide password" : "Show password"}
                            >
                                {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                                {showPasswordRules && (
                                    <div className="password-rules">
                                        <p>דרישות הסיסמה:</p>
                                        <ul>
                                            <li className={formData.password.length >= 8 && formData.password.length <= 20 ? 'valid' : 'invalid'}>
                                                לפחות 8 תווים ולא יותר מ-20 תווים המכילים:
                                            </li>
                                            <li className={/^[A-Za-z\d!@$%^&*()[\]{}+]+$/.test(formData.password) ? 'valid' : 'invalid'}>
                                                יש לכלול אותיות רק באנגלית
                                            </li>
                                            <li className={/[A-Z]/.test(formData.password) ? 'valid' : 'invalid'}>
                                                -אות גדולה אחת לפחות באנגלית
                                            </li>
                                            <li className={/[a-z]/.test(formData.password) ? 'valid' : 'invalid'}>
                                                -אות קטנה אחת לפחות באנגלית
                                            </li>
                                            <li className={/\d/.test(formData.password) ? 'valid' : 'invalid'}>
                                                -ספרה אחת לפחות
                                            </li>
                                            <li className={/[!@$%^&*()[\]{}+]/.test(formData.password) ? 'valid' : 'invalid'}>
                                                -תו מיוחד אחד לפחות: <code>!@$%^&*()[]{}+</code>
                                            </li>

                                        </ul>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="submit-button"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'הטופס בשליחה' : 'הרשמה'}
                            </button>
                        </form>
                        {message && <p className="message">{message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUpDetails;
