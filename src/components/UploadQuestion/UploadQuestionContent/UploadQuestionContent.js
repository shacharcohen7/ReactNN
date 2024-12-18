// Course.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Select from "react-select";
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';  // ייבוא הפוטר
import './UploadQuestionContent.css';

function UploadQuestionContent() {
    const { courseName, examYear, examSemester, examDateSelection, questionNum } = useParams();  // מקבלים את שם הקורס מה-URL
    const [questionFile, setQuestionFile] = useState(null);
    const [topics, setTopics] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState('');
    const navigate = useNavigate();  // יצירת אובייקט navigate

    const handleCancelClick = () => {
        navigate('/home');  // מנווט לעמוד ההרשמה
      };

    const handleTopicChange = (selected) => {
        setSelectedTopics(selected || []);
      };

      useEffect(() => {
    
            axios.get('http://localhost:5001/api/course/get_course_topics', {
                params: { course_id: courseName },
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
    return (
        <div className="upload-question-content-page">
            <Header />
            <main className="content">
            <div className="course-header">
                <h1>העלאת שאלה חדשה</h1>
                <div className="details-container">
                    <div className="detail-item">
                        <strong>קורס</strong> {courseName}
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
                    <label htmlFor="file-upload-1" className="field-label">העלה שאלה:</label>
                    <input
                        className="question-content-field"
                        type="file"
                        onChange={(e) => setQuestionFile(e.target.files[0])}
                        required
                    />
                    <label htmlFor="file-upload-1" className="field-label">העלה פתרון מרצה:</label>
                    <input
                        className="question-content-field"
                        type="file"
                        onChange={(e) => setQuestionFile(e.target.files[0])}
                        required
                    />
                    <label htmlFor="file-upload-1" className="field-label">בחר נושאים לשאלה:</label>
                    <Select
                        id="multi-select"
                        options={topics.map((topic) => ({ value: topic, label: topic }))} // המרה לפורמט מתאים
                        isMulti // מאפשר בחירה מרובה
                        value={selectedTopics}
                        onChange={handleTopicChange}
                        className="question-content-field"
                    />
                    <div className="question-button-row">
                    <button className="add-question-button">
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
