import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './UserSetting.css';
import axiosInstance from '../../utils/axiosInstance';


function UserSetting() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [notificationSettings, setNotificationSettings] = useState(null);

  const [notifications, setNotifications] = useState({
    AppointSystemManager: true,
    AppointCourseManager: true,
    CommentToFollowing: true,
    CommentToComment: true,
    ReactToComment: true,
    RemoveCourseManager: true,
  });
  const notificationLabels = {
    AppointSystemManager: 'מינוי למנהל מערכת',
    AppointCourseManager: 'מינוי למנהל קורס',
    CommentToFollowing: 'תגובה לשאלה שאני עוקב/ת אחריה',
    CommentToComment: 'תגובה לתגובה שלי',
    ReactToComment: 'תגובה שלי קיבלה לייק',
    RemoveCourseManager: 'הסרת מנהל קורס',
  };
  

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({ ...prev, [name]: checked }));
  };

  const saveProfilePicture = () => {
    alert("📸 Profile picture saved (you can implement upload logic here)");
  };

  const saveName = () => {
    alert(`✅ Name saved: ${firstName} ${lastName}`);
  };

  const saveNotifications = async () => {
    try {
      const token = localStorage.getItem('access_token');
  
      const response = await axiosInstance.post(
        `${API_BASE_URL}/api/user/update_notification_settings`,
        notifications,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success) {
        alert("🔔 Notification settings saved!");
        fetchNotificationSettings();
      } else {
        alert("⚠️ Failed to save notification settings.");
      }
    } catch (error) {
      console.error("Error saving notification settings:", error);
      alert("⚠️ Error occurred while saving settings.");
    }
  };
  

  const fetchNotificationSettings = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axiosInstance.get(`${API_BASE_URL}/api/user/get_notification_settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const parsed = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
  
      if (parsed.success) {
        setNotifications(parsed.settings);
      }
    } catch (error) {
      console.error("Error fetching notification settings:", error);
    }
  };
  
  useEffect(() => {
    fetchNotificationSettings();
  }, []);
  

  return (
    <div className="page-container">
      <Header />

      <main className="main-content">
        <div className="settings-container">

          {/* Profile Picture Upload */}
          <div className="profile-picture-section">
            <img
              src={profilePic || '/default-avatar.png'}
              alt="Profile"
              className="profile-picture"
            />
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button onClick={saveProfilePicture}>שמור תמונה</button>
          </div>

          {/* Name Fields */}
          <div className="name-section">
            <label>
              שם פרטי:
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>

            <label>
              שם משפחה:
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>

            <button onClick={saveName}>שמור שם</button>
          </div>

          {/* Notification Settings */}
          <div className="notifications-section">
            <h2>הגדרות התראות</h2>
            <h5>אני מעוניי/ת לקבל התראות במייל על:</h5>

            {Object.entries(notifications).map(([key, value]) => (
            <label key={key} className="notification-option">
                <input
                type="checkbox"
                name={key}
                checked={value}
                onChange={handleCheckboxChange}
                />
                {notificationLabels[key] || key}
            </label>
            ))}


            <button onClick={saveNotifications}>שמור הגדרות התראות</button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default UserSetting;
