// Exam.js
import React, {useState, useEffect, useCallback} from 'react';
import { useParams } from 'react-router-dom'
import { IoIosArrowBack } from "react-icons/io";
import axios from 'axios';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';  // ייבוא הפוטר
import './Exam.css';
import axiosInstance from '../../utils/axiosInstance';

import { useNavigate } from "react-router-dom";
import PdfLineMark from "../PDFLineMark/PDFLineMark";
import {FaSpinner} from "react-icons/fa";

function Exam() {
    const [searchResults, setSearchResults] = useState([]); // אם אין תוצאות, הוא יהיה מערך ריק
    const [allQuestions, setAllQuestions] = useState([]);  // התחלה של מערך ריק
    const [isModalOpen, setIsModalOpen] = useState(false); // New state for modal visibility
    const [token, setToken] = useState('');  // מזהה היוזר
    const [examFile, setExamFile] = useState(null);
    const [solutionFile, setSolutionFile] = useState(null);
    const [examExist, setExamExist] = useState(false);
    const [solutionExist, setSolutionExist] = useState(false);
    const { courseId, examYear, examSemester, examDateSelection } = useParams();  // מקבלים את שם הקורס מה-URL
    const [courseDetails, setCourseDetails] = useState(null);
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false); // State לשליטה בפופ-אפ
    const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false); // State לשליטה בפופ-אפ
    const [questionNum, setQuestionNum] = useState(''); // מספר שאלה
    const openQuestionModal = () => setIsQuestionModalOpen(true);  // פונקציה לפתיחת הפופ-אפ
    const openSolutionModal = () => setIsSolutionModalOpen(true);  // פונקציה לפתיחת הפופ-אפ
    const closeQuestionModal = () => setIsQuestionModalOpen(false); // פונקציה לסגירת הפופ-אפ
    const navigate = useNavigate();
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const [lines, setLines] = useState([]);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [isSolutionUploaded, setIsSolutionUploaded] = useState(false);
    const [onlyWithSolution, setOnlyWithSolution] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dataChanged, setDataChanged] = useState(false); // State to track data changes

    const [hasSolution, setHasSolution] = useState([]);

    const removeLastLine = () => {
        // Remove the last line from the array if there are any lines
        setLines((prevLines) => prevLines.slice(0, -1));
    };


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setExamFile(file); // Store the selected file
            setIsFileUploaded(true); // Flag to indicate the file is ready for marking
        }
    };

    const handleSolutionChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSolutionFile(file); // Store the selected file
            setIsSolutionUploaded(true); // Flag to indicate the file is ready for marking
        }
    };

    const addAuthHeaders = (headers = {}) => {
        const token = localStorage.getItem('access_token');  // הוצאת ה-token מ-localStorage
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;  // הוספת ה-token להדר Authorization
        }
        return headers;
    };

    const handleSubmitLines = useCallback(async (lines) => {
        if (!examFile) {
            alert("Please upload a file before submitting.");
            return;
        }

        if (!lines || lines.length === 0) {
            alert("Please draw at least one line to split the questions.");
            return;
        }

        const formData = new FormData();
        formData.append('course_id', courseId);
        formData.append('year', examYear);
        formData.append('semester', examSemester);
        formData.append('moed', examDateSelection);
        formData.append('pdf_exam', examFile); // Attach the PDF file
        formData.append('line_data', JSON.stringify(lines)); // Attach the drawn lines data

        try {
            const response = await axiosInstance.post(`${API_BASE_URL}/api/course/uploadFullExamPdf`, formData, {
                headers: {
                    ...addAuthHeaders()
                },
            });

            if (response.data.success) {
                alert("המבחן נחתך בהצלחה, השאלות נשמרו!");
                closeModal();
                window.location.reload(); // Reload the page
            } else {
                alert(`שגיאה בחיתוך המבחן : ${response.data.message}`);
            }
        } catch (error) {
            console.error("שגיאה בחיתוך המבחן:", error);
            alert("שגיאה אירעה במהלך חיתוך המבחן ושמירתו");
        }
    });


    const handleSubmitSolutionLines = async (lines) => {
        if (!solutionFile) {
            alert("Please upload a file before submitting.");
            return;
        }

        if (!lines || lines.length === 0) {
            alert("Please draw at least one line to split the questions.");
            return;
        }

        const formData = new FormData();
        formData.append('course_id', courseId);
        formData.append('year', examYear);
        formData.append('semester', examSemester);
        formData.append('moed', examDateSelection);
        formData.append('solution_pdf', solutionFile); // Attach the PDF file
        formData.append('line_data', JSON.stringify(lines)); // Attach the drawn lines data

        try {
            const response = await axiosInstance.post(`${API_BASE_URL}/api/course/uploadFullExamSolution`, formData, {
                headers: {
                    ...addAuthHeaders()
                },
            });

            if (response.data.success) {
                alert("File uploaded and lines saved successfully!");
                closeSolutionModal();
                window.location.reload(); // Reload the page
            } else {
                alert(`Failed to upload file: ${response.data.message}`);
                closeSolutionModal();
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("An error occurred while uploading the file.");
            closeSolutionModal();
        }
    };

    const handleFileUpload = async (lines) => {
        if (!examFile) {
            alert("Please select a file to upload.");
            return;
        }
        setIsFileUploaded(true); // Set the file upload state to true
    }

    const handleSolutionUpload = async (lines) => {
        if (!solutionFile) {
            alert("Please select a file to upload.");
            return;
        }
        setIsSolutionUploaded(true); // Set the file upload state to true
    }


    const navigateToQuestionPage = (question_number) => {
        navigate(`/question/${courseId}/${examYear}/${examSemester}/${examDateSelection}/${question_number}`);
    };

    const handleCheckboxChange = (e) => {
        setOnlyWithSolution(e.target.checked);
      };

    useEffect(() => {
        const storedToken = localStorage.getItem('access_token');
        setToken(storedToken);
        const fetchData = async () => {
            setIsLoading(true);
            if (courseId) {
                try {
                    // טעינת פרטי הקורס
                    const courseResponse = await axiosInstance.get(`${API_BASE_URL}/api/course/get_course/${courseId}`, {
                        headers: addAuthHeaders()  
                    });
                    if (courseResponse.data && courseResponse.data.status === 'success') {
                        setCourseDetails(courseResponse.data.data);
                    }

                    // טעינת קובץ המבחן האם קיים
                    const response = await axiosInstance.post(`${API_BASE_URL}/api/checkExamFullPdf`,
                        {
                            course_id: courseId,
                            year: examYear,
                            semester: examSemester,
                            moed: examDateSelection,  // העברת הנתונים בגוף הבקשה, לא ב-params
                        }, 
                        {
                            headers: addAuthHeaders()  // הוספת הכותרת המתאימה
                        } 
                    );
                    if (response.data.success) {
                        setExamExist(response.data.has_link)
                    } 

                    // טעינת כל השאלות של המבחן
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
                        const filteredQuestions = parsedResponse.data.filter(
                            (question) =>
                                String(question.year) === String(examYear) &&
                                String(question.semester) === String(examSemester) &&
                                String(question.moed) === String(examDateSelection)
                        );
                        setAllQuestions(filteredQuestions);  // עדכון תוצאות החיפוש אם הם מערך
                    } else {
                        setAllQuestions([]);  // אם לא, הפוך את allQuestions למערך ריק
                    }


                } catch (error) {
                    console.error('Error fetching data:', error);
                    setAllQuestions([]);  // לנקות אם יש שגיאה
                }
                finally {
                    setIsLoading(false);
                }

            }
    
        };

        fetchData();
        setDataChanged(!dataChanged);

    }, [onlyWithSolution]);

    useEffect(() => {
        const fetchExamFullSolution = async () => {
            try {
                const response = await axiosInstance.post(`${API_BASE_URL}/api/course/check_exist_full_solution`, {
                    course_id: courseId,
                    year: examYear,
                    semester: examSemester,
                    moed: examDateSelection,
                }, {
                    headers: addAuthHeaders(),
                });
                if (response.data.status === "success") {
                    // console.log("has link " , response.data.has_link)
                    // console.log("has link " , response.data)

                    setSolutionExist(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching exam solutions:', error);
            }
        };

        fetchExamFullSolution();
    }, [dataChanged]);

    const sortedQuestions = [...allQuestions].sort((a, b) => {
        // מיון לפי שנה
        if (a.question_number !== b.question_number) {
            return a.question_number - b.question_number;
        }
    });

    useEffect(() => {
            const checkAnswers = async () => {
                const resultsWithSolutions = await Promise.all(
                    sortedQuestions.map(async (result) => {
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
        
        }, [dataChanged]);

    const handleSort = (column) => {
        // מיון תוצאות החיפוש לפי העמודה
        const sortedResults = [...searchResults].sort((a, b) => {
            if (a[column] < b[column]) return -1;
            if (a[column] > b[column]) return 1;
            return 0;
        });
        setSearchResults(sortedResults);
    };

    const handleConfirmClick = () => {
            if(questionNum < 1){
                alert("מספר שאלה לא תקין");
            }
            else{
                console.log("חיפוש לפי מועד עם פרמטרים: ", { courseId, examYear, examSemester, examDateSelection, questionNum });
                
                // קריאה ל-API לחיפוש לפי מועד
                axiosInstance.post(`${API_BASE_URL}/api/course/search_question_by_specifics`, {
                    course_id: courseId,
                    year: examYear,
                    semester: examSemester,
                    moed: examDateSelection,
                    question_number: questionNum
                }, {
                    headers: addAuthHeaders()
                })
                .then(response => {
                    const parsedResponse = JSON.parse(response.data.data);  // המרת המחרוזת לאובייקט    
                    console.log(parsedResponse.status)
                    if (parsedResponse.status==="success" && parsedResponse.data.length == 1) {
                        const userChoice = window.confirm(
                            "שאלה זו קיימת במאגר. האם ברצונך לעבור לדף השאלה?"
                        );
                        if (userChoice) {
                            navigate(`/question/${courseId}/${examYear}/${examSemester}/${examDateSelection}/${questionNum}`);
                        } 
                    } else {
                        navigate(`/upload-question-content/${courseId}/${examYear}/${examSemester}/${examDateSelection}/${questionNum}`);
                    }
                })
                .catch(error => {
                    console.error('שגיאה בחיפוש לפי מועד:', error);
                    alert("אירעה שגיאה בחיפוש לפי מועד");
                });
            }
    };

    const downloadExamPdf = async () => {
        try {
            const response = await axiosInstance.post(
                `${API_BASE_URL}/api/course/downloadExamPdf`,
                {
                    course_id: courseId,
                    year: examYear,
                    semester: examSemester,
                    moed: examDateSelection,
                },
                {
                    headers: addAuthHeaders()  
                ,
                
                    responseType: 'blob', // Expect binary data
                }
            );
    
            if (response.headers['content-type'] === 'application/json') {
                // Handle the case where the response is JSON (no file link exists)
                const reader = new FileReader();
                reader.onload = () => {
                    const result = JSON.parse(reader.result);
                    if (!result.has_link) {
                        alert(result.message);
                    }
                };
                reader.readAsText(response.data);
            } else {
                // Handle the case where the response is a file
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
    
                // Use the expected file name
                const fileName = `${courseId}_${examYear}_${examSemester}_${examDateSelection}.pdf`;
                link.setAttribute('download', fileName);
    
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                console.error('Error downloading exam PDF:', error);
                alert('An error occurred while trying to download the exam.');
            }
        }
    };

    const downloadSolutionPdf = async () => {
        try {
            const response = await axiosInstance.post(
                `${API_BASE_URL}/api/course/downloadExamFullSolution`,
                {
                    course_id: courseId,
                    year: examYear,
                    semester: examSemester,
                    moed: examDateSelection,
                },
                {
                    headers: addAuthHeaders()
                ,

                    responseType: 'blob', // Expect binary data
                }
            );

            if (response.headers['content-type'] === 'application/json') {
                // Handle the case where the response is JSON (no file link exists)
                const reader = new FileReader();
                reader.onload = () => {
                    const result = JSON.parse(reader.result);
                    if (!result.has_link) {
                        alert(result.message);
                    }
                };
                reader.readAsText(response.data);
            } else {
                // Handle the case where the response is a file
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;

                // Use the expected file name
                const fileName = `${courseId}_${examYear}_${examSemester}_${examDateSelection}_solution.pdf`;
                link.setAttribute('download', fileName);

                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                console.error('Error downloading solution PDF:', error);
                alert('An error occurred while trying to download the solution.');
            }
        }
    }
    
    const openModal = () => setIsModalOpen(true); // Open modal

    const closeModal =useCallback( () => {
        setIsModalOpen(false);
        setExamFile(null);
    }, []); // Close modal and reset file

    const closeSolutionModal =useCallback( () => {
        setIsSolutionModalOpen(false);
        setSolutionFile(null);
        setIsSolutionUploaded(false);
    }, []); // Close modal and reset file
      
    const addExamPdf = async () => {
        try {
            const response = await axiosInstance.post(`${API_BASE_URL}/api/checkExamFullPdf`,
                {
                    course_id: courseId,
                    year: examYear,
                    semester: examSemester,
                    moed: examDateSelection,  // העברת הנתונים בגוף הבקשה, לא ב-params
                }, 
                {
                    headers: addAuthHeaders()  // הוספת הכותרת המתאימה
                } 
            );

            if (response.data.success) {
                if (response.data.has_link) {
                    alert("המבחן כבר קיים במערכת. את/ה מוזמנ/ת להוריד אותו");
                } else {
                    openModal();
                    setIsFileUploaded(false); // Reset the file upload state
                }
            } else {
                alert(`Failed to check the exam: ${response.data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error checking exam:', error);
            alert('An error occurred while checking the exam.');
        }
    };

    if (!courseDetails) {
        return <div>Loading...</div>;
    }
    return (
        <div className="upload-question-content-page">
            <Header />
            <div className='links-container'>
                <a href={`/home`} className="nav-result-link">
                    <span>דף הבית</span>
                </a>
                <IoIosArrowBack />
                <a href={`/course/${courseDetails.course_id}`} className="nav-result-link">
                    <span>קורס {courseDetails.course_id} - {courseDetails.name}</span>
                </a>
                <IoIosArrowBack />
                <a>
                    <span>{examYear} סמסטר {examSemester} מועד {examDateSelection}</span>
                </a>
            </div>
            <main className="content">
                <h1>דף מבחן</h1>
                {/* <div className="details-container">
                    <div className="detail-item">
                        <strong>קורס</strong> {courseDetails.course_id} - {courseDetails.name}
                    </div>
                    <div className="detail-item">
                        <strong>שנה</strong> {examYear}
                    </div>
                    <div className="detail-item">
                        <strong>סמסטר</strong> {examSemester}
                    </div>
                    <div className="detail-item">
                        <strong>מועד</strong> {examDateSelection}
                    </div>
                </div> */}
                <div className="action-buttons">
                    {examExist ?
                        (<button
                            className="action-button"
                            onClick={downloadExamPdf}
                        >
                            הורדת המבחן המלא
                        </button>) :
                        (<button
                            className="action-button"
                            onClick={addExamPdf}
                        >
                            העלאת המבחן המלא
                        </button>)}
                    <button
                        className="action-button"
                        onClick={() => {
                            openQuestionModal();
                            console.log(isQuestionModalOpen);
                        }}
                    >
                        העלאת שאלה חדשה
                    </button>
                    {solutionExist ?
                            (<button
                                className="action-button"
                                onClick={downloadSolutionPdf}
                            >
                                הורדת הפיתרון המלא
                            </button>) :
                            (<button
                                className="action-button"
                                onClick={() => {
                                    openSolutionModal();
                                }}
                            >
                                העלאת פיתרון המבחן
                            </button>)
                    }
                    {isQuestionModalOpen && (
                        <div className="modal-overlay">
                            <div className="modal-content-question">
                                <p>
                                    הזן את מספר השאלה שברצונך להעלות
                                </p>
                                <input
                                    type="number"
                                    value={questionNum}
                                    onChange={(e) => setQuestionNum(e.target.value)}
                                    placeholder='מספר שאלה'
                                    className="search-input-question"
                                    min="1"
                                />
                                <div className="modal-buttons">
                                    <button class="confirm-button-question" onClick={() => handleConfirmClick()}>
                                        אישור
                                    </button>
                                    <button class="confirm-button-question" onClick={closeQuestionModal}>
                                        ביטול
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="updates-container">
                    <h3>שאלות במבחן זה</h3>
                    <label className='checkbox-solution'>
                        <input
                            type="checkbox"
                            checked={onlyWithSolution}
                            onChange={handleCheckboxChange}
                            />
                            הצג שאלות עם פתרון בלבד
                        </label>
                    <ul className="results-list">
                        {isLoading ? (
                            <div className="loading-container">
                                <FaSpinner className="spinner" size={60} />
                                <span className="loading-text">טוען שאלות...</span>
                            </div>
                        ) : (
                            sortedQuestions && Array.isArray(sortedQuestions) && sortedQuestions.length > 0 ? (
                                sortedQuestions.map((result, index) => (
                                    (!onlyWithSolution || (onlyWithSolution && hasSolution[index])) && (
                                        <li key={result.question_id} className="result-item">
                                            <a href={`/question/${courseId}/${result.year}/${result.semester}/${result.moed}/${result.question_number}`} className="result-link">
                                                <span>שאלה מספר {result.question_number}</span>
                                            </a>
                                        </li>
                                    )
                                ))
                            ) : (
                                <p>לא נמצאו שאלות</p>
                            )
                        )}
                    </ul>
                    
                </div>
                <div>
                    {isModalOpen && !isFileUploaded && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <button className="modal-close" onClick={closeModal}>X</button>
                                <h2>העלה קובץ מבחן</h2>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="application/pdf"
                                />
                                <div className="modal-actions">
                                    <button
                                        className="upload-btn"
                                        onClick={() => handleFileUpload()}  // Pass lines to the upload function
                                    >
                                        Upload
                                    </button>
                                    <button className="cancel-btn" onClick={closeModal}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {isSolutionModalOpen && !isSolutionUploaded && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <button className="modal-close" onClick={closeSolutionModal}>X</button>
                                <h2>העלה קובץ פיתרון</h2>
                                <input
                                    type="file"
                                    onChange={handleSolutionChange}
                                    accept="application/pdf"
                                />
                                <div className="modal-actions">
                                    <button
                                        className="upload-btn"
                                        onClick={() => handleSolutionUpload}  // Pass lines to the upload function
                                    >
                                        Upload
                                    </button>
                                    <button className="cancel-btn" onClick={closeSolutionModal}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {isSolutionUploaded && solutionFile && (
                        <div className="modal-overlay">
                            <div className="modal-content-line-selection">
                                {/*<button className="modal-close" onClick={closeModal}>X</button>*/}
                                <PdfLineMark
                                    file={solutionFile}
                                    closeModal={closeSolutionModal}
                                    onLinesChange={setLines}// Capture lines drawn by the user
                                    onSubmitLines={handleSubmitSolutionLines} // Pass the function to handle line submission
                                    userPrompt="בחר את נקודות ההפרדה בין התשובות (הקו הראשון בתחילת שאלה 1 והאחרון בסוף השאלה האחורנה)"
                                />
                            </div>
                        </div>
                    )}

                    {/* Modal for Line Selection after file is uploaded */}
                    {isFileUploaded && examFile && (
                        <div>
                            {/*<p className="modal-title">בחר את נקודות ההפרדה בין השאלות (הקו הראשון בתחילת שאלה 1 והאחרון בסוף השאלה האחורנה)</p>*/}
                            <div>
                                {/*<button className="modal-close" onClick={closeModal}>X</button>*/}
                                <PdfLineMark
                                    file={examFile}
                                    closeModal={closeModal}
                                    onLinesChange={setLines}// Capture lines drawn by the user
                                    onSubmitLines={handleSubmitLines} // Pass the function to handle line submission
                                    userPrompt="בחר את נקודות ההפרדה בין השאלות (הקו הראשון בתחילת שאלה 1 והאחרון בסוף השאלה האחורנה)"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer/>
        </div>
    );
}
export default Exam;

