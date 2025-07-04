import React, { useState } from 'react';
import './OpenCourse.css'; // יש לוודא שהקובץ הזה קיים
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from "react-router-dom";
import {FaSpinner} from "react-icons/fa";

function OpenCourse() {
  const [newCourseNumber, setNewCourseNumber] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [syllabusFile, setSyllabusFile] = useState(null);
  const [showCourseNumberTooltip, setShowCourseNumberTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  const handleNewCourseSubmit = async () => {
    if (!newCourseNumber || !newCourseName || !syllabusFile) {
      alert('כל השדות חובה');
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('course_id', newCourseNumber);
      formData.append('name', newCourseName);
      formData.append('syllabus_content_pdf', syllabusFile);
  
      const response = await axiosInstance.post(
        `${API_BASE_URL}/api/course/open_course`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
  
      if (response.data.success) {
        alert('הקורס נוסף בהצלחה!');
        console.log('Response:', response.data);
        navigate(`/course/${newCourseNumber}`);
      } else {
        alert(`שגיאה: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error adding course:', error);
      alert('שגיאה בהוספת הקורס. אנא נסה שוב מאוחר יותר.');
    }
    finally {
      setIsLoading(false)
    }
  };

  return (
      <>
        {isLoading && (
            <div className="loading-overlay">
              <div className="loading-container">
                <FaSpinner className="spinner" size={80} />
                <span className="loading-text2">מנתחים את המידע שלך, פעולה זו עלולה לקחת מעט זמן</span>
              </div>
            </div>
        )}
      <div className="open-course-page">
        <Header />
        <main className="content">
          <div className="form-container">
            <h2>הוספת קורס חדש</h2>

            <div className="form-row">
              <label htmlFor="courseName">שם קורס:</label>
              <input
                  id="courseName"
                  type="text"
                  placeholder="שם קורס"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  required
              />
            </div>

            <div className="form-row">
              <label htmlFor="courseNumber">מספר קורס:</label>

              <div style={{position: 'relative', width: '63%'}}>
                <input
                    id="courseNumber"
                    type="text"
                    placeholder="מספר קורס"
                    value={newCourseNumber}
                    onChange={(e) => setNewCourseNumber(e.target.value)}
                    onMouseEnter={() => setShowCourseNumberTooltip(true)}
                    onMouseLeave={() => setShowCourseNumberTooltip(false)}
                    required
                    style={{width: '100%'}} // אם אין לך CSS גלובלי
                />
                {showCourseNumberTooltip && (
                    <div className="tooltip2">חובה מהצורה xxx.x.xxxx</div>
                )}
              </div>
            </div>


            <div className="form-row">
              <label htmlFor="syllabus">סילבוס:</label>
              <input
                  id="syllabus"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setSyllabusFile(e.target.files[0])}
                  required
              />
            </div>

            <button className="search-button" onClick={handleNewCourseSubmit}>
              הוסף קורס
            </button>
          </div>
        </main>
        <Footer/>
      </div>
      </>
  );

}

export default OpenCourse;
