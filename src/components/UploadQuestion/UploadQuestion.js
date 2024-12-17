// Course.js
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';  // ייבוא הפוטר
import './UploadQuestion.css';

function UploadQuestion() {
    const { courseName } = useParams();  // מקבלים את שם הקורס מה-URL
    const navigate = useNavigate();  // יצירת אובייקט navigate
    const semesters = ['סתיו', 'אביב', 'קיץ'];
    const examDates = ['א', 'ב', 'ג', 'ד'];
    const [examYear, setExamYear] = useState(''); // שנה של המבחן
    const [examSemester, setExamSemester] = useState(''); // סמסטר של המבחן
    const [examDateSelection, setExamDateSelection] = useState(''); // מועד של המבחן
    const [questionNum, setQuestionNum] = useState(''); // מספר שאלה
    return (
        <div className="upload-question-page">
            <Header />
            <main className="content">
            <div className="course-header">
                <h1>העלאת שאלה חדשה</h1>
                <h1>{courseName} - קורס</h1>
                <div className="search-container">
                <div className="date-search">
                    <input
                        type="text" 
                        disabled 
                        value={courseName}
                        className="search-input-course"
                        required
                    >
                    </input>

                    <input
                        type="text"
                        placeholder="שנה"
                        value={examYear}
                        onChange={(e) => setExamYear(e.target.value)}
                        className="search-input-course"
                    />

                    <select
                        value={examSemester}
                        onChange={(e) => setExamSemester(e.target.value)}
                        className="search-input-course"
                    >
                        <option value="">בחר סמסטר</option>
                        {semesters.map((semesterOption, index) => (
                            <option key={index} value={semesterOption}>
                                {semesterOption}
                            </option>
                        ))}
                    </select>

                    <select
                        value={examDateSelection}
                        onChange={(e) => setExamDateSelection(e.target.value)}
                        className="search-input-course"
                    >
                        <option value="">בחר מועד</option>
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
                        className="search-input-course"
                    />
                </div>
                <button className="search-button-home">
                    אישור
                </button>
                </div>
            </div>
            </main>
            <Footer />
        </div>
    );
}

export default UploadQuestion;
