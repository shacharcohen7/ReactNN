import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [courses, setCourses] = useState([]); // כאן נשמור את הקורסים של היוזר
    const [userId, setUserId] = useState(''); // כאן נשמור את ה-user ID
    const [searchType, setSearchType] = useState('topic'); 
    const [selectedCourse, setSelectedCourse] = useState('');
    const [topics, setTopics] = useState([]);
    const [courseId, setCourseId] = useState('');

    const [selectedTopic, setSelectedTopic] = useState('');
    const [searchText, setSearchText] = useState(''); // שינוי שם ל-searchText

    const [examYear, setExamYear] = useState(''); // שינוי שם ל-examYear
    const [examSemester, setExamSemester] = useState(''); // שינוי שם ל-examSemester
    const [examDateSelection, setExamDateSelection] = useState(''); // שינוי שם ל-examDateSelection
    const [questionNum, setQuestionNum] = useState(''); // שינוי שם ל-questionNum

    const semesters = ['סתיו', 'אביב', 'קיץ'];
    const examDates = ['א', 'ב', 'ג', 'ד'];

    useEffect(() => {
        // מבצע קריאה ל-API כאשר הקומפוננטה נטענת
        axios.get('http://localhost:5001/api/course/get_all_courses')
            .then(response => {
                setCourses(response.data.courses);
            })
            .catch(error => {
                console.error("שגיאה בקריאה ל-API:", error);
            });
    }, []); // תבצע קריאה אחת בלבד כשקומפוננטה נטענת

    // קריאה לקבלת הנושאים של קורס
    useEffect(() => {
        if (selectedCourse) {
            axios.get('http://localhost:5001/api/course/get_course_topics   http://localhost:5001/api/login', {
                params: { course_id: selectedCourse }
            })
            .then(response => {
                if (response.data.success) {
                    setTopics(response.data.topics); // עדכון ה-state עם הנושאים של הקורס
                } else {
                    console.error('לא ניתן להוריד נושאים');
                }
            })
            .catch(error => {
                console.error('שגיאה בקריאת ה-API עבור נושאים:', error);
            });
        }
    }, [selectedCourse]); // הפעל מחדש את הקריאה כל פעם שהקורס משתנה

    useEffect(() => {
        // קריאה ל-API לקבלת הקורסים של היוזר
        if (userId) {
            axios.get('http://localhost:5001/api/get_user_courses', {
                params: { user_id: userId }
            })
            .then(response => {
                if (response.data.success) {
                    setCourses(response.data.courses); // עדכון ה-state עם הקורסים
                } else {
                    console.error('לא ניתן להוריד קורסים');
                }
            })
            .catch(error => {
                console.error('שגיאה בקריאת ה-API עבור קורסים:', error);
            });
        }
    }, [userId]); // קריאה ל-API כאשר userId משתנה

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

    const navigateToAddQuestion = () => {
        navigate('/addquestion');
    };

    const navigateToAddExam = () => {
        navigate('/addexam');
    };

    const handleCourseSearch = () => {
        if (courses.some(course => course.id === courseId)) {
            navigate(`/course/${courseId}`);
        } else {
            alert("הקורס לא נמצא!");
        }
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
                                className="search-input-course"
                            >
                                <option value="">בחר קורס</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedTopic}
                                onChange={(e) => setSelectedTopic(e.target.value)}
                                className="search-input-topic"
                                disabled={!selectedCourse}
                            >
                                <option value="">בחר נושא</option>
                                {selectedCourse && topics.map((topic, index) => (
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
                                className="search-input-text"
                            />
                        </div>
                    )}

                    {searchType === 'date' && (
                        <div className="date-search">
                            <select
                                value={selectedCourse}
                                onChange={handleCourseSelection}
                                className="search-input-course"
                                required
                            >
                                <option value="">בחר קורס</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                placeholder="שנה"
                                value={examYear}
                                onChange={(e) => setExamYear(e.target.value)}
                                className="search-input-course"
                            />

                            <select
                                value={examSemester}
                                onChange={(e) => setExamSemester(e.target.value)}
                                className="search-input-course"
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
                                className="search-input-course"
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
                                className="search-input-course"
                            />
                        </div>
                    )}
                    <button className="search-button-home" onClick={handleSearch}>
                        חפש
                    </button>
                </div>

                <div className="action-section">
                    <div className="action-card" onClick={navigateToAddQuestion}>
                        <span>העלאת שאלה</span>
                    </div>
                    <div className="action-card" onClick={navigateToAddExam}>
                        <span>העלאת מבחן</span>
                    </div>
                </div>
                <div className="course-search-container">
                    <label className="search-label" htmlFor="courseId">חפש קורס:</label>
                    <input
                        type="text"
                        id="courseId"
                        placeholder="הכנס מזהה קורס (XXX.X.XXXX)"
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
                        className="search-input-home"
                    />
                    <button className="search-button-home" onClick={handleCourseSearch}>חפש קורס</button>
                </div>

                <div className="courses-section">
                    <h3>הקורסים שלי</h3>
                    <div className="course-cards-container">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="course-card"
                                onClick={() => navigateToCoursePage(course.id)}
                            >
                                <span>{course.name}</span>
                                <p style={{ fontSize: '12px', color: 'gray' }}>
                                    {course.id}
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
