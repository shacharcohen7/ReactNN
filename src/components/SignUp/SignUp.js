import React, { useState } from 'react';
import axios from 'axios';  // Import Axios for HTTP requests
import './SignUp.css';

function SignUp() {
    // State to hold form data



    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        termsAccepted: false,
    });

    const [message, setMessage] = useState('');

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
        if (!formData.termsAccepted) {
            setMessage('עליך לאשר את תקנון האתר');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/register', {
                email: formData.email,
                password: formData.password,
                first_name: formData.firstName,
                last_name: formData.lastName,
            })

            setMessage('ההרשמה בוצעה בהצלחה!');  // Success message
            console.log(response.data);  // You can log the response if needed
        } catch (error) {
            setMessage(error.response?.data?.message || 'ההרשמה נכשלה. בדוק את הפרטים שלך.');
        }
    };

    return (
        <div className="SignUp">
            <div className="background-logo">
                <div className="image-layer"></div> {/* Image layer */}
                <div className="content">
                    <h1 className="signup-title">הרשמה</h1>

                    {/* Registration form */}
                    <div className="signup-container">
                        <p className="instruction">:נא להזין את הפרטים הבאים</p>
                        <form className="signup-form" onSubmit={handleSubmit}>
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
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="סיסמה"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="confirm_line">
                                <label htmlFor="terms">
                                    <input
                                        type="checkbox"
                                        name="termsAccepted"
                                        checked={formData.termsAccepted}
                                        onChange={handleChange}
                                        required
                                    />
                                    אני מאשר/ת את תקנון האתר
                                </label>
                                <button type="button" className="signup-link">תקנון</button>
                            </div>
                            <button type="submit" className="signup-button">הרשמה</button>
                        </form>

                        {/* Display message based on submission success or failure */}
                        {message && <p className="message">{message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
