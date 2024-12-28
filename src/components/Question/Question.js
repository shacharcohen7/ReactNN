// Question.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaRegThumbsUp, FaRegThumbsDown  } from "react-icons/fa";
import { FaRegCommentAlt, FaCommentAlt } from 'react-icons/fa';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';  // ייבוא הפוטר
import './Question.css';

function Question() {
    const { courseId, examYear, examSemester, examDateSelection, questionNum } = useParams();  // מקבלים את שם הקורס מה-URL
    const [courseDetails, setCourseDetails] = useState(null);
    const [questionPdfUrl, setQuestionPdfUrl] = useState(null);
    const [answerPdfUrl, setAnswerPdfUrl] = useState(null);
    const [answerFile, setAnswerFile] = useState(null);
    const [visiblePDF, setVisiblePDF] = useState('question'); 
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [allComments, setAllComments] = useState([]); // שמירה של רשימת ההודעות
    const [chatInput, setchatInput] = useState(""); // הודעה חדשה
    const [replyInput, setReplyInput] = useState(""); // הודעה חדשה
    const [isUploading, setIsUploading] = useState(false);
    const [question, setQuestion] = useState([]);
    const navigate = useNavigate();  // יצירת אובייקט navigate

    const handleReplyClick = (commentId) => {
        setActiveCommentId(activeCommentId === commentId ? null : commentId);
        setReplyInput([]);  // לדוגמה, לאפס את שדה הקלט
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
                // navigate(`/question/${courseId}/${examYear}/${examSemester}/${examDateSelection}/${questionNum}`);
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

    const handleKeyDown = (chatInput, prevId) => (e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // מונע את ריענון הדף
          handleSendClick(chatInput, prevId);
        }
      };

    const updateComments = async () => {
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
                setAllComments(parsedResponse.data[0].comments_list)
                setchatInput([]);
                setReplyInput([]);
                setActiveCommentId(null);
            } else {
                setQuestion([]); // אם אין תוצאות או יש יותר מתוצאה אחת, לנקות את ה-state
            }
        })
        .catch(error => {
            console.error('שגיאה בחיפוש שאלה ספציפית:', error);
            setQuestion([]); // אם קרתה שגיאה, לנקות את ה-state
            alert("אירעה שגיאה בחיפוש שאלה ספציפית");
        });
    }

    const handleSendClick = async (chatInput, prevId) => {
        if(chatInput != ""){
            const formData = new FormData();
            formData.append('course_id', courseId);
            formData.append('year', examYear);
            formData.append('semester', examSemester);
            formData.append('moed', examDateSelection);
            formData.append('question_number', questionNum);
            formData.append('writer_name', localStorage.getItem('first_name') + ' ' + localStorage.getItem('last_name'));
            formData.append('prev_id', prevId);
            formData.append('comment_text', chatInput);
        
            try {
                // Make the API call
                const response = await axios.post('http://localhost:5001/api/course/add_comment', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
        
                // Handle success
                if (response.data.success) {
                    updateComments();
                } else {
                    // Handle failure
                    alert(`Failed to add comment: ${response.data.message}`);
                }
            } catch (error) {
                // Handle error
                console.error("Error adding comment:", error);
                alert("An error occurred while adding the comment.");
            }
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
                    setQuestion(parsedResponse.data[0]);  // עדכון תוצאות החיפוש
                    setAllComments(parsedResponse.data[0].comments_list)
                } else {
                    setQuestion([]); // אם אין תוצאות או יש יותר מתוצאה אחת, לנקות את ה-state
                }
            })
            .catch(error => {
                console.error('שגיאה בחיפוש שאלה ספציפית:', error);
                setQuestion([]); // אם קרתה שגיאה, לנקות את ה-state
                alert("אירעה שגיאה בחיפוש שאלה ספציפית");
            });
        }
    }, [courseId]); 

    const renderComments = (comments) => {
        return comments.map((comment) => (
            <div key={comment.comment_id} className="comment-box">
                <div className="comment-content">
                    <div className="comment-header">
                        <span className="comment-writer">{comment.writer_name}</span>
                    </div>
                    {comment.comment_text}
                </div>
                <div className="comment-options">
                    <div className="comment-timestamp">
                        {new Date(comment.date).toLocaleString('he-IL', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        }).replace(',', ' // ')}
                    </div>
                    <button type="button" className="reaction-button">
                        <FaRegThumbsUp />
                    </button>
                    <button type="button" className="reaction-button">
                        <FaRegThumbsDown />
                    </button>
                    <button
                        type="button"
                        className="reaction-button"
                        onClick={() => handleReplyClick(comment.comment_id)}
                    >
                        {activeCommentId === comment.comment_id ? (<FaCommentAlt />) : (<FaRegCommentAlt />)}
                    </button>
                </div>            
        
                {/* תגובות משנה */}
                {comment.replies && (
                <div className="replies-container">
                    {renderComments(comment.replies)}
                    {activeCommentId === comment.comment_id && (
                        <form className="reply-form">
                            <input
                                type="text"
                                placeholder="כתיבת תגובה..."
                                value={replyInput}
                                onKeyDown={handleKeyDown(replyInput, comment.comment_id)}
                                onChange={(e) => setReplyInput(e.target.value)}
                                className="reply-input"
                                autoFocus
                            />
                            <button 
                                type="button" 
                                className="reply-button" 
                                onClick={() => handleSendClick(replyInput, comment.comment_id)}
                            >
                                שלח
                            </button>
                        </form>
                    )}
                </div>
                )}
            </div>
        ));
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
    }, [courseId]);

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
    }, [courseId]);

    const handlePDFChange = (criteria) => {
        setVisiblePDF(criteria);
    };

    const organizeComments = (comments) => {
        const commentMap = new Map();
        const topLevelComments = [];
      
        // הוספת כל תגובה למפה לפי ה-id שלה
        comments.forEach((comment) => {
          commentMap.set(comment.comment_id, { ...comment, replies: [] });
        });
      
        // יצירת היררכיה של תגובות (אם יש תגובות תחת תגובות אחרות)
        comments.forEach((comment) => {
          if (comment.prev_id != "0") {
            const parentComment = commentMap.get(comment.prev_id);
            if (parentComment) {
              parentComment.replies.push(commentMap.get(comment.comment_id));
            }
          } else {
            topLevelComments.push(commentMap.get(comment.comment_id));
          }
        });
      
        return topLevelComments;
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
                        <strong>שנה</strong> {question.year}
                    </div>
                    <div className="detail-item">
                        <strong>סמסטר</strong> {question.semester}
                    </div>
                    <div className="detail-item">
                        <strong>מועד</strong> {question.moed}
                    </div>
                    <div className="detail-item">
                        <strong>שאלה</strong> {question.question_number}
                    </div>
                </div>
                <div className="details-container">
                    <div className="detail-item">
                        <strong>נושאי השאלה:</strong> {question.question_topics && question.question_topics.join(', ')}
                    </div>
                </div>
                <div className="tabs-container">
                    <button
                        className={`tab ${visiblePDF === 'question' ? 'active' : ''}`}
                        onClick={() => handlePDFChange('question')}
                    >
                        שאלה
                    </button>
                    <button
                        className={`tab ${visiblePDF === 'answer' ? 'active' : ''}`}
                        onClick={() => handlePDFChange('answer')}
                    >
                        פתרון
                    </button>
                </div>
                {visiblePDF === 'question' && (
                    <div className="pdf-form">
                        {questionPdfUrl ? (
                            <iframe src={questionPdfUrl} width="100%" height="600px" title="PDF Viewer" />
                        ) : (
                            <p>Loading PDF...</p>
                        )}
                    </div>
                )}
                {visiblePDF === 'answer' && (
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
                    {allComments && allComments.length > 0 ? (
                        <div className="comments-container">
                            {renderComments(organizeComments(allComments))}
                        </div>
                    ) : (
                        <div className="comments-container">
                            <div className="no-comments">אין תגובות</div>
                        </div>
                    )}
                    <form className="chat-form">
                        <input
                            type="text"
                            placeholder="כתיבת תגובה..."
                            value={chatInput}
                            onKeyDown={handleKeyDown(chatInput, "0")}
                            onFocus={() => {
                                setReplyInput([]);
                                setActiveCommentId(null);}}
                            onChange={(e) => setchatInput(e.target.value)}
                            className="chat-input"
                        />
                        <button type="button" className="send-button" onClick={() => handleSendClick(chatInput, "0")}>שלח</button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Question;
