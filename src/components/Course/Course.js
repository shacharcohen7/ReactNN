import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { faStar } from '@fortawesome/free-solid-svg-icons'; // כוכב מלא
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons'; // כוכב ריק
import { faEye } from '@fortawesome/free-solid-svg-icons'; // עין
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IoIosArrowBack } from "react-icons/io";
import axios from 'axios';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './Course.css';
import axiosInstance from '../../utils/axiosInstance';

import { useNavigate } from "react-router-dom";


function Course() {
    const {courseId} = useParams();
    const [courseDetails, setCourseDetails] = useState(null);
    const [token, setToken] = useState('');  // מזהה היוזר
    const [isCourseRegistered, setIsCourseRegistered] = useState(false); // האם היוזר רשום לקורס הנוכחי
    const [topics, setTopics] = useState([]);    
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('topic'); 
    const [examYear, setExamYear] = useState('');
    const [examSemester, setExamSemester] = useState('');
    const [examDateSelection, setExamDateSelection] = useState('');
    const [questionNum, setQuestionNum] = useState('');
    const [activeSearch, setActiveSearch] = useState(false);
    
    const navigate = useNavigate();

    const [selectedTopic, setSelectedTopic] = useState('');
    const [searchText, setSearchText] = useState(''); // שינוי שם ל-searchText

    const [searchResults, setSearchResults] = useState([]); // אם אין תוצאות, הוא יהיה מערך ריק
    const [allQuestions, setAllQuestions] = useState([]);  // התחלה של מערך ריק
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


    
    const uniqueExams = allQuestions.filter((result, index, self) => 
        index === self.findIndex((r) => 
            r.year === result.year && r.semester === result.semester && r.moed === result.moed
        )
    );
  
    // פונקציה שתוסיף את ההדר המתאים לכל בקשה
    const addAuthHeaders = (headers = {}) => {
        const token = localStorage.getItem('access_token');  // הוצאת ה-token מ-localStorage
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;  // הוספת ה-token להדר Authorization
        }
        return headers;
    };


    useEffect(() => {
        const storedToken = localStorage.getItem('access_token');
        setToken(storedToken);
        console.log("course id:", courseId);
    
        const fetchData = async () => {
            if (courseId) {
                try {
                    // טעינת פרטי הקורס
                    const courseResponse = await axiosInstance.get(`${API_BASE_URL}/api/course/get_course/${courseId}`, {
                        headers: addAuthHeaders()  
                    });
                    if (courseResponse.data && courseResponse.data.status === 'success') {
                        setCourseDetails(courseResponse.data.data);
                    }
    
                    // טעינת נושאי הקורס

                    const topicsResponse = await axiosInstance.get(`${API_BASE_URL}/api/course/get_course_topics`, {
                        params: { course_id: courseId },
                        headers: addAuthHeaders()  
                    });
                    if (topicsResponse.data.status === 'success') {
                        setTopics(topicsResponse.data.data);
                    }
    
                    // טעינת כל השאלות של הקורס
                    const questionsResponse = await axiosInstance.post(`${API_BASE_URL}/api/course/search_question_by_specifics`, 

                        {
                            course_id: courseId,  // העברת הנתונים בגוף הבקשה, לא ב-params
                        }, 
                        {
                            headers: addAuthHeaders()  // הוספת הכותרת המתאימה
                        }
                    );
                    let parsedResponse;
                    if (typeof questionsResponse.data.data === 'string') {
                        parsedResponse = JSON.parse(questionsResponse.data.data); // המרת המחרוזת לאובייקט

                    } else {
                        parsedResponse = questionsResponse.data.data; // אם כבר אובייקט, השתמש בו
                    }
    
                    if (parsedResponse.status === 'success' && parsedResponse.data.length > 0) {
                        setAllQuestions(parsedResponse.data);  // עדכון תוצאות החיפוש אם הם מערך
                    } else {
                        setAllQuestions([]);  // אם לא, הפוך את allQuestions למערך ריק
                    }
    
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setAllQuestions([]);  // לנקות אם יש שגיאה
                }
            }
    
            // טעינת קורסים שהמשתמש רשום אליהם
            if (storedToken) {
                try {
                    const userCoursesResponse = await axiosInstance.get(`${API_BASE_URL}/api/get_user_courses`, {
                        params: { access_token: storedToken },
                        headers: addAuthHeaders()
                    });
                    if (userCoursesResponse.data.success) {
                        setIsCourseRegistered(userCoursesResponse.data.courses.some(course => course.course_id === courseId));
                    }
                } catch (error) {
                    console.error('Error fetching user courses:', error);
                }
            }
        };
    
        fetchData();
    }, []);

    const clearSearchFields = () => {
        setSelectedTopic('');
        setExamYear('');
        setExamDateSelection('');
        setExamSemester('');
        setQuestionNum('');
        setSearchText('');
    }

    const handleSearchClick = () => {
        if (searchType === 'topic') {
            console.log("חיפוש לפי נושא עם פרמטרים: ", { selectedTopic });
    
            // קריאה ל-API לחיפוש לפי נושא
            axiosInstance.post(`${API_BASE_URL}/api/course/search_questions_by_topic`, {
                topic: selectedTopic,
                course_id: courseId || undefined
            }, {
                headers: addAuthHeaders()
            })
            .then(response => {
                const parsedResponse = JSON.parse(response.data.data);  // המרת המחרוזת לאובייקט
                console.log("תוצאות חיפוש לפי נושא: ", parsedResponse);
    
                // אם התוצאה היא לא מערך, נהפוך אותה למערך
                if (parsedResponse.status === "success" && parsedResponse.data.length > 0) {
                    console.log("תוצאות החיפוש: ", parsedResponse.data);
                    setSearchResults(parsedResponse.data);  // עדכון תוצאות החיפוש
                } else {
                    setSearchResults([]); // אם אין תוצאות, לנקות את ה-state
                }
            })
            .catch(error => {
                console.error('שגיאה בחיפוש לפי נושא:', error);
                setSearchResults([]); // אם קרתה שגיאה, לנקות את ה-state
                alert("אירעה שגיאה בחיפוש לפי נושא");
            });
        } else if (searchType === 'date') {
            console.log("חיפוש לפי מועד עם פרמטרים: ", { courseId, examYear, examSemester, examDateSelection, questionNum });
    
            // קריאה ל-API לחיפוש לפי מועד
            axiosInstance.post(`${API_BASE_URL}/api/course/search_question_by_specifics`, {
                course_id: courseId,
                year: examYear || undefined,  // לא נשלח אם לא קיים
                semester: examSemester || undefined,  // לא נשלח אם לא קיים
                moed: examDateSelection || undefined,  // לא נשלח אם לא קיים
                question_number: questionNum || undefined  // לא נשלח אם לא קיים
            }, {
                headers: addAuthHeaders()  // הוספת כותרת האותנטיקציה המתאימה
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
        } else if (searchType === 'text') {
            console.log("חיפוש לפי טקסט עם פרמטרים: ", { searchText });
    
            axiosInstance.post(`${API_BASE_URL}/api/course/search_questions_by_text`, {
                text: searchText,      // הטקסט לחיפוש
                course_id: courseId    // מזהה הקורס
            }, {
                headers: addAuthHeaders()  // הוספת כותרת האותנטיקציה המתאימה
            })
            .then(response => {
                const parsedResponse = JSON.parse(response.data.data);
                if (parsedResponse.status === "success" && parsedResponse.message.length > 0) {
                    setSearchResults(parsedResponse.message);
                } else {
                    setSearchResults([]);
                }
            })
            .catch(error => {
                console.error('שגיאה בחיפוש לפי טקסט:', error);
                setSearchResults([]);
                alert("אירעה שגיאה בחיפוש לפי טקסט");
            });
        }
    };

    const sortedQuestions = [...uniqueExams].sort((a, b) => {
        // מיון לפי שנה
        if (a.year !== b.year) {
            return a.year - b.year;
        }
    });
    
    const handleAddToFavorites = () => {
        if (token) {
            axiosInstance.post(`${API_BASE_URL}/api/course/register_to_course`, 
                { course_id: courseId }, 
                { headers: addAuthHeaders() }
            )
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
        if (token) {
            axiosInstance.post(`${API_BASE_URL}/api/course/remove_student_from_course`, 
                { course_id: courseId}, 
                { headers: addAuthHeaders() }
            )
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

    const navigateToExamPage = (year, semester, moed) => {
        navigate(`/exam/${courseId}/${year}/${semester}/${moed}`);
    };

    const handleAddExam = () => {
        navigate('/add-exam');
    };

    const navigateToUploadQuestion = () => {
        navigate(`/upload-question-date/${courseId}`);
    };

    const handleDownloadAllExamsZip = async () => {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/api/course/handleDownloadAllExamsZip`, {
                params: { course_id: courseId },
                headers: addAuthHeaders(),
                responseType: 'json' // ✅ Change from 'blob' to 'json' to correctly detect "no exams"
            });
    
            // ✅ Check if the response indicates no exams
            if (response.data && response.data.no_exams) {
                alert("אין מבחנים מלאים לקורס זה באתר כרגע");
                return; // Stop execution, do not attempt file download
            }
    
            // If this point is reached, it means exams exist and a ZIP should be downloaded
            const zipResponse = await axiosInstance.get(`${API_BASE_URL}/api/course/handleDownloadAllExamsZip`, {
                params: { course_id: courseId },
                headers: addAuthHeaders(),
                responseType: 'blob' // ✅ Fetch the actual ZIP file now
            });
    
            // Extract the filename from the "Content-Disposition" header
            const contentDisposition = zipResponse.headers['content-disposition'];
            let filename = `NegevNerds_exams_${courseId}.zip`; // Default fallback
    
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?([^"]+)"?/);
                if (match && match[1]) {
                    filename = match[1];
                }
            }
    
            // Create a link and trigger the download
            const url = window.URL.createObjectURL(new Blob([zipResponse.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading exams:", error);
            alert("שגיאה בהורדת כלל המבחנים");
        }
    };
    

    return (
        <div className="course-page">
            <Header />
            {courseDetails && (
                <div className='links-container'>
                    <a href={`/home`} className="nav-result-link">
                        <span>דף הבית</span>
                    </a>
                    <IoIosArrowBack />
                    <a>
                        <span>קורס {courseDetails.course_id} - {courseDetails.name}</span>
                    </a>
                </div> 
            )}
            <main className="content">
                <div className="course-header">
                    {courseDetails ? (
                        <>
                            <button
                                onClick={isCourseRegistered ? handleRemoveFromFavorites : handleAddToFavorites}
                                title={isCourseRegistered ? 'הסר מהקורסים שלי' : 'הוסף לקורסים שלי'}
                                className="favorite-button"
                            >
                                <FontAwesomeIcon icon={isCourseRegistered ? faStar : faStarRegular} />
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
                    <button
                        className={`tab ${searchType === 'text' ? 'active' : ''}`}
                        onClick={() => setSearchType('text')}
                    >
                        חיפוש לפי טקסט
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
                                <option value="">נושא</option>
                                {courseId && topics.map((topic, index) => (
                                    <option key={index} value={topic}>
                                        {topic}
                                    </option>
                                ))}
                            </select>
                            <div className="search-buttons">
                                <button className="search-button-home" onClick={() => {handleSearchClick(); setActiveSearch(true);}}>
                                    חפש
                                </button>
                                <button className="search-button-home" onClick={() => {setActiveSearch(false); clearSearchFields();}}>
                                    נקה
                                </button>
                            </div>
                        </div>
                    )}

                    {searchType === 'text' && (
                        <div className="topic-search">
                            <input
                                type="text"
                                placeholder="טקסט"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="search-input-topic"
                            />
                            <div className="search-buttons">
                                <button className="search-button-home" onClick={() => {handleSearchClick(); setActiveSearch(true);}}>
                                    חפש
                                </button>
                                <button className="search-button-home" onClick={() => {setActiveSearch(false); clearSearchFields();}}>
                                    נקה
                                </button>
                            </div>
                        </div>
                    )}

                    {searchType === 'date' && (
                        <div className="topic-search">
                            <input
                                type="text"
                                placeholder="שנה"
                                value={examYear}
                                onChange={(e) => setExamYear(e.target.value)}
                                className="search-input-topic"
                            />
                            <select
                                value={examSemester}
                                onChange={(e) => setExamSemester(e.target.value)}
                                className="search-input-topic"
                                disabled={examYear === ''}

                            >
                                <option value="">סמסטר</option>
                                <option value="סתיו">סתיו</option>
                                <option value="אביב">אביב</option>
                                <option value="קיץ">קיץ</option>
                            </select>
                            <select
                                value={examDateSelection}
                                onChange={(e) => setExamDateSelection(e.target.value)}
                                className="search-input-topic"
                                disabled={examSemester === ''}

                            >
                                <option value="">מועד</option>
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
                                className="search-input-topic"
                                disabled={examDateSelection === ''}
                            />
                            <div className="search-buttons">
                                <button className="search-button-home" onClick={() => {handleSearchClick(); setActiveSearch(true);}}>
                                    חפש
                                </button>
                                <button className="search-button-home" onClick={() => {setActiveSearch(false); clearSearchFields();}}>
                                    נקה
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {activeSearch && (<div className="search-results">
                    {searchResults.length > 0 ? (
                        <div>
                            <h3>התוצאות שהתקבלו</h3>
                            <ul className="results-list">
                               {searchResults.map((result) => (
                                    <li key={`${result.year}-${result.semester}-${result.moed}`} className="result-item">
                                        <a href={`/question/${courseId}/${result.year}/${result.semester}/${result.moed}/${result.question_number}`} className="result-link">
                                            <span>{courseDetails.name} / {result.year} / {result.semester} / מועד {result.moed} / שאלה {result.question_number}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div>
                            <h3>התוצאות שהתקבלו</h3>
                            <p>לא נמצאו תוצאות לחיפוש זה</p>
                        </div>
                    )}
                </div>)}

                <div className="action-buttons">
                    <button className="offline-button">
                        העלאת מבחן חדש
                    </button>
                    <button className="action-button" onClick={navigateToUploadQuestion}>
                        העלאת שאלה חדשה
                    </button>
                    <button className="action-button" onClick={handleDownloadAllExamsZip}>
                        הורדת כלל המבחנים
                    </button>
                </div>

                <div className="updates-container">
                    <h3>מבחנים בקורס זה</h3>

                        <table className='search-results-table'>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('year')}>שנה</th>
                                <th onClick={() => handleSort('semester')}>סמסטר</th>
                                <th onClick={() => handleSort('moed')}>מועד</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedQuestions && Array.isArray(sortedQuestions) && sortedQuestions.length > 0 ? (
                                sortedQuestions.map(result => (
                                    <tr key={result.question_id}>
                                        <td>{result.year}</td>
                                        <td>{result.semester}</td>
                                        <td>{result.moed}</td>
                                        <td>
                                            <button onClick={() => navigateToExamPage(result.year, result.semester, result.moed)}>
                                            <i className="fas fa-arrow-left"></i> 
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">לא נמצאו מבחנים</td>
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
