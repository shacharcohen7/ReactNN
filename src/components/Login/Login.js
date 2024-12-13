import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for HTTP requests
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  // State to hold form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  // פונקציה שתתבצע כשילחצו על כפתור הרשמה
  const handleSignUpClick = () => {
    navigate('/signupdetails');  // מנווט לעמוד ההרשמה
  };

  const [message, setMessage] = useState(''); // State for success or error messages

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission and make HTTP POST request
  
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
        // Send login data to the backend
        const response = await axios.post('http://localhost:5001/api/login', {
            email: formData.email,
            password: formData.password,
        });

        // Log response for debugging
        console.log('Login response:', response.data);

        if (response.data.success) {
            // Store user data (e.g., email, token) in localStorage
            localStorage.setItem('email', formData.email);
            localStorage.setItem('firstName', response.data.firstName);
            localStorage.setItem('lastName', response.data.lastName);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token); // If you use a token-based system
            }

            // Display success message
            setMessage('התחברות בוצעה בהצלחה!');

            // Redirect to the home page
            navigate('/home');
        } else {
            // Handle login failure
            setMessage(response.data.message || 'התחברות נכשלה. בדוק את הפרטים שלך.');
        }
    } catch (error) {
        // Log error for debugging
        console.error('Login error:', error.response || error.message);

        // Display error message
        setMessage(error.response?.data?.message || 'שגיאה במהלך ההתחברות.');
    }
};


return (
  <div className="welcome-page">
    <div className="background-logo">
      <div className="image-layer"></div> {/* שכבת התמונה */}
      <div className="content">
        <h1 className="welcome-title">ברוכים הבאים!</h1>
        {/* טופס התחברות */}
        <div className="login-container">
          <p className="instruction">נא להזין פרטי משתמש:</p>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
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
            <button type="submit" className="submit-button">
              התחברות
            </button>
          </form>
          {/* Display error or success message */}
          {message && <p className="message">{message}</p>}
          <div className="bottom_line">
            <p className="new-user-text">חדש אצלנו?</p>
            <button type="button" className="sign-up-link" onClick={handleSignUpClick}>
              הרשמה
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default Login;
