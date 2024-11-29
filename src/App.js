import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="background-logo">
        <div className="image-layer"></div> {/* שכבת התמונה */}
        <div className="content">
          <h1 className="welcome-title">ברוכים הבאים!</h1>

          {/* טופס התחברות */}
          <div className="login-container">
            <p className="instruction">נא להזין שם משתמש וסיסמה אוניברסיטאיים</p>
            <form className="login-form">
              <div className="input-group">
                <label htmlFor="username">שם משתמש</label>
                <input type="text" id="username" placeholder="הזן שם משתמש" required />
              </div>
              <div className="input-group">
                <label htmlFor="password">סיסמה</label>
                <input type="password" id="password" placeholder="הזן סיסמה" required />
              </div>
              <button type="submit" className="login-button">התחברות</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
