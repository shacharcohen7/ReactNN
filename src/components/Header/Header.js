// Header.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logoNNcircle.png';
import { useNavigate } from 'react-router-dom';
import './Header.css'; 

function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();  // יצירת אובייקט navigate

    useEffect(() => {
        // Retrieve user's first and last name from localStorage
        const firstName = localStorage.getItem('first_name');
        const lastName = localStorage.getItem('last_name');
        if (firstName && lastName) {
            setUserName(`${firstName} ${lastName}`);
        } else {
            setUserName('אורח'); // Fallback if user data is not available
        }
    }, []);

    const handleLogoutClick = async () => {
        try {
            const email = localStorage.getItem('email');
            if (!email) {
                throw new Error('User email not found in localStorage');
            }
    
            // Log the payload being sent
            console.log('Logout request payload:', { email });
    
            // Call the backend logout endpoint
            const response = await axios.post('http://localhost:5001/api/logout', { email });
            console.log('Logout response:', response);
    
            if (response.data.success) {
                localStorage.removeItem('email');
                localStorage.removeItem('token'); // If token is used
                navigate('/login');
            } else {
                alert(response.data.message || 'Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error.response || error.message);
            alert('Failed to log out. Please try again.');
        }
    };

    // ניווט לדף הבית כאשר לוחצים על הלוגו
    const handleLogoClick = () => {
        navigate('/home');
    };
    


    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="header-page">
        <header className="header">
        <div className="logo-container" onClick={handleLogoClick}>
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
                                <p className="dropdown-username">{userName}</p>
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
