// 


// Question.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BsEmojiSmile } from "react-icons/bs";
import { FaRegCommentAlt, FaCommentAlt } from 'react-icons/fa';
import { BiDownArrow, BiSolidUpArrow } from "react-icons/bi";
import Header from '../Header/Header';
import Footer from '../Footer/Footer';  // ייבוא הפוטר
import './Question.css';
import { useNavigate } from "react-router-dom";




function Question() {
    const { courseId, examYear, examSemester, examDateSelection, questionNum } = useParams();  // מקבלים את שם הקורס מה-URL
    const [courseDetails, setCourseDetails] = useState(null);
    const [questionPdfUrl, setQuestionPdfUrl] = useState(null);
    const [answerPdfUrl, setAnswerPdfUrl] = useState(null);
    const [answerFile, setAnswerFile] = useState(null);
    const [visiblePDF, setVisiblePDF] = useState('question'); 
    const [activeRepliedComment, setActiveRepliedComment] = useState(null);
    const [activeReactedComment, setActiveReactedComment] = useState(null);
    const [allComments, setAllComments] = useState([]); // שמירה של רשימת ההודעות
    const [chatInput, setchatInput] = useState(""); // הודעה חדשה
    const [replyInput, setReplyInput] = useState(""); // הודעה חדשה
    const [isUploading, setIsUploading] = useState(false);
    const [expandReplies, setExpandReplies] = useState({});
    const [usernames, setUsernames] = useState({});
    const [question, setQuestion] = useState([]);
    const [reactionsForComment, setReactionsForComment] = useState(null);
    const emojies = {"Love":"❤️", "Like":"👍", "Thanks":"🙏🏼", "Plus":"➕", "King":"👑"};
    const [isModalOpen, setIsModalOpen] = useState(false); // New state for modal visibility
    const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
    const [isCourseManager, setIsCourseManager] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const navigate = useNavigate();





    const toggleReactionsWindow = (comment) => {
        setReactionsForComment(reactionsForComment === comment ? null : comment);
      };
      
    const showReactionsDetails= (reactions) => {
        return reactions.map((reaction, index) => (
          <div class="reaction-table-row" key={index}>
            <div class="reaction-table-cell">{emojies[reaction.emoji]}</div>
            <div class="reaction-table-cell">{usernames[reaction.user_id] || "טוען..."}</div>
          </div>
        ));
      };

      useEffect(() => {
        const fetchUsernames = async () => {
          const newUsernames = {};
          for (const comment of allComments) {
            for (const reaction of comment.reactions) {
                if (!usernames[reaction.user_id]) {
                    try {
                        const response = await axios.get('http://localhost:5001/api/get_user_name', {
                            params: { user_id: reaction.user_id }
                        });
                        console.log(response.data)
                        if (response.data.success) {
                            newUsernames[reaction.user_id] = response.data.data;
                        }
                    } catch (error) {
                        console.error(`שגיאה בקבלת שם משתמש עבור ${reaction.user_id}:`, error);
                    }
                }
            }
          }
          setUsernames(prev => ({ ...prev, ...newUsernames }));
        };
    
        fetchUsernames();
      }, [allComments]);

    const handleArrowClick = (commentId) => {
        setExpandReplies((prev) => ({
            ...prev,
            [commentId]: !prev[commentId], // החלפת המצב של תגובה מסוימת
        }));
    };

    const getUserReactionForComment = (comment) => {
        // מחפש את התגובה של המשתמש עם user_id תואם
        const userReaction = comment.reactions.find(reaction => reaction.user_id === localStorage.getItem('user_id'));
        
        // אם נמצאה תגובה למשתמש, מחזירים את האימוג'י שלה, אחרת מחזירים null
        return userReaction ? userReaction : null;
    }

    const handleAddEmoji = async (commentId, emoji) => {
       setActiveReactedComment(null)
       const formData = new FormData();
            formData.append('course_id', courseId);
            formData.append('year', examYear);
            formData.append('semester', examSemester);
            formData.append('moed', examDateSelection);
            formData.append('question_number', questionNum);
            formData.append('comment_id', commentId);
            formData.append('user_id', localStorage.getItem('user_id'));
            formData.append('emoji', emoji);
        
            try {
                // Make the API call
                const response = await axios.post('http://localhost:5001/api/course/add_reaction', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
        
                // Handle success
                if (response.data.success) {
                    updateComments();
                } else {
                    // Handle failure
                    alert(`Failed to add reaction: ${response.data.message}`);
                }
            } catch (error) {
                // Handle error
                console.error("Error adding reaction:", error);
                alert("An error occurred while adding the reaction.");
            }
      };
    
    const handleRemoveEmoji = async (comment_id, reaction_id) => {
        setActiveReactedComment(null)
        const formData = new FormData();
            formData.append('course_id', courseId);
            formData.append('year', examYear);
            formData.append('semester', examSemester);
            formData.append('moed', examDateSelection);
            formData.append('question_number', questionNum);
            formData.append('comment_id', comment_id);
            formData.append('reaction_id', reaction_id);
        
            try {
                // Make the API call
                const response = await axios.post('http://localhost:5001/api/course/remove_reaction', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
        
                // Handle success
                if (response.data.success) {
                    updateComments();
                } else {
                    // Handle failure
                    alert(`Failed to remove reaction: ${response.data.message}`);
                }
            } catch (error) {
                // Handle error
                console.error("Error removing reaction:", error);
                alert("An error occurred while removing the reaction.");
            }
      };
      const openModal = () => setIsModalOpen(true); // Open modal
      const closeModal = () => {
          setIsModalOpen(false);
          setAnswerFile(null); // Reset file input
      };
      const openSolutionModal = () => setIsSolutionModalOpen(true);
      const closeSolutionModal = () => setIsSolutionModalOpen(false);

      const handleFileChange = (e) => setAnswerFile(e.target.files[0]);

      const handleFileUpload = async () => {
        if (!answerFile) {
            alert("Please select a file to upload.");
            return;
        }
    
        const formData = new FormData();
        formData.append('course_id', courseId);
        formData.append('year', examYear);
        formData.append('semester', examSemester);
        formData.append('moed', examDateSelection);
        formData.append('pdf_exam', answerFile); // Adjust the key if needed for your backend API
    
        try {
            const response = await axios.post('http://localhost:5001/api/course/uploadFullExamPdf', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            if (response.data.success) {
                alert("File uploaded successfully!");
                closeModal();
            } else {
                alert(`Failed to upload file: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("An error occurred while uploading the file.");
        }
    };
    

    const handleReplyClick = (commentId) => {
        setActiveRepliedComment(activeRepliedComment === commentId ? null : commentId);
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
        axios.post('http://localhost:5001/api/course/search_question_by_specifics', {
            course_id: courseId,
            year: examYear,
            semester: examSemester,
            moed: examDateSelection,
            question_number: questionNum
        })
        .then(response => {
            const parsedResponse = JSON.parse(response.data.data);  // המרת המחרוזת לאובייקט    
            if (parsedResponse.status === "success" && parsedResponse.data.length === 1) {
                setAllComments(parsedResponse.data[0].comments_list)
                setchatInput([]);
                setReplyInput([]);
                setActiveRepliedComment(null);
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

    const handleSolutionUpload = async () => {
        if (!answerFile) {
            alert("Please select a file to upload.");
            return;
        }
    
        const formData = new FormData();
        formData.append('course_id', courseId);
        formData.append('year', examYear);
        formData.append('semester', examSemester);
        formData.append('moed', examDateSelection);
        formData.append('question_number', questionNum);
        formData.append('solution_file', answerFile); // Adjust the key for your backend
    
        try {
            const response = await axios.post('http://localhost:5001/api/course/uploadSolution', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            if (response.data.success) {
                alert("Solution uploaded successfully!");
                closeSolutionModal();
            } else {
                alert(`Failed to upload solution: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Error uploading solution:", error);
            alert("An error occurred while uploading the solution.");
        }
    };
    

    const handleSendClick = async (chatInput, prevId) => {
        if(chatInput !== ""){
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
            axios.post('http://localhost:5001/api/course/search_question_by_specifics', {
                course_id: courseId,
                year: examYear,
                semester: examSemester,
                moed: examDateSelection,
                question_number: questionNum
            })
            .then(response => {
                const parsedResponse = JSON.parse(response.data.data);  // המרת המחרוזת לאובייקט    
                if (parsedResponse.status==="success" && parsedResponse.data.length === 1) {
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
    }, [courseId, examYear, examSemester, examDateSelection, questionNum]); 

    useEffect(() => {
        const checkCourseManager = async () => {
            try {
                const response = await axios.post('http://localhost:5001/api/course/is_course_manager', {
                    course_id: courseId,
                    user_id: localStorage.getItem('user_id'), 
                });
                if (response.data.success) {
                    console.log("Course manager status:", response.data.is_manager);
                    setIsCourseManager(response.data.is_manager);
                } else {
                    console.error("Error checking course manager:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching course manager status:", error);
            }
        };
    
        checkCourseManager();
    }, [courseId]);
    

    const countReactionsForComment = (reactions) => {
        const reactionsCounter = new Map()
        Object.entries(emojies).forEach(([key, value]) => {
            reactionsCounter.set(key, 0);
        });
        reactions.forEach((reaction) => {
                reactionsCounter.set(reaction.emoji, reactionsCounter.get(reaction.emoji) + 1);
            });
        return reactionsCounter
    }

    const showUsersReactions = (reactionsCounter) => {
        return Array.from(reactionsCounter.entries()).map(([emoji, count]) => (
            count > 0 && <div>
                {emojies[emoji]}
            </div>
        ))
    }

    const renderComments = (comments) => {
        return comments.map((comment) => (
            <div key={comment.comment_id} className="comment-box" onMouseLeave={() => setActiveReactedComment(null)}>
                <div className="comment-content">
                    <div className="comment-header">
                        <span className="comment-writer">{comment.writer_name}</span>
                    </div>
                    {comment.reactions.length > 0 && 
                        <button className="users-reactions-window" onClick={() => toggleReactionsWindow(comment)}>
                            {showUsersReactions(countReactionsForComment(comment.reactions))}
                            <div style={{ fontSize: "16px" }}> {comment.reactions.length}</div>
                        </button>}
                    {activeReactedComment === comment.comment_id && (
                        <div className="emojies-window" onMouseLeave={() => setActiveReactedComment(null)}>
                        {Object.entries(emojies).map(([word, emoji]) => (
                                <div type="button" className="emoji" onClick={() => handleAddEmoji(comment.comment_id, word)}>
                                    {emoji} {/* תציג את האימוג'י */}
                                </div>
                            ))}
                        </div>
                    )}
                    {comment.comment_text}
                </div>
                <div className="comment-options">
                    <div className="comment-timestamp" onMouseEnter={() => setActiveReactedComment(null)}>
                        {new Date(comment.date).toLocaleString('he-IL', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                        }).replace(',', ' // ')}
                    </div>
                    {getUserReactionForComment(comment) == null ? (
                        <button 
                            className="reaction-button" 
                            onMouseEnter={() => setActiveReactedComment(comment.comment_id)}
                        >
                                <BsEmojiSmile size={"15px"} /> 
                        </button>
                    ) : (
                        <button 
                            className="small-emoji" 
                            onClick={() => {handleRemoveEmoji(comment.comment_id, getUserReactionForComment(comment).reaction_id)}}
                            onMouseEnter={() => setActiveReactedComment(comment.comment_id)}
                        >
                            {emojies[getUserReactionForComment(comment).emoji]}    
                        </button>
                    )}
                    <button
                        type="button"
                        className="reaction-button"
                        onMouseEnter={() => setActiveReactedComment(null)}
                        onClick={() => {
                            !expandReplies[comment.comment_id] && handleArrowClick(comment.comment_id);
                            handleReplyClick(comment.comment_id);
                        }}
                    >
                        {activeRepliedComment === comment.comment_id ? <FaCommentAlt /> : <FaRegCommentAlt />}
                    </button>
                    {comment.replies.length > 0 && (
                        <button 
                            type="button" 
                            className="reaction-button" 
                            onClick={() => {
                                activeRepliedComment === comment.comment_id && setActiveRepliedComment(null);
                                handleArrowClick(comment.comment_id)
                            }}
                        >
                            {expandReplies[comment.comment_id] ? <BiSolidUpArrow size={"16px"}/> : <BiDownArrow  size={"16px"}/>}
                        </button>
                    )}
                </div>            
        
                {/* תגובות משנה */}
                {expandReplies[comment.comment_id] && (
                    <div className="replies-container" onMouseEnter={() => setActiveReactedComment(null)}>
                        {renderComments(comment.replies)}
                        {activeRepliedComment === comment.comment_id && (
                            <form className="reply-form">
                                <input
                                    type="text"
                                    placeholder={`כתיבת תגובה ל${comment.writer_name}...`} 
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
        setVisiblePDF(criteria);
    };
    

    const downloadExamPdf = async () => {
        try {
            const response = await axios.post(
                'http://localhost:5001/api/course/downloadExamPdf',
                {
                    course_id: courseId,
                    year: examYear,
                    semester: examSemester,
                    moed: examDateSelection,
                },
                {
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
    const handleAddSolution = async () => {
        try {
            const response = await axios.post('http://localhost:5001/api/checkExistSolution', {
                course_id: courseId,
                year: examYear,
                semester: examSemester,
                moed: examDateSelection,
                question_number: questionNum,
            });
            if (response.data.success) {
                if (response.data.has_link) {
                    alert("הפתרון כבר קיים במערכת. את/ה מוזמנ/ת לגשת אליו");
                } else {
                    openSolutionModal();
                }
            } else {
                alert(`Failed to check the exam: ${response.data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error checking exam:', error);
            alert('An error occurred while checking the exam.');
        }
    };
    
    const handleEditQuestion = async () => {
    }
    
    const handleDeleteQuestion = () => {
        setIsDeleteModalOpen(true);
    };
    const confirmDeleteQuestion = async () => {
        try {
            // Call the backend API to delete the question
            const response = await axios.delete('http://localhost:5001/api/course/delete_question', {
                data: {
                    course_id: courseId,
                    year: examYear,
                    semester: examSemester,
                    moed: examDateSelection,
                    question_number: questionNum,
                }
            });
    
            if (response.data.success) {
                console.log("Question deleted successfully.");
                setIsDeleteModalOpen(false); // Close the modal after deleting
                navigate(`/course/${courseId}`); // Navigate to the course page
            } else {
                console.error("Error deleting question:", response.data.message);
            }
        } catch (error) {
            console.error("Error deleting question:", error);
        }
    };
    
    const cancelDeleteQuestion = () => {
        setIsDeleteModalOpen(false); // Close the modal without deleting
    };
    const adddExamPdf = async () => {
        try {
            const response = await axios.post('http://localhost:5001/api/checkExamFullPdf', {
                course_id: courseId,
                year: examYear,
                semester: examSemester,
                moed: examDateSelection,
            });

            if (response.data.success) {
                if (response.data.has_link) {
                    alert("המבחן כבר קיים במערכת. את/ה מוזמנ/ת להוריד אותו");
                } else {
                    openModal(); // Open modal for file upload
                }
            } else {
                alert(`Failed to check the exam: ${response.data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error checking exam:', error);
            alert('An error occurred while checking the exam.');
        }
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
          if (comment.prev_id !== "0") {
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
                    <button
                        className="tab download-tab"
                        onClick={downloadExamPdf}
                    >
                        הורד את כל המבחן
                    </button>
                    <button
                        className="tab download-tab"
                        onClick={adddExamPdf}
                    >
                        העלאת המבחן השלם
                    </button>
                    <button
                        className="tab download-tab"
                        onClick={handleAddSolution}
                    >
                        הוספת פתרון מרצה
                    </button>
                    {/* Render manager-only buttons */}
                    {isCourseManager && (
                        <>
                            <button
                                className="tab download-tab edit-question-button"
                                onClick={handleEditQuestion}
                            >
                                עריכת שאלה
                            </button>
                            <button 
                                className="tab download-tab button-danger" 
                                onClick={handleDeleteQuestion}
                            >
                                מחיקת שאלה
                            </button>
                        </>
                    )}
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
                                    <div>
                                        <p>לשאלה זו אין פתרון</p>
                                        <button className="upload-answer-button" onClick={handleUploadClick}>העלה פתרון רשמי</button>
                                    </div>
                                ) : (
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
                            {reactionsForComment && (
                                <div className="modal-overlay" onClick={()=>setReactionsForComment(null)}>
                                    <div className="reactions-modal-content">
                                        {showReactionsDetails(reactionsForComment.reactions)}
                                    </div>
                                </div>
                            )}
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
                                setActiveRepliedComment(null);}}
                            onChange={(e) => setchatInput(e.target.value)}
                            className="chat-input"
                        />
                        <button type="button" className="send-button" onClick={() => handleSendClick(chatInput, "0")}>שלח</button>
                    </form>
                    {isModalOpen && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <button className="modal-close" onClick={closeModal}>X</button>
                                <h2>Upload Exam File</h2>
                                <input type="file" onChange={handleFileChange} />
                                <div className="modal-actions">
                                    <button className="upload-btn" onClick={handleFileUpload}>Upload</button>
                                    <button className="cancel-btn" onClick={closeModal}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {isDeleteModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>האם את/ה בטוח/ה?</h2>
                            <p>מחיקת השאלה תמחק את השאלה ואת כל הנתונים הקשורים אליה.</p>
                            <div className="modal-actions">
                                <button className="confirm-btn" onClick={confirmDeleteQuestion}>
                                    המשך
                                </button>
                                <button className="cancel-btn" onClick={cancelDeleteQuestion}>
                                    בטל
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                    {isSolutionModalOpen && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <button className="modal-close" onClick={closeSolutionModal}>X</button>
                                <h2>Upload Solution File</h2>
                                <input type="file" onChange={handleFileChange} />
                                <div className="modal-actions">
                                    <button className="upload-btn" onClick={handleSolutionUpload}>Upload</button>
                                    <button className="cancel-btn" onClick={closeSolutionModal}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}    
export default Question;

