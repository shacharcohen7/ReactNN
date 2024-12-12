import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignUpCode.css';
import axios from 'axios'; // Import Axios for HTTP requests

function SignUpCode() {
    // State to hold form data
    const navigate = useNavigate();  // יצירת אובייקט navigate

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
        // e.preventDefault();

        // try {
        //     const response = await axios.post('http://localhost:5000/api/register', {
        //         email: formData.email,
        //         password: formData.password,
        //         first_name: formData.firstName,
        //         last_name: formData.lastName,
        //     })

        //     setMessage('ההרשמה בוצעה בהצלחה!');  // Success message
        //     console.log(response.data);  // You can log the response if needed
        //     navigate('/signupterms');
        // } catch (error) {
        //     setMessage(error.response?.data?.message || 'ההרשמה נכשלה. בדוק את הפרטים שלך.');
        // }
        navigate('/signupterms');
    };

    return (
        <div className="welcome-page">
            <div className="background-logo">
                <div className="image-layer"></div> {/* Image layer */}
                <div className="content">
                    <h1 className="welcome-title">אימות דו-שלבי</h1>

                    {/* Registration form */}
                    <div className="login-container">
                        <p className="instruction">נא להזין את הקוד שקיבלת במייל:</p>
                        <form className="login-form" onSubmit={handleSubmit}>
                            <div className="code-input-group">
                                <input className="code-input-group input"
                                    type="text" 
                                    maxLength="4" 
                                    required 
                                />
                            </div>
                            <button type="submit" className="code-submit-button" onClick={handleSubmit}>אישור</button>
                        </form>
                        {/* Display message based on submission success or failure */}
                        {message && <p className="styles.message">{message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUpCode;
