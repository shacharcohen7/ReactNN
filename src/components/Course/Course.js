// Course.js
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';  // ייבוא הפוטר
import './Course.css'; 

function Course() { 
    const { courseName } = useParams();  // מקבלים את שם הקורס מה-URL
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSearchType, setSelectedSearchType] = useState('topic'); // הבחירה בין נושא למועד
    const [selectedTopic, setSelectedTopic] = useState(''); // נושא שנבחר
    const [examYear, setExamYear] = useState(''); // שנה של המבחן
    const [examSemester, setExamSemester] = useState(''); // סמסטר של המבחן
    const [examDateSelection, setExamDateSelection] = useState(''); // מועד של המבחן
    const [questionNum, setQuestionNum] = useState(''); // מספר שאלה
    const navigate = useNavigate();  // יצירת אובייקט navigate

    // נתיב הסילבוס (יש להחליף בנתיב האמיתי של הסילבוס)
    const syllabusUrl = '/path-to-syllabus.pdf';

    // פונקציה לחיפוש בקורס
    const handleSearchClick = () => {
        console.log("חיפוש בקורס:", searchQuery);
    };

    // ניווט לדף העלאת מבחן חדש
    const handleAddExam = () => {
        navigate('/add-exam');  // יש ליצור דף זה מאוחר יותר
    };

    // ניווט לדף העלאת שאלה חדשה
    const navigateToUploadQuestion = () => {
        navigate(`/upload-question-date/${courseName}`);
    };

    // ניווט להצגת הסילבוס
    const handleShowSyllabus = () => {
        window.open(syllabusUrl, '_blank');  // פותח את הסילבוס בתצוגה חדשה
    };

    return (
        <div className="course-page">
            <Header />
            <main className="content">
                {/* שם הקורס + כפתור סילבוס */}
                <div className="course-header">
                    <h1>{courseName} - קורס</h1>
                    <button className="show-syllabus-button" onClick={handleShowSyllabus}>
                        הצג סילבוס
                    </button>
                </div>

                {/* סרגל חיפוש */}
                <div className="search-container">
                    <div className="tabs-container">
                        <button
                            className={`tab ${selectedSearchType === 'topic' ? 'active' : ''}`}
                            onClick={() => setSelectedSearchType('topic')}
                        >
                            חיפוש לפי נושא
                        </button>
                        <button
                            className={`tab ${selectedSearchType === 'date' ? 'active' : ''}`}
                            onClick={() => setSelectedSearchType('date')}
                        >
                            חיפוש לפי מועד
                        </button>
                    </div>

                    <div className="search-inputs">
                        {/* סרגל חיפוש לפי נושא */}
                        {selectedSearchType === 'topic' && (
                            <div className="topic-search">
                                <select
                                    value={selectedTopic}
                                    onChange={(e) => setSelectedTopic(e.target.value)}
                                    className="search-input-home"
                                >
                                    <option value="">בחר נושא</option>
                                    <option value="אלגברה">אלגברה</option>
                                    <option value="גיאומטריה">גיאומטריה</option>
                                    <option value="חדוא">חדו"א</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="חיפוש טקסט חופשי"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input-home"
                                />
                            </div>
                        )}

                        {/* סרגל חיפוש לפי מועד */}
                        {selectedSearchType === 'date' && (
                            <div className="date-search">
                                <input
                                    type="text"
                                    placeholder="שנה"
                                    value={examYear}
                                    onChange={(e) => setExamYear(e.target.value)}
                                    className="search-input-home"
                                />

                                <select
                                    value={examSemester}
                                    onChange={(e) => setExamSemester(e.target.value)}
                                    className="search-input-home"
                                >
                                    <option value="">בחר סמסטר</option>
                                    <option value="סתיו">סתיו</option>
                                    <option value="אביב">אביב</option>
                                    <option value="קיץ">קיץ</option>
                                </select>

                                <select
                                    value={examDateSelection}
                                    onChange={(e) => setExamDateSelection(e.target.value)}
                                    className="search-input-home"
                                >
                                    <option value="">בחר מועד</option>
                                    <option value="א">א</option>
                                    <option value="ב">ב</option>
                                    <option value="ג">ג</option>
                                    <option value="ד">ד</option>
                                </select>

                                <input
                                    type="number"
                                    placeholder="מספר שאלה"
                                    value={questionNum}
                                    onChange={(e) => setQuestionNum(e.target.value)}
                                    className="search-input-home"
                                />
                            </div>
                        )}
                    </div>

                    <button className="search-button" onClick={handleSearchClick}>
                        חפש
                    </button>
                </div>

                {/* כפתורים להעלאת מבחן ושאלה חדשה */}
                <div className="action-buttons">
                    <button className="action-button" onClick={handleAddExam}>
                        העלאת מבחן חדש
                    </button>
                    <button className="action-button" onClick={navigateToUploadQuestion}>
                        העלאת שאלה חדשה
                    </button>
                </div>

                {/* חלון עדכונים אחרונים */}
                <div className="updates-container">
                    <h3>עדכונים אחרונים</h3>
                    <div className="update-links">
                        <p><a href="/question/1">שאלה 1</a></p>
                        <p><a href="/question/2">שאלה 2</a></p>
                        {/* ניתן להוסיף קישורים נוספים לדפים של שאלות */}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Course;
