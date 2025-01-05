
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from './logoNNcircle.png';
import './Header.css';
import { UserContext } from '../../context/UserContext';

function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const firstName = localStorage.getItem('first_name');
        const lastName = localStorage.getItem('last_name');
        if (firstName && lastName && setUser) {
            setUser({ firstName, lastName });
        }
    }, [setUser]);

    const handleLogoutClick = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert('You are not logged in.');
                return;
            }

            const response = await axios.post('http://localhost:5001/api/logout',
                {},  // לא נדרש לשלוח גוף אם הטוקן בכותרת
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,  // שליחת הטוקן בכותרת
                        'Content-Type': 'application/json',  // הגדרת סוג תוכן כ-JSON
                    }
                }
            );

            if (response.data.success) {
                localStorage.clear();
                setUser({ firstName: '', lastName: '' });
                navigate('/login');
            } else {
                alert(response.data.message || 'Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error.response || error.message);
            alert('Failed to log out. Please try again.');
        }
    };

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
                    <button className="icon-button" aria-label="Notifications">
                        <i className="fas fa-bell"></i>
                    </button>
                    <div className="dropdown">
                        <button
                            className="icon-button"
                            onClick={toggleDropdown}
                            aria-expanded={isDropdownOpen}
                            aria-haspopup="true"
                            aria-label="User Menu"
                        >
                            <i className="fas fa-user"></i>
                        </button>
                        {isDropdownOpen && (
                            <div className="dropdown-menu" role="menu">
                                <p className="dropdown-username">
                                    {user?.firstName && user?.lastName
                                        ? `${user.firstName} ${user.lastName}`
                                        : 'אורח'}
                                </p>
                                <p className="dropdown-item">הפרופיל שלי</p>
                                <p
                                    className="dropdown-item"
                                    onClick={handleLogoutClick}
                                    role="menuitem"
                                >
                                    התנתקות
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </div>
    );
}

export default Header;