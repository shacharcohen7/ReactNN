// Header.js
import React, { useState } from 'react';
import logo from './logoNNcircle.png';
import { useNavigate } from 'react-router-dom';
import './Header.css';  // אם יש CSS ייחודי להדר

function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();  // יצירת אובייקט navigate

    const handleLogoutClick = () => {
        navigate('/login');  // מנווט לעמוד ההתחברות
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="header-page">
        <header className="header">
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
                </div>
            <div className="icons-container">
                <button className="icon-button">
                    <i className="fas fa-bell"></i> {/* אייקון התראות */}
                </button>
                <div className="dropdown">
                    <button className="icon-button" onClick={toggleDropdown}>
                        <i className="fas fa-user"></i> {/* אייקון משתמש */}
                    </button>
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <p className="dropdown-username">שחר כהן</p>
                            <p className="dropdown-item">הפרופיל שלי</p>
                            <p className="dropdown-item" onClick={handleLogoutClick}>התנתקות</p>
                        </div>
                    )}
                </div>
            </div>
        </header>
    </div>
    );
}

export default Header;
