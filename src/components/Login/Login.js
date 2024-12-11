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
    // e.preventDefault();

    // try {
    //   const response = await axios.post('http://localhost:5000/api/login', {
    //     email: formData.email,
    //     password: formData.password,
    //   });

    //   setMessage('התחברות בוצעה בהצלחה!'); // Success message
    //   console.log(response.data); // Log response for debugging
    //   navigate('/home');  // מנווט לעמוד ההרשמה
    // } catch (error) {
    //   setMessage(error.response?.data?.message || 'התחברות נכשלה. בדוק את הפרטים שלך.');
    // }
    navigate('/home');
  };

  return (
    <div className="Login">
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
                <button type="submit" className="login-button">התחברות</button>
              </form>

            <div className="bottom_line">
              <p className="new-user-text">חדש אצלנו?</p>
              <button type="link" className="sign-up-link" onClick={handleSignUpClick}>הרשמה</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
