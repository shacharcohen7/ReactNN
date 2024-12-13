import React, { useState } from 'react';
import './Home.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [searchType, setSearchType] = useState('topic'); // שינוי שם למובן יותר
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [searchText, setSearchText] = useState(''); // שינוי שם ל-searchText

    const [examYear, setExamYear] = useState(''); // שינוי שם ל-examYear
    const [examSemester, setExamSemester] = useState(''); // שינוי שם ל-examSemester
    const [examDateSelection, setExamDateSelection] = useState(''); // שינוי שם ל-examDateSelection
    const [questionNum, setQuestionNum] = useState(''); // שינוי שם ל-questionNum

    const courses = {
        '202.1.1010': 'מתמטיקה',
        '201.2.1000': 'פיזיקה',
        '372.1.1050': 'כימיה'
    };
    const topics = {
        '202.1.1010': ['אלגברה', 'גיאומטריה', 'חדו"א'],
        '201.2.1000': ['כוחות', 'אנרגיה', 'חשמל'],
        '372.1.1050': ['תהליכים כימיים', 'יסודות כימיים', 'מולקולות'],
    };
    const semesters = ['סתיו', 'אביב', 'קיץ'];
    const examDates = ['א', 'ב', 'ג', 'ד'];

    const navigate = useNavigate();

    const handleSearchTypeChange = (criteria) => {
        setSearchType(criteria);
    };

    const handleCourseSelection = (e) => {
        setSelectedCourse(e.target.value);
    };

    const handleSearch = () => {
        console.log("חיפוש עם פרמטרים: ", { selectedCourse, selectedTopic, searchText });
    };

    const navigateToCoursePage = (courseId) => {
        navigate(`/course/${courseId}`);
    };

    const navigateToAddNewCourse = () => {
        navigate('/opencourse'); // ניווט לדף "פתיחת קורס חדש"
    };

    return (
        <div className="home-page">
            <Header />
            <main className="content">
                <div className="tabs-container">
                    <button
                        className={`tab ${searchType === 'topic' ? 'active' : ''}`}
                        onClick={() => handleSearchTypeChange('topic')}
                    >
                        חיפוש לפי נושא
                    </button>
                    <button
                        className={`tab ${searchType === 'date' ? 'active' : ''}`}
                        onClick={() => handleSearchTypeChange('date')}
                    >
                        חיפוש לפי מועד
                    </button>
                </div>

                <div className="search-container">
                    {searchType === 'topic' && (
                        <div className="topic-search">
                            <select
                                value={selectedCourse}
                                onChange={handleCourseSelection}
                                className="search-input-home"
                            >
                                <option value="">בחר קורס</option>
                                {Object.entries(courses).map(([courseId, courseName], index) => (
                                    <option key={index} value={courseId}>
                                        {courseName}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedTopic}
                                onChange={(e) => setSelectedTopic(e.target.value)}
                                className="search-input-home"
                                disabled={!selectedCourse}
                            >
                                <option value="">בחר נושא</option>
                                {selectedCourse && topics[selectedCourse] && topics[selectedCourse].map((topic, index) => (
                                    <option key={index} value={topic}>
                                        {topic}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                placeholder="טקסט חופשי"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="search-input-home"
                            />
                        </div>
                    )}

                    {searchType === 'date' && (
                        <div className="date-search">
                            <select
                                value={selectedCourse}
                                onChange={handleCourseSelection}
                                className="search-input-home"
                                required
                            >
                                <option value="">בחר קורס</option>
                                {Object.entries(courses).map(([courseId, courseName], index) => (
                                    <option key={index} value={courseId}>
                                        {courseName}
                                    </option>
                                ))}
                            </select>

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
                                {semesters.map((semesterOption, index) => (
                                    <option key={index} value={semesterOption}>
                                        {semesterOption}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={examDateSelection}
                                onChange={(e) => setExamDateSelection(e.target.value)}
                                className="search-input-home"
                            >
                                <option value="">בחר מועד</option>
                                {examDates.map((dateOption, index) => (
                                    <option key={index} value={dateOption}>
                                        {dateOption}
                                    </option>
                                ))}
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
                    <button className="search-button-home" onClick={handleSearch}>
                        חפש
                    </button>
                </div>

                <div className="courses-section">
                    <h3>הקורסים שלי</h3>
                    <div className="course-cards-container">
                        {Object.entries(courses).map(([courseId, courseName]) => (
                            <div
                                key={courseId}
                                className="course-card"
                                onClick={() => navigateToCoursePage(courseId)}
                            >
                                <span>{courseName}</span>
                                <p style={{ fontSize: '12px', color: 'gray' }}>
                                    {courseId}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="add-course-button" onClick={navigateToAddNewCourse}>
                    <span className="plus-sign">+</span>
                    <span>פתיחת קורס חדש</span>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Home;
