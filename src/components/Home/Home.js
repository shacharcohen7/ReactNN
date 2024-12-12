import React, { useState } from 'react';
import './Home.css';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';


function Home() {
    const [selectedSearch, setSelectedSearch] = useState('topic'); // 'topic' או 'date'
    const [selectedCourse, setSelectedCourse] = useState(''); // עבור שדה קורס
    const [selectedTopic, setSelectedTopic] = useState(''); // עבור שדה נושא
    const [freeText, setFreeText] = useState(''); // עבור שדה טקסט חופשי

    // שדות עבור חיפוש לפי מועד
    const [year, setYear] = useState('');
    const [semester, setSemester] = useState('');
    const [examDate, setExamDate] = useState('');
    const [questionNumber, setQuestionNumber] = useState('');

    // רשימת הקורסים והנושאים
    const courses = ['מתמטיקה', 'פיזיקה', 'כימיה', 'מדעי המחשב']; // רשימת הקורסים
    const topics = {
        'מתמטיקה': ['אלגברה', 'גיאומטריה', 'חדו"א'],
        'פיזיקה': ['כוחות', 'אנרגיה', 'חשמל'],
        'כימיה': ['תהליכים כימיים', 'יסודות כימיים', 'מולקולות'],
        'מדעי המחשב': ['תכנות', 'אלגוריתמים', 'מבני נתונים']
    };
    const semesters = ['סתיו', 'אביב', 'קיץ']; // רשימת הסמסטרים
    const examDates = ['א', 'ב', 'ג', 'ד']; // רשימת המועדים

    const navigate = useNavigate();  // יצירת אובייקט navigate

    // פונקציה שתשנה את סוג החיפוש
    const handleSearchSelection = (searchType) => {
        setSelectedSearch(searchType);
    };

    // פונקציה לעדכון קורס
    const handleCourseChange = (e) => {
        setSelectedCourse(e.target.value);
    };


    // פונקציה לחיפוש (לדוגמה, הדפסת התוצאה)
    const handleSearchClick = () => {
        console.log("חיפוש עם פרמטרים: ", { selectedCourse, selectedTopic, freeText });
    };

    // ניווט לדף קורס
    const navigateToCourse = (course) => {
        navigate(`/course/${course}`);
    };

    const [showModal, setShowModal] = useState(false); // שדה לניהול הצגת ה-Modal
    const [newCourseNumber, setNewCourseNumber] = useState(''); // שדה למספר הקורס
    const [newCourseName, setNewCourseName] = useState(''); // שדה לשם הקורס
    const [syllabusFile, setSyllabusFile] = useState(null); // שדה להעלאת קובץ
    const [courseTopics, setCourseTopics] = useState(''); // שדה לרשימת נושאים

    // פונקציה שתפתח את ה-modal
    const openModal = () => {
        setShowModal(true);
    };

    // פונקציה שתסגור את ה-modal
    const closeModal = () => {
        setShowModal(false);
    };

    // פונקציה לשמירת קורס חדש
    const handleNewCourseSubmit = () => {
        // כאן תוכל להוסיף לוגיקה להוספת קורס
        if (!newCourseNumber || !newCourseName || !syllabusFile || !courseTopics) {
            alert('כל השדות חובה');
            return;
        }
        console.log('הקורס החדש:', { newCourseNumber, newCourseName, syllabusFile, courseTopics });
        setShowModal(false); // סוגר את ה-modal אחרי הוספת הקורס
    };

    return (
        <div className="home-page">
            <Header />
            <main className="content">
                <div className="tabs-container">
                    <button 
                        className={`tab ${selectedSearch === 'topic' ? 'active' : ''}`} 
                        onClick={() => handleSearchSelection('topic')}
                    >
                        חיפוש לפי נושא
                    </button>
                    <button 
                        className={`tab ${selectedSearch === 'date' ? 'active' : ''}`} 
                        onClick={() => handleSearchSelection('date')}
                    >
                        חיפוש לפי מועד
                    </button>
                </div>

                <div className="search-container">
                    {selectedSearch === 'topic' && (
                        <div className="topic-search">
                            {/* שדה קורס */}
                            <select 
                                value={selectedCourse} 
                                onChange={handleCourseChange} 
                                className="search-input"
                            >
                                <option value="">בחר קורס</option>
                                {courses.map((course, index) => (
                                    <option key={index} value={course}>
                                        {course}
                                    </option>
                                ))}
                            </select>
                            {/* שדה נושא */}
                            <select 
                                value={selectedTopic} 
                                onChange={(e) => setSelectedTopic(e.target.value)} 
                                className="search-input"
                                disabled={!selectedCourse}  // אם לא נבחר קורס, שדה הנושא יהיה מנוטרל
                            >
                                <option value="">בחר נושא</option>
                                {/* אם נבחר קורס, מציג רק את הנושאים שלו */}
                                {selectedCourse && topics[selectedCourse] && topics[selectedCourse].map((topic, index) => (
                                    <option key={index} value={topic}>
                                        {topic}
                                    </option>
                                ))}
                            </select>

                            {/* שדה טקסט חופשי */}
                            <input
                                type="text"
                                placeholder="טקסט חופשי"
                                value={freeText}
                                onChange={(e) => setFreeText(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    )}

                    {selectedSearch === 'date' && (
                        <div className="date-search">
                            {/* שדה קורס */}
                            <select 
                                value={selectedCourse} 
                                onChange={handleCourseChange} 
                                className="search-input"
                                required
                            >
                                <option value="">בחר קורס</option>
                                {courses.map((course, index) => (
                                    <option key={index} value={course}>
                                        {course}
                                    </option>
                                ))}
                            </select>

                            {/* שנה */}
                            <input
                                type="text"
                                placeholder="שנה"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="search-input"
                            />

                            {/* סמסטר */}
                            <select 
                                value={semester} 
                                onChange={(e) => setSemester(e.target.value)} 
                                className="search-input"
                            >
                                <option value="">בחר סמסטר</option>
                                {semesters.map((semesterOption, index) => (
                                    <option key={index} value={semesterOption}>
                                        {semesterOption}
                                    </option>
                                ))}
                            </select>

                            {/* מועד */}
                            <select 
                                value={examDate} 
                                onChange={(e) => setExamDate(e.target.value)} 
                                className="search-input"
                            >
                                <option value="">בחר מועד</option>
                                {examDates.map((dateOption, index) => (
                                    <option key={index} value={dateOption}>
                                        {dateOption}
                                    </option>
                                ))}
                            </select>

                            {/* מספר שאלה */}
                            <input
                                type="number"
                                placeholder="מספר שאלה"
                                value={questionNumber}
                                onChange={(e) => setQuestionNumber(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    )}

                    {/* כפתור חיפוש */}
                    <button className="search-button" onClick={handleSearchClick}>
                        חפש
                    </button>
                </div>
  {/* ריבוע עם כותרת "הקורסים שלי" */}
  <div className="courses-section">
                    <h3>הקורסים שלי</h3>
                    <div className="course-cards-container">
                        {courses.map((course, index) => (
                            <div 
                                key={index} 
                                className="course-card"
                                onClick={() => navigateToCourse(course)} 
                            >
                                <span>{course}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ריבוע להוספת קורס */}
                <div className="add-course-button" onClick={openModal}>
                    <span className="plus-sign">+</span>
                    <span>הוספת קורס</span>
                </div>

                {/* Modal להוספת קורס */}
                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close-button" onClick={closeModal}>X</span>
                            <h2>הוספת קורס</h2>
                            <input
                                type="text"
                                placeholder="מספר קורס"
                                value={newCourseNumber}
                                onChange={(e) => setNewCourseNumber(e.target.value)}
                                className="search-input"
                                required
                            />
                            <input
                                type="text"
                                placeholder="שם קורס"
                                value={newCourseName}
                                onChange={(e) => setNewCourseName(e.target.value)}
                                className="search-input"
                                required
                            />
                            <input
                                type="file"
                                onChange={(e) => setSyllabusFile(e.target.files[0])}
                                className="search-input"
                                required
                            />
                            <textarea
                                placeholder="הכנס רשימה של נושאים"
                                value={courseTopics}
                                onChange={(e) => setCourseTopics(e.target.value)}
                                className="search-input"
                                required
                            />
                            <button className="search-button" onClick={handleNewCourseSubmit}>
                                הוסף קורס
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Home;