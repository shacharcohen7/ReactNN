import React, {useState, useEffect, useTransition} from 'react';
import axios from 'axios';
import './Home.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

function Home() {
    const [courses, setCourses] = useState([]);  // קורסים כלליים
    const [userCourses, setUserCourses] = useState([]);  // קורסים של היוזר הספציפי    
    const [userId, setUserId] = useState(''); // כאן נשמור את ה-user ID
    const [token, setToken] = useState('');  // מזהה היוזר
    const [searchById, setSearchById] = useState(false);
    const [searchType, setSearchType] = useState('topic'); 
    const [selectedCourse, setSelectedCourse] = useState('');
    const [searchTrigerred, setSearchTriggered] = useState(false);
    const [courseResults, setCourseResults] = useState('');
    const [courseForQuestion, setcourseForQuestion] = useState('');
    const [courseForExam, setCourseForExam] = useState('');
    const [topics, setTopics] = useState([]);
    const [courseId, setCourseId] = useState('');
    const [activeSearch, setActiveSearch] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [searchText, setSearchText] = useState(''); // שינוי שם ל-searchText
    const [courseSearchInput, setCourseSearchInput] = useState(''); // שינוי שם ל-searchText
    const [coursesMatchNamePart, setCoursesMatchNamePart] = useState([])
    const [examYear, setExamYear] = useState(''); // שינוי שם ל-examYear
    const [examSemester, setExamSemester] = useState(''); // שינוי שם ל-examSemester
    const [examDateSelection, setExamDateSelection] = useState(''); // שינוי שם ל-examDateSelection
    const [questionNum, setQuestionNum] = useState(''); // שינוי שם ל-questionNum
    const [searchCourseByNameResults, setSearchCourseByNameResults] = useState(false);
    const semesters = ['סתיו', 'אביב', 'קיץ'];
    const examDates = ['א', 'ב', 'ג', 'ד'];
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const [onlyWithSolution, setOnlyWithSolution] = useState(false);
    const [hasSolution, setHasSolution] = useState([]);
    //const [isLoadingCourses, setIsLoadingCourses] = useState(false); // State for loading state

    const [suggestion, setSuggestion] = useState(''); // State for suggestion

    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false); // State לשליטה בפופ-אפ
    const openQuestionModal = () => setIsQuestionModalOpen(true);  // פונקציה לפתיחת הפופ-אפ
    const closeQuestionModal = () => setIsQuestionModalOpen(false); // פונקציה לסגירת הפופ-אפ

    const [isExamModalOpen, setIsExamModalOpen] = useState(false); // State לשליטה בפופ-אפ
    const openExamModal = () => setIsExamModalOpen(true);  // פונקציה לפתיחת הפופ-אפ
    const closeExamModal = () => setIsExamModalOpen(false); // פונקציה לסגירת הפופ-אפ


    const [isCourseNotFoundModalOpen, setIsCourseNotFoundModalOpen] = useState(false); // State לשליטה במודל פתיחת קורס חדש
    const [searchCourseModal, setIsSearchCourseModalOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]); // אם אין תוצאות, הוא יהיה מערך ריק

    const [IsSystemManager, setIsSystemManager] = useState(false);
    const [isToolbarOpen, setIsToolbarOpen] = useState(false);
    const [isRemoveCourseModalOpen, setIsRemoveCourseModalOpen] = useState(false);
    const [selectedCourseToRemove, setSelectedCourseToRemove] = useState('');
    const [isAppointSystemManagerModalOpen, setIsAppointSystemManagerModalOpen] = useState(false);
    const [emailToAppoint, setEmailToAppoint] = useState('');

    
    const addAuthHeaders = (headers = {}) => {
        const token = localStorage.getItem('access_token');  // הוצאת ה-token מ-localStorage
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;  // הוספת ה-token להדר Authorization
        }
        return headers;
    };

    const courseIdToNameMap = {};
    courses.forEach((course) => {
        courseIdToNameMap[course.course_id] = course.name;
    });
    
    const handleCourseSearchByNameResults = (courses) => {
        if(courses.length > 0){
            setSearchCourseByNameResults(true);
            setCoursesMatchNamePart(courses)
        } else {
            setIsCourseNotFoundModalOpen(true)
        }
    }

    const handleRadioChange = (isSearchById) => {
        setSearchById(!isSearchById);
        setCourseSearchInput('')
    }

    const handleCourseSearchInput = (e) => {
        setCourseSearchInput(e.target.value);
    };
    
    useEffect(() => {
        const storedToken = localStorage.getItem('access_token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        console.log('✅ useEffect2 triggered: courseId =', courseId);

        const checkSystemManager = async () => {
            try {
                const response = await axiosInstance.post(`${API_BASE_URL}/api/course/is_system_manager`, {
                },{headers: addAuthHeaders()})  
                if (response.data.success) {
                    console.log("user is course manager:", response.data.is_system_manager);
                    setIsSystemManager(response.data.is_system_manager);
                } else {
                    console.error("Not system manager:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching course manager status:", error);
            }
        };
    
        checkSystemManager();
    }, [courseId]);
    
    useEffect(() => {
        // API call to fetch all courses
        const token = localStorage.getItem('access_token');
        if (token) {
            console.log("Sending request with token get all courses:", token);
            axiosInstance.get(`${API_BASE_URL}/api/course/get_all_courses`, {
                headers: addAuthHeaders()
                })
                .then(response => {
                    // Set the courses state with the data array from the response
                    console.log("Response received get all courses:", response);  // הדפסה של התשובה שהתקבלה

                    setCourses(response.data.data);
                })
                .catch(error => {
                    console.error("שגיאה בגישה לכל הקורסים", error);
                });
        }
    }, []);// תבצע קריאה אחת בלבד כשקומפוננטה נטענת

    useEffect(() => {
        const checkAnswers = async () => {
            const resultsWithSolutions = await Promise.all(
                searchResults.map(async (result) => {
                    try {
                        const response = await axios.get(`${API_BASE_URL}/api/course/check_answer_for_question`, {
                            params: {
                                course_id: result.course_id,
                                year: result.year,
                                semester: result.semester,
                                moed: result.moed,
                                question_number: result.question_number,
                            },
                            headers: addAuthHeaders(),
                        });
                        // בדיקה אם יש פתרון
                        if (response.data.status === "success" ) {
                            return response.data.data === true; // נחזיר את ה-result המלא
                        }
    
                    } catch (error) {
                        console.error('Error checking answer for question', result.question_number, error);
                        return null;
                    }
                })
            );
                // סינון רק אלה שלא null (כלומר, שיש להן פתרון)
            setHasSolution(resultsWithSolutions);
        };
    
        checkAnswers();
    
    }, [searchResults]);

    // קריאה לקבלת הנושאים של קורס
    useEffect(() => {
        if (selectedCourse) {

            axiosInstance.get(`${API_BASE_URL}/api/course/get_course_topics`, {
                params: { course_id: selectedCourse },
                headers: addAuthHeaders()
            })
            .then(response => {
                if (response.data.status === 'success') {
                    setTopics(response.data.data); // עדכון ה-state עם הנושאים של הקורס
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
        // בצע קריאה ל-API כדי להשיג את הקורסים של המשתמש
        if (token) {
          axiosInstance.get(`${API_BASE_URL}/api/get_user_courses`, {
            headers: addAuthHeaders()
          })
          .then(response => {
            console.log('API Response:', response);
            if (response.data.success) {
              setUserCourses(response.data.courses); // עדכון הסטייט עם המערך של הקורסים
            } else {
              console.error('Failed to fetch user courses');
            }
          })
          .catch(error => {
            console.error('Error fetching user courses:', error);
          });
        }
      }, [token]);


    const navigate = useNavigate();
    const handleSearchTypeChange = (criteria) => {
        setSearchType(criteria);
    };
    const handleCourseSelection = (e) => {
        setSelectedCourse(e.target.value);
    };

    const clearSearchFields = () => {
        setSelectedCourse('');
        setSelectedTopic('');
        setExamYear('');
        setExamDateSelection('');
        setExamSemester('');
        setQuestionNum('');
        setSearchText('');
    }

    const getCourseName = (course_id) => {
        const course = courses.find(course => course.course_id === course_id);
        return course ? course.name : null; // מחזיר את שם הקורס או null אם לא נמצא
    }

    const handleCourseSelectionForQuestion = (e) => {
        setcourseForQuestion(e.target.value);
    };


    const handleCourseSelectionForExam = (e) => {
        setCourseForExam(e.target.value);
    };

    // const handleQuestionClick = (year, semester, moed, question_number) => {
    //     navigate(`/question/${selectedCourse}/${year}/${semester}/${moed}/${question_number}`);  // עובר לדף השאלה עם מזהה השאלה
    // };

    
    const handleCheckboxChange = (e) => {
        setOnlyWithSolution(e.target.checked);
      };

    useEffect(() => {
        handleSearch();
    }, [searchTrigerred]);

    const handleSearch = () => {
        setSearchResults([])
        if (searchType === 'topic') {
            console.log("חיפוש לפי נושא עם פרמטרים: ", { selectedCourse, selectedTopic });
    
            // קריאה ל-API לחיפוש לפי נושא
            axiosInstance.post(`${API_BASE_URL}/api/course/search_questions_by_topic`, {
                topic: selectedTopic,
                course_id: selectedCourse || undefined
            }, {
                headers: addAuthHeaders()
            })
            .then(response => {
                const parsedResponse = JSON.parse(response.data.data);  
                console.log("תוצאות חיפוש לפי נושא: ", parsedResponse);
    
                if (parsedResponse.status === "success" && parsedResponse.data.length > 0) {
                    console.log("תוצאות החיפוש: ", parsedResponse.data);
                    setSearchResults(parsedResponse.data);  
                } else {
                    setSearchResults([]); 
                }
            })
            .catch(error => {
                console.error('שגיאה בחיפוש לפי נושא:', error);
                setSearchResults([]); 
                alert("אירעה שגיאה בחיפוש לפי נושא");
            });
    
        } else if (searchType === 'date') {
            console.log("חיפוש לפי מועד עם פרמטרים: ", { selectedCourse, examYear, examSemester, examDateSelection, questionNum });
    
            axiosInstance.post(`${API_BASE_URL}/api/course/search_question_by_specifics`, {
                course_id: selectedCourse,
                year: examYear || undefined,
                semester: examSemester || undefined,
                moed: examDateSelection || undefined,
                question_number: questionNum || undefined

            }, {
                headers: addAuthHeaders()
            })
            .then(response => {
                const parsedResponse = JSON.parse(response.data.data);     
                if (parsedResponse.status === "success" && parsedResponse.data.length > 0) {
                    setSearchResults(parsedResponse.data); 
                } else {
                    setSearchResults([]);
                }
            })
            .catch(error => {
                console.error('שגיאה בחיפוש לפי מועד:', error);
                setSearchResults([]); 
                alert("אירעה שגיאה בחיפוש לפי מועד");
            });
        } else if (searchType === 'text') {
            console.log("חיפוש לפי טקסט עם פרמטרים: ", { selectedCourse, searchText });
    
            axiosInstance.post(`${API_BASE_URL}/api/course/search_questions_by_text`, {
                text: searchText,
                course_id: selectedCourse || undefined},
            {headers: addAuthHeaders()})
            .then(response => {
                const parsedResponse = JSON.parse(response.data.data);  // המרת המחרוזת לאובייקט    
                    // אם התוצאה היא לא מערך, נהפוך אותה למערך
                    console.log('API Response:', parsedResponse);
                    if (parsedResponse.status === "success" ) {
                        console.log('API22 Response:', parsedResponse.message);
                        if (parsedResponse.first_suggestion!== null) {
                            setSuggestion(parsedResponse.first_suggestion);
                        }
                        if (parsedResponse.message.length > 0) {
                            setSearchResults(parsedResponse.message);
                        }// עדכון תוצאות החיפוש
                } else {
                    setSearchResults([]); // אם אין תוצאות, לנקות את ה-state
                }
            })
            .catch(error => {
                console.error('שגיאה בחיפוש לפי טקסט:', error);
                setSearchResults([]); // אם קרתה שגיאה, לנקות את ה-state
                alert("אירעה שגיאה בחיפוש לפי טקסט");
            });
        }
        setCourseResults(selectedCourse)
    };
    const handleRemoveCourseAction = () => {
        setIsRemoveCourseModalOpen(true);
      };
      
      useEffect(() => {
        const handleKeyDown = (event) => {
          if (event.key === "Escape" && isAppointSystemManagerModalOpen) {
            setIsAppointSystemManagerModalOpen(false);
            setEmailToAppoint("");
          }
        };
      
        document.addEventListener("keydown", handleKeyDown);
        
        return () => {
          document.removeEventListener("keydown", handleKeyDown);
        };
      }, [isAppointSystemManagerModalOpen]);
      
      const handleAppointSystemManager = () => {
        setIsAppointSystemManagerModalOpen(true);
      };
      
      
  
      
    
    const navigateToUploadQuestion = () => {
        if (courseForQuestion) {
            // Navigate only if courseForQuestion has a valid value
            navigate(`/upload-question-date/${courseForQuestion}`);
          } else {
            // Optionally, you can alert the user or show a message if no course is selected
            alert("אנא בחר קורס לפני שתמשיך.");
          }
    };

    const navigateToUploadExam = () => {
        if (courseForExam) {
            // Navigate only if courseForQuestion has a valid value
            navigate(`/upload-exam/${courseForExam}`);
        } else {
            // Optionally, you can alert the user or show a message if no course is selected
            alert("אנא בחר קורס לפני שתמשיך.");
        }
    };

    const navigateToAddExam = () => {
        navigate('/addexam');
    };

    const handleCourseSearchById = (courseId) => {
        console.log("Searching for course with courseId:", courseId);
        
        if (courseId) {
            // מחפש את הקורס לפי ה-ID בתוך המערך של הקורסים
            const course = courses.find(course => course.course_id === courseId);
            if (course) {
                axiosInstance.get(`${API_BASE_URL}/api/course/get_course/${courseId}`, {
                    headers: addAuthHeaders()
                })
                    .then(response => {
                        console.log('Course data:', response.data);
                        navigate(`/course/${courseId}`); // אם הקורס נמצא, מעביר לדף הקורס
                    })
                    .catch(error => {
                        console.error('Error fetching course details:', error);
                    });
            } else {
                openCourseNotFoundModal(); // אם הקורס לא נמצא
            }
        } else {
            console.error('Course ID is missing');
        }
    };
    
    const handleCourseSearchByName = (name_part) => {
        console.log("Searching for courses with name_part:", name_part);
        
        if (name_part) {
            axiosInstance.get(`${API_BASE_URL}/api/course/get_courses_by_name/${name_part}`, {
                headers: addAuthHeaders()
            })
            .then(response => {
                console.log('Courses data:', response.data.data);
                handleCourseSearchByNameResults(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching course details:', error);
            });
        } else {
            console.error('Course name is missing');
        }
    };

    const openCourseNotFoundModal = () => {
        setIsCourseNotFoundModalOpen(true);
    };

    const closeCourseNotFoundModal = () => {
        setIsCourseNotFoundModalOpen(false);
    };

    const openSearchCourseModal = () => {
        setIsSearchCourseModalOpen(true);
    };

    const closeSearchCourseModal = () => {
        setIsSearchCourseModalOpen(false);
        setCourseSearchInput('')
        setSearchById(true)
    };

    const navigateToAddNewCourse = () => {
        navigate('/opencourse'); // ניווט לדף "פתיחת קורס חדש"
    };

    return (
        <div className="home-page">
            <Header />
            <main className="content">
            <h1>דף הבית</h1>
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
                <button
                    className={`tab ${searchType === 'text' ? 'active' : ''}`}
                    onClick={() => handleSearchTypeChange('text')}
                >
                    חיפוש לפי טקסט
                </button>
            </div>
            {IsSystemManager && (
  <div className={`system-toolbar-container ${isToolbarOpen ? 'open' : ''}`}>
    <div className="toolbar-toggle" onClick={() => setIsToolbarOpen(prev => !prev)}>
      🔧
    </div>
    <div className="toolbar-content">
      <h4>פעולות מנהל מערכת</h4>
      <button onClick={handleRemoveCourseAction}>הסרת קורס</button>
      <button onClick={handleAppointSystemManager}>מינוי מנהל מערכת </button>
    </div>
  </div>
)}
{isRemoveCourseModalOpen && (
  <div className="modal-overlay">
    <div className="modal-content-remove">
      <h3>בחר קורס להסרה</h3>
      <select
        value={selectedCourseToRemove}
        onChange={(e) => setSelectedCourseToRemove(e.target.value)}
        className="search-input-topic"
      >
        <option value="">בחר קורס</option>
        {courses.map((course) => (
          <option key={course.course_id} value={course.course_id}>
            {course.name}
          </option>
        ))}
      </select>

      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        <button
          className="confirm-button"
          disabled={!selectedCourseToRemove}
          onClick={async () => {
            try {
              const response = await axiosInstance.post(
                `${API_BASE_URL}/api/course/remove_course`,
                { course_id: selectedCourseToRemove },
                { headers: addAuthHeaders() }
              );
          
              if (response.data.success) {
                alert('הקורס נמחק בהצלחה');
                // Optional: refresh the course list
                setCourses(prev => prev.filter(c => c.course_id !== selectedCourseToRemove));
              } else {
                alert(`שגיאה במחיקת הקורס: ${response.data.message}`);
              }
            } catch (error) {
              console.error('Error removing course:', error);
              alert('שגיאה בחיבור לשרת');
            } finally {
              setIsRemoveCourseModalOpen(false);
              setSelectedCourseToRemove('');
            }
          }}
          
        >
          אישור
        </button>
        <button
          className="cancel-button"
          onClick={() => {
            setIsRemoveCourseModalOpen(false);
            setSelectedCourseToRemove('');
          }}
        >
          ביטול
        </button>
      </div>
    </div>
  </div>
)}
{isAppointSystemManagerModalOpen && (
  <div
    className="modal-overlay"
    onClick={(e) => {
      // If the click happened directly on the overlay, then close the modal.
      if (e.target.classList.contains("modal-overlay")) {
        setIsAppointSystemManagerModalOpen(false);
        setEmailToAppoint("");
      }
    }}
  >
    <div className="modal-content-remove" onClick={(e) => e.stopPropagation()}>
      <h3>מינוי מנהל מערכת</h3>
      <p>אנא הקליד/י את האימייל של המשתמש אותו את/ה רוצה למנות:</p>
      <input
        type="email"
        placeholder="כתובת אימייל"
        value={emailToAppoint}
        onChange={(e) => setEmailToAppoint(e.target.value)}
        className="search-input-topic"
      />
      <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
        <button
          className="confirm-button"
          disabled={!emailToAppoint}
          onClick={async () => {
            try {          
              const response = await axiosInstance.post(
                `${API_BASE_URL}/api/course/appoint_system_manager`,
                { email: emailToAppoint },
                { headers: addAuthHeaders() }
              );
          
              if (response.data.success) {
                alert("נשלחה בקשת מינוי אל המשתמש");
              } else {
                alert(`שגיאה במינוי: ${response.data.message}`);
              }
            } catch (error) {
              console.error("Error appointing system manager:", error);
          
              if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);  // 🔥 Real message from backend
              } else {
                alert("שגיאה בחיבור לשרת");  // Generic fallback
              }
            } finally {
              setIsAppointSystemManagerModalOpen(false);
              setEmailToAppoint("");
            }
          }}
          
        >
          אישור
        </button>
        <button
          className="cancel-button"
          onClick={() => {
            setIsAppointSystemManagerModalOpen(false);
            setEmailToAppoint("");
          }}
        >
          ביטול
        </button>
      </div>
    </div>
  </div>
)}


                <div className="search-container">
                    {searchType === 'topic' && (
                        <div className="topic-search">
                            <select
                                value={selectedCourse}
                                onChange={handleCourseSelection}
                                className="search-input-topic"
                            >
                                <option value="">קורס</option>
                                {courses.map((course) => (
                                    <option key={course.course_id} value={course.course_id}>
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
                                <option value="">נושא</option>
                                {selectedCourse && topics.map((topic, index) => (
                                    <option key={index} value={topic}>
                                        {topic}
                                    </option>
                                ))}
                            </select>
                            <div className="search-buttons">
                                <button className="search-button-home" onClick={() => {setSuggestion('') ; handleSearch(); setActiveSearch(true);}}>
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
                            <select
                                value={selectedCourse}
                                onChange={handleCourseSelection}
                                className="search-input-topic"
                            >
                                <option value="">קורס</option>
                                {courses.map((course) => (
                                    <option key={course.course_id} value={course.course_id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                placeholder="טקסט"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="search-input-topic"
                            />
                            <div className="search-buttons">
                                <button className="search-button-home" onClick={() => {handleSearch(); setActiveSearch(true);}}>
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
                            <select
                                value={selectedCourse}
                                onChange={handleCourseSelection}
                                className="search-input-topic"
                                required
                            >
                                <option value="">קורס</option>
                                {courses.map((course) => (
                                    <option key={course.course_id} value={course.course_id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="number"
                                placeholder="שנה"
                                value={examYear}
                                onChange={(e) => setExamYear(e.target.value)}
                                className="search-input-topic"
                                disabled={selectedCourse === ''}
                            />

                            <select
                                value={examSemester}
                                onChange={(e) => setExamSemester(e.target.value)}
                                className="search-input-topic"
                                disabled={examYear === ''}
                            >
                                <option value="">סמסטר</option>
                                {semesters.map((semesterOption, index) => (
                                    <option key={index} value={semesterOption}>
                                        {semesterOption}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={examDateSelection}
                                onChange={(e) => setExamDateSelection(e.target.value)}
                                className="search-input-topic"
                                disabled={examSemester === ''}
                            >
                                <option value="">מועד</option>
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
                                className="search-input-topic"
                                disabled={examDateSelection === ''}
                            />
                            <div className="search-buttons">
                                <button className="search-button-home" onClick={() => {handleSearch(); setActiveSearch(true);}}>
                                    חפש
                                </button>
                                <button className="search-button-home" onClick={() => {setOnlyWithSolution(false); setActiveSearch(false); clearSearchFields();}}>
                                    נקה
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                {activeSearch && (<div className="search-results">
                    {suggestion !== '' && searchType === 'text' && (
                        <div className="suggestion">
                            <p>האם התכוונת ל:</p>
                            <p
                                style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                                onClick={() => {
                                    setSearchText(suggestion) ;
                                    setSuggestion('') ;
                                    setSearchTriggered(!searchTrigerred);
                                }}
                            >
                                {suggestion}
                            </p>
                        </div>
                    )}
                    {searchResults.length > 0 ? (
                            <div>

                            <h3>התוצאות שהתקבלו</h3> {/* כותרת התוצאות */}
                            <label className='checkbox-solution'>
                                <input
                                    type="checkbox"
                                    checked={onlyWithSolution}
                                    onChange={handleCheckboxChange}
                                />
                                הצג שאלות עם פתרון בלבד
                            </label>
                            <ul className="results-list">
                                {searchResults.map((result, index) => (
                                    (!onlyWithSolution || (onlyWithSolution && hasSolution[index])) &&
(                                    (<li key={result.question_id} className="result-item">
                                        <a href={`/question/${result.course_id}/${result.year}/${result.semester}/${result.moed}/${result.question_number}`} className="result-link">
                                            <span>{courseIdToNameMap[result.course_id] || "לא ידוע"} / {result.year} / {result.semester} / מועד {result.moed} / שאלה {result.question_number}</span>
                                        </a>
                                    </li>))
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
                    <button className="action-button" type="button" onClick={openExamModal}>
                        <span>העלאת מבחן חדש </span>
                    </button>
                    <button className="action-button" type="button" onClick={openQuestionModal}>
                        <span>העלאת שאלה חדשה</span>
                    </button>
                    {isExamModalOpen && (
                        <div className="modal-overlay">
                            <div className="modal-content-question">
                                <p>
                                    במידה והקורס לא נמצא ברשימת הקורסים, תוכל לפתוח אותו
                                    <a href="/opencourse"> כאן </a>.
                                </p>
                                <select
                                    value={courseForExam}
                                    onChange={handleCourseSelectionForExam}
                                    className="search-input-course">
                                    <option value="">בחר קורס</option>
                                    {courses.map((course) => (
                                        <option key={course.course_id} value={course.course_id}>
                                            {course.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="modal-buttons">
                                    <button className="confirm-button-question" onClick={navigateToUploadExam}>
                                        אישור
                                    </button>
                                    <button className="confirm-button-question" onClick={closeExamModal}>
                                        ביטול
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {isQuestionModalOpen && (
                        <div className="modal-overlay">
                        <div className="modal-content-question">
                            <p>
                                במידה והקורס לא נמצא ברשימת הקורסים, תוכל לפתוח אותו
                                <a href="/opencourse"> כאן </a>.
                            </p>
                            <select
                                value={courseForQuestion}
                                onChange={handleCourseSelectionForQuestion}
                                className="search-input-course">
                                <option value="">בחר קורס</option>
                                {courses.map((course) => (
                                    <option key={course.course_id} value={course.course_id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                            <div className="modal-buttons">
                                <button className="confirm-button-question" onClick={navigateToUploadQuestion}>
                                    אישור
                                </button>
                                <button className="confirm-button-question" onClick={closeQuestionModal}>
                                    ביטול
                                </button>
                            </div>
                        </div>
                        </div>
                    )}
                </div>
                <div className="courses-section">
                    <h3>הקורסים שלי</h3>
                    <div className="course-cards-container">
                        {userCourses.map((course) => (
                            <div
                                key={course.course_id}
                                className="course-card"
                                onClick={() => navigate(`/course/${course.course_id}`)} // קריאה לפונקציה של החיפוש
                                >
                                <span>{course.name}</span>
                                {/* <p style={{ fontSize: '12px', color: 'gray' }}>
                                    {course.id}
                                </p> */}
                            </div>
                        ))}
                        <div className="course-card" style={{fontSize:'40px'}} onClick={openSearchCourseModal}>+</div>
                    </div>

                </div>

                {isCourseNotFoundModalOpen && (
                <div className="modal-black-overlay">
                    <div className="search-course-modal">
                        <h2>לא התקבלו תוצאות</h2>
                        <div style={{display:"flex", flexDirection:"row", justifyContent:"center"}}>
                        <button className="search-button-home" onClick={navigateToAddNewCourse}>פתח קורס חדש</button></div>
                        <button className="close-button" onClick={()=> setIsCourseNotFoundModalOpen(false)}>x</button>
                    </div>
                </div>
                )}
                {searchCourseModal && (
                    <div className="modal-black-overlay">
                        <div className="search-course-modal">
                            <h2>חפש את הקורס הרצוי</h2>
                            <div className="course-search-container">
                                <div style={{display:"flex", flexDirection:"column"}}>
                                    <label>
                                    <input
                                        type="radio"
                                        checked={searchById}
                                        onChange={() => handleRadioChange(false)}
                                    />
                                    חיפוש לפי מספר קורס
                                    </label>
                                    <label>
                                    <input
                                        type="radio"
                                        checked={!searchById}
                                        onChange={() => handleRadioChange(true)}
                                    />
                                    חיפוש לפי שם קורס
                                    </label>
                                </div>
                                <div>
                                    {searchById ? (
                                        <input
                                            style={{width:"215px"}}
                                            type="text"
                                            value={courseSearchInput}
                                            onChange={handleCourseSearchInput}
                                            placeholder="הזן מספר קורס (XXX.XX.XXXX)"
                                            className="search-input-topic"
                                        />
                                    ) : (<input
                                        style={{width:"215px"}}
                                        type="text"
                                        value={courseSearchInput}
                                        onChange={handleCourseSearchInput}
                                        placeholder="הזן שם קורס"
                                        className="search-input-topic"
                                    />)}
                                    
                                </div>
                                <button className="search-button-home" onClick={() => {
                                    closeSearchCourseModal();
                                    {searchById ?   handleCourseSearchById(courseSearchInput) : 
                                                    handleCourseSearchByName(courseSearchInput)}
                                    }}
                                >
                                    חפש קורס
                                </button>
                            </div>
                            <button className="close-button" onClick={closeSearchCourseModal}>x</button>
                        </div>
                    </div>
                )}
                {searchCourseByNameResults && (
                    <div className="modal-black-overlay">
                        <div className="search-course-modal">
                            <h2>תוצאות חיפוש</h2>
                            <div  style={{display:"flex", flexDirection:"column", gap:"10px"}}>
                                {coursesMatchNamePart.map(course => 
                                    (<div
                                        key={course.course_id}
                                        className='course-search-by-name-result'
                                        onClick={()=>navigate(`/course/${course.course_id}`)}
                                    >
                                        {course.course_id} {course.name}
                                    </div>)
                                )}
                            </div><br></br>
                            <div style={{display:"flex", flexDirection:"row", justifyContent:"center"}}>
                                <button className="search-button-home" onClick={navigateToAddNewCourse}>לא מה שחיפשת? פתח קורס חדש</button>
                            </div>
                            <button className="close-button" onClick={()=>setSearchCourseByNameResults(false)}>x</button>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default Home;
