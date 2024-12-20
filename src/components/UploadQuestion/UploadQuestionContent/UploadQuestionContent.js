// Course.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Select from "react-select";
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';  // ייבוא הפוטר
import './UploadQuestionContent.css';

function UploadQuestionContent() {
    const { courseId, examYear, examSemester, examDateSelection, questionNum } = useParams();  // מקבלים את שם הקורס מה-URL
    const [courseDetails, setCourseDetails] = useState(null);
    const [questionFile, setQuestionFile] = useState(null);
    const [solutionFile, setSolutionFile] = useState(null);
    const [isAmerican, setAmerican] = useState(null);
    const [topics, setTopics] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState('');
    const navigate = useNavigate();  // יצירת אובייקט navigate

    const handleCancelClick = () => {
        navigate('/home');  // מנווט לעמוד ההרשמה
      };

    const handleConfirmClick = () => {
        navigate(`/question/${courseId}/${examYear}/${examSemester}/${examDateSelection}/${questionNum}`);
      };

    const handleTopicChange = (selected) => {
        setSelectedTopics(selected || []);
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
    }); 

    if (!courseDetails) {
        return <div>Loading...</div>;
    }
    
    return (
        <div className="upload-question-content-page">
            <Header />
            <main className="content">
            <div className="course-header">
                <h1>העלאת שאלה חדשה</h1>
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
                <div className="question-content-form">
                    <div className="form-group">
                        <label className="label-question-content" htmlFor="name">שאלה:</label>
                        <div class="info-icon" title="העלה קובץ PDF של השאלה כפי שמופיעה במבחן">i</div>
                        <input
                            className="question-content-field"
                            type="file"
                            onChange={(e) => setQuestionFile(e.target.files[0])}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="label-question-content" htmlFor="name">פתרון מרצה:</label>
                        <div class="info-icon" title="במידה וקיים ברשותך פתרון מרצה לשאלה, העלה קובץ PDF של פתרון זה">i</div>
                        <input
                            className="question-content-field"
                            type="file"
                            onChange={(e) => setSolutionFile(e.target.files[0])}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="label-question-content" htmlFor="name">סוג השאלה:</label>
                        <div class="info-icon" title="בחר את סוג השאלה - אמריקאית או פתוחה">i</div>
                        <select
                            value={isAmerican === null ? '' : isAmerican ? 'אמריקאית' : 'פתוחה'}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '') {
                                    setAmerican(null); // אם בחרו אופציה ריקה, מאפסים ל-null
                                } else {
                                    setAmerican(value === 'אמריקאית'); // אם אמריקאית, true; אחרת false
                                }}
                            }
                            className="question-content-field"
                            required
                        >
                            <option value=""></option>
                            <option>אמריקאית</option>
                            <option>פתוחה</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="label-question-content" htmlFor="name">נושאי השאלה:</label>
                        <div class="info-icon" title="בחר את נושאי הקורס בהם עוסקת שאלה זו">i</div>
                        <Select
                            id="multi-select"
                            options={topics.map((topic) => ({ value: topic, label: topic }))} // המרה לפורמט מתאים
                            isMulti // מאפשר בחירה מרובה
                            value={selectedTopics}
                            onChange={handleTopicChange}
                            className="question-content-field"
                        />
                    </div>
                    <div className="question-button-row">
                        <button className="add-question-button" onClick={handleConfirmClick}>
                            סיום
                        </button>
                        <button className="add-question-button" onClick={handleCancelClick}>
                            ביטול
                        </button>
                    </div>
                </div>
            </div>
            </main>
            <Footer />
        </div>
    );
}

export default UploadQuestionContent;
