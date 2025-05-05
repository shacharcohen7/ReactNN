// Question.js
import React, { useState, useEffect , useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import { GoCheck } from "react-icons/go";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { IoAttach } from "react-icons/io5";
import { LuSendHorizontal } from "react-icons/lu";
import { CiFileOn } from "react-icons/ci";

import { BsEmojiSmile } from "react-icons/bs";
import { FaRegCommentAlt, FaCommentAlt } from 'react-icons/fa';
import { BiDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
import { PiPencilLineFill } from "react-icons/pi";

import Header from '../Header/Header';
import Footer from '../Footer/Footer';  // ייבוא הפוטר
import './Question.css';
import TokenManager from '../../utils/TokenManager';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from "react-router-dom";


function Question() {
    const { courseId, examYear, examSemester, examDateSelection, questionNum } = useParams(); 
    const [courseDetails, setCourseDetails] = useState(null);
    const [questionPdfUrl, setQuestionPdfUrl] = useState(null);
    const [allQuestions, setAllQuestions] = useState([]);  // התחלה של מערך ריק
    const [imageUrl, setImageUrl] = useState(null); // Define state for imageUrl
    const [answerImageUrl, setAnswerImageUrl] = useState(null); // Define state for imageUrl
    const [answerPdfUrl, setAnswerPdfUrl] = useState(null);
    const [answerFile, setAnswerFile] = useState(null);
    const [visiblePDF, setVisiblePDF] = useState('question'); 
    const [activeRepliedComment, setActiveRepliedComment] = useState(null);
    const [activeReactedComment, setActiveReactedComment] = useState(null);
    const [activeEditedComment, setActiveEditedComment] = useState(null);
    const [allComments, setAllComments] = useState([]); // שמירה של רשימת ההודעות
    const [commentMediaMap, setCommentMediaMap] = useState({}); // מילון תגובה -> מדיה
    const [showPictureForComment, setShowPictureForComment] = useState(null);
    const [showPictureWhileCommenting, setShowPictureWhileCommenting] = useState(false);
    const [chatInput, setchatInput] = useState(""); // הודעה חדשה
    const [replyInput, setReplyInput] = useState(""); // הודעה חדשה
    const [textareaHeight, setTextareaHeight] = useState(40); // גובה התיבה (בהתחלה 40)
    const [newText, setNewText] = useState(""); // הודעה חדשה
    const [isUploading, setIsUploading] = useState(false);
    const [expandReplies, setExpandReplies] = useState({});
    const [usernames, setUsernames] = useState({});
    const [question, setQuestion] = useState([]);
    const [reactionsForComment, setReactionsForComment] = useState(null);
    const emojies = {"Love":"❤️", "Like":"👍", "Thanks":"🙏🏼", "Plus":"➕", "King":"👑", "Fire":"🔥", "Clap":"👏"
        , "laugh":"😂", "sad":"☹️", "shocked":"😮"
    };
    const [isModalOpen, setIsModalOpen] = useState(false); // New state for modal visibility
    const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
    const [isCourseManager, setIsCourseManager] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const navigate = useNavigate();
    const [isDeleteCommentModalOpen, setIsDeleteCommentModalOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null); // Store the comment ID to delete
    const [commentsMetadata, setCommentsMetadata] = useState([]);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const [allTopics, setAllTopics] = useState([]);
    const [isTopicsModalOpen, setIsTopicsModalOpen] = useState(false);
    const [chosenTopics, setChosenTopics] = useState([]);
    const [notChosenTopics, setNotChosenTopics] = useState([]);
    const mainCommentFileRef = useRef(null);
    const replyCommentFileRef  = useRef(null);
    const [isEditDetailsModalOpen, setIsEditDetailsModalOpen] = useState(false);
    const [editCourseId, setEditCourseId] = useState(courseId);
    const [editYear, setEditYear] = useState(examYear);
    const [editSemester, setEditSemester] = useState(examSemester);
    const [editMoed, setEditMoed] = useState(examDateSelection);
    const [editQuestionNumber, setEditQuestionNumber] = useState(question.question_number);
    const [photoFile, setPhotoFile] = useState(null);

    const currentYear = new Date().getFullYear();
    const [isOpenCourseModalVisible, setIsOpenCourseModalVisible] = useState(false);

    const [ShowDeleteSolutionConfirmation, setShowDeleteSolutionConfirmation] = useState(false);
    const [IsSystemManager, setIsSystemManager] = useState(false);
    const textareaRef = useRef(null); // נשתמש ב־ref לגישה ל־textarea

    const [showSwapModal, setShowSwapModal] = useState(false);
    const [swapFile, setSwapFile] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const followButtonRef = useRef(null);

    const handleFileSwap = async () => {
        if (!swapFile) {
            alert("אנא בחר קובץ PDF או תמונה");
            return;
        }
    
        const formData = new FormData();
        formData.append('course_id', courseId);
        formData.append('year', examYear);
        formData.append('semester', examSemester);
        formData.append('moed', examDateSelection);
        formData.append('question_number', questionNum);
        formData.append('new_file', swapFile);
    
        try {
            const response = await axiosInstance.post(
                `${API_BASE_URL}/api/course/swap_question_file`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                }
            );
    
            if (response.data.success) {
                alert("הקובץ הוחלף בהצלחה");
                setShowSwapModal(false);
                // Refresh if needed
                // navigate(`/question/${courseId}/${examYear}/${examSemester}/${examDateSelection}/${questionNum}`);
                window.location.reload(); // 🔄 Force full refresh to reflect updated file

            } else {
                alert(`ההחלפה נכשלה: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Error swapping file:", error);
            alert("אירעה שגיאה בעת החלפת הקובץ");
        }
    };

    const addAuthHeaders = (headers = {}) => {
        const token = localStorage.getItem('access_token');  // הוצאת ה-token מ-localStorage
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;  // הוספת ה-token להדר Authorization
        }
        return headers;
    };

    const sortedQuestions = [...allQuestions].sort((a, b) => {
        // מיון לפי שנה
        if (a.question_number !== b.question_number) {
            return a.question_number - b.question_number;
        }
    });
    const handleDeleteSolution = async () => {
       
        try {
            const response = await axiosInstance.delete(`${API_BASE_URL}/api/course/deleteQuestionSolution`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                data: {
                    course_id: courseId,
                    year: examYear,
                    semester: examSemester,
                    moed: examDateSelection,
                    question_number: questionNum
                }
            });
    
            if (response.data.success) {
                alert("הפתרון נמחק בהצלחה.");
                // You might want to redirect or refresh after deletion
                    setShowDeleteSolutionConfirmation(false); // ❌ Close the modal
                // ✅ Trigger reload of solution using useEffect dependencies
                setAnswerPdfUrl(null);
                setAnswerImageUrl(null);
            } else {
                alert(`מחיקת הפתרון נכשלה: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Error deleting question:", error);
            alert("אירעה שגיאה בעת מחיקת הפתרון.");
        }
    };
    
    

    const { prevQuestion, nextQuestion } = useMemo(() => {
        const index = sortedQuestions.findIndex(q => q.question_number === Number(questionNum));
        return {
          prevQuestion: index > 0 ? sortedQuestions[index - 1] : null,
          nextQuestion: index < sortedQuestions.length - 1 ? sortedQuestions[index + 1] : null
        };
      }, [questionNum, sortedQuestions]);

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
                        const response = await axiosInstance.get(`${API_BASE_URL}/api/get_user_name`, {
                            params: {
                                user_id: reaction.user_id  
                            },
                            headers: addAuthHeaders()  
                        });
                        
                        console.log("response from get name by user_id", response.data)
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

      useEffect(() => {
        const fetchData = async () => {
            try {
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
        };    
        fetchData();
    }, []);

    
      

      useEffect(() => {
        const fetchInitialData = async () => {
            await updateComments();
        };
    
        fetchInitialData();
    }, []); // Empty dependency array ensures it runs only once on page load. 

    useEffect(() => {
        const fetchCourseTopics = async () => {
            try {
                const topicsResponse = await axiosInstance.get(`${API_BASE_URL}/api/course/get_course_topics`, {
                    params: { course_id: courseId },
                    headers: addAuthHeaders()
                });
                if (topicsResponse.data.status === 'success') {
                    setAllTopics(topicsResponse.data.data);
                } else {
                    console.error("Failed to fetch course topics:", topicsResponse.data.message);
                }
            } catch (err) {
                console.error("Error loading topics:", err);
            }
        };
    
        if (courseId) {
            fetchCourseTopics();
        }
    }, [courseId]);
    
    const handleArrowClick = (commentId) => {
        setExpandReplies((prev) => ({
            ...prev,
            [commentId]: !prev[commentId], // החלפת המצב של תגובה מסוימת
        }));
    };

    const getUserReactionForComment = (comment) => {
        // מחפש את התגובה של המשתמש עם user_id תואם
        const userReaction = comment.reactions.find(reaction => reaction.user_id === TokenManager.getUserIdFromToken());
        
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
            formData.append('emoji', emoji);
        
            try {
                // Make the API call
                const response = await axiosInstance.post(`${API_BASE_URL}/api/course/add_reaction`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
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
                const response = await axiosInstance.post(`${API_BASE_URL}/api/course/remove_reaction`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
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
    //   const openSolutionModal = () => setIsSolutionModalOpen(true);
    //   const closeSolutionModal = () => setIsSolutionModalOpen(false);

      const handleFileChange = (e) => setAnswerFile(e.target.files[0]);

      const CommentEditor = ({ initialText, onTextChange }) => {
        const [text, setText] = useState(initialText || "");  // אתחול עם הטקסט ההתחלתי אם יש
      
        useEffect(() => {
          if (initialText) {
            setText(initialText);  // אם יש טקסט חדש, עדכן את הסטייט
          }
        }, [initialText]);  // עדכון אם ה-prop משתנה
      
        const handleChange = (e) => {
            const newText = e.target.value;
            setText(newText); // עדכון הסטייט של הטקסט המקומי
          };
        
          const handleBlur = () => {
            // כאשר יוצאים מהשדה (או שומרים את הערך), שלח את הטקסט החדש
            if (onTextChange) {
              onTextChange(text);
            }
          };
        
        useEffect(() => {
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';  // מאפסים את הגובה
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;  // עדכון הגובה לפי התוכן
            }
        }, [text]);  // כל פעם שהטקסט משתנה
        
        return (
          <textarea
            //type="text"
            ref={textareaRef}  // קישור ל־ref
            value={text} // מציג את הטקסט בתיבת הקלט
            onChange={handleChange} // עדכון הטקסט במצב
            onBlur={handleBlur} // שולח את הטקסט אחרי שמפסיקים לערוך
            className="edit-input"
            // style={{
            //     resize: 'none', // מניעת שינוי גודל ידני
            //     overflowY: 'auto', // גלילה אם התיבה יותר גדולה מהגובה המקסימלי
            //     minHeight: '40px',  // גובה מינימלי (שתי שורות)
            //     width: '800px'
            //             }}
          />
        );
      };

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
            const response = await axiosInstance.post(`${API_BASE_URL}/api/course/uploadFullExamPdf`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
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

    // const handleConfirmUploadClick = async () => {
    //     // Validate the inputs
    //     if (!answerFile) {
    //         alert("Please upload an answer file.");
    //         return;
    //     }

    //     const formData = new FormData();
    //     formData.append('course_id', courseId);
    //     formData.append('year', examYear);
    //     formData.append('semester', examSemester);
    //     formData.append('moed', examDateSelection);
    //     formData.append('question_number', questionNum);
    //     formData.append('pdf_answer', answerFile);
    
    //    try {
    //        // Make the API call
    //        const response = await axios.post(`${API_BASE_URL}/api/course/upload_answer', formData, {
    //            headers: {
    //                'Content-Type': 'multipart/form-data',
    //                'Authorization': `Bearer ${localStorage.getItem('access_token')}` // Send token in header
    //            }
    //        });
    
    //         // Handle success
    //         if (response.data.success) {
    //             alert("Answer uploaded successfully!");
    //             // navigate(`/question/${courseId}/${examYear}/${examSemester}/${examDateSelection}/${questionNum}`);
    //         } else {
    //             // Handle failure
    //             alert(`Failed to upload answer: ${response.data.message}`);
    //         }
    //     } catch (error) {
    //         // Handle error
    //         console.error("Error uploading answer:", error);
    //         alert("An error occurred while uploading the answer.");
    //     }
    // };

    const handleKeyDown = (chatInput, prevId) => (e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // מונע את ריענון הדף
          //handleSendClick(chatInput, prevId);
        }
    };

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setchatInput(newValue);
    
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'; // מאפסים את הגובה
          const newHeight = Math.min(e.target.scrollHeight, 120); // הגובה המרבי של 4 שורות (במקרה זה 120px)
          textareaRef.current.style.height = `${newHeight}px`; // עדכון הגובה
        }
      };
    
    // const updateComments = async () => {
    //     axios.post(`${API_BASE_URL}/api/course/search_question_by_specifics', {
    //         course_id: courseId,
    //         year: examYear,
    //         semester: examSemester,
    //         moed: examDateSelection,
    //         question_number: questionNum
    //     })
    //     .then(response => {
    //         const parsedResponse = JSON.parse(response.data.data);  // המרת המחרוזת לאובייקט    
    //         if (parsedResponse.status === "success" && parsedResponse.data.length === 1) {
    //             setAllComments(parsedResponse.data[0].comments_list)
    //             setchatInput([]);
    //             setReplyInput([]);
    //             setActiveRepliedComment(null);
    //         } else {
    //             setQuestion([]); // אם אין תוצאות או יש יותר מתוצאה אחת, לנקות את ה-state
    //         }
    //     })
    //     .catch(error => {
    //         console.error('שגיאה בחיפוש שאלה ספציפית:', error);
    //         setQuestion([]); // אם קרתה שגיאה, לנקות את ה-state
    //         alert("אירעה שגיאה בחיפוש שאלה ספציפית");
    //     });
    // }

    // const updateComments = async () => {
    //     try {
    //         const response = await axiosInstance.post(`${API_BASE_URL}/api/course/search_question_by_specifics`, 
    //             {
    //                 course_id: courseId,
    //                 year: examYear,
    //                 semester: examSemester,
    //                 moed: examDateSelection,
    //                 question_number: questionNum
    //             },
    //             {
    //                 headers: addAuthHeaders()  // שלח את ההדרים המתאימים
    //             }
    //         );            
    //         const parsedResponse = JSON.parse(response.data.data);
    //         if (parsedResponse.status === "success" && parsedResponse.data.length === 1) {
    //             const questionData = parsedResponse.data[0];
    //             setAllComments(questionData.comments_list);
                
    //             setchatInput([]);
    //             setReplyInput([]);
    //             setActiveRepliedComment(null);
    
    //             // Fetch metadata for comments
    //             const metadataResponse = await axiosInstance.get(`${API_BASE_URL}/api/course/get_comments_metadata`, {
    //                 params: { question_id: questionData.question_id }, 
    //                 headers: addAuthHeaders()
    //             });
    
    //             if (metadataResponse.data.success) {
    //                 setCommentsMetadata(metadataResponse.data.comments_metadata); // Store metadata in a state
    //             } else {
    //                 console.error("Error fetching comments metadata:", metadataResponse.data.message);
    //                 setCommentsMetadata([])
    //             }
    //         } else {
    //             setQuestion([]);
    //             setCommentsMetadata([])

    //         }
    //     } catch (error) {
    //         console.error('Error updating comments:', error);
    //         setQuestion([]);
    //         alert("An error occurred while updating comments.");
    //     }
    // };
    
    const updateComments = async () => {
        try {
            const response = await axiosInstance.post(
                `${API_BASE_URL}/api/course/search_question_by_specifics`,
                {
                    course_id: courseId,
                    year: examYear,
                    semester: examSemester,
                    moed: examDateSelection,
                    question_number: questionNum
                },
                {
                    headers: addAuthHeaders()
                }
            );
    
            const parsedResponse = JSON.parse(response.data.data);
            if (parsedResponse.status === "success" && parsedResponse.data.length === 1) {
                const questionData = parsedResponse.data[0];
    
                setchatInput([]);
                setReplyInput([]);
                setActiveRepliedComment(null);
    
                // Fetch metadata for comments
                const metadataResponse = await axiosInstance.get(
                    `${API_BASE_URL}/api/course/get_comments_metadata`,
                    {
                        params: { question_id: questionData.question_id },
                        headers: addAuthHeaders()
                    }
                );
    
                if (metadataResponse.data.success) {
                    const metadata = metadataResponse.data.comments_metadata;
    
                    // Merge metadata into comments
                    const enrichedComments = questionData.comments_list.map(comment => {
                        const meta = metadata.find(m => m.comment_id === comment.comment_id);
                        return {
                            ...comment,
                            profile_picture_base64: meta?.profile_picture_base64 || null
                        };
                    });
    
                    setAllComments(enrichedComments);
                    setCommentsMetadata(metadata);
                } else {
                    console.error("Error fetching comments metadata:", metadataResponse.data.message);
                    setAllComments([]);
                    setCommentsMetadata([]);
                }
            } else {
                setQuestion([]);
                setAllComments([]);
                setCommentsMetadata([]);
            }
        } catch (error) {
            console.error('Error updating comments:', error);
            setQuestion([]);
            setAllComments([]);
            setCommentsMetadata([]);
            alert("An error occurred while updating comments.");
        }
    };
    
    const handleDeleteComment = (commentId) => {
        setCommentToDelete(commentId); // Store the comment ID
        setIsDeleteCommentModalOpen(true); // Open the modal
    };

    const confirmDeleteComment = async () => {
        if (!commentToDelete) return; // Ensure a comment is selected
        const formData = new FormData();
            formData.append('course_id', courseId);
            formData.append('year', examYear);
            formData.append('semester', examSemester);
            formData.append('moed', examDateSelection);
            formData.append('question_number', questionNum);
            formData.append('comment_id', commentToDelete);

        try {
            const response = await axiosInstance.post(`${API_BASE_URL}/api/course/delete_comment`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`, // Send token in header
                }
            });
    
            if (response.data.success) {
                updateComments(); // Refresh comments after deletion
            } else {
                alert(`שגיאה במחיקת התגובה: ${response.data.message}`);
            }
        } catch (error) {
            console.error("שגיאה במחיקת התגובה:", error);
            alert("אירעה שגיאה במהלך מחיקת התגובה.");
        }
    
        setIsDeleteCommentModalOpen(false); // Close the modal
        setCommentToDelete(null); // Reset the comment to delete
    };
    
    const cancelDeleteComment = () => {
        setIsDeleteCommentModalOpen(false); // Close the modal
        setCommentToDelete(null); // Reset the comment to delete
    };
    
    const confirmEditComment = async (comment_id) => {
        if(newText.length > 0){
            const formData = new FormData();
                formData.append('course_id', courseId);
                formData.append('year', examYear);
                formData.append('semester', examSemester);
                formData.append('moed', examDateSelection);
                formData.append('question_number', questionNum);
                formData.append('comment_id', comment_id);
                formData.append('new_text', newText);
                
            try {
                const response = await axiosInstance.post(`${API_BASE_URL}/api/course/edit_comment_text`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data', 
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`, // Send token in header
                    }
                });
        
                if (response.data.success) {
                    updateComments(); // Refresh comments after deletion
                } else {
                    alert(`שגיאה בעריכת התגובה: ${response.data.message}`);
                }
            } catch (error) {
                console.error("שגיאה בעריכת התגובה:", error);
                alert("אירעה שגיאה במהלך עריכת התגובה.");
            }
        }
    }
      
    

    const handleSolutionUpload = async (e) => {
        e.preventDefault();
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
        const cleanedFile = new File([answerFile], answerFile.name.replace(/ /g, '_'), { type: answerFile.type });
        formData.append('solution_file', cleanedFile); // Adjust the key for your backend
    
        try {
            const response = await axiosInstance.post(`${API_BASE_URL}/api/course/uploadSolution`, formData, {
                headers: {...addAuthHeaders()},
            });
            console.log("Full response from upload solution", response);
            console.log("response from upload solution", response.data)
            if (response.data.success) {
                alert("Solution uploaded successfully!");
                setAnswerFile(null);

                // closeSolutionModal();
            } else {
                alert(`Failed to upload solution: ${response.data.message}`);
            }
        } catch (error) {

            console.error("Error uploading solution:", error);
            alert("An error occurred while uploading the solution.");
        }
    };


    const handleSendClick = async (chatInput, prevId) => {
        if(chatInput.length > 0){
            const formData = new FormData();
            formData.append('course_id', courseId);
            formData.append('year', examYear);
            formData.append('semester', examSemester);
            formData.append('moed', examDateSelection);
            formData.append('writer_id', TokenManager.getUserIdFromToken());
            formData.append('question_number', questionNum);
            formData.append('writer_name', localStorage.getItem('first_name') + ' ' + localStorage.getItem('last_name'));
            formData.append('prev_id', prevId);
            formData.append('question_id', question.question_id);
            formData.append('comment_text', chatInput);
            formData.append('photo_file', photoFile);
        
            try {
                // Make the API call
                const response = await axiosInstance.post(`${API_BASE_URL}/api/course/add_comment`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data', 
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`, // Send token in header
                    }
                });
        
                // Handle success
                if (response.data.success) {
                    updateComments();
                    setPhotoFile(null);
                } else {
                    // Handle failure
                    alert(`Failed to add comment: ${response.data.message}`);
                }
            } catch (error) {
                // Handle error
                console.error("Error adding comment:", error);
                alert("An error occurred while adding the comment.");
            }

            setchatInput(""); // מאפס את התגובה
            if (textareaRef.current) {
              textareaRef.current.style.height = '40px'; // מאפס את הגובה לגובה הראשוני
            }
        }
    };

    useEffect(() => {
        if (courseId) {
            console.log("חיפוש שאלה ספציפית: ", { courseId, examYear, examSemester, examDateSelection, questionNum });
    
            // קריאה ל-API לחיפוש לפי מועד
            axiosInstance.post(`${API_BASE_URL}/api/course/search_question_by_specifics`, {
                course_id: courseId,
                year: examYear,
                semester: examSemester,
                moed: examDateSelection,
                question_number: questionNum
            }, {
                headers: addAuthHeaders()  // שלח את ההדרים המתאימים
            })
            .then(async response => {
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
        const checkFollowStatus = async () => {
          try {
            const response = await axiosInstance.get(`${API_BASE_URL}/api/course/is_following`, {
              params: {
                question_id: question.question_id
              },
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
              }
            });
      
            if (response.data.success) {
              setIsFollowing(response.data.is_following); // true or false
            }
          } catch (error) {
            console.error("Failed to check follow status:", error);
          }
        };
      
        if (question?.question_id) {
          checkFollowStatus();
        }
      }, [question]);
      
    useEffect(() => {
        const initialExpandState = allComments.reduce((acc, comment) => {
          acc[comment.comment_id] = true;
          return acc;
        }, {});
        
        setExpandReplies(initialExpandState);
      }, [allComments]); // ירוץ שוב אם comments משתנה

    useEffect(() => {
        const checkCourseManager = async () => {
            try {
                const response = await axiosInstance.post(`${API_BASE_URL}/api/course/is_course_manager`, {
                    course_id: courseId,
                },{headers: addAuthHeaders()})  
                if (response.data.success) {
                    console.log("user is course manager:", response.data.is_manager);
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

    useEffect(() => {
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

    const formatMessage = (message) => {
        return message.split('\n').map((item, index) => (
          <span key={index}>
            {item}
            <br />
          </span>
        ));
      };
       

    const renderComments = (comments) => {
        const loggedInUserId = TokenManager.getUserIdFromToken(); // Current logged-in user
        const handleTextChange = (newText) => {
            setNewText(newText)
          };
        return comments.map((comment) => {
            const commentMetadata = commentsMetadata.find(metadata => metadata.comment_id === comment.comment_id);
            
            return (
                <div key={comment.comment_id} className="comment-box" onMouseLeave={() => setActiveReactedComment(null)}>
                    <div className="comment-content">
                        {comment.deleted ? (<em>תגובה זו נמחקה</em>):(
                            <>
                             <div className="comment-header">
                            {comment.profile_picture_base64 ? (
                                <img
                                src={`data:image/png;base64,${comment.profile_picture_base64}`}
                                alt="avatar"
                                className="comment-avatar"
                                />
                            ) : (
                                <div className="comment-avatar-fallback">
                                {comment.writer_name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </div>
                            )}
                            <span className="comment-writer">{comment.writer_name}</span>
                            </div>



                                {activeEditedComment !== comment.comment_id && comment.reactions.length > 0 && (
                                    <button
                                        className="users-reactions-window"
                                        onClick={() => toggleReactionsWindow(comment)}
                                    >
                                        {showUsersReactions(countReactionsForComment(comment.reactions))}
                                        <div style={{ fontSize: "16px" }}>{comment.reactions.length}</div>
                                    </button>
                                )}
                                {activeReactedComment === comment.comment_id && (
                                    <div
                                        className="emojies-window"
                                        onMouseLeave={() => setActiveReactedComment(null)}
                                    >
                                        {Object.entries(emojies).map(([word, emoji]) => (
                                            <div
                                                key={word}
                                                type="button"
                                                className="emoji"
                                                onClick={() => handleAddEmoji(comment.comment_id, word)}
                                            >
                                                {emoji}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {activeEditedComment === comment.comment_id ? (
                                    <CommentEditor initialText={comment.comment_text} onTextChange={handleTextChange}/>
                                ) : (
                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                        <p>{formatMessage(comment.comment_text)}</p>
                                        {commentMediaMap[comment.comment_id] && (
                                            <img
                                                src={commentMediaMap[comment.comment_id]}
                                                alt="media"
                                                className="photo-of-comment"
                                                onClick={()=>setShowPictureForComment(comment.comment_id)}
                                            />
                                        )}
                                    </div>
                                )}
                            </>  
                        )}
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
                        {activeEditedComment === comment.comment_id ? (
                            <>
                            <button
                                className="reaction-button"
                                onClick={() => setActiveEditedComment(null)}
                            >
                                <RxCross2 />
                            </button>
                            <button
                                className="reaction-button"
                                onClick={() => {
                                    setActiveEditedComment(null)
                                    confirmEditComment(comment.comment_id)}}
                            >
                                <GoCheck />

                            </button>
                            </>
                        ) : (<>{!comment.deleted && (
                            getUserReactionForComment(comment) === null ? (
                            <button
                                className="reaction-button"
                                onMouseEnter={() =>  activeEditedComment === null && activeRepliedComment === null && setActiveReactedComment(comment.comment_id)}
                                onClick = {() => {
                                    setActiveRepliedComment(null);
                                    setActiveEditedComment(null);}}
                            >
                                <BsEmojiSmile size={"15px"} />
                            </button>
                        ) : (
                            <button
                                className="small-emoji"
                                onClick={() => {
                                    setActiveEditedComment(null);
                                    handleRemoveEmoji(
                                        comment.comment_id,
                                        getUserReactionForComment(comment).reaction_id
                                    );
                                }}
                                onMouseEnter={() => activeEditedComment === null && activeRepliedComment === null && setActiveReactedComment(comment.comment_id)}
                            >
                                {emojies[getUserReactionForComment(comment).emoji]}
                            </button>
                        ))}
                        {!comment.deleted && (
                            <button
                                type="button"
                                className="reaction-button"
                                onMouseEnter={() => setActiveReactedComment(null)}
                                onClick={() => {
                                    setchatInput([]);
                                    setPhotoFile(null);
                                    setActiveEditedComment(null);
                                    !expandReplies[comment.comment_id] && handleArrowClick(comment.comment_id);
                                    handleReplyClick(comment.comment_id);
                                }}
                            >
                            {activeRepliedComment === comment.comment_id ? <FaCommentAlt /> : <FaRegCommentAlt />}
                        </button>)}
                        {(isCourseManager || IsSystemManager || (commentMetadata && loggedInUserId === commentMetadata.writer_id)) && (
                            !comment.deleted && (
                            <button
                                type="button"
                                className="reaction-button delete-comment-button"
                                onClick={() => {
                                    setActiveRepliedComment(null);
                                    setActiveEditedComment(null);
                                    handleDeleteComment(comment.comment_id)}}
                            >
                                <FaRegTrashAlt />
                            </button>
                            ))}
                        {(commentMetadata && loggedInUserId === commentMetadata.writer_id) && (
                            !comment.deleted && (
                            <button
                                type="button"
                                className="reaction-button delete-comment-button"
                                onClick={() => {
                                    setActiveRepliedComment(null);
                                    setActiveEditedComment(comment.comment_id)}}
                            >
                                <PiPencilLineFill size={"16px"}/>
                            </button>
                            ))}
                        {comment.replies.length > 0 && (
                            <button
                                type="button"
                                className="reaction-button"
                                onClick={() => {
                                    activeRepliedComment === comment.comment_id && setActiveRepliedComment(null);
                                    handleArrowClick(comment.comment_id);
                                }}
                            >
                                {expandReplies[comment.comment_id] ? (
                                    <BiSolidUpArrow size={"16px"} />
                                ) : (
                                    <BiDownArrow size={"16px"} />
                                )}
                            </button>
                        )}
                        {!comment.deleted && comment.edited && <div className="comment-timestamp">התגובה נערכה</div>}
                        </>
                    )}
                    </div>
                    {/* Replies Section */}
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
                                    <div>
                                        {photoFile && activeRepliedComment ? (
                                        <button title="צפה בקובץ שצירפת" type="button" className="reply-button" onClick={()=>setShowPictureWhileCommenting(true)}>
                                            <CiFileOn size={"30px"}/>
                                        </button>
                                        ) : (
                                            <button title="צרף קובץ" type="button" className="reply-button" onClick={()=>{
                                                                                                                        setchatInput([]);
                                                                                                                        setPhotoFile(null);
                                                                                                                        replyCommentFileRef.current.click()}}>
                                                <IoAttach size={"30px"}/>
                                            </button>)
                                        }
                                        <input
                                            type="file"
                                            accept=".jpeg, .jpg, .png"
                                            ref={replyCommentFileRef}
                                            onChange={(e)=>setPhotoFile(e.target.files[0])}
                                            style={{ display: "none" }}
                                        />
                                    </div>
                                    <button
                                    title="שלח"
                                        type="button"
                                        className="reply-button"
                                        onClick={() => handleSendClick(replyInput, comment.comment_id)}
                                    >
                                        <LuSendHorizontal size={"20px"} style={{ transform: "rotate(180deg)" }}/>
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            );
        });
    };
    
    useEffect(() => {
        if (courseId) {
            axiosInstance.get(`${API_BASE_URL}/api/course/get_course/${courseId}`, {headers: addAuthHeaders()})
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

    const fetchCommentMedia = async (comment_id) => {
        try {
          const response = await axiosInstance.get(`${API_BASE_URL}/api/course/get_comment_media`,
            {
              params: {
                course_id: courseId,
                year: examYear,
                semester: examSemester,
                moed: examDateSelection,
                question_number: questionNum,
                comment_id: comment_id,
              },
              headers: addAuthHeaders(),
              responseType: 'blob', // חשוב! כי הקובץ הוא תמונה או JSON
            }
          );
      
          const contentType = response.headers['content-type'];
          if (contentType && contentType.includes('application/json')) {
            // ננסה לקרוא את התוכן של ה־blob כטקסט ואז לפרסר אותו
            const text = await response.data.text();
            const json = JSON.parse(text);
            if (json.media === null) {
              return null;
            } else {
              console.warn('Unexpected JSON response:', json);
              return null;
            }
          } else {
            // זו תמונה או קובץ אחר - ניצור ממנו קישור
            const fileUrl = URL.createObjectURL(response.data);
            return fileUrl;
          }
        } catch (error) {
          console.error('Error fetching media:', error);
          return null;
        }
      };

      useEffect(() => {
        const loadAllMedia = async () => {
            const mediaMap = {};
            const promises = allComments.map(async (comment) => {
                const fileUrl = await fetchCommentMedia(comment.comment_id);
                mediaMap[comment.comment_id] = fileUrl;
            });
    
            // נחכה שכל ההבטחות יסתיימו
            await Promise.all(promises);
            setCommentMediaMap(mediaMap);  // רק עכשיו נעדכן את המילון
        };
    
        if (allComments.length > 0) {
            loadAllMedia();
        }
    }, [allComments]);

    useEffect(() => {
        const fetchQuestionFile = async () => {
            try {
                const response = await axiosInstance.get(`${API_BASE_URL}/api/course/get_question_pdf`, {
                    params: {
                        course_id: courseId,
                        year: examYear,
                        semester: examSemester,
                        moed: examDateSelection,
                        question_number: questionNum,
                    },
                    headers: addAuthHeaders(),
                    responseType: 'blob', // Make sure to receive the file as a blob
                });

                const fileType = response.headers['content-type'];
                if (fileType === 'application/pdf') {
                    const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
                    const pdfUrl = URL.createObjectURL(pdfBlob);
                    setQuestionPdfUrl(pdfUrl);
                } else if (fileType.includes('image')) {
                    const imageUrl = URL.createObjectURL(response.data);
                    setImageUrl(imageUrl);
                     // Set the image URL
                }
                else {console.error('Unsupported file type:', fileType);}

            } catch (error) {
                console.error('Error fetching file:', error);
            }
        };

        fetchQuestionFile();
    }, [courseId, examYear, examSemester, examDateSelection, questionNum]);


    useEffect(() => {
        const fetchAnswerPdf = async () => {
            try {
                const response = await axiosInstance.get(`${API_BASE_URL}/api/course/get_answer_pdf`, {
                    params : {
                        course_id: courseId,
                        year: examYear,
                        semester: examSemester,
                        moed: examDateSelection,
                        question_number: questionNum,
                    },
                    headers: addAuthHeaders(),
                    responseType: 'blob', // חשוב כדי לקבל את הקובץ כ-BLOB
                });
                console.log("answer-data", response.data)
                const fileType = response.headers['content-type'];
                if (fileType === 'application/pdf') {
                    const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
                    const answerpdfUrl = URL.createObjectURL(pdfBlob);
                    setAnswerImageUrl(null);
                    setAnswerPdfUrl(answerpdfUrl);

                } else if (fileType.includes('image')) {
                    const answerImageUrl = URL.createObjectURL(response.data);
                    setAnswerPdfUrl(null)
                    setAnswerImageUrl(answerImageUrl);
                    // Set the image URL
                }
                else {console.error('Unsupported file type:', fileType);}

                // יצירת URL מה-BLOB
                //const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
                //const pdfUrl = URL.createObjectURL(pdfBlob);

                //setAnswerPdfUrl(pdfUrl); // שמירת ה-URL למצב
            } catch (error) {
                console.error('Error fetching PDF:', error);
                setAnswerPdfUrl(null)
            }
        };
        fetchAnswerPdf();
    }, [answerFile]);

    
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const shouldScroll = params.get("scrollToFollow");
      
        if (shouldScroll === "true") {
          const followBtn = document.querySelector(".discussion-follow-btn");
          if (followBtn) {
            followBtn.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }, [question]);
      
    
      
    const handlePDFChange = (criteria) => {
        setVisiblePDF(criteria);
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
                    responseType: 'blob', // Expect binary data
                }, 
                {
                    headers: addAuthHeaders()
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
    
   // const handleAddSolution = async () => {
      //  try {
      //      const response = await axios.post(`${API_BASE_URL}/api/checkExistSolution', {
      //          params: {course_id: courseId,
      //          year: examYear,
      //          semester: examSemester,
      //          moed: examDateSelection,
      //          question_number: questionNum},
      //          headers: addAuthHeaders()
      //      });
      //      if (response.data.success) {
      //          if (response.data.has_link) {
      //              alert("הפתרון כבר קיים במערכת. את/ה מוזמנ/ת לגשת אליו");
      //          } else {
      //              openSolutionModal();
      //          }
      //      } else {
      //          alert(`Failed to check the exam: ${response.data.message || 'Unknown error'}`);
      //      }
      //  } catch (error) {
      //      console.error('Error checking exam:', error);
      //      alert('An error occurred while checking the exam.');
      //  }
    //};
    
    const handleEditQuestion = async () => {
    }
    
    const handleDeleteQuestion = () => {
        setIsDeleteModalOpen(true);
    };
    const confirmDeleteQuestion = async () => {
        try {
            // Call the backend API to delete the question
            const response = await axiosInstance.delete(`${API_BASE_URL}/api/course/delete_question`, {
                data: {
                    course_id: courseId,
                    year: examYear,
                    semester: examSemester,
                    moed: examDateSelection,
                    question_number: questionNum,
                }, 
                headers: addAuthHeaders()
            });
    
            if (response.data.success) {
                console.log("Question deleted successfully.");
                setIsDeleteModalOpen(false); // Close the modal after deleting
                navigate(`/exam/${courseDetails.course_id}/${examYear}/${examSemester}/${examDateSelection}`); // Navigate to the course page
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
            const response = await axiosInstance.post(`${API_BASE_URL}/api/checkExamFullPdf`, {
                params: {course_id: courseId,
                year: examYear,
                semester: examSemester,
                moed: examDateSelection},
                headers: addAuthHeaders()
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
            <div className='links-container'>
                <a href={`/home`} className="nav-result-link">
                    <span>דף הבית</span>
                </a>
                <IoIosArrowBack />
                <a href={`/course/${courseDetails.course_id}`} className="nav-result-link">
                    <span>קורס {courseDetails.course_id} - {courseDetails.name}</span>
                </a>
                <IoIosArrowBack />
                <a href={`/exam/${courseDetails.course_id}/${examYear}/${examSemester}/${examDateSelection}`} className="nav-result-link">
                    <span>{examYear} סמסטר {examSemester} מועד {examDateSelection}</span>
                </a>
                <IoIosArrowBack />
                <a>
                    <span>שאלה {questionNum}</span>
                </a>
            </div>
            <main className="content">
                <h1>דף שאלה</h1>
               
                {question.question_topics && question.question_topics.length > 0 &&
                <div className="details-container">
                    <div className="detail-item">
                        {/* <strong>נושאי השאלה:</strong> {question.question_topics && question.question_topics.join(', ')} */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px' }}>
  <strong>נושאי השאלה:</strong>
  {question.question_topics && question.question_topics.join(', ')}
  {(isCourseManager || IsSystemManager) && (
    <span
      title="ערוך נושאים"
      style={{ cursor: 'pointer', marginRight: '8px' }}
      onClick={() => {
        const currentTopics = question.question_topics || [];
        setChosenTopics(currentTopics);
        setNotChosenTopics(allTopics.filter(topic => !currentTopics.includes(topic)));
        setIsTopicsModalOpen(true);
      }}
    >
      ✏️
    </span>
  )}
  

</div>
{isTopicsModalOpen && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>עריכת נושאי השאלה</h3>

      <div className="topics-section">
        <h4>נושאים שנבחרו</h4>
        <div className="topics-list">
          {chosenTopics.map((topic) => (
            <span key={topic} className="topic-chip">
              {topic}
              <button onClick={() => {
                setChosenTopics(prev => prev.filter(t => t !== topic));
                setNotChosenTopics(prev => [...prev, topic]);
              }}>❌</button>
            </span>
          ))}
        </div>
      </div>

      <div className="topics-section">
        <h4>נושאים שאינם נבחרו</h4>
        <div className="topics-list">
          {notChosenTopics.map((topic) => (
            <span key={topic} className="topic-chip">
              {topic}
              <button
  style={{
    color: 'green',
    background: 'transparent',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    lineHeight: 1,
  }}
  onClick={() => {
    setNotChosenTopics(prev => prev.filter(t => t !== topic));
    setChosenTopics(prev => [...prev, topic]);
  }}
>
  +
</button>


            </span>
          ))}
        </div>
      </div>

      <div className="modal-actions">
        <button onClick={() => setIsTopicsModalOpen(false)}>ביטול</button>
        <button onClick={async () => {
  try {
    const formData = new FormData();
    formData.append("course_id", courseId);
    formData.append("year", examYear);
    formData.append("semester", examSemester);
    formData.append("moed", examDateSelection);
    formData.append("question_number", question.question_number);
    chosenTopics.forEach(topic => formData.append("topics", topic));

    const response = await axiosInstance.post(
      `${API_BASE_URL}/api/question/edit_question_topic`,
      formData,
      {
        headers: {
          ...addAuthHeaders(),
        },
      }
    );

    if (response.data.success) {
      question.question_topics = chosenTopics;
      setIsTopicsModalOpen(false);
    } else {
      alert(response.data.message || "שגיאה בעדכון הנושאים");
    }

  } catch (err) {
    // ✅ Show specific message from server if available
    if (err.response && err.response.data && err.response.data.message) {
      alert(err.response.data.message); // ← this will show "חובה לבחור לפחות נושא אחד"
    } else {
      alert("שגיאה בשליחת הבקשה לשרת");
    }
    console.error("Failed to update topics:", err);
  }
}}>
  אישור
</button>


      </div>
    </div>
  </div>
)}
{isEditDetailsModalOpen && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>עריכת פרטי השאלה</h3>

      <div className="field-row">
        <label>מספר קורס<span style={{ color: 'red' }}>*</span></label>
        <input type="text" value={editCourseId} onChange={(e) => setEditCourseId(e.target.value)} />
      </div>

      <div className="field-row">
        <label>שנה<span style={{ color: 'red' }}>*</span></label>

        <input type="number" value={editYear} onChange={(e) => setEditYear(e.target.value)} min="1900" max={new Date().getFullYear()} />
      </div>

      <div className="field-row">
        <label>סמסטר<span style={{ color: 'red' }}>*</span></label>

        <select value={editSemester} onChange={(e) => setEditSemester(e.target.value)}>
          <option value="סתיו">סתיו</option>
          <option value="אביב">אביב</option>
          <option value="קיץ">קיץ</option>
        </select>
      </div>

      <div className="field-row">
        <label>מועד<span style={{ color: 'red' }}>*</span></label>

        <select value={editMoed} onChange={(e) => setEditMoed(e.target.value)}>
          <option value="א">א</option>
          <option value="ב">ב</option>
          <option value="ג">ג</option>
          <option value="ד">ד</option>
        </select>
      </div>

      <div className="field-row">
        <label>מספר שאלה<span style={{ color: 'red' }}>*</span></label>

        <input type="number" value={editQuestionNumber} onChange={(e) => setEditQuestionNumber(e.target.value)} min="1" />
      </div>

      <div className="modal-actions">
        <button onClick={() => setIsEditDetailsModalOpen(false)}>ביטול</button>

        {/* ✅ Place this exact block here */}
        <button onClick={async () => {
          const currentYear = new Date().getFullYear();
          const validMoeds = ["א", "ב", "ג", "ד"];
          if (
            !editCourseId ||
            !editYear ||
            !editSemester ||
            !editMoed ||
            !editQuestionNumber
          ) {
            alert("נא למלא את כל השדות");
            return;
          }
          
          if (editYear > currentYear) {
            alert("השנה לא יכולה להיות בעתיד");
            return;
          }
          if (editQuestionNumber < 1) {
            alert("מספר שאלה חייב להיות לפחות 1");
            return;
          }
          if (!validMoeds.includes(editMoed)) {
            alert("נא לבחור מועד תקני (א, ב, ג, ד)");
            return;
          }

          try {
            const formData = new FormData();
            
                    // ✅ OLD details (from original state)
            formData.append("old_course_id", courseId);
            formData.append("old_year", examYear);
            formData.append("old_semester", examSemester);
            formData.append("old_moed", examDateSelection);
            formData.append("old_question_number", questionNum);

            // ✅ NEW details (from form input)
            formData.append("new_course_id", editCourseId);
            formData.append("new_year", editYear);
            formData.append("new_semester", editSemester);
            formData.append("new_moed", editMoed);
            formData.append("new_question_number", editQuestionNumber);

            const response = await axiosInstance.post(
              `${API_BASE_URL}/api/question/edit_question_details`,
              formData,
              {
                headers: {
                  ...addAuthHeaders(),
                },
              }
            );

            if (response.data.success) {
              alert("פרטי השאלה עודכנו בהצלחה!");
              setIsEditDetailsModalOpen(false);
              // Optionally reload or update UI
              navigate(`/question/${editCourseId}/${editYear}/${editSemester}/${editMoed}/${editQuestionNumber}`);

            } else {
                const msg = response.data.message;
              
                if (msg === "הקורס לא קיים במערכת") {
                  setIsEditDetailsModalOpen(false);
                  setIsOpenCourseModalVisible(true); // ⬅️ Show the serious modal
                } else {
                  alert(msg || "שגיאה בעדכון פרטי השאלה");
                }
              }
              

          } catch (err) {
            console.error("Failed to update question details:", err);
            alert("שגיאה בשליחת הבקשה לשרת");
          }
        }}>
          אישור
        </button>
      </div>
    </div>
  </div>
)}




                    </div>
                </div>}
                <div className="tabs-container">
                    <button 
                        className={`tab-next ${!prevQuestion ? "disabled" : ""}`} 
                        onClick={() => prevQuestion && navigate(`/question/${courseId}/${examYear}/${examSemester}/${examDateSelection}/${prevQuestion.question_number}`)}
                        title={"לשאלה הקודמת במבחן"}
                        disabled={!prevQuestion} // הכפתור מושבת אם אין שאלה הבאה
                    >
                        <FaArrowRight />
                    </button>
                    
                    <div className="question-tab-group">
    <button
        className={`tab ${visiblePDF === 'question' ? 'active' : ''}`}
        onClick={() => handlePDFChange('question')}
    >
        שאלה
    </button>
    <span
        className="question-file-swap-icon"
        title="החלפת קובץ שאלה"
        onClick={() => setShowSwapModal(true)}
    >
        ⇄
    </span>
</div>

{showSwapModal && (
    <div className="modal-overlay">
        <div className="modal-content-question">
            <p>בחר קובץ שאלה חדש להעלאה (PDF או תמונה):</p>
            <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setSwapFile(e.target.files[0])}
            />
            <div className="modal-buttons">
                <button onClick={handleFileSwap} className="confirm-button">אישור</button>
                <button onClick={() => setShowSwapModal(false)} className="cancel-button">ביטול</button>
            </div>
        </div>
    </div>
)}

                    {/* Group "פתרון" + "מחק פתרון" vertically */}
    <div className="answer-tab-group">
        <button
            className={`tab ${visiblePDF === 'answer' ? 'active' : ''}`}
            onClick={() => handlePDFChange('answer')}
        >
            פתרון
        </button>

        {(isCourseManager || IsSystemManager) && (answerPdfUrl || answerImageUrl) && (
            <button 
            className="tab download-tab button-danger" 
            onClick={() => setShowDeleteSolutionConfirmation(true)}
        >
            מחק פתרון
        </button>
        )}
    </div>
                    <button 
                        className={`tab-next ${!nextQuestion ? "disabled" : ""}`} 
                        onClick={() => nextQuestion && navigate(`/question/${courseId}/${examYear}/${examSemester}/${examDateSelection}/${nextQuestion.question_number}`)}
                        title={"לשאלה הבאה במבחן"}
                        disabled={!nextQuestion} // הכפתור מושבת אם אין שאלה הבאה
                    >
                        <FaArrowLeft />
                    </button>
                    {/* <button
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
                    </button> */}
                    {/* <button
                        className="tab download-tab"
                        onClick={handleAddSolution}
                    >
                        הוספת פתרון מרצה
                    </button> */}
                    {/* Render manager-only buttons */}
                    {(isCourseManager || IsSystemManager) && (
                        <>
                            <button
                            className="tab download-tab edit-question-button"
                            onClick={() => setIsEditDetailsModalOpen(true)}
                            >
                            עריכת פרטי השאלה
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
                        ) : imageUrl ? (
                            <div 
                                style={{
                                    width: '100%', 
                                    height: '600px',  // Fixed height for container
                                    overflow: 'auto'  // Enables vertical scrolling
                                }}
                            >
                                <img
                                    src={imageUrl}
                                    alt="Question"
                                    style={{
                                        width: '100%',      // Full width of container
                                        height: 'auto',     // Automatically adjust height
                                        objectFit: 'contain' // Maintain aspect ratio
                                    }}
                                />
                            </div>
                        ) : (
                            <p>Loading file...</p>
                        )}
                    </div>
                )}
                {visiblePDF === 'answer' && (
                    <div className="pdf-form">
                        {answerPdfUrl ? (
                            <iframe src={answerPdfUrl} width="100%" height="1000px" title="PDF Viewer"/>
                        ) : answerImageUrl ? (
                            <div 
                                style={{
                                    width: '100%', 
                                    height: '600px',  // Fixed height for container
                                    overflow: 'auto'  // Enables vertical scrolling
                                }}
                            >
                                <img
                                    src={answerImageUrl}
                                    alt="Question"
                                    style={{
                                        width: '100%',      // Full width of container
                                        height: 'auto',     // Automatically adjust height
                                        objectFit: 'contain' // Maintain aspect ratio
                                    }}
                                />
                                </div>
                            ) :
                            (
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
                                                accept=".pdf, .jpeg, .jpg, .png"
                                                onChange={(e) => setAnswerFile(e.target.files[0])}
                                                required
                                            />
                                            <div>
                                                <div className="question-button-row">
                                                    <button className="upload-answer-button" onClick={handleSolutionUpload}>
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
  <div className="discussion-follow-container" ref={followButtonRef}>
    <button
      className={`discussion-follow-btn ${isFollowing ? 'following' : ''}`}
      onClick={async () => {
        try {
          const endpoint = isFollowing ? 'unfollow' : 'follow';

          await axiosInstance.post(`${API_BASE_URL}/api/course/${endpoint}`, {
            question_id: question.question_id
          }, {
            headers: {
              ...addAuthHeaders(),
            }
          });

          setIsFollowing(!isFollowing);
        } catch (error) {
          console.error(`Failed to ${isFollowing ? 'unfollow' : 'follow'}:`, error);
        }
      }}
    >
      {isFollowing ? '✓ במעקב' : '+ מעקב אחר הדיון'}
    </button>
  </div>


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
                            {showPictureForComment && (
                                <div className="modal-overlay" onClick={()=>setShowPictureForComment(null)}>
                                    <div className="max-photo">
                                        {commentMediaMap[showPictureForComment] && <img
                                            src={commentMediaMap[showPictureForComment]}
                                            alt="media"
                                        />}
                                        <p>{allComments.find(c => c.comment_id === showPictureForComment).comment_text}</p>
                                    </div>
                                </div>
                            )}
                            {showPictureWhileCommenting && (
                                <div className="modal-overlay" onClick={()=>setShowPictureWhileCommenting(false)}>
                                    <div className="max-photo">
                                        {photoFile && 
                                            <img
                                                src={URL.createObjectURL(photoFile)}
                                                alt="media"
                                                className='photo-while-commenting'
                                        />}
                                        <button title="מחק קובץ זה" onClick={()=>setPhotoFile(null)}>
                                            <FaRegTrashAlt />
                                        </button>
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
                        <textarea
                            //type="text"
                            ref={textareaRef} // קישור ל־textarea
                            placeholder="כתיבת תגובה..."
                            value={chatInput}
                            // onKeyDown={handleKeyDown(chatInput)}
                            // onClick={()=>setActiveEditedComment(null)}
                            onChange={handleInputChange}
                            onClick={() => {
                                setActiveEditedComment(null);
                                setReplyInput([]);
                                setActiveRepliedComment(null);}}
                            className="reply-input"
                            style={{
                                resize: 'none', // מונע מהמשתמש לשנות את גודל ה־textarea ידנית
                                overflowY: 'auto', // מאפשר גלילה אם התוכן חורג
                                height: '40px', // גובה התיבה מתחיל עם 2 שורות
                                minHeight: '40px', // גובה מינימלי
                                maxHeight: '120px', // גובה מקסימלי של 4 שורות
                              }}
                        />
                        <div>
                            {photoFile && activeRepliedComment===null ? (<button title="צפה בקובץ שצירפת" type="button" className="reply-button" onClick={()=>setShowPictureWhileCommenting(true)}>
                                            <CiFileOn size={"30px"}/>
                                        </button>
                                ) : (
                                <button title="צרף קובץ" type="button" className="reply-button" onClick={()=>{ 
                                                                                                                setPhotoFile(null);
                                                                                                                setActiveEditedComment(null);
                                                                                                                setReplyInput([]);
                                                                                                                setActiveRepliedComment(null);
                                                                                                                mainCommentFileRef.current.click()
                                                                                                                }}
                                >
                                    <IoAttach size={"30px"}/>
                                </button>)
                            }
                            <input
                                type="file"
                                accept=".jpeg, .jpg, .png"
                                ref={mainCommentFileRef}
                                onChange={(e)=>setPhotoFile(e.target.files[0])}
                                style={{ display: "none" }}
                            />
                        </div>
                        <button title="שלח" type="button" className="reply-button" onClick={() => handleSendClick(chatInput, "0")}>
                            <LuSendHorizontal size={"20px"} style={{ transform: "rotate(180deg)" }}/>
                        </button>
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
                {isDeleteCommentModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>האם את/ה בטוח/ה?</h2>
                        <p>מחיקת התגובה תמחק את כל התוכן שלה לצמיתות.</p>
                        <div className="modal-actions">
                            <button className="confirm-btn" onClick={confirmDeleteComment}>
                                אישור
                            </button>
                            <button className="cancel-btn" onClick={cancelDeleteComment}>
                                ביטול
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isOpenCourseModalVisible && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3 style={{ marginBottom: "15px" }}>הקורס לא קיים במערכת</h3>
      <p>האם ברצונך לפתוח קורס חדש?</p>
      <div className="modal-actions" style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button
          className="cancel-btn"
          onClick={() => setIsOpenCourseModalVisible(false)}
        >
          ביטול
        </button>
        <button
          className="upload-btn"
          onClick={() => {
            setIsOpenCourseModalVisible(false);
            navigate(`/opencourse`);
          }}
        >
          פתח קורס חדש
        </button>
      </div>
    </div>
  </div>
)}
{ShowDeleteSolutionConfirmation && (
    <div className="modal-overlay">
        <div className="delete-solution-confirmation-modal">
        <p>האם את/ה בטוח/ה שברצונך למחוק את השאלה?</p>
            <div className="modal-buttons">
                <button onClick={handleDeleteSolution} className="confirm-button">אישור</button>
                <button onClick={() => setShowDeleteSolutionConfirmation(false)} className="cancel-button">ביטול</button>
            </div>
        </div>
    </div>
)}


                    {/* {isSolutionModalOpen && (
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
                    )} */}
                </div>
            </main>
            <Footer />
        </div>
    );
}    
export default Question;

