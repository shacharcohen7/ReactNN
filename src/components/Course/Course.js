import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Course.css';


function Course() {
    const { courseId } = useParams();
    const [courseDetails, setCourseDetails] = useState(null);
    const [userId, setUserId] = useState('');  // מזהה היוזר
    const [userCourses, setUserCourses] = useState([]); 
    const [isCourseRegistered, setIsCourseRegistered] = useState(false); // האם היוזר רשום לקורס הנוכחי
    const [topics, setTopics] = useState([]);    
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('topic'); 
    const [examYear, setExamYear] = useState('');
    const [examSemester, setExamSemester] = useState('');
    const [examDateSelection, setExamDateSelection] = useState('');
    const [questionNum, setQuestionNum] = useState('');
    const navigate = useNavigate();

    const [selectedTopic, setSelectedTopic] = useState('');
    const [searchText, setSearchText] = useState(''); // שינוי שם ל-searchText

    const [searchResults, setSearchResults] = useState([]); // אם אין תוצאות, הוא יהיה מערך ריק
    

    useEffect(() => {
        const storedUserId = localStorage.getItem('user_id');
        setUserId(storedUserId);
        if (courseId) {
            axios.get(`http://localhost:5001/api/course/get_course/${courseId}`)
                .then(response => {
                    if (response.data && response.data.status === 'success') {
                        setCourseDetails(response.data.data);
                    } else {
                        console.error('Response does not contain valid course data', response.data);
                    }
                })
                .catch(error => {
                    console.error('Error fetching course details:', error);
                });
        }
    
        // בדוק אם יש ליוזר קורסים
        if (storedUserId) {
            axios.get('http://localhost:5001/api/get_user_courses', {
                params: { user_id: storedUserId }
            })
            .then(response => {
                if (response.data.success) {
                    setUserCourses(response.data.courses); // עדכון הסטייט עם המערך של הקורסים
                    // בדוק אם הקורס הנוכחי נמצא ברשימה
                    setIsCourseRegistered(response.data.courses.some(course => course.course_id === courseId)); // עדכון אם הקורס נמצא במועדפים
                }
            })
            .catch(error => {
                console.error('Error fetching user courses:', error);
            });
        }
    }, [courseId]); 
    
    useEffect(() => {
        const storedUserId = localStorage.getItem('user_id');
        setUserId(storedUserId);
        if (storedUserId && courseId) {
            axios.get('http://localhost:5001/api/get_user_courses', {
                params: { user_id: storedUserId }
            })
            .then(response => {
                if (response.data.success) {
                    setUserCourses(response.data.courses); // עדכון הסטייט עם המערך של הקורסים
                    // עדכון האם הקורס נמצא ברשימה
                    const isRegistered = response.data.courses.some(course => course.course_id === courseId);
                    setIsCourseRegistered(isRegistered); // עדכון המצב של ההרשמה
                }
            })
            .catch(error => {
                console.error('Error fetching user courses:', error);
            });
        }
    }, [courseId]);
    // מבצע את הקריאה מחדש כשמתעדכן courseId
    

    // קריאה לקבלת הנושאים של קורס
    useEffect(() => {
        if (courseId) {
            axios.get('http://localhost:5001/api/course/get_course_topics', {
                params: { course_id: courseId },
                headers: {}
            })
            .then(response => {
                if (response.data.status == 'success') {
                    setTopics(response.data.data); // עדכון ה-state עם הנושאים של הקורס
                } else {
                    console.error('לא ניתן להוריד נושאים');
                }
            })
            .catch(error => {
                console.error('שגיאה בקריאת ה-API עבור נושאים:', error);
            });
        }
    }, [courseId]); // הפעל מחדש את הקריאה כל פעם שהקורס משתנה

    const handleSearchClick = () => {
        if (searchType === 'topic') {
            console.log("חיפוש לפי נושא עם פרמטרים: ", { courseId, selectedTopic, searchText });
            // במקרה של חיפוש לפי נושא, תוכל להוסיף את קריאת ה-API המתאימה כאן
        } else if (searchType === 'date') {
            console.log("חיפוש לפי מועד עם פרמטרים: ", { courseId, examYear, examSemester, examDateSelection, questionNum });
    
            // קריאה ל-API לחיפוש לפי מועד
            axios.post('http://localhost:5001/api/course/search_exam_by_specifics', {
                course_id: courseId,
                year: examYear || undefined,
                semester: examSemester || undefined,
                moed: examDateSelection || undefined,
                question_number: questionNum || undefined
            })
            .then(response => {
                const parsedResponse = JSON.parse(response.data.data);  // המרת המחרוזת לאובייקט    
                if (parsedResponse.status==="success" && parsedResponse.data.length > 0) {
                    setSearchResults(parsedResponse.data);  // עדכון תוצאות החיפוש
                } else {
                    setSearchResults([]); // אם אין תוצאות, לנקות את ה-state
                }
            })
            .catch(error => {
                console.error('שגיאה בחיפוש לפי מועד:', error);
                setSearchResults([]); // אם קרתה שגיאה, לנקות את ה-state
                alert("אירעה שגיאה בחיפוש לפי מועד");
            });
        }
    };

    const handleAddToFavorites = () => {
        if (userId) {
            axios.post('http://localhost:5001/api/course/register_to_course', {
                course_id: courseId,
                user_id: userId
            })
            .then(response => {
                if (response.data.success) {
                    setIsCourseRegistered(true); // אם ההרשמה הצליחה, השתנה למינוס
                }
            })
            .catch(error => {
                console.error('Error registering to course:', error);
            });
        }
    };
    
    const handleRemoveFromFavorites = () => {
        if (userId) {
            axios.post('http://localhost:5001/api/course/remove_student_from_course', {
                course_id: courseId,
                user_id: userId
            })
            .then(response => {
                if (response.data.success) {
                    setIsCourseRegistered(false);
                }
            })
            .catch(error => {
                console.error('Error removing from course:', error.response || error);
            });
            
        }
    };
    

    const handleSort = (column) => {
        // מיון תוצאות החיפוש לפי העמודה
        const sortedResults = [...searchResults].sort((a, b) => {
            if (a[column] < b[column]) return -1;
            if (a[column] > b[column]) return 1;
            return 0;
        });
        setSearchResults(sortedResults);
    };

    const navigateToQuestionPage = (questionId) => {
        navigate(`/question/${questionId}`);
    };

    const handleAddExam = () => {
        navigate('/add-exam');
    };

    const navigateToUploadQuestion = () => {
        navigate(`/upload-question-date/${courseId}`);
    };

    return (
        <div className="course-page">
            <Header />
            <main className="content">
            <div className="course-header">
                {courseDetails ? (
                    <>
                    <button 
                        onClick={isCourseRegistered ? handleRemoveFromFavorites : handleAddToFavorites} 
                        title={isCourseRegistered ? 'הסר מהקורסים שלי' : 'הוסף לקורסים שלי'}
                        className="favorite-button">
                        {isCourseRegistered ? '-' : '+'}
                    </button>
                        <h1>{courseDetails.course_id} - {courseDetails.name}</h1>
                    </>
                ) : (
                    <h1>טוען...</h1>
                )}
            </div>
                    <div className="tabs-container">
                        <button
                            className={`tab ${searchType === 'topic' ? 'active' : ''}`}
                            onClick={() => setSearchType('topic')}
                        >
                            חיפוש לפי נושא
                        </button>
                        <button
                            className={`tab ${searchType === 'date' ? 'active' : ''}`}
                            onClick={() => setSearchType('date')}
                        >
                            חיפוש לפי מועד
                        </button>
                    </div>

                    <div className="search-container">
                        {searchType === 'topic' && (
                            <div className="topic-search">
                                <select
                                    value={selectedTopic}
                                    onChange={(e) => setSelectedTopic(e.target.value)}
                                    className="search-input-topic"
                                >
                                <option value="">בחר נושא</option>
                                {courseId && topics.map((topic, index) => (
                                    <option key={index} value={topic}>
                                        {topic}
                                    </option>
                                ))}
                                </select>
                                <input
                                    type="text"
                                    placeholder="חיפוש טקסט חופשי"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input-text"
                                />
                            </div>
                        )}

                        {searchType === 'date' && (
                            <div className="date-search">
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
                                    <option value="סתיו">סתיו</option>
                                    <option value="אביב">אביב</option>
                                    <option value="קיץ">קיץ</option>
                                </select>
                                <select
                                    value={examDateSelection}
                                    onChange={(e) => setExamDateSelection(e.target.value)}
                                    className="search-input-course"
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
                                    className="search-input-course"
                                />
                            </div>
                        )}

                    <button className="search-button-home" onClick={handleSearchClick}>
                        חפש
                    </button>
                </div>

                <div className="action-buttons">
                    <button className="action-button" onClick={handleAddExam}>
                        העלאת מבחן חדש
                    </button>
                    <button className="action-button" onClick={navigateToUploadQuestion}>
                        העלאת שאלה חדשה
                    </button>
                </div>

                <div className="updates-container">
                    <h3>שאלות בקורס</h3>
                    <table className="search-results-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('year')}>שנה</th>
                                <th onClick={() => handleSort('semester')}>סמסטר</th>
                                <th onClick={() => handleSort('moed')}>מועד</th>
                                <th onClick={() => handleSort('question_number')}>מספר שאלה</th>
                                <th>פעולה</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResults.length > 0 ? (
                                searchResults.map(result => (
                                    <tr key={result.question_id}>
                                        <td>{result.year}</td>
                                        <td>{result.semester}</td>
                                        <td>{result.moed}</td>
                                        <td>{result.question_number}</td>
                                        <td>
                                            <button onClick={() => navigateToQuestionPage(result.question_id)}>
                                                צפה בשאלה
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">לא נמצאו שאלות</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Course;
