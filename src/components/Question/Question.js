// Question.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Select from "react-select";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';  // ייבוא הפוטר
import './Question.css';

function Question() {
    const { courseId, examYear, examSemester, examDateSelection, questionNum } = useParams();  // מקבלים את שם הקורס מה-URL
    const [courseDetails, setCourseDetails] = useState(null);
    const [questionPdfUrl, setQuestionPdfUrl] = useState(null);
    const [answerPdfUrl, setAnswerPdfUrl] = useState(null);
    const [answerFile, setAnswerFile] = useState(null);
    const [PDF, setPDF] = useState('question'); 
    const [messages, setMessages] = useState([]); // שמירה של רשימת ההודעות
    const [inputMessage, setInputMessage] = useState(""); // הודעה חדשה
    const [isUploading, setIsUploading] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const navigate = useNavigate();  // יצירת אובייקט navigate

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim() !== "") {
            setMessages([...messages, inputMessage]); // הוספה לרשימה
            setInputMessage(""); // איפוס השדה
        }
    };

    const handleUploadClick = () => {
        setIsUploading(true); // מציג את טופס העלאת הקובץ
    };

    const handleCancelUploadClick = () => {
        setIsUploading(false); // מחזיר את התצוגה המקורית
    };

    const handleConfirmUploadClick = async () => {
        // Validate the inputs
        if (!answerFile) {
            alert("Please upload an answer file.");
            return;
        }

        const formData = new FormData();
        formData.append('course_id', courseId);
        formData.append('year', examYear);
        formData.append('semester', examSemester);
        formData.append('moed', examDateSelection);
        formData.append('question_number', questionNum);
        formData.append('pdf_answer', answerFile);
    
        try {
            // Make the API call
            const response = await axios.post('http://localhost:5001/api/course/upload_answer', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            // Handle success
            if (response.data.success) {
                alert("Answer uploaded successfully!");
                navigate(`/question/${courseId}/${examYear}/${examSemester}/${examDateSelection}/${questionNum}`);
            } else {
                // Handle failure
                alert(`Failed to upload answer: ${response.data.message}`);
            }
        } catch (error) {
            // Handle error
            console.error("Error uploading answer:", error);
            alert("An error occurred while uploading the answer.");
        }
    };

    useEffect(() => {
        if (courseId) {
            console.log("חיפוש שאלה ספציפית: ", { courseId, examYear, examSemester, examDateSelection, questionNum });
    
            // קריאה ל-API לחיפוש לפי מועד
            axios.post('http://localhost:5001/api/course/search_exam_by_specifics', {
                course_id: courseId,
                year: examYear,
                semester: examSemester,
                moed: examDateSelection,
                question_number: questionNum
            })
            .then(response => {
                const parsedResponse = JSON.parse(response.data.data);  // המרת המחרוזת לאובייקט    
                if (parsedResponse.status==="success" && parsedResponse.data.length == 1) {
                    setSearchResult(parsedResponse.data[0]);  // עדכון תוצאות החיפוש
                } else {
                    setSearchResult([]); // אם אין תוצאות או יש יותר מתוצאה אחת, לנקות את ה-state
                }
            })
            .catch(error => {
                console.error('שגיאה בחיפוש שאלה ספציפית:', error);
                setSearchResult([]); // אם קרתה שגיאה, לנקות את ה-state
                alert("אירעה שגיאה בחיפוש שאלה ספציפית");
            });
        }
    }, [courseId]); 

    useEffect(() => {
        if (courseId) {
            axios.get(`http://localhost:5001/api/course/get_course/${courseId}`)
            .then(response => {
                console.log('Response received:', response);
                
                if (response.data && response.data.status === 'success') {
                    console.log('Course data:', response.data.data); // הדפס את המידע שהתקבל
                    setCourseDetails(response.data.data);  // עדכון הסטייט עם פרטי הקורס
                } else {
                    console.error('Response does not contain valid course data', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching course details:', error);
            });
        }
    }, [courseId]); 

    useEffect(() => {
        const fetchQuestionPdf = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/course/get_question_pdf', {
                    params : {
                        course_id: courseId,
                        year: examYear,
                        semester: examSemester,
                        moed: examDateSelection,
                        question_number: questionNum,
                    },
                    responseType: 'blob', // חשוב כדי לקבל את הקובץ כ-BLOB
                });

                // יצירת URL מה-BLOB
                const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
                const pdfUrl = URL.createObjectURL(pdfBlob);

                setQuestionPdfUrl(pdfUrl); // שמירת ה-URL למצב
            } catch (error) {
                console.error('Error fetching PDF:', error);
            }
        };
        fetchQuestionPdf();
    }, [courseId, examYear, examSemester, examDateSelection, questionNum]);

    useEffect(() => {
        const fetchAnswerPdf = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/course/get_answer_pdf', {
                    params : {
                        course_id: courseId,
                        year: examYear,
                        semester: examSemester,
                        moed: examDateSelection,
                        question_number: questionNum,
                    },
                    responseType: 'blob', // חשוב כדי לקבל את הקובץ כ-BLOB
                });

                // יצירת URL מה-BLOB
                const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
                const pdfUrl = URL.createObjectURL(pdfBlob);

                setAnswerPdfUrl(pdfUrl); // שמירת ה-URL למצב
            } catch (error) {
                console.error('Error fetching PDF:', error);
            }
        };
        fetchAnswerPdf();
    }, [courseId, examYear, examSemester, examDateSelection, questionNum]);

    const handlePDFChange = (criteria) => {
        setPDF(criteria);
    };

    if (!courseDetails) {
        return <div>Loading...</div>;
    }
    return (
        <div className="upload-question-content-page">
            <Header />
            <main className="content">
                <h1>דף שאלה</h1>
                <div className="details-container">
                    <div className="detail-item">
                        <strong>קורס</strong> {courseDetails.course_id} - {courseDetails.name}
                    </div>
                    <div className="detail-item">
                        <strong>שנה</strong> {searchResult.year}
                    </div>
                    <div className="detail-item">
                        <strong>סמסטר</strong> {examSemester}
                    </div>
                    <div className="detail-item">
                        <strong>מועד</strong> {examDateSelection}
                    </div>
                    <div className="detail-item">
                        <strong>שאלה</strong> {questionNum}
                    </div>
                </div>
                <div className="details-container">
                    <div className="detail-item">
                        <strong>נושאי השאלה:</strong> {searchResult.question_topics && JSON.parse(searchResult.question_topics).join(', ')}
                    </div>
                </div>
                <div className="tabs-container">
                    <button
                        className={`tab ${PDF === 'question' ? 'active' : ''}`}
                        onClick={() => handlePDFChange('question')}
                    >
                        שאלה
                    </button>
                    <button
                        className={`tab ${PDF === 'answer' ? 'active' : ''}`}
                        onClick={() => handlePDFChange('answer')}
                    >
                        פתרון
                    </button>
                </div>
                {PDF === 'question' && (
                    <div className="pdf-form">
                        {questionPdfUrl ? (
                            <iframe src={questionPdfUrl} width="100%" height="600px" title="PDF Viewer" />
                        ) : (
                            <p>Loading PDF...</p>
                        )}
                    </div>
                )}
                {PDF === 'answer' && (
                    <div className="pdf-form">
                        {answerPdfUrl ? (
                            <iframe src={answerPdfUrl} width="100%" height="1000px" title="PDF Viewer" />
                        ) : (
                            <div>
                                {!isUploading ? (
                                    // תצוגה מקורית
                                    <div>
                                        <p>לשאלה זו אין פתרון</p>
                                        <button className="upload-answer-button" onClick={handleUploadClick}>העלה פתרון רשמי</button>
                                    </div>
                                ) : (
                                    // טופס העלאת קובץ
                                    <div>
                                        <form>
                                            <input
                                                className="question-content-field"
                                                type="file"
                                                onChange={(e) => setAnswerFile(e.target.files[0])}
                                                required
                                            />
                                            <div>
                                            <div className="question-button-row">
                                                <button className="upload-answer-button" onClick={handleConfirmUploadClick}>
                                                    אישור
                                                </button>
                                                <button className="upload-answer-button" onClick={handleCancelUploadClick}>
                                                    ביטול
                                                </button>
                                            </div>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
                 <div className="chat-container">
                    <div className="chat-box">
                        {messages.length === 0 ? (
                            <div className="no-messages">אין עדיין תגובות, התחל את הדיון</div>
                        ) : (
                            messages.map((msg, index) => (
                                <div key={index} className="chat-message">
                                    {msg}
                                </div>
                            ))
                        )}
                    </div>
                    <form onSubmit={handleSendMessage} className="chat-form">
                        <input
                            type="text"
                            placeholder="הקלד הודעה..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            className="chat-input"
                        />
                        <button type="submit" className="send-message-button">שלח</button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Question;
