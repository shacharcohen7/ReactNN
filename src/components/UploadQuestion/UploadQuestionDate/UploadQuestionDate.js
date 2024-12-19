// Course.js
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';  // ייבוא הפוטר
import './UploadQuestionDate.css';

function UploadQuestionDate() {
    const { courseId } = useParams();  // מקבלים את שם הקורס מה-URL
    const navigate = useNavigate();  // יצירת אובייקט navigate
    const semesters = ['סתיו', 'אביב', 'קיץ'];
    const examDates = ['א', 'ב', 'ג', 'ד'];
    const [examYear, setExamYear] = useState(''); // שנה של המבחן
    const [examSemester, setExamSemester] = useState(''); // סמסטר של המבחן
    const [examDateSelection, setExamDateSelection] = useState(''); // מועד של המבחן
    const [questionNum, setQuestionNum] = useState(''); // מספר שאלה

    const navigateToUploadQuestionContent = () => {
        if (examYear && examSemester && examDateSelection && questionNum) {
            if(examYear < 1800){
                alert("שנה לא תקינה");
            }
            else if(questionNum < 1){
                alert("מספר שאלה לא תקין");
            }
            else{
                // search for question
                // if null - navigate to upload-question-content page
                navigate(`/upload-question-content/${courseId}/${examYear}/${examSemester}/${examDateSelection}/${questionNum}`);
                // else - navigate to question page
            }
          } else {
            // Optionally, you can alert the user or show a message if no course is selected
            alert("אנא מלא את כל השדות.");
          }
    };
    
    return (
        <div className="upload-question-date-page">
            <Header />
            <main className="content">
            <div className="course-header">
                <h1>העלאת שאלה חדשה</h1>
                <div className="question-content-form">
                    <div className="form-group">
                        <label className="label-question-content" htmlFor="name">מספר קורס:</label>
                        <input
                            type="text" 
                            disabled 
                            value={courseId}
                            className="question-date-field"
                            required
                        >
                        </input>
                    </div>
                    <div className="form-group">
                        <label className="label-question-content" htmlFor="name">שנה:</label>
                        <input
                            type="number"
                            value={examYear}
                            onChange={(e) => {setExamYear(e.target.value)}}
                            className="question-date-field"
                            min="1800"
                        />
                    </div>
                    <div className="form-group">
                        <label className="label-question-content" htmlFor="name">סמסטר:</label>
                        <select
                            value={examSemester}
                            onChange={(e) => setExamSemester(e.target.value)}
                            className="question-date-field"
                        >
                            <option value=""></option>
                            {semesters.map((semesterOption, index) => (
                                <option key={index} value={semesterOption}>
                                    {semesterOption}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="label-question-content" htmlFor="name">מועד:</label>
                        <select
                            value={examDateSelection}
                            onChange={(e) => setExamDateSelection(e.target.value)}
                            className="question-date-field"
                        >
                            <option value=""></option>
                            {examDates.map((dateOption, index) => (
                                <option key={index} value={dateOption}>
                                    {dateOption}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="label-question-content" htmlFor="name">מספר שאלה:</label>
                        <input
                            type="number"
                            value={questionNum}
                            onChange={(e) => setQuestionNum(e.target.value)}
                            className="question-date-field"
                            min="1"
                        />
                    </div>
                    <button className="confirm-button-question" onClick={navigateToUploadQuestionContent}>
                        אישור
                    </button>
                </div>
                
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default UploadQuestionDate;
