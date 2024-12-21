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
    const [PDF, setPDF] = useState('question'); 
    const [messages, setMessages] = useState([]); // שמירה של רשימת ההודעות
    const [inputMessage, setInputMessage] = useState(""); // הודעה חדשה
    const navigate = useNavigate();  // יצירת אובייקט navigate

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim() !== "") {
            setMessages([...messages, inputMessage]); // הוספה לרשימה
            setInputMessage(""); // איפוס השדה
        }
    };

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
                        <strong>שנה</strong> {examYear}
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
                <div className="tabs-container">
                    <button
                        className={`tab ${PDF === 'question' ? 'active' : ''}`}
                        onClick={() => handlePDFChange('question')}
                    >
                        שאלה
                    </button>
                    <button
                        className={`tab ${PDF === 'solution' ? 'active' : ''}`}
                        onClick={() => handlePDFChange('solution')}
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
                {PDF === 'solution' && (
                    <div className="pdf-form">
                        {answerPdfUrl ? (
                            <iframe src={answerPdfUrl} width="100%" height="1000px" title="PDF Viewer" />
                        ) : (
                            <p>לשאלה זו אין פתרון מרצה</p>
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
                        <button type="submit" className="chat-submit">שלח</button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Question;
