import React from 'react';
import './SignUp.css';

function SignUp() {
  return (
    <div className="SignUp">
      <div className="background-logo">
        <div className="image-layer"></div> {/* שכבת התמונה */}
        <div className="content">
          <h1 className="signup-title">הרשמה</h1>

          {/* טופס התחברות */}
          <div className="signup-container">
            <p className="instruction">:נא להזין את הפרטים הבאים</p>
            <form className="signup-form">
                <div className="input-group">
                    <input type="text" id="firstName" placeholder="שם פרטי" required />
                    <input type="text" id="lastName" placeholder="שם משפחה" required />
                    <input type="email" id="email" placeholder="מייל אוניברסיטאי" required />
                    <input type="password" id="password" required placeholder="סיסמה" />
                </div>
                <div className="confirm_line">
                    <label htmlFor="terms">
                        <input type="checkbox" id="terms" required />אני מאשר/ת את תקנון האתר
                    </label>
                    <button type="button" className="signup-link">תקנון</button> {/* או להשתמש בלינק */}
                </div>
                <button type="submit" className="signup-button">הרשמה</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
