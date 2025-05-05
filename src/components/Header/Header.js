
import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from './logoNNcircle.png';
import './Header.css';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../utils/axiosInstance';
import useNotificationsSocket from '../hooks/useNotificationsSocket';
import TokenManager from '../../utils/auth';


function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const [notificationCount, setNotificationCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const notificationRef = useRef(null);
    const userId = TokenManager.getUserIdFromToken();
    const [latestPopupNotif, setLatestPopupNotif] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
    const [profileFallbackName, setProfileFallbackName] = useState('');
    
    useNotificationsSocket({
      userId: userId,
      onNotification: (newNotif) => {
        setNotifications((prev) => [newNotif, ...prev]);
        setNotificationCount((prev) => prev + 1);
        
        setLatestPopupNotif(newNotif);  // 👈 trigger popup
    
        // Hide it after 5 seconds
        setTimeout(() => {
          setLatestPopupNotif(null);
        }, 5000);
      }
    });
    


    useEffect(() => {
        const firstName = localStorage.getItem('first_name');
        const lastName = localStorage.getItem('last_name');
        if (firstName && lastName && setUser) {
            setUser({ firstName, lastName });
        }
    }, [setUser]);
    // useEffect(() => {
    //   const fetchProfilePicture = async () => {
    //     try {
    //       const token = localStorage.getItem('access_token');
    //       const response = await axiosInstance.get(
    //         `${API_BASE_URL}/api/user/get_profile_picture`,
    //         {
    //           headers: {
    //             Authorization: `Bearer ${token}`,
    //           },
    //           responseType: 'blob',
    //         }
    //       );
    //       const imageUrl = URL.createObjectURL(response.data);
    //       setProfilePic(imageUrl);
    //     } catch (error) {
    //       console.error("Error fetching profile picture:", error);
    //     }
    //   };
    
    //   fetchProfilePicture();
    // }, []);
    useEffect(() => {
      const fetchProfilePicture = async () => {
        try {
          const token = localStorage.getItem('access_token');
          const decoded = JSON.parse(atob(token.split('.')[1]));
          setProfileFallbackName(`${decoded.firstName || ''} ${decoded.lastName || ''}`.trim());
    
          const response = await axiosInstance.get(
            `${API_BASE_URL}/api/user/get_profile_picture`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              responseType: 'blob',
            }
          );
          const imageUrl = URL.createObjectURL(response.data);
          setProfilePic(imageUrl);
        } catch (error) {
          console.error("Error fetching profile picture:", error);
        }
      };
    
      fetchProfilePicture();
    }, []);
    
    
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (notificationRef.current && !notificationRef.current.contains(event.target)) {
            setShowNotifications(false);
          }
        };
      
        const handleEscKey = (event) => {
          if (event.key === 'Escape') {
            setShowNotifications(false);
          }
        };
      
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscKey);
      
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          document.removeEventListener('keydown', handleEscKey);
        };
      }, []);
      

    // useEffect(() => {
    //     console.log('✅ useEffect255 triggered: courseId')

    //     const fetchNotifications = async () => {
    //         try {
    //             const token = localStorage.getItem('access_token');
    //             if (!token) return;
    
    //             const response = await axiosInstance.get(`${API_BASE_URL}/api/course/get_unapproved_notification_list`, {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 }
    //             });
    
    //             const parsed = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    //             console.log("📦 Parsed response:", parsed);

    //             if (parsed.success && Array.isArray(parsed.notifications)) {
    //                 console.log("🔔 Notification count from server:", parsed.notifications.length);

    //                 setNotificationCount(parsed.notifications.length);
    //             }
    //             else{
    //                 console.log("🔔 Notification ero:");

    //             }
    //         } catch (error) {
    //             console.error("Error fetching notifications:", error);
    //         }
    //     };
    
    //     fetchNotifications();
    // }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
          try {
            const token = localStorage.getItem('access_token');
            if (!token) return;
      
            const response = await axiosInstance.get(`${API_BASE_URL}/api/course/get_unapproved_notification_list`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
      
            const parsed = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      
            if (parsed.success && Array.isArray(parsed.notifications)) {
              setNotificationCount(parsed.notifications.length);
              setNotifications(parsed.notifications); // 👈 save them
            }
          } catch (error) {
            console.error("Error fetching notifications:", error);
          }
        };
      
        fetchNotifications();
      }, []);
      
    
      const navigateToDiscussion = async (notif) => {
        try {
          await markAsSeen(notif);  // First mark it as seen
          window.location.href = `${notif.link}?scrollToFollow=true`;
        } catch (error) {
          console.error("Failed to navigate to discussion:", error);
        }
      };

      const navigateToCourse = async (notif) => {
        try {
          window.location.href = notif.link; // No query string
        } catch (error) {
          console.error("Failed to navigate to course:", error);
        }
      };
      
      
      
      const markAsSeen = async (notif) => {
        try {
            console.log("Sending mark_as_seen for:", notif);

          const response = await axiosInstance.post(
            `${API_BASE_URL}/api/course/mark_as_seen`,
            {
              notification_id: notif.notification_id,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              },
            }
          );
      
          if (response.data.success) {
            // ✅ Only update the UI if backend confirms success
            setNotifications((prev) =>
              prev.filter((n) => n.notification_id !== notif.notification_id)
            );
            setNotificationCount((prev) => prev - 1);
          } else {
            console.error("Backend failed to mark notification as seen:", response.data.message);
          }
        } catch (error) {
          console.error("Failed to mark as seen:", error);
        }
      };
      
      
    const handleLogoutClick = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert('You are not logged in.');
                navigate('/');
                return;
            }

            const response = await axiosInstance.post(`${API_BASE_URL}/api/logout`,
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
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('You are not logged in.');
            navigate('/');
            return;
        }
        navigate('/home');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const addAuthHeaders = (headers = {}) => {
      const token = localStorage.getItem('access_token');  // הוצאת ה-token מ-localStorage
      if (token) {
          headers['Authorization'] = `Bearer ${token}`;  // הוספת ה-token להדר Authorization
      }
      return headers;
  };
  const approve_system_manager_appoint = async (notif) => {
    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}/api/user/approve_system_manager_appoint`,
        { notification_id: notif.notification_id },  // ✅ fix to match actual field
        { headers: addAuthHeaders() }
      );
  
      if (response.data.success) {
        alert("האישור נקלט בהצלחה");
  
        // ✅ Remove notification from list and update count
        setNotifications((prev) =>
          prev.filter((n) => n.notification_id !== notif.notification_id)
        );
        setNotificationCount((prev) => prev - 1);
      } else {
        alert(`שגיאה: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error approving system manager:", error);
      alert("שגיאה באישור המינוי");
    }
  };
  
    
    const disapprove_system_manager_appoint = async (notif) => {
      try {
        console.log("Sending notification_id:", notif.notification_id);
    
        const response = await axiosInstance.post(
          `${API_BASE_URL}/api/user/disapprove_system_manager_appoint`,
          { notification_id: notif.notification_id },
          { headers: addAuthHeaders() }
        );
    
        if (response.data.success) {
          alert("הסירוב נקלט בהצלחה");
    
          // ✅ Remove notification from the list
          setNotifications((prev) =>
            prev.filter((n) => n.notification_id !== notif.notification_id)
          );
          setNotificationCount((prev) => prev - 1);
        } else {
          alert(`שגיאה: ${response.data.message}`);
        }
      } catch (error) {
        console.error("Error disapproving system manager:", error);
        alert("שגיאה בסירוב המינוי");
      }
    };
    const approve_course_manager_appoint = async (notif) => {
      try {
        const response = await axiosInstance.post(
          `${API_BASE_URL}/api/user/approve_course_manager_appoint`,
          { notification_id: notif.notification_id },  // ✅ fix to match actual field
          { headers: addAuthHeaders() }
        );
    
        if (response.data.success) {
          alert("האישור נקלט בהצלחה");
    
          // ✅ Remove notification from list and update count
          setNotifications((prev) =>
            prev.filter((n) => n.notification_id !== notif.notification_id)
          );
          setNotificationCount((prev) => prev - 1);
        } else {
          alert(`שגיאה: ${response.data.message}`);
        }
      } catch (error) {
        console.error("Error approving system manager:", error);
        alert("שגיאה באישור המינוי");
      }
    };
    
      
      const disapprove_course_manager_appoint = async (notif) => {
        try {
          console.log("Sending notification_id:", notif.notification_id);
      
          const response = await axiosInstance.post(
            `${API_BASE_URL}/api/user/disapprove_course_manager_appoint`,
            { notification_id: notif.notification_id },
            { headers: addAuthHeaders() }
          );
      
          if (response.data.success) {
            alert("הסירוב נקלט בהצלחה");
      
            // ✅ Remove notification from the list
            setNotifications((prev) =>
              prev.filter((n) => n.notification_id !== notif.notification_id)
            );
            setNotificationCount((prev) => prev - 1);
          } else {
            alert(`שגיאה: ${response.data.message}`);
          }
        } catch (error) {
          console.error("Error disapproving system manager:", error);
          alert("שגיאה בסירוב המינוי");
        }
      };
    

    return (
        <div className="header-page">
            <header className="header">
                <div className="logo-container" onClick={handleLogoClick}>
                    <img src={logo} alt="Logo" className="logo" />
                </div>
                <div className="icons-container">
                <div className="notification-wrapper">
  <button
    className="icon-button"
    aria-label="Notifications"
    onClick={() => setShowNotifications((prev) => !prev)}
  >
    <i className="fas fa-bell"></i>
    {notificationCount > 0 && (
      <span className="notification-indicator">
        {notificationCount > 99 ? '99+' : notificationCount}
      </span>
    )}
  </button>
  {latestPopupNotif && (
  <div className="floating-notification">
    <p>{latestPopupNotif.message}</p>
  </div>
)}

  {showNotifications && notifications.length > 0 && (
  <div className="notification-dropdown" ref={notificationRef}>
    {notifications.map((notif, index) => {
      const isDiscussionType =
        notif.type === "CommentToFollowing" ||
        notif.type === "CommentToComment" ||
        notif.type === "ReactToComment";

      if (notif.type === "AppointSystemManager")  {
        return (
          <div className="notification-item" key={index}>
            <p className="notif-message">{notif.message}</p>
            <p className="notif-timestamp">{notif.timestamp}</p>

            <div className="notif-buttons">
            <button
                className="notif-btn secondary"
                onClick={() => disapprove_system_manager_appoint(notif)}
              >
                סירוב
              </button>
              <button
                className="notif-btn"
                onClick={() => approve_system_manager_appoint(notif)}
              >
                אישור
              </button>
              
            </div>
          </div>
        );
      }
      if (notif.type === "AppointCourseManager")  {
        return (
          <div className="notification-item" key={index}>
            <p className="notif-message">{notif.message}</p>
            <p className="notif-timestamp">{notif.timestamp}</p>

            <div className="notif-buttons">
            <button
                className="notif-btn secondary"
                onClick={() => disapprove_course_manager_appoint(notif)}
              >
                סירוב
              </button>
              <button
                className="notif-btn"
                onClick={() => approve_course_manager_appoint(notif)}
              >
                אישור
              </button>
              <button className="notif-btn" onClick={() => navigateToCourse(notif)}>
                מעבר לקורס
              </button>
              
            </div>
          </div>
        );
      }

      if (isDiscussionType) {
        return (
          <div className="notification-item" key={index}>
            <p className="notif-message">{notif.message}</p>
            <p className="notif-timestamp">{notif.timestamp}</p>

            <div className="notif-buttons">
              <button className="notif-btn" onClick={() => navigateToDiscussion(notif)}>
                מעבר לדיון
              </button>
              <button className="notif-btn secondary" onClick={() => markAsSeen(notif)}>
                ראיתי
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="notification-item" key={index}>
          <p className="notif-message">{notif.message}</p>
          <p className="notif-timestamp">{notif.timestamp}</p>
  
          <div className="notif-buttons">
            <button className="notif-btn" onClick={() => markAsSeen(notif)}>
              ראיתי
            </button>
          </div>
        </div>
      );
    })}
  </div>
)}



</div>



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
                                <div className="dropdown-userinfo">
                                <span className="dropdown-username">
                                {user?.firstName && user?.lastName
                                  ? `${user.firstName} ${user.lastName}`
                                  : 'אורח'}
                                </span>
                                {profilePic ? (
  <img
    src={profilePic}
    alt="avatar"
    className="dropdown-profile-pic"
  />
) : (
  <div className="comment-avatar-fallback">
    {profileFallbackName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()}
  </div>
)}

                                </div>
                                <p
                                    className="dropdown-item"
                                    onClick={() => navigate('/settings')}
                                    role="menuitem"
                                >
                                    הגדרות פרופיל
                                </p>
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
                    <button className="icon-button" aria-label="Notifications" onClick={() => handleLogoClick()}>
                        <i className="fas fa-home"></i>
                    </button>
                </div>
            </header>
        </div>
    );
}

export default Header;