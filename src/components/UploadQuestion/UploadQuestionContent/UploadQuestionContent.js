// Course.js
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';  // ייבוא הפוטר
import './UploadQuestionContent.css';

function UploadQuestionContent() {
    const { courseName, examYear, examSemester, examDateSelection, questionNum } = useParams();  // מקבלים את שם הקורס מה-URL
    const [questionFile, setQuestionFile] = useState(null);
    const navigate = useNavigate();  // יצירת אובייקט navigate
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
                <div className="form-content">
                    <input
                        type="file"
                        onChange={(e) => setQuestionFile(e.target.files[0])}
                        className="search-input-open"
                        required
                    />
                    <button className="add-question-button">
                        הוסף שאלה
                    </button>
                </div>
            </div>
            </main>
            <Footer />
        </div>
    );
}

export default UploadQuestionContent;
