import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();  // יצירת אובייקט navigate

  // פונקציה שתתבצע כשילחצו על כפתור הרשמה
  const handleSignUpClick = () => {
    navigate('/signup');  // מנווט לעמוד ההרשמה
  };

  return (
    <div className="Login">
      <div className="background-logo">
        <div className="image-layer"></div> {/* שכבת התמונה */}
        <div className="content">
          <h1 className="welcome-title">ברוכים הבאים!</h1>

          {/* טופס התחברות */}
          <div className="login-container">
            <p className="instruction">:נא להזין פרטי משתמש</p>
            <form className="login-form">
              <div className="input-group">
                  <input type="email" id="email" placeholder="מייל אוניברסיטאי" required />
                  <input type="password" id="username" required placeholder="סיסמה"/>
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
