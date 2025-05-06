import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './UserSetting.css';
import axiosInstance from '../../utils/axiosInstance';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

function UserSetting() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [notificationSettings, setNotificationSettings] = useState(null);
  const [nameError, setNameError] = useState('');
  const [nameSuccess, setNameSuccess] = useState('');
  const { setUser } = useContext(UserContext);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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
  

  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));  // 👈 preview URL
      setUploadError('');
    } else {
      setUploadError('יש לבחור קובץ תמונה בלבד.');
      setSelectedImage(null);
      setPreviewUrl(null);
    }
  };
  
  
  const saveProfilePicture = async () => {
    if (!selectedImage) {
      setUploadError('לא נבחרה תמונה.');
      return;
    }
  
    const formData = new FormData();
    formData.append('profile_picture', selectedImage);
  
    try {
      const token = localStorage.getItem('access_token');
      const response = await axiosInstance.post(
        `${API_BASE_URL}/api/user/upload_profile_picture`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
  
      if (response.data.success) {
        setUploadSuccess("✅ התמונה נשמרה בהצלחה.");
        setUploadError('');
      
        const savedPath = response.data.profile_picture_path;
      
        // Make sure the backend gave us a full URL or construct it:
        const fullImageUrl = `${API_BASE_URL}/${savedPath}`;
        setProfilePic(fullImageUrl);
        
        // Wait for next render to clear preview
        // setTimeout(() => setPreviewUrl(null), 500);
      
      
        // Optional: preview the uploaded image or update user context
      } else {
        setUploadError("שגיאה בהעלאת התמונה: " + response.data.message);
        setUploadSuccess('');
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("שגיאה בהעלאת התמונה. נסו שוב מאוחר יותר.");
      setUploadSuccess('');
    }
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({ ...prev, [name]: checked }));
  };

  

  const saveName = async () => {
    const hebrewRegex = /^[\u0590-\u05FF\s]+$/;
  
    if (!firstName.trim() || !lastName.trim()) {
      setNameError("נא למלא שם פרטי ושם משפחה.");
      setNameSuccess('');
      return;
    }
    if (firstName.length > 25 || lastName.length > 25) {
      setNameError("השם לא יכול להכיל יותר מ-25 תווים.");
      setNameSuccess('');
      return;
    }
  
    if (!hebrewRegex.test(firstName) || !hebrewRegex.test(lastName)) {
      setNameError("השם חייב להכיל אותיות בעברית בלבד.");
      setNameSuccess('');
      return;
    }
  
    // Clear any previous errors
    setNameError('');
    setNameSuccess('');
  
    try {
      const token = localStorage.getItem('access_token');
      const response = await axiosInstance.post(
        `${API_BASE_URL}/api/user/update_name`,
        {
          first_name: firstName,
          last_name: lastName,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
  
      if (response.data.success) {
        localStorage.setItem('first_name', firstName);
        localStorage.setItem('last_name', lastName);
        setUser({ firstName, lastName });  // ✅ immediately updates header
        setNameSuccess("✅ השם נשמר בהצלחה.");
      } else {
        setNameError("שגיאה בשמירת השם. נסו שוב.");
      }
    } catch (error) {
      console.error("Error saving name:", error);
      setNameError("שגיאה בשרת. נסו שוב מאוחר יותר.");
    }
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
  
  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axiosInstance.get(
          `${API_BASE_URL}/api/user/get_profile_picture`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: 'blob',  // ⬅️ important for image
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
  
  return (
    <div className="page-container">
      <Header />

      <main className="main-content">
        <div className="settings-container">

          {/* Profile Picture Upload */}
          <div className="profile-picture-section">
          <img
            src={previewUrl || profilePic || '/default-avatar.png'}
            alt="Profile"
            className="profile-picture"
          />
{profilePic && (
  <>
    <button
      onClick={() => setShowDeleteConfirmation(true)}
      className="remove-picture-button"
    >
      הסר תמונת פרופיל
    </button>

    {showDeleteConfirmation && (
      <div className="confirmation-modal">
        <p>האם אתה בטוח שברצונך להסיר את התמונה?</p>
        <button
          onClick={async () => {
            try {
              const token = localStorage.getItem('access_token');
              const response = await axiosInstance.post(
                `${API_BASE_URL}/api/user/delete_profile_picture`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (response.data.success) {
                setProfilePic(null);
                setPreviewUrl(null);
                setSelectedImage(null);
                setUploadSuccess("✅ התמונה נמחקה בהצלחה.");
                setUploadError('');
              } else {
                setUploadError("שגיאה במחיקת התמונה.");
              }
            } catch (err) {
              console.error("Error deleting profile picture:", err);
              setUploadError("שגיאה במחיקת התמונה.");
            } finally {
              setShowDeleteConfirmation(false);
            }
          }}
        >
          כן
        </button>
        <button onClick={() => setShowDeleteConfirmation(false)}>לא</button>
      </div>
    )}
  </>
)}


            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button onClick={saveProfilePicture}>שמור תמונה</button>
            {uploadSuccess && <p className="success-message">{uploadSuccess}</p>}
{uploadError && <p className="error-message">{uploadError}</p>}

          </div>

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

  {nameError && <p style={{ color: 'red' }}>{nameError}</p>}
  {nameSuccess && <p style={{ color: 'green' }}>{nameSuccess}</p>}

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
