import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUpDetails.css';
import axios from 'axios'; // Import Axios for HTTP requests

function SignUpDetails() {
    // State to hold form data
    const navigate = useNavigate();  // יצירת אובייקט navigate

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);  // State to manage submission status
    const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);


    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,  // Handle checkbox
        });
    };

    // Handle form submission and make HTTP POST request
    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);  // Disable the submit button during the submission process

        try {


            const response = await axios.post('http://localhost:5001/api/register', {
                email: formData.email,
                password: formData.password,
                first_name: formData.firstName,
                last_name: formData.lastName,
            });

            localStorage.setItem('email', formData.email);
            localStorage.setItem('password', formData.password);
            localStorage.setItem('first_name', formData.firstName);
            localStorage.setItem('last_name', formData.lastName);



            setMessage('ההרשמה בוצעה בהצלחה!');  // Success message
            console.log(response.data);  // You can log the response if needed
            navigate('/signupcode');
        } catch (error) {
            setMessage(error.response?.data?.message || 'ההרשמה נכשלה. בדוק את הפרטים שלך.');
        }

        setIsSubmitting(false);  // Re-enable the submit button after the process is done
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
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="שם פרטי"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="שם משפחה"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
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
                                        type="password"
                                        name="password"
                                        placeholder="סיסמה"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onMouseEnter={() => setShowPasswordTooltip(true)}
                                        onMouseLeave={() => setShowPasswordTooltip(false)}
                                        required
                                    />
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
