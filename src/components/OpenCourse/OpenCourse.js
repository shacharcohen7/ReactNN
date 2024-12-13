import React, { useState } from 'react';
import './OpenCourse.css'; // יש לוודא שהקובץ הזה קיים
import Header from '../Header/Header'; // נניח שאתה משתמש בהדר ב-header עצמאי
import Footer from '../Footer/Footer';  // ייבוא הפוטר


function OpenCourse() {
  const [newCourseNumber, setNewCourseNumber] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [syllabusFile, setSyllabusFile] = useState(null);
  const [courseTopics, setCourseTopics] = useState('');

  const handleNewCourseSubmit = () => {
    if (!newCourseNumber || !newCourseName || !syllabusFile || !courseTopics) {
      alert('כל השדות חובה');
      return;
    }
    console.log('הקורס החדש:', { newCourseNumber, newCourseName, syllabusFile, courseTopics });
    alert('הקורס נוסף בהצלחה');
  };

  return (
    <div className="open-course-page">
      <Header />
      <main className="content">
        <div className="form-content">
          <h2>הוספת קורס חדש</h2>
          <input
            type="text"
            placeholder="מספר קורס"
            value={newCourseNumber}
            onChange={(e) => setNewCourseNumber(e.target.value)}
            className="search-input-open"
            required
          />
          <input
            type="text"
            placeholder="שם קורס"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            className="search-input-open"
            required
          />
          <input
            type="file"
            onChange={(e) => setSyllabusFile(e.target.files[0])}
            className="search-input-open"
            required
          />
          <textarea
            placeholder="הכנס רשימה של נושאים"
            value={courseTopics}
            onChange={(e) => setCourseTopics(e.target.value)}
            className="search-input-open"
            required
          />
          <button className="search-button" onClick={handleNewCourseSubmit}>
            הוסף קורס
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default OpenCourse;
